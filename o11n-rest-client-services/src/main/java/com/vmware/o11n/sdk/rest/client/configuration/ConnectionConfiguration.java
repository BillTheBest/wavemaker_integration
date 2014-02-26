package com.vmware.o11n.sdk.rest.client.configuration;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;

/**
 * Holds http connection specific settings such as proxy, timeout, etc.
 */
public class ConnectionConfiguration {

    private int connectionTimeout;
    private int socketTimeout;
    private int maxConnectionsPerRoute;
    private int proxyPort;
    private String proxyHost;
    private int reconnectTimeout;

    private ConnectionConfiguration() {

    }

    /**
     *
     * @return a new ConnectionConfiguration instance with the default connection settings.
     */
    public static ConnectionConfiguration defaultConfiguration() {
        return new ConnectionConfiguration.Builder().build();
    }

    /**
     * Builder class for building connection configuration
     */
    public static class Builder {
        private int connectionTimeout = 0;
        private int socketTimeout = 0;
        private int maxConnectionsPerRoute = 3;
        private int proxyPort = 0;
        private String proxyHost = null;
        private int reconnectTimeout = 1000;

        /**
         * Determines the timeout in milliseconds until a connection is established. A value of zero means the timeout is not used.
         * The default value is zero.
         * @return the timeout in milliseconds
         */
        public Builder withConnectionTimeout(int connectionTimeout) {
            this.connectionTimeout = connectionTimeout;
            return this;
        }

        /**
         * Determines the default socket timeout (SO_TIMEOUT) in milliseconds which is the timeout for waiting for data.
         * A timeout value of zero is interpreted as an infinite timeout. Default value is zero.
         * @return the socket timeout in milliseconds
         */
        public Builder withSocketTimeout(int socketTimeout) {
            this.socketTimeout = socketTimeout;
            return this;
        }

        /**
         * Determines the maximum limit of connection on a per route basis. Default value is 3.
         * @return the max connections
         */
        public Builder withMaxConnectionsPerRoute(int maxConnectionsPerRoute) {
            this.maxConnectionsPerRoute = maxConnectionsPerRoute;
            return this;
        }

        /**
         * Determines a proxy port. Default Value is zero.
         * @return the proxy port.
         */
        public Builder withProxyPort(int proxyPort) {
            this.proxyPort = proxyPort;
            return this;
        }

        /**
         * Determines a proxy host. Default value is null.If this method is not invoked, the http client is not provided with proxy settings.
         * @return
         */
        public Builder withProxyHost(String proxyHost) {
            this.proxyHost = proxyHost;
            return this;
        }

        /**
         * Timeout before reconnecting to the remote server. Used when atmosphere listener is activated.
         * @param reconnectTimeout in milliseconds
         * @return
         */
        public Builder withReconnectTimeout(int reconnectTimeout) {
            this.reconnectTimeout = reconnectTimeout;
            return this;
        }


        /**
         * Builds a new instance of a ConnectionConfiguration with the provided settings.
         * @return a new ConnectionConfiguration instance.
         */
        public ConnectionConfiguration build() {
            ConnectionConfiguration configuration = new ConnectionConfiguration();
            configuration.connectionTimeout = this.connectionTimeout;
            configuration.socketTimeout = this.socketTimeout;
            configuration.maxConnectionsPerRoute = this.maxConnectionsPerRoute;
            configuration.proxyHost = this.proxyHost;
            configuration.proxyPort = this.proxyPort;
            configuration.reconnectTimeout = this.reconnectTimeout;
            return configuration;
        }

        /**
         * Builds a copy of the provided ConnectionConfiguratiion.
         * @param prototype the prototype
         * @return the copy of the prototype
         */
        public Builder prototype(ConnectionConfiguration prototype) {
            Validate.notNull(prototype);
            return new Builder()
                .withConnectionTimeout(prototype.getConnectionTimeout())
                .withMaxConnectionsPerRoute(prototype.getMaxConnectionsPerRoute())
                .withProxyHost(prototype.getProxyHost())
                .withProxyPort(prototype.getProxyPort())
                .withSocketTimeout(prototype.getSocketTimeout())
                .withReconnectTimeout(prototype.getReconnectTimeout());
        }
    }

    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    public int getSocketTimeout() {
        return socketTimeout;
    }

    public int getMaxConnectionsPerRoute() {
        return maxConnectionsPerRoute;
    }

    public int getProxyPort() {
        return proxyPort;
    }

    public String getProxyHost() {
        return proxyHost;
    }

    public boolean isProxySettingsProvided() {
        return !StringUtils.isEmpty(proxyHost) && proxyPort >= 0;
    }

    public int getReconnectTimeout() {
        return reconnectTimeout;
    }
}
