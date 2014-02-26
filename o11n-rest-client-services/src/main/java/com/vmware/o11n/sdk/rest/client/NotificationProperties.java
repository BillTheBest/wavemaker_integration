package com.vmware.o11n.sdk.rest.client;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationProperties {

    @JsonProperty
    private String changeType;
    
    @JsonProperty
    @JsonIgnore
    private String JMSXDeliveryCount;
    
    @JsonProperty
    @JsonIgnore
    private String RequestorID;
    
    @JsonProperty
    private String ownerId;
    
    @JsonProperty
    private String changeTarget;
    
    @JsonProperty
    private String type;
    
    @JsonProperty
    private String originatorSessionId;
    
    @JsonProperty
    @JsonIgnore
    private String ClientID;
    
    @JsonProperty
    private String objectType;
    
    @JsonProperty
    private String workflowTokenState;
    
    public String getChangeType() {
        return changeType;
    }
    public String getJMSXDeliveryCount() {
        return JMSXDeliveryCount;
    }
    public String getRequestorID() {
        return RequestorID;
    }
    public String getOwnerId() {
        return ownerId;
    }
    public String getChangeTarget() {
        return changeTarget;
    }
    public String getType() {
        return type;
    }
    public String getOriginatorSessionId() {
        return originatorSessionId;
    }
    public String getClientID() {
        return ClientID;
    }
    public String getObjectType() {
        return objectType;
    }
    public String getWorkflowTokenState() {
        return workflowTokenState;
    }
    
    public String toString() {
        return new StringBuilder(changeType).append(" ").append(objectType).toString();
    }
}
