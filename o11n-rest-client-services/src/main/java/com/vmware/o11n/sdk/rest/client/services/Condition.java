package com.vmware.o11n.sdk.rest.client.services;

import org.apache.commons.lang.Validate;

/**
 * Typesafe representation of the filtering capabilities
 * provided by the vCO REST interface.
 * Please consult the REST documentation for details. 
 *
 */
public final class Condition implements QueryParam{
    private final String operation;
    private final String property;
    private final String value;

    private Condition(String operation, String property, String value) {
        /*REQUIRE: */{
            Validate.notEmpty(property, "property cannot be empty string");
            Validate.notEmpty(value, "value cannot be empty string");
        }
        this.operation = operation;
        this.property = property;
        this.value = value;
    }

    public static Condition equal(String property, String value) {
        return new Condition("=", property, value);
    }

    public static Condition notEqual(String property, String value) {
        return new Condition("!=", property, value);
    }

    public static Condition contain(String property, String value) {
        return new Condition("~", property, value);
    }

    public static Condition notContain(String property, String value) {
        return new Condition("!~", property, value);
    }

    public static Condition greaterThan(String property, String value) {
        return new Condition(">", property, value);
    }

    public static Condition lessThan(String property, String value) {
        return new Condition("<", property, value);
    }

    @Override
    public String toString() {
        return property + operation + value;
    }

    @Override
    public String toParamValue() {
        return property + operation + value;
    }
}
