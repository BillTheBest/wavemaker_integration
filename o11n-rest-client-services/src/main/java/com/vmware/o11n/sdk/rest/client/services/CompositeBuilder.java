package com.vmware.o11n.sdk.rest.client.services;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.CompositeValue;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

/**
 * Fluent api for construction {@link CompositeValue} objects.
 * Saves keystrokes and your sanity. 
 *
 */
public final class CompositeBuilder {

    private Map<String, CompositeValue> compositeValues;

    public CompositeBuilder() {
        compositeValues = new HashMap<String, CompositeValue>();
    }

    public CompositeBuilder put(String id, Composite value) {
        CompositeValue cv = makeCompositeValue(id);
        addValue(cv);
        return this;
    }

    private CompositeValue makeCompositeValue(String id) {
        CompositeValue cv = new CompositeValue();
        cv.setId(id);
        return cv;
    }

    public CompositeBuilder put(String id, SdkObject value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setSdkObject(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, Array value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setArray(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, Calendar value) {
        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(value.getTime());

        CompositeValue cv = makeCompositeValue(id);
        cv.setDate(BuilderUtils.toXml(gc));
        addValue(cv);

        return this;
    }

    public CompositeBuilder put(String id, XMLGregorianCalendar value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setDate(value);
        addValue(cv);

        return this;
    }

    public CompositeBuilder put(String id, Date value) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value);

        CompositeValue cv = makeCompositeValue(id);
        cv.setDate(BuilderUtils.toXml(cal));
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, MimeAttachment value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setMimeAttachment(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, Properties value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setProperties(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, boolean value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setBoolean(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder putSecure(String id, String value) {
        CompositeValue cv = makeCompositeValue(id);

        SecureString ss = new SecureString();
        ss.setValue(value);

        cv.setSecureString(ss);
        addValue(cv);

        return this;
    }

    public CompositeBuilder put(String id, String value) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setString(value);
        addValue(cv);
        return this;
    }

    public CompositeBuilder put(String id, double number) {
        CompositeValue cv = makeCompositeValue(id);
        cv.setNumber(number);
        addValue(cv);
        return this;
    }

    private void addValue(CompositeValue cv) {
        compositeValues.put(cv.getId(), cv);
    }

    public CompositeBuilder put(String id, Number number) {
        return put(id, number.doubleValue());
    }

    public Composite build() {
        Composite composite = new Composite();

        for (CompositeValue cv : compositeValues.values()) {
            composite.getProperty().add(cv);
        }
        
        return composite;
    }
}
