package com.vmware.o11n.wm.presentation.dao;

/**
 * Created with IntelliJ IDEA.
 * User: jinnie
 * Date: 3/27/13
 * Time: 2:23 PM
 * To change this template use File | Settings | File Templates.
 */
public class VcoObject {
    private String href;
    private String type;
    private String id;
    private String displayValue;

    public void setHref(String href) {
        this.href = href;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }

    public String getHref() {
        return href;
    }

    public String getType() {
        return type;
    }

    public String getId() {
        return id;
    }

    public String getDisplayValue() {
        return displayValue;
    }
}
