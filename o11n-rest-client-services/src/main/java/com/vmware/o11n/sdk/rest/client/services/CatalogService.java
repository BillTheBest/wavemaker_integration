package com.vmware.o11n.sdk.rest.client.services;

import org.apache.commons.lang.Validate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.PluginMetadata;

/**
 *
 * Entry point for all plugins (SDK Object) related operations.
 */
public class CatalogService extends AbstractService {

    public CatalogService(VcoSession session) {
        super(session);
    }

    //GET /catalog
    public InventoryItem getCatalogContents() {
        return getObjectAppending("catalog/", InventoryItem.class);
    }

    //GET /catalog/{namespace}
    public InventoryItem findRootPluginObject(String pluginName, InventoryItemQuerySpec query) {
        Validate.notEmpty(pluginName, "pluginName cannot be empty");

        return getObjectAppending("catalog/" + urlEncode(pluginName) + qs(query), InventoryItem.class);
    }

    //GET /catalog/{namespace}/metadata
    public PluginMetadata getPluginMetadata(String pluginName) {
        Validate.notEmpty(pluginName, "pluginName cannot be empty");

        return getObjectAppending("catalog/" + urlEncode(pluginName) + "/metadata", PluginMetadata.class);
    }

    //GET /inventory
    /**
     *
     * @param query can be null
     * @return
     */
    public InventoryItem browseInventory(InventoryItemQuerySpec query) {
        return getObjectAppending("inventory/" + qs(query), InventoryItem.class);
    }

    //GET /catalog/{namespace}/{type}
    public InventoryItemsList findPluginObjects(String pluginName, String type, InventoryItemQuerySpec query) {
        Validate.notEmpty(pluginName, "pluginName cannot be empty");
        Validate.notEmpty(type, "type cannot be empty");

        return getObjectAppending("catalog/" + urlEncode(pluginName) + "/" + type + qs(query), InventoryItemsList.class);
    }

    //GET /catalog/{namespace}/{type}/{id}
    public InventoryItem getPluginObjectById(String pluginName, String type, String id, InventoryItemQuerySpec query) {
        return getObjectAppending("catalog/" + urlEncode(pluginName) + "/" + urlEncode(type) + "/" + urlEncode(id) + qs(query), InventoryItem.class);
    }

    //GET /catalog/{namespace}/{parentType}/{parentId}/{relationName}
    public InventoryItemsList findPluginObjectsByRelation(String pluginName, String parentType, String parentId, String relationName, InventoryItemQuerySpec query) {
        return getObjectAppending(new StringBuilder("catalog/")
            .append(urlEncode(pluginName))
            .append("/")
            .append(urlEncode(parentType))
            .append("/")
            .append(urlEncode(parentId))
            .append("/")
            .append(urlEncode(relationName))
            .append(qs(query))
            .toString(), InventoryItemsList.class);
    }

    //GET /catalog/{namespace}/{type}/metadata/icon
    public Icon getIcon(String pluginName, String type) {
        Validate.notEmpty(pluginName, "pluginName cannot be empty");
        Validate.notEmpty(type, "type cannot be empty");

        String url = "catalog/" + urlEncode(pluginName) + "/" + urlEncode(type) + "/metadata/icon";
        return getIcon(appendToRoot(url));
    }
}
