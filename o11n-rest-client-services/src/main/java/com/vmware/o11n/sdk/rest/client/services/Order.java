package com.vmware.o11n.sdk.rest.client.services;

/**
 * 
 * Typesafe representation of the ordering supported by some REST endpoints.
 * @see InventoryItemQuerySpec
 * @see CategoryQuerySpec
 *
 */
public final class Order implements QueryParam {
    private final String property;

    private Order(String property) {
        this.property = property;
    }

    @Override
    public String toParamValue() {
        return property;
    }

    /**
     * Creates an "sort ascending by property" object. 
     * @param property
     * @return
     */
    public static Order ascendingBy(String property) {
        return new Order("+" + property);
    }

    /**
     * Creates an "sort descending by property" object. 
     * @param property
     * @return
     */
    public static Order descendingBy(String property) {
        return new Order("-" + property);
    }

    @Override
    public String toString() {
        return toParamValue();
    }
}
