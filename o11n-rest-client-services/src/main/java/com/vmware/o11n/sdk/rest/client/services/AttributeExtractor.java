package com.vmware.o11n.sdk.rest.client.services;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Link.Attributes;

/**
 * Convinience class for extracting specific values by name from a list
 * of {@link Attribute} objects. Many entities are described by an attribute list.
 * @see InventoryItem
 * @see Link 
 *
 */
public class AttributeExtractor {
    private List<Attribute> attributes;

    public AttributeExtractor() {
    }

    public AttributeExtractor from(Link link) {
        Attributes temp = link.getAttributes();
        if (temp != null) {
            attributes = temp.getAttribute();
        } else {
            attributes = Collections.emptyList();
        }

        return this;
    }

    public AttributeExtractor from(InventoryItem inventoryItem) {
        com.vmware.o11n.sdk.rest.client.stubs.InventoryItem.Attributes iia = inventoryItem.getAttributes();
        if (iia != null) {
            List<Attribute> temp = iia.getAttribute();
            if (temp != null) {
                attributes = temp;
            } else {
                attributes = Collections.emptyList();
            }
        } else {
            attributes = Collections.emptyList();
        }

        return this;
    }

    public String extractAttributeValue(String name) {
        Attribute attr = extractAttribute(name);
        if (attr != null) {
            return attr.getValue();
        } else {
            return null;
        }
    }

    public Attribute extractAttribute(String name) {
        for (Attribute attr : attributes) {
            if (StringUtils.equals(name, attr.getName())) {
                return attr;
            }
        }

        return null;
    }
}
