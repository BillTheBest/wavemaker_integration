/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

import com.vmware.o11n.sdk.rest.client.stubs.MessageSeverity;

import java.util.List;

/**
 * Defines the data model for a field.
 */
public class FieldModel {

    public enum FieldTypeModel {
        WORKFLOW, SDK_OBJECT, SIMPLE
    }

    /**
     * Id of the field.
     */
    private String id;
    /**
     * Type of the parameter that this filed will be used for.
     */
    private String type;

    /**
     * Defines the global type for this field. It aggregate type of the field in
     * few categories defined by {@link FieldTypeModel}.
     */
    private FieldTypeModel fieldType;

    private Object value;

    /**
     * Indicates if the field is hidden.
     */
    private Boolean hidden = false;
    /**
     * Defines what will be the label for this field. Currently this label is not localizable.
     */
    private String displayName;
    /**
     * Defines the messages that are set for this field during validation.
     */
    private List<MessageModel> messages;
    /**
     * Defines the constraints for this field.
     */
    private ConstraintsModel constraints;
    /**
     * Defines the decorators for this field.
     */
    private DecoratorsModel decorators;

    public Boolean getValid() {
        for (MessageModel message : messages) {
            if (message.getSeverity() == MessageSeverity.ERROR) {
                return true;
            }
        }
        return false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public FieldTypeModel getFieldType() {
        return fieldType;
    }

    public void setFieldType(FieldTypeModel fieldType) {
        this.fieldType = fieldType;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

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

    public List<MessageModel> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageModel> messages) {
        this.messages = messages;
    }

    public ConstraintsModel getConstraints() {
        return constraints;
    }

    public void setConstraints(ConstraintsModel constraints) {
        this.constraints = constraints;
    }

    public DecoratorsModel getDecorators() {
        return decorators;
    }

    public void setDecorators(DecoratorsModel decorators) {
        this.decorators = decorators;
    }
}
