package com.vmware.o11n.wm.services;

import java.net.URI;
import java.nio.charset.Charset;
import java.util.Arrays;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

public class VcoRestJsonService extends VcoBaseService {

	protected VcoRestJsonService(VcoConnectionService connectionService) {
		super(connectionService);
	}

	public String get(String url) {
			HttpHeaders headers = new HttpHeaders();
			headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
			HttpEntity<String> httpEntity = new HttpEntity<String>(headers);
			
			ResponseEntity<String> response = getSession().getRestTemplate().exchange(
					getSession().appendToRoot(url), HttpMethod.GET, httpEntity, String.class);
			
			if(response == null) {
				return null;
			}
			
			HttpStatus statusCode = response.getStatusCode();
			if (HttpStatus.NOT_FOUND.equals(statusCode)) {
				return null;
			}
			
			if (HttpStatus.OK.equals(statusCode)) {
				return response.getBody();
			}
			
			MediaType contentType = response.getHeaders().getContentType();
			Charset charset = contentType != null ? contentType.getCharSet() : null;
			byte[] body = response.getBody() == null ? new byte[0]: response.getBody().getBytes();
			switch (statusCode.series()) {
			case CLIENT_ERROR:
				throw new HttpClientErrorException(statusCode, statusCode.getReasonPhrase(), body, charset);
			case SERVER_ERROR:
				throw new HttpServerErrorException(statusCode, statusCode.getReasonPhrase(), body, charset);
			default:
				return statusCode.toString();
		}
	}

	public String postForLocation(String url, String jsonBody) {
		URI location = getSession().getRestTemplate().postForLocation(getSession().appendToRoot(url), getBody(jsonBody));
		if (location == null) {
			return null;
		}

		return location.toString();
	}

	public String post(String url, String jsonBody) {
		return getSession().getRestTemplate()
				.postForObject(getSession().appendToRoot(url), getBody(jsonBody), String.class);
	}

	public void put(String url, String jsonBody) {
		getSession().getRestTemplate().put(getSession().appendToRoot(url), getBody(jsonBody));
	}

	public void delete(String url) {
		getSession().getRestTemplate().delete(getSession().appendToRoot(url));
	}

	private HttpEntity<String> getBody(String jsonBody) {
		HttpHeaders headers = getJsonContentHeader();
		HttpEntity<String> httpEntity = new HttpEntity<String>(jsonBody, headers);
		return httpEntity;
	}

	private HttpHeaders getJsonContentHeader() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		return headers;
	}
}
