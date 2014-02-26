package com.vmware.o11n.sdk.rest.client.impl;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

public class CertificateManager implements HostnameVerifier {
    private final String ipAddress;
    private final int port;

    private List<X509Certificate> connectionCertificates;
    private boolean hostVerified = true;
    private boolean certsTrusted = true;
    private String hostName = null;
    private HostnameVerifier hostNameVerifier;

    public CertificateManager(String ipAddress, int port) {
        this.ipAddress = ipAddress;
        this.port = port;
        hostNameVerifier = new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
    }

    public synchronized X509Certificate[] connect(final boolean includeChain) throws IOException,
            NoSuchAlgorithmException, KeyManagementException {
        connectionCertificates = new ArrayList<X509Certificate>();
        SSLSocket sslSocket = null;
        try {
            // create a SocketFactory without TrustManager (well with one that accepts anything)
            TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }

                public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                }

                public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType)
                        throws CertificateException {
                    certs[0].checkValidity();

                    if (includeChain) {
                        for (X509Certificate certificate : certs) {
                            connectionCertificates.add(certificate);
                        }
                    } else {
                        connectionCertificates.add(certs[0]);//add only the server cert                        
                    }
                }
            } };

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            SSLSocketFactory sslSocketFactory = sc.getSocketFactory();
            sslSocket = (SSLSocket) sslSocketFactory.createSocket(this.ipAddress, this.port);
            sslSocket.setSoTimeout(30 * 1000);
            sslSocket.startHandshake();

        } finally {
            try {
                if (sslSocket != null) {
                    sslSocket.close();
                }
            } catch (IOException silent) {
            }
        }
        X509Certificate[] result = null;
        if (connectionCertificates.size() > 0) {
            result = new X509Certificate[connectionCertificates.size()];
            result = connectionCertificates.toArray(result);
        } else {
            result = null;
        }
        return result;
    }

    public boolean verify(String hostname, SSLSession session) {//verify them all
        hostName = hostname;
        try {
            hostVerified = hostNameVerifier.verify(hostname, session);
        } catch (Exception t) {
            hostVerified = false;
        }
        return true;
    }

    public boolean isCertsTrusted() {
        return certsTrusted;
    }

    public boolean isHostVerified() {
        return hostVerified;
    }

    public String getHostName() {
        return hostName;
    }
}
