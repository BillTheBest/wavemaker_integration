package com.vmware.o11n.sdk.rest.client.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

/**
 * Fluent api for construction {@link Array} objects.
 * Saves keystrokes and your sanity. 
 *
 */
public final class ArrayBuilder {
    private List<Object> contents;

    public ArrayBuilder(Object... elements) {
        contents = new ArrayList<Object>();
        if (elements != null) {
            for (Object object : elements) {
                if (object == null) {
                    add((String) null);
                    continue;
                }
                if (object instanceof Composite) {
                    Composite c = (Composite) object;
                    add(c);
                }
                if (object instanceof Array) {
                    Array c = (Array) object;
                    add(c);
                }
                if (object instanceof Calendar) {
                    Calendar c = (Calendar) object;
                    add(c);
                }
                if (object instanceof Date) {
                    Date c = (Date) object;
                    add(c);
                }
                if (object instanceof Number) {
                    Number c = (Number) object;
                    add(c.doubleValue());
                }
                if (object instanceof MimeAttachment) {
                    MimeAttachment c = (MimeAttachment) object;
                    add(c);
                }
                if (object instanceof Properties) {
                    Properties c = (Properties) object;
                    add(c);
                }
                if (object instanceof SdkObject) {
                    SdkObject c = (SdkObject) object;
                    add(c);
                }
                if (object instanceof String) {
                    String c = (String) object;
                    add(c);
                }
                if (object instanceof SecureString) {
                    SecureString c = (SecureString) object;
                    appendSecure(c.getValue());
                }
                if (object instanceof XMLGregorianCalendar) {
                    XMLGregorianCalendar c = (XMLGregorianCalendar) object;
                    add(c);
                }
                if (object instanceof Boolean) {
                    Boolean c = (Boolean) object;
                    add(c);
                }
            }
        }
    }

    public ArrayBuilder add(Composite value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(SdkObject value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(Array value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(Calendar value) {
        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(value.getTime());
        list().add(BuilderUtils.toXml(gc));

        return this;
    }

    public ArrayBuilder add(XMLGregorianCalendar value) {
        list().add(value);

        return this;
    }

    public ArrayBuilder add(Date value) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(value);
        list().add(BuilderUtils.toXml(cal));
        return this;
    }

    public ArrayBuilder add(MimeAttachment value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(Properties value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(boolean value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder appendSecure(String value) {
        SecureString ss = new SecureString();
        ss.setValue(value);
        list().add(ss);

        return this;
    }

    public ArrayBuilder add(String value) {
        list().add(value);
        return this;
    }

    public ArrayBuilder add(double number) {
        list().add(number);

        return this;
    }

    public ArrayBuilder add(Number number) {
        return add(number.doubleValue());
    }

    private List<Object> list() {
        return contents;
    }

    public Array build() {
        Array array = new Array();

        for (Object obj : contents) {
            array.getSdkObjectOrStringOrSecureString().add(obj);
        }

        return array;
    }
}
