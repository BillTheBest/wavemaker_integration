/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

import java.util.List;

/**
 *  Defines the step data model used in the presentation.
 */
public class StepModel {
    /**
     * Indicates if the group is hidden.
     */
    private Boolean hidden = false;
    /**
     * Defines the name for this step. This name is not localizable.
     */
    private String displayName;
    /**
     * Defines the description for this step. This description is not localizable.
     */
    private String description;
    /**
     * Defines the messages for this step.
     */
    private List<MessageModel> messages;
    /**
     * Defines the groups in this step.
     */
    private List<GroupModel> groups;


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

    public List<GroupModel> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupModel> groups) {
        this.groups = groups;
    }
}
