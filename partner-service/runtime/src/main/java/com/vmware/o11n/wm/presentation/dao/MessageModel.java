/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

import com.vmware.o11n.sdk.rest.client.stubs.MessageSeverity;

/**
 * Defines the data model for a message displayed for an object in the presentation.
 */

public class MessageModel {
    /**
     * Defines the severity of the message.
     */
    private MessageSeverity severity;
    /**
     * Message content. This content is not localizable.
     */
    private String message;

    public MessageSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(MessageSeverity severity) {
        this.severity = severity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
