package com.vmware.o11n.sdk.rest.client.services;

import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;

/**
 * 
 * Typesafe representation of the avaialble filtering and sorting
 * capabilities of all operations that return a collection of 
 * {@link InventoryItem}s. 
 *
 */
public class InventoryItemQuerySpec extends AbstractQuerySpec {

    public InventoryItemQuerySpec setMaxResult(int param) {
        setParam("maxResult", param);
        return this;
    }

    public InventoryItemQuerySpec setStartIndex(int param) {
        setParam("startIndex", param);
        return this;
    }

    public InventoryItemQuerySpec setQueryCount(boolean param) {
        setParam("queryCount", param);
        return this;
    }

    public InventoryItemQuerySpec addKey(String param) {
        append("keys", param);
        return this;
    }

    public InventoryItemQuerySpec addCondition(Condition param) {
        append("conditions", param);
        return this;
    }

    public InventoryItemQuerySpec addSortOrder(Order param) {
        append("sortOrder", param);
        return this;
    }
}
