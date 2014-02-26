package com.vmware.o11n.wm.http;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.client.utils.URIUtils;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHttpEntityEnclosingRequest;
import org.apache.http.message.BasicHttpRequest;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.services.VcoConnectionService;

public class VcoProxyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String FORWARD_SLASH = "/";
	private static final String ZIP_EXTENSION = ".zip";
	private static final String CONTENT_LENGHT_HEADER = "content-length";
	private static final Set<String> HEADERS_TO_BE_COPIED = new HashSet<String>(Arrays.asList(new String[] { 
			"accept", "accept-charset", "accept-encoding","accept-language", "cache-control",  
			"content-type", "date", "etag", "expires", "if-modified-since", "if-none-match", 
			"content-disposition", "last-modified", "location", "pragma", "allow" }));

	private static WebApplicationContext webApplicationContext;
	private static VcoConnectionConfiguration connectionConfiguration;
	private static VcoConnectionService connectionService;

	@SuppressWarnings("deprecation")
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {
		
		String vcoUrl = rewriteRequestUrl(request);
		HttpRequest vcoRequest = null;
		if (request.getHeader(HttpHeaders.CONTENT_LENGTH) != null
				|| request.getHeader(HttpHeaders.TRANSFER_ENCODING) != null) {
			HttpEntityEnclosingRequest enclosingRequest = new BasicHttpEntityEnclosingRequest(request.getMethod(), vcoUrl);
			enclosingRequest.setEntity(new InputStreamEntity(request.getInputStream(), request.getContentLength()));
			vcoRequest = enclosingRequest;
		} else {
			vcoRequest = new BasicHttpRequest(request.getMethod(), vcoUrl);
		}

		RestTemplate restTemplate = getConnectionService().getSession().getRestTemplate();
		HttpComponentsClientHttpRequestFactory factory = ((HttpComponentsClientHttpRequestFactory) restTemplate
				.getRequestFactory());
		DefaultHttpClient defaultHttpClient = (DefaultHttpClient) factory.getHttpClient();
		
		copyRequestHeaders(request, vcoRequest);
		
		HttpResponse vcoResponse = defaultHttpClient.execute(
				URIUtils.extractHost(getConnectionConfiguration().getVcoRestApiUri()), vcoRequest);

		response.setStatus(vcoResponse.getStatusLine().getStatusCode(), vcoResponse.getStatusLine().getReasonPhrase());
		copyResponseHeaders(vcoResponse, response);
		copyResponseBody(vcoResponse, response);
	}

	private String rewriteRequestUrl(HttpServletRequest request) {
		String baseUrl = getConnectionConfiguration().getVcoRestApiUri().toString();
		if (baseUrl.endsWith(FORWARD_SLASH)) {
			baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
		}
		String pathInfo = request.getPathInfo();
		String queryString = request.getQueryString();

		StringBuilder uri = new StringBuilder(1000);
		uri.append(baseUrl);
		if (pathInfo != null) {
			if(isZipExtenssion(pathInfo)) {
				//This is a workaround to make the browser open a save dialog popup. 
				//The ".zip" part is not required by vco
				pathInfo = pathInfo.replace(".zip", "/");
			}
			uri.append(pathInfo);
		}
		if (queryString != null && queryString.length() > 0) {
			uri.append("?");
			uri.append(queryString);
		}

		return uri.toString();
	}

	private boolean isZipExtenssion(String pathInfo) {
		return pathInfo.indexOf(ZIP_EXTENSION) != -1;
	}

	protected void copyResponseHeaders(HttpResponse vcoResponse, HttpServletResponse response) {
		for (Header header : vcoResponse.getAllHeaders()) {
			String headerName = header.getName().toLowerCase();
			if (HEADERS_TO_BE_COPIED.contains(headerName) || CONTENT_LENGHT_HEADER.equals(headerName)) {
				response.addHeader(header.getName(), header.getValue());
			}
		}
	}

	protected void copyRequestHeaders(HttpServletRequest request, HttpRequest vcoRequest) {
		Enumeration<?> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = (String) headerNames.nextElement();
			if (HEADERS_TO_BE_COPIED.contains(headerName.toLowerCase())) {
				vcoRequest.addHeader(headerName, request.getHeader(headerName));
			}
		}
		if(isZipExtenssion(request.getPathInfo())) {
			Header[] headers = vcoRequest.getHeaders("Accept");
			if(headers != null && headers.length > 0) {
				vcoRequest.removeHeader(headers[0]);
			}
			vcoRequest.addHeader("Accept", "application/zip");
		}
	}

	protected void copyResponseBody(HttpResponse vcoResponse, HttpServletResponse response) throws IOException {
		HttpEntity entity = vcoResponse.getEntity();
		if (entity != null) {
			OutputStream out = response.getOutputStream();
			try {
				entity.writeTo(out);
			} finally {
				try {
					out.close();
				} catch (IOException e) {
					log(e.getMessage(), e);
				}
			}
		}
	}

	protected WebApplicationContext getWebApplicationContext() {
		if (webApplicationContext == null) {
			webApplicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(this
					.getServletContext());
		}
		return webApplicationContext;
	}

	protected VcoConnectionConfiguration getConnectionConfiguration() {
		if (connectionConfiguration == null) {
			connectionConfiguration = (VcoConnectionConfiguration) getWebApplicationContext().getBean(
					"connectionConfiguration");
		}
		return connectionConfiguration;
	}

	protected VcoConnectionService getConnectionService() {
		if (connectionService == null) {
			connectionService = (VcoConnectionService) getWebApplicationContext().getBean("vcoConnectionService");
		}
		return connectionService;
	}
}
