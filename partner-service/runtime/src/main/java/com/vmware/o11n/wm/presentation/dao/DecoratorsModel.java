/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

//import com.vmware.o11n.serenity.plugin.ui.common.InventoryObjectRef;

import java.util.List;

/**
 * Defines the decorators assigned to {@link FieldModel}.
 */
public class DecoratorsModel {
    /**
     *  Defines options for a chooser type.
     */
    public enum ChooserType {
        NONE,
        LIST,
        TREE,
        DROPDOWN
    }

    /**
     * Defines the chooser type assigned to the {@link FieldModel}.
     */
    private ChooserType chooserDecorator = ChooserType.NONE;
    /**
     * Defines the root elements instance for the {@link FieldModel}.
     */
//    public List<InventoryObjectRef> rootElements;
    /**
     * Defines if the step need to be refreshed on field's value change.
     */
    private Boolean refreshOnChange = false;

    private List<Object> predefinedList;

    private Boolean multiline = false;

    public ChooserType getChooserDecorator() {
        return chooserDecorator;
    }

    public void setChooserDecorator(ChooserType chooserDecorator) {
        this.chooserDecorator = chooserDecorator;
    }

    public Boolean getRefreshOnChange() {
        return refreshOnChange;
    }

    public void setRefreshOnChange(Boolean refreshOnChange) {
        this.refreshOnChange = refreshOnChange;
    }

    public List<Object> getPredefinedList() {
        return predefinedList;
    }

    public void setPredefinedList(List<Object> predefinedList) {
        this.predefinedList = predefinedList;
    }

    public Boolean getMultiline() {
        return multiline;
    }

    public void setMultiline(Boolean multiline) {
        this.multiline = multiline;
    }
}
