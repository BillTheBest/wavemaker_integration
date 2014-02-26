package com.vmware.o11n.sdk.rest.client.services;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext.Parameters;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

/**
 * Fluent api for construction {@link ExecutionContext} objects.
 * Saves keystrokes and your sanity.
 *
 */
public final class ExecutionContextBuilder {

    private ExecutionContext context;

    public ExecutionContextBuilder() {
        context = new ExecutionContext();
        context.setParameters(new Parameters());
    }

    public ExecutionContextBuilder addParam(String name, Composite value) {
        Parameter param = new Parameter();
        param.setType("composite");

        param.setComposite(value);
        context.getParameters().getParameter().add(param);
        return this;
    }

    public ExecutionContextBuilder addParam(String name, SdkObject value) {
        Parameter param = makeParam(name);
        param.setType("sdk-object");
        if (value.getType() != null) {
            param.setType(value.getType());
        }

        param.setSdkObject(value);
        context.getParameters().getParameter().add(param);
        return this;
    }

    private Parameter makeParam(String name) {
        Parameter param = new Parameter();
        param.setName(name);
        return param;
    }

    public ExecutionContextBuilder addParam(String name, Array value) {
        Parameter param = makeParam(name);
        param.setType("array");

        param.setArray(value);
        context.getParameters().getParameter().add(param);
        return this;
    }

    public ExecutionContextBuilder addParam(String name, Calendar value) {
        Parameter param = makeParam(name);
        param.setType("date");

        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value.getTime());
        param.setDate(BuilderUtils.toXml(cal));
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, Date value) {
        Parameter param = makeParam(name);
        param.setType("date");

        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value);
        param.setDate(BuilderUtils.toXml(cal));
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, MimeAttachment value) {
        Parameter param = makeParam(name);
        param.setType("mime-attachment");

        param.setMimeAttachment(value);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, Properties value) {
        Parameter param = makeParam(name);
        param.setType("properties");

        param.setProperties(value);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, boolean value) {
        Parameter param = makeParam(name);
        param.setType("boolean");

        param.setBoolean(value);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addSecureParam(String name, String value) {
        Parameter param = makeParam(name);
        param.setType("SecureString");

        SecureString ss = new SecureString();
        ss.setValue(value);
        param.setSecureString(ss);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, String value) {
        Parameter param = makeParam(name);
        param.setType("string");

        param.setString(value);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, double number) {
        Parameter param = makeParam(name);
        param.setType("number");

        param.setNumber(number);
        context.getParameters().getParameter().add(param);

        return this;
    }

    public ExecutionContextBuilder addParam(String name, Number number) {
        return addParam(name, number.doubleValue());
    }

    public ExecutionContext build() {
        return context;
    }

    public ExecutionContext empty() {
        return context;
    }
}
