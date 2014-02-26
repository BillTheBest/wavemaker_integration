package com.vmware.o11n.wm.http;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.vmware.o11n.wm.common.ItemIcon;
import com.vmware.o11n.wm.configuration.ConfigurationConstants;
import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.services.VcoCacheManager;
import com.vmware.o11n.wm.services.VcoWorkflowService;

public class VcoProxyImageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final int MAX_NTHREDS = 50;
	private static final String LOAD_TO_CACHE = ".load";
	private static final String WORKFLOW_IDS_PARAM = "workflowIds";
	private static final long DEFAULT_WORKFLOW_ICON_CHECKSUM = 3172861699L;
	private static final String DEFAULT_CATALOG_ITEM_ICON_URI = "resources/images/test_catalog_icon.png";
	private static WebApplicationContext webApplicationContext;
	private static VcoCacheManager vcoCacheManager;
	private static VcoWorkflowService vcoWorkflowService;
	private static VcoConnectionConfiguration connectionConfiguration;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String workflowId = getWorkflowId(request);
		if (workflowId == null) {
			return;
		}

		boolean returnData = false;
		if (workflowId.indexOf(LOAD_TO_CACHE) != -1) {
			workflowId = workflowId.replace(LOAD_TO_CACHE, "");
			returnData = true;
		}

		ItemIcon icon = getWorkflowIcon(workflowId);

		if (returnData) {
			String body = "{id:\"" + workflowId + "\", url:\"" + icon.getHref() + "\"}";
			response.setContentType(MediaType.APPLICATION_JSON_VALUE);
			response.setContentLength(body.length());
			OutputStream out = response.getOutputStream();
			try {
				out.write(body.getBytes());
			} finally {
				try {
					out.close();
				} catch (IOException e) {
					log(e.getMessage(), e);
				}
			}
		} else {
			response.setContentType(icon.getContentType());
			response.setContentLength(icon.getData().length);
			OutputStream out = response.getOutputStream();
			try {
				out.write(icon.getData());
			} finally {
				try {
					out.close();
				} catch (IOException e) {
					log(e.getMessage(), e);
				}
			}
		}
	}

	private ItemIcon getWorkflowIcon(String workflowId) throws IOException {
		return getWorkflowIcon(workflowId, getVcoCacheManager(), getVcoWorkflowService(), getConnectionConfiguration());
	}

	private static ItemIcon getWorkflowIcon(String workflowId, VcoCacheManager cacheManager,
			VcoWorkflowService workflowService, VcoConnectionConfiguration connectionConfiguration) throws IOException {
		ItemIcon icon = cacheManager.getIcon(workflowId);
		if (icon == null) {
			ResponseEntity<BufferedImage> data = workflowService.getWorkflowIcon(workflowId);
			String contentType = data.getHeaders().getContentType().toString();
			String imageType = contentType.replace("image/", "");
			ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
			ImageIO.write(data.getBody(), imageType, byteOut);
			String url = null;
			byte[] iconBytes = byteOut.toByteArray();
			long defaultChecksum = 0;
			String checkSumStr = connectionConfiguration
					.getConfiguration(ConfigurationConstants.DEFAULT_WORKFLOW_ICON_CHECKSUM.name());
			if (checkSumStr == null) {
				defaultChecksum = DEFAULT_WORKFLOW_ICON_CHECKSUM;
			} else {
				defaultChecksum = Long.valueOf(checkSumStr);
			}
			if (defaultChecksum == ItemIcon.calculateChecksum(iconBytes)) {
				url = connectionConfiguration.getConfiguration(ConfigurationConstants.DEFAULT_CATALOG_ITEM_ICON_URI
						.name());
				if (url == null) {
					url = DEFAULT_CATALOG_ITEM_ICON_URI;
				}
				iconBytes = new byte[0];
			} else {
				url = "icons/" + workflowId;
			}
			icon = new ItemIcon(contentType, iconBytes, url, workflowId);
			cacheManager.putIcon(workflowId, icon);
		}

		return icon;
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		final String workflowIds = req.getParameter(WORKFLOW_IDS_PARAM);
		if (StringUtils.isBlank(workflowIds)) {
			return;
		}
		IconRetrivalCallable.vcoCacheManager = getVcoCacheManager();
		IconRetrivalCallable.vcoWorkflowService = getVcoWorkflowService();
		IconRetrivalCallable.vcoConnectionConfiguration = getConnectionConfiguration();

		final String[] workflowIdTokens = workflowIds.split(",");
		final List<Callable<ItemIcon>> callables = new ArrayList<Callable<ItemIcon>>(workflowIdTokens.length);
		for (String workflowId : workflowIdTokens) {
			callables.add(new IconRetrivalCallable(workflowId));
		}

		final ExecutorService executer = Executors
				.newFixedThreadPool(workflowIdTokens.length > MAX_NTHREDS ? MAX_NTHREDS : workflowIdTokens.length);

		final StringBuilder builder = new StringBuilder();
		try {

			final List<Future<ItemIcon>> futures = executer.invokeAll(callables);

			builder.append("[");
			for (Future<ItemIcon> future : futures) {
				ItemIcon icon = future.get();
				if (icon != null) {
					builder.append("{id:\"");
					builder.append(icon.getWorkflowId());
					builder.append("\", url:\"");
					builder.append(icon.getHref());
					builder.append("\"}");
					builder.append(",");
				}
			}
			builder.deleteCharAt(builder.length() - 1);
			builder.append("]");

			executer.shutdown();

		} catch (Exception e) {
			e.printStackTrace();
		}

		String body = builder.toString();
		resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
		resp.setContentLength(body.length());
		OutputStream out = resp.getOutputStream();
		try {
			out.write(body.getBytes());
		} finally {
			try {
				out.close();
			} catch (IOException e) {
				log(e.getMessage(), e);
			}
		}
	}

	@Override
	protected long getLastModified(HttpServletRequest req) {
		String workflowId = getWorkflowId(req);
		if (workflowId == null) {
			return -1;
		}

		ItemIcon icon = getVcoCacheManager().getIcon(workflowId);
		if (icon == null) {
			return -1;
		}

		if (icon.getModifiedSince() != null) {
			return icon.getModifiedSince().getTime();
		}

		icon.setLastModifiedDate();

		return -1;
	}

	private String getWorkflowId(HttpServletRequest req) {
		String pathInfo = req.getPathInfo();
		if (pathInfo == null) {
			return null;
		}

		String workflowId = pathInfo.substring(1);
		return workflowId;
	}

	protected WebApplicationContext getWebApplicationContext() {
		if (webApplicationContext == null) {
			webApplicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(this
					.getServletContext());
		}
		return webApplicationContext;
	}

	protected VcoCacheManager getVcoCacheManager() {
		if (vcoCacheManager == null) {
			vcoCacheManager = (VcoCacheManager) getWebApplicationContext().getBean("vcoCacheManager");
		}
		return vcoCacheManager;
	}

	protected VcoWorkflowService getVcoWorkflowService() {
		if (vcoWorkflowService == null) {
			vcoWorkflowService = (VcoWorkflowService) getWebApplicationContext().getBean("vcoWorkflowService");
		}
		return vcoWorkflowService;
	}

	protected VcoConnectionConfiguration getConnectionConfiguration() {
		if (connectionConfiguration == null) {
			connectionConfiguration = (VcoConnectionConfiguration) getWebApplicationContext().getBean(
					"connectionConfiguration");
		}
		return connectionConfiguration;
	}

	private static class IconRetrivalCallable implements Callable<ItemIcon> {
		protected static VcoWorkflowService vcoWorkflowService;
		protected static VcoCacheManager vcoCacheManager;
		protected static VcoConnectionConfiguration vcoConnectionConfiguration;
		protected String workflowId;

		public IconRetrivalCallable(String workflowId) {
			this.workflowId = workflowId;
		}

		@Override
		public ItemIcon call() throws Exception {
			return VcoProxyImageServlet.getWorkflowIcon(workflowId, vcoCacheManager, vcoWorkflowService,
					vcoConnectionConfiguration);
		}

	}

}
