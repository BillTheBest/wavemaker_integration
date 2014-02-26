package com.vmware.o11n.sdk.rest.client;

import java.io.IOException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.Validate;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpException;
import org.apache.http.HttpRequest;
import org.apache.http.HttpRequestInterceptor;
import org.apache.http.impl.client.EntityEnclosingRequestWrapper;
import org.apache.http.impl.client.RequestWrapper;
import org.apache.http.protocol.HttpContext;

import com.vmware.o11n.sdk.rest.client.authentication.Authentication;

public class RequestAuthenticationInterceptor implements HttpRequestInterceptor {

    private final Authentication authentication;

    public RequestAuthenticationInterceptor(final Authentication authentication) {
        Validate.notNull(authentication);
        this.authentication = authentication;
    }

    @Override
    public void process(HttpRequest request, HttpContext context) throws HttpException, IOException {
        if (request instanceof EntityEnclosingRequestWrapper) {
            HttpEntity entity = ((HttpEntityEnclosingRequest) request).getEntity();
            byte[] body = IOUtils.toByteArray(entity.getContent());
            authentication.postProcessRequest(request, body);
        } else if (request instanceof RequestWrapper) {
            authentication.postProcessRequest(request, new byte[0]);
        } else {
            throw new IllegalArgumentException(
                    "Invalid request type. Expected EntityEnclosingRequestWrapper or RequestWrapper, but got "
                            + request.getClass());
        }
    }

}
