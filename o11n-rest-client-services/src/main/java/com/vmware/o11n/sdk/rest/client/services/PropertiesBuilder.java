package com.vmware.o11n.sdk.rest.client.services;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.KeyValuePair;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

/**
 * Fluent api for construction {@link Properties} objects.
 * Saves keystrokes and your sanity. 
 *
 */
public final class PropertiesBuilder {

    private final Map<String, KeyValuePair> kvPairs;

    public PropertiesBuilder() {
        kvPairs = new HashMap<String, KeyValuePair>();
    }

    public PropertiesBuilder addProperty(String property, Composite value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        addKVPair(kvp);
        return this;
    }

    private KeyValuePair makeKeyValuePair(String property) {
        KeyValuePair kvp = new KeyValuePair();
        kvp.setKey(property);
        return kvp;
    }

    public PropertiesBuilder addProperty(String property, SdkObject value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setSdkObject(value);
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder addProperty(String property, Array value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setArray(value);
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder addProperty(String property, Calendar value) {
        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(value.getTime());

        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setDate(BuilderUtils.toXml(gc));
        addKVPair(kvp);

        return this;
    }

    public PropertiesBuilder addProperty(String property, XMLGregorianCalendar value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setDate(value);
        addKVPair(kvp);

        return this;
    }

    public PropertiesBuilder addProperty(String property, Date value) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value);

        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setDate(BuilderUtils.toXml(cal));
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder addProperty(String property, MimeAttachment value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setMimeAttachment(value);
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder addProperty(String property, Properties value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setProperties(value);
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder addProperty(String property, boolean value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setBoolean(value);
        addKVPair(kvp);
        return this;
    }

    public PropertiesBuilder putSecure(String property, String value) {
        KeyValuePair kvp = makeKeyValuePair(property);

        SecureString ss = new SecureString();
        ss.setValue(value);

        kvp.setSecureString(ss);
        addKVPair(kvp);

        return this;
    }

    public PropertiesBuilder addProperty(String property, String value) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setString(value);
        addKVPair(kvp);
        return this;
    }

    private void addKVPair(KeyValuePair kvp) {
        kvPairs.put(kvp.getKey(), kvp);
    }

    public PropertiesBuilder addProperty(String property, double number) {
        KeyValuePair kvp = makeKeyValuePair(property);
        kvp.setNumber(number);
        addKVPair(kvp);

        return this;
    }

    public PropertiesBuilder addProperty(String property, Number number) {
        return addProperty(property, number.doubleValue());
    }

    public Properties build() {
        Properties props = new Properties();

        for (KeyValuePair kvp : kvPairs.values()) {
            props.getProperty().add(kvp);
        }

        return props;
    }
}
