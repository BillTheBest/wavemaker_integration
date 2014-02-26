package com.vmware.o11n.sdk.rest.client.authentication;

import org.apache.http.HttpRequest;

/**
 * Encapsulates authentication types to the vCO server.
 *
 *@see SsoAuthentication
 *@see UsernamePasswordAuthentication
 *@see DevModeAuthentication
 */
public abstract class Authentication {

    public void postProcessRequest(HttpRequest request, byte[] body) {
    }
}
