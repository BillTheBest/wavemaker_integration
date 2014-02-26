/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

import java.util.List;

/**
 *  Defines the data model for a group of fields.
 */
public class GroupModel {
    /**
     * Indicates if the group is hidden.
     */
    private Boolean hidden = false;
    /**
     * Defines the name for this group.
     */
    private String displayName;
    /**
     * Defines the description for this field.
     */
    private String description;
    /**
     * Defines the messages for this group.
     */
    private List<MessageModel> messages;
    /**
     * Defines the fields inside this group.
     */
    private List<FieldModel> fields;


    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<MessageModel> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageModel> messages) {
        this.messages = messages;
    }

    public List<FieldModel> getFields() {
        return fields;
    }

    public void setFields(List<FieldModel> fields) {
        this.fields = fields;
    }
}
