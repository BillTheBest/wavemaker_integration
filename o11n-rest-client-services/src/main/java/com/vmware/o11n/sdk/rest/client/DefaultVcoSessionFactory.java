package com.vmware.o11n.sdk.rest.client;

import java.io.IOException;
import java.net.URI;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.commons.lang.Validate;

import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.authentication.UsernamePasswordAuthentication;
import com.vmware.o11n.sdk.rest.client.configuration.ConnectionConfiguration;
import com.vmware.o11n.sdk.rest.client.configuration.ConnectionConfiguration.Builder;
import com.vmware.o11n.sdk.rest.client.impl.VcoSessionImpl;

/**
 * Default implementation of the {@link VcoSessionFactory} interface.
 * This class can be customized to allow connection to vCO servers
 * operating with self-signed certificates.
 *
 */
public class DefaultVcoSessionFactory implements VcoSessionFactory {
    private final URI uri;
    private final ConnectionConfiguration connectionConfiguration;

    /**
     *
     * @param uri the location, for example https://10.23.164.112:8281/api/. Cannot be
     * null
     */
    public DefaultVcoSessionFactory(URI uri) {
        this(uri, ConnectionConfiguration.defaultConfiguration());
    }


    /**
     *
     * @param uri the location, for example https://10.23.164.112:8281/api/. Cannot be null
     * @param connectionConfiguration connection configurations for the HTTP client. Cannot be null
     */
    public DefaultVcoSessionFactory(URI uri, ConnectionConfiguration connectionConfiguration) {
        Validate.notNull(uri, "uri must be not null");
        Validate.notNull(connectionConfiguration, "connection configuration must not be null");
        this.uri = uri;
        this.connectionConfiguration = connectionConfiguration;
    }

    /**
     * A helper method that creates a session for a given vCO location, a username and
     * a password. Works only if vCO is running in LDAP mode
     * @param uri location of the vCO REST endpoint
     * @param username
     * @param password
     * @return
     */
    public static VcoSession newLdapSession(URI uri, String username, String password) {
        return new DefaultVcoSessionFactory(uri).newSession(new UsernamePasswordAuthentication(username, password));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public URI getUri() {
        return uri;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VcoSession newSession(Authentication auth) {
        Validate.notNull(auth, "auth cannot be null");

        try {
            return new VcoSessionImpl(uri, auth, newSSLContext(), newHostnameVerifier(), connectionConfiguration);
        } catch (KeyManagementException e) {
            throw new IllegalStateException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VcoSession newSession(Authentication auth, ConnectionConfiguration connectionConfig) {
        Validate.notNull(auth, "auth cannot be null");
        Validate.notNull(connectionConfig, "connectionConfig cannot be null");

        try {
            return new VcoSessionImpl(uri, auth, newSSLContext(), newHostnameVerifier(), connectionConfig);
        } catch (KeyManagementException e) {
            throw new IllegalStateException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    protected SSLContext newSSLContext() throws KeyManagementException, NoSuchAlgorithmException {
        return null;
    }

    /**
     * Extension point for custom SSL handling.
     * Allows for fine tuning the certificate policy as vCO REST is always accessed
     * over https.
     * @return
     */
    protected HostnameVerifier newHostnameVerifier() {
        return null;
    }

    /**
     * A default implementation that ignore all certificate errors.
     * Useful for development mode but considered risky for production use.
     * @return
     * @throws KeyManagementException
     * @throws NoSuchAlgorithmException
     */
    protected final SSLContext newUnsecureSSLContext() throws KeyManagementException, NoSuchAlgorithmException {
        SSLContext sslcontext = SSLContext.getInstance("TLS"); // New context instance.
        TrustManager[] truster = new TrustManager[] { new X509TrustManager() {

            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            }

            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            }
        } };
        sslcontext.init(null, truster, new java.security.SecureRandom());
        return sslcontext;
    }

    /**
     * A default implementation that ignore all hostname-certificate mismatches.
     * Useful for development mode but considered risky for production use.
     * @return
     */
    protected final HostnameVerifier newUnsecureHostnameVerifier() {
        return new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
    }

    @Override
    public Builder getFactoryConnectionConfiguration() {
        return new ConnectionConfiguration.Builder().prototype(connectionConfiguration);
    }
}
