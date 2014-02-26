package com.vmware.o11n.wm.common;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

import javax.xml.datatype.XMLGregorianCalendar;
import java.util.Iterator;
import java.util.List;

public class PresentationParameter extends BaseParameter {
	private static final long serialVersionUID = -6428380936171175872L;
	private Object value;

	public PresentationParameter() {
		super();
	}

	public Parameter toParameter() {
		Parameter param = new Parameter();
		param.setName(getName());
		param.setType(getType());
		toParamValue(param);

		return param;
	}

	private void toParamValue(Parameter param) {
		if (value == null)
			return;

        if (type != null && type.startsWith(ARRAY_TYPE_PREFIX)) {
            List list = (List) value;
            Array sdkArray = new Array();
            Iterator iterator = list.iterator();
            while (iterator.hasNext()) {
                Object item = iterator.next();
                sdkArray.getSdkObjectOrStringOrSecureString().add(item);
            }
            param.setArray(sdkArray);
        } else if (STRING_TYPE.equals(type) || PATH_TYPE.equals(type)) {
			param.setString((String) value);
		} else if (SECURE_STRING_TYPE.equals(type)) {
			SecureString secureString = new SecureString();
			secureString.setValue(value.toString());
			param.setSecureString(secureString);
		} else if (DATE_TYPE.equalsIgnoreCase(type)) {
            param.setDate((XMLGregorianCalendar) value);
		} else if (BOOLEAN_TYPE.equals(type)) {
			param.setBoolean(Boolean.valueOf(value.toString()));
		} else if (NUMBER_TYPE.equals(type)) {
			param.setNumber(Double.valueOf(value.toString()));
		} else if (MIME_TYPE.equals(type)) {
            param.setMimeAttachment((MimeAttachment) value);
		} else if (PROPERTIES.equals(type)) {
			throw new RuntimeException("Not implemented for PROPERTIES");
		} else if (COMPOSITE.equals(type)) {
			throw new RuntimeException("Not implemented for COMPOSITE");
		} else if (SDK_OBJECT.equals(type) || value instanceof SdkObject) {
			param.setSdkObject((SdkObject) value);
		} else {
			throw new RuntimeException("Type not recognized");
		}
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

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

}
