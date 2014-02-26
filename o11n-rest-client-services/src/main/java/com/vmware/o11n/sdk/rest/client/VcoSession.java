package com.vmware.o11n.sdk.rest.client;

import java.net.URI;

import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.services.NotificationListener;

/**
 * Represents a a connection to the vCO server 
 * for a user. A VcoSession object cannot be shared between different
 * users as it carries the user's authentication. The VcoSession is thread-safe
 * and can be reused for multiple requests and be safely put in and HttpSession. 
 *
 */
public interface VcoSession {
    /**
     * Exposes a low level RestTemplate from Spring allowing users low level access to
     * the vCO REST interface. 
     * @see <a href="http://static.springsource.org/spring/docs/3.0.x/javadoc-api/org/springframework/web/client/RestTemplate.html">RestTemplate javadoc</a>
     * @return
     */
    RestTemplate getRestTemplate();

    /**
     * Utility method to constuct URIs.
     * Creates an URI the with the base URI fro vCO REST api prepended.
     * @param part
     * @return
     */
    URI appendToRoot(String part);

    /**
     * Retrieves the authentication for this session. 
     * The Authentication object can safely be reused to create another
     * session.
     * @return
     */
    Authentication getAuthentication();
    
    /**
     * Used for remote notifications over HTTP
     * @param listener interface over which the notifications are sent
     */
    void addListener(NotificationListener listener);
    
    /**
     * Used to unsubscribe from remote notifications
     * @param listener
     */
    void removeListener(NotificationListener listener);
    
    /**
     * Used for invalidating a session - closing connections etc. 
     */
    void close();
}
