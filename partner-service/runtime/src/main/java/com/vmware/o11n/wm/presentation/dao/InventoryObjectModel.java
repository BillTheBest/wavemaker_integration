package com.vmware.o11n.wm.presentation.dao;

public class InventoryObjectModel extends BaseModel {
    private String name;
    private String type;
    private String data;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        if (data == null) {
            this.data = "";
        } else {
            this.data = data;
        }
    }
}
