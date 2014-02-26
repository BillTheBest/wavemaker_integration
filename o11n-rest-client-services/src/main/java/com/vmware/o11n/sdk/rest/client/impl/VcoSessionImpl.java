package com.vmware.o11n.sdk.rest.client.impl;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.SocketException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.SchemeRegistryFactory;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.HttpConnectionParams;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.Notification;
import com.vmware.o11n.sdk.rest.client.RequestAuthenticationInterceptor;
import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.authentication.UsernamePasswordAuthentication;
import com.vmware.o11n.sdk.rest.client.configuration.ConnectionConfiguration;
import com.vmware.o11n.sdk.rest.client.services.NotificationListener;

public class VcoSessionImpl implements VcoSession {

    private static final Logger LOG = LoggerFactory.getLogger(VcoSessionImpl.class);

    private final Authentication authentication;
    private final URI uri;
    private final ConnectionConfiguration connectionConfiguration;
    private final SSLContext sslContext;
    private final HostnameVerifier hostnameVerifier;
    private final RestTemplate template;
    private final HttpClient httpClient;
    private final HttpClient cometHttpClient;
    private boolean inClosingState;

    private final List<NotificationListener> listeners = new CopyOnWriteArrayList<NotificationListener>();

    public VcoSessionImpl(URI uri, Authentication authentication, SSLContext sslContext,
            HostnameVerifier hostnameVerifier, ConnectionConfiguration connectionConfiguration) {
        this.uri = uri;
        this.connectionConfiguration = connectionConfiguration;
        this.authentication = authentication;
        this.sslContext = sslContext;
        this.hostnameVerifier = hostnameVerifier;
        this.httpClient = makeHttpClient();
        this.cometHttpClient = makeHttpClient();

        HttpConnectionParams.setConnectionTimeout(httpClient.getParams(), connectionConfiguration.getConnectionTimeout());
        HttpConnectionParams.setSoTimeout(httpClient.getParams(), connectionConfiguration.getSocketTimeout());

        HttpConnectionParams.setConnectionTimeout(cometHttpClient.getParams(), connectionConfiguration.getConnectionTimeout());

        this.template = new RestTemplate(new HttpComponentsClientHttpRequestFactory(httpClient));

    }

    @Override
    public Authentication getAuthentication() {
        return authentication;
    }

    @Override
    public RestTemplate getRestTemplate() {

        return template;
    }

    private synchronized HttpClient makeHttpClient() {
        DefaultHttpClient client = null;

        if (sslContext != null) {
            SchemeRegistry registry = SchemeRegistryFactory.createDefault();
            SSLSocketFactory sslSocketFactory = null;

            if (hostnameVerifier != null) {
                sslSocketFactory = new SSLSocketFactory(sslContext, new X509HostnameVerifier() {

                    @Override
                    public boolean verify(String hostname, SSLSession session) {
                        return hostnameVerifier.verify(hostname, session);
                    }

                    @Override
                    public void verify(String host, String[] cns, String[] subjectAlts) throws SSLException {
                    }

                    @Override
                    public void verify(String host, X509Certificate cert) throws SSLException {
                    }

                    @Override
                    public void verify(String host, SSLSocket ssl) throws IOException {
                    }
                });
            } else {
                sslSocketFactory = new SSLSocketFactory(sslContext);
            }

            Scheme scheme = new Scheme("https", uri.getPort(), sslSocketFactory);
            registry.register(scheme);
            ThreadSafeClientConnManager connManager = new ThreadSafeClientConnManager(registry);
            connManager.setMaxForRoute(new HttpRoute(new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme())),
                    connectionConfiguration.getMaxConnectionsPerRoute());
            client = new DefaultHttpClient(connManager);
        } else {
            ThreadSafeClientConnManager connManager = new ThreadSafeClientConnManager();
            connManager.setMaxForRoute(new HttpRoute(new HttpHost(uri.getHost(), uri.getPort(), uri.getScheme())),
                    connectionConfiguration.getMaxConnectionsPerRoute());
            client = new DefaultHttpClient(connManager);
        }

        client.addRequestInterceptor(new RequestAuthenticationInterceptor(authentication));

        if (authentication instanceof UsernamePasswordAuthentication) {
            UsernamePasswordAuthentication upa = (UsernamePasswordAuthentication) authentication;

            Credentials credentials = new UsernamePasswordCredentials(upa.getUsername(), upa.getPassword());
            AuthScope scope = new AuthScope(uri.getHost(), uri.getPort());
            client.getCredentialsProvider().setCredentials(scope, credentials);
        }

        if (connectionConfiguration.isProxySettingsProvided()) {
            configureProxy(client);
        }

        return client;
    }

    @Override
    public URI appendToRoot(String part) {
        try {
            String s = uri.toString();
            if (!s.endsWith("/")) {
                s += "/";
            }
            return new URI(s + part);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("cannot make uri using part " + part, e);
        }
    }

    @Override
    public synchronized void addListener(NotificationListener listener) {
        if (listener != null) {
            if (listeners.isEmpty()) {
                listeners.add(listener);
                Thread t = new Thread(new NotificationThread(new NotificationHandler(listeners)), "notificationThread");
                t.start();
            } else {
                listeners.add(listener);
            }
        }
    }

    @Override
    public synchronized void removeListener(NotificationListener listener) {
        if (listener != null) {
            listeners.remove(listener);
        }
    }

    @Override
    public synchronized void close() {
        this.inClosingState = true;
        //Forces connection close
        httpClient.getConnectionManager().shutdown();
    }

    private class NotificationThread implements Runnable {

        private NotificationHandler notificationHandler;

        public NotificationThread(NotificationHandler notificationHandler) {
            this.notificationHandler = notificationHandler;
        }

        @Override
        public void run() {
            URI endpoint = appendToRoot("notifications/channel/");
            while (!inClosingState) {
                HttpGet request = new HttpGet(endpoint);
                try {
                    cometHttpClient.execute(request, notificationHandler);
                    delay();
                } catch (ClientProtocolException e) {
                    LOG.info("HTTP or HttpClient exception has occurred. ", e);
                    delay();
                    LOG.info("Attempting to reconnect...");
                } catch (SocketException se) {
                    if (inClosingState) {
                        LOG.info("Terminating session. Connection closed.");
                    } else {
                        LOG.info("Destination host (" + endpoint + ") unreachable.");
                        delay();
                        LOG.info("Attempting to reconnect...");
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Connection to " + endpoint + " was aborted", e);
                }
            }
        }

        private void delay() {
            try {
                Thread.sleep(connectionConfiguration.getReconnectTimeout());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private class NotificationHandler implements ResponseHandler<String> {

        private List<NotificationListener> listeners;

        public NotificationHandler(List<NotificationListener> listeners) {
            this.listeners = listeners;
        }

        @Override
        public String handleResponse(HttpResponse response) throws ClientProtocolException, IOException {
            InputStream inputStream = response.getEntity().getContent();

            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line = null;
            int strLength = 0;
            StringBuilder sb = new StringBuilder();
            try {
                while ((line = reader.readLine()) != null) {
                    try {
                        if (StringUtils.isNumeric(line)) {
                            strLength = Integer.parseInt(line);
                        } else {
                            if (strLength > 0) {
                                sb.append(line);
                                if (sb.length() == strLength) {
                                    //notify
                                    Notification msg = convertToObject(line, Notification.class);
                                    for (NotificationListener listener : listeners) {
                                        listener.onMessage(msg);
                                    }
                                    //null counter and buffer
                                    strLength = 0;
                                    sb = new StringBuilder();
                                }
                            } else if (sb.length() > strLength) {
                                //null counter and buffer
                                strLength = 0;
                                sb = new StringBuilder();
                            }
                        }
                    } catch (Throwable e) {
                        //null counter and buffer
                        strLength = 0;
                        sb = new StringBuilder();
                        LOG.warn(e.getMessage(), e);
                    }
                }
            } finally {
                LOG.debug("Closing notification input stream.");
                inputStream.close();
            }
            return sb.toString();
        }

        public <T> T convertToObject(String payload, Class<T> responseType) throws Exception {
            byte[] jsonBytes = payload.getBytes();
            ByteArrayInputStream input = new ByteArrayInputStream(jsonBytes);
            ObjectMapper mapper = new ObjectMapper();
            T obj = null;
            try {
                obj = mapper.readValue(input, responseType);
            } catch (JsonParseException e) {
                throw new Exception(e.getMessage(), e);
            } catch (JsonMappingException e) {
                //                throw new Exception(e.getMessage(), e);
            } catch (IOException e) {
                throw new Exception(e.getMessage(), e);
            } finally {
                try {
                    input.close();
                } catch (IOException e) {
                }
            }
            return obj;
        }

    }

    private void configureProxy(HttpClient httpClient) {
        String proxyHost = connectionConfiguration.getProxyHost();
        int proxyPort = connectionConfiguration.getProxyPort();
        HttpHost proxy = new HttpHost(proxyHost, proxyPort);
        httpClient.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY, proxy);
    }
}
