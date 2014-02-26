package com.vmware.o11n.sdk.rest.client;

import java.net.URI;

import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.authentication.UsernamePasswordAuthentication;
import com.vmware.o11n.sdk.rest.client.configuration.ConnectionConfiguration;

/**
 * Main entry point to vCO REST Java client.
 * @see DefaultVcoSessionFactory
 */
public interface VcoSessionFactory {

    /**
     * Returns the API URI this VcoSessionFactory was configured with
     * @return
     */
    URI getUri();

    /**
     * Creates an authenticated VcoSession using the provided Authentication object.
     * The returned session can fail upon usage if the provided credentials are incorrect.
     *
     * @param auth cannot be null
     * @see UsernamePasswordAuthentication
     * @return
     */
    VcoSession newSession(Authentication auth);

    /**
     *
     * @param auth
     * @param connectionConfig
     * @return
     */
    VcoSession newSession(Authentication auth, ConnectionConfiguration connectionConfig);

    /**
     *
     * @return a builder for ConnectionConfiguration based on the factory's config
     */
    ConnectionConfiguration.Builder getFactoryConnectionConfiguration();
}
