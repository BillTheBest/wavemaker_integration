package com.vmware.o11n.sdk.rest.client;

import java.sql.Date;

import org.codehaus.jackson.annotate.JsonProperty;

public class Notification {

    @JsonProperty
    private NotificationProperties properties;
    
    @JsonProperty
    private String id;
    
    @JsonProperty
    private Date timestamp;
    
    public NotificationProperties getProperties() {
        return properties;
    }
    public String getId() {
        return id;
    }
    public Date getTimestamp() {
        return timestamp;
    }
    
    public String toString() {
        return new StringBuilder(id).append(" ").append(properties == null ? "" : properties.toString()).toString();
    }
}
