package com.vmware.o11n.wm.services;

import java.net.URI;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.services.ExecutionService;
import com.vmware.o11n.sdk.rest.client.services.WorkflowService;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.wm.common.PresentationParameter;
import com.vmware.o11n.wm.common.QuerySpec;

public class VcoBaseService {
	protected final Log logger = LogFactory.getLog(getClass());
	protected static final String PRESENTATION_PART_URL = "/presentation/";
	protected static final String WORKFLOW_PART_URL = "workflows/";
	protected static final String WORKFLOW_EXECUTION = "executions";
	private static final String SYSTEM_PACKAGE_NAME = "com.vmware.o11n.waveoperator.package";

	private transient static boolean systemPackageUploaded;

	private final VcoConnectionService connectionService;
	private final VcoCacheManager cacheManager;

	protected VcoBaseService(VcoConnectionService connectionService) {
		this(connectionService, null);
	}

	protected VcoBaseService(VcoConnectionService connectionService, VcoCacheManager cacheManager) {
		this.connectionService = connectionService;
		this.cacheManager = cacheManager;
	}

	protected VcoConnectionService getConnectionService() {
		return connectionService;
	}

	protected VcoSession getSession() {
		return connectionService.getSession();
	}

	protected boolean isCurrentUserAdmin() {
		return connectionService.isCurrentUserAdmin();
	}

	protected void verifyUserIsAdmin() {
		connectionService.verifyCurrentUserIsAdmin();
	}

	protected VcoCacheManager getCacheManager() {
		return cacheManager;
	}

	protected WorkflowService getWorkflowService() {
		return new WorkflowService(getSession());
	}

	protected ExecutionService getExecutionService() {
		return new ExecutionService(getSession());
	}

	protected void uploadSystemPackage() {
		if (!systemPackageUploaded) {
			logger.info("Uploading to vCO server system package with name: " + SYSTEM_PACKAGE_NAME);
			MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
			ClassPathResource resourceContent = new ClassPathResource(SYSTEM_PACKAGE_NAME);
			parts.add("file", resourceContent);
			getSession().getRestTemplate().postForEntity(getSession().appendToRoot("packages/?overwrite=false"), parts,
					Void.class);
			systemPackageUploaded = true;
		}
	}

	protected String qs(QuerySpec query) {
		if (query != null) {
			return query.toString();
		} else {
			return "";
		}
	}

	protected Workflow createWorkflowLink(String workflowId, String linkName) {
		Workflow workflow = new Workflow();
		workflow.setId(workflowId);
		Relations relations = new Relations();
		workflow.setRelations(relations);
		Link link = new Link();
		link.setRel(linkName);
		relations.getLink().add(link);
		URI url = getSession().appendToRoot(WORKFLOW_PART_URL + workflowId + "/" + linkName + "/");
		link.setHref(url.toString());

		return workflow;
	}

	protected <T> T getRestObjectAppendingToRoot(String path, Class<? extends T> type) {
		try {
			return getSession().getRestTemplate().getForObject(getSession().appendToRoot(path), type);
		} catch (HttpClientErrorException e) {
			if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
				return null;
			} else {
				throw e;
			}
		}
	}

	protected String extractIdFromUrl(String url, String partBeforeId) {
		int beginIndex = url.indexOf(partBeforeId) + partBeforeId.length();
		int endIndex = url.indexOf("/", beginIndex);
		if (endIndex == -1)
			return null;
		String id = url.substring(beginIndex, endIndex);
		return id;
	}

	protected ExecutionContext mapParameters(List<PresentationParameter> presentationParameters) {
		ExecutionContext execContext = new ExecutionContext();
		if (presentationParameters == null || presentationParameters.isEmpty()) {
			return execContext;
		}

		ExecutionContext.Parameters executionParam = new ExecutionContext.Parameters();
		execContext.setParameters(executionParam);

		List<Parameter> params = executionParam.getParameter();
		for (PresentationParameter presentationParameter : presentationParameters) {
			params.add(presentationParameter.toParameter());
		}

		return execContext;
	}
}
