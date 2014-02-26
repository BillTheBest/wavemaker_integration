package com.vmware.o11n.sdk.rest.client.authentication;

import com.vmware.o11n.sdk.rest.client.VcoSessionFactory;

/**
 * Encapsulated an Authentication that is usable when vCO is
 * running in LDAP mode. 
 * @see VcoSessionFactory#newSession(Authentication)
 */
public final class UsernamePasswordAuthentication extends Authentication {
    private final String username;
    private final String password;

    /**
     * Default constructor
     * @param username
     * @param password
     */
    public UsernamePasswordAuthentication(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
