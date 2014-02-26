package com.vmware.o11n.wm.common;

import java.text.SimpleDateFormat;
import java.util.List;

import javax.xml.datatype.XMLGregorianCalendar;

import org.apache.commons.lang.StringUtils;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.CompositeValue;
import com.vmware.o11n.sdk.rest.client.stubs.KeyValuePair;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

public class ExecutionParameter extends BaseParameter {
	private static final long serialVersionUID = 6265918725164252038L;
	private Object value;
	private Object displayValue;
	private ExecutionParameterType paramType;

	public ExecutionParameter() {
		super();
	}
	
	public ExecutionParameter(Parameter sdkParameter, ExecutionParameterType paramType) {
		this(sdkParameter);
		this.paramType = paramType;
	}

	public ExecutionParameter(Parameter sdkParameter) {
		super(sdkParameter);
		resolveValue(sdkParameter);
	}

	private void resolveValue(Parameter sdkParameter) {
		if (sdkParameter == null)
			return;
		String sdkType = getType();
		if (sdkType == null)
			return;

		if (STRING_TYPE.equals(sdkType) || PATH_TYPE.equals(sdkType)) {
			value = sdkParameter.getString();
		} else if (SECURE_STRING_TYPE.equalsIgnoreCase(sdkType)) {
			SecureString secureString = sdkParameter.getSecureString();
			if(secureString != null) {
				value = secureString.getValue();
				displayValue = extractDisplayName(secureString);
			}
		} else if (sdkType.toLowerCase().startsWith(ARRAY_TYPE)) {
			Array array = sdkParameter.getArray();
			if (array == null)
				return;
			List<Object> listParams = array.getSdkObjectOrStringOrSecureString();
            if ("Array/Date".equals(sdkType)) {
                for (int i=0; i<listParams.size(); i++) {
                    long millis = ((XMLGregorianCalendar) listParams.get(i)).toGregorianCalendar().getTimeInMillis();
                    listParams.set(i, millis);
                }
            }
            value = listParams;
			displayValue = extractDisplayName(sdkParameter.getArray());
		} else if (DATE_TYPE.equalsIgnoreCase(sdkType)) {
            value = convertXmlDateToMillis(sdkParameter.getDate());
            displayValue = convertXmlDate(sdkParameter.getDate());
		} else if (BOOLEAN_TYPE.equals(sdkType)) {
			value = sdkParameter.isBoolean();
		} else if (NUMBER_TYPE.equals(sdkType)) {
			value = sdkParameter.getNumber();
		} else if (MIME_TYPE.equals(sdkType)) {
			value = sdkParameter.getMimeAttachment();
			displayValue = extractDisplayName(value);
		} else if (PROPERTIES.equals(sdkType)) {
			value = sdkParameter.getProperties();
			displayValue = extractDisplayName(value);
		} else if (COMPOSITE.equals(sdkType)) {
			value = sdkParameter.getComposite();
			displayValue = extractDisplayName(value);
		} else {
			value = sdkParameter.getSdkObject();
			displayValue = extractDisplayName(value);
		}
	}

	private Object extractDisplayName(Object param) {
		if (param instanceof SdkObject) {
			return extractSdkObject((SdkObject) param);
		} else if (param instanceof SecureString) {
			return "****";
		} else if (param instanceof XMLGregorianCalendar) {
			return convertXmlDate((XMLGregorianCalendar) param);
		} else if (param instanceof MimeAttachment) {
			return "mime: " + ((MimeAttachment) param).getName();
		} else if( param instanceof Array) {
			List<Object> listParams = ((Array) param).getSdkObjectOrStringOrSecureString();
			return extractArray(listParams);
		} else if( param instanceof Properties) {
			List<KeyValuePair> props = ((Properties) param).getProperty();
			return extractProperties(props);
		} else if( param instanceof KeyValuePair) {
			KeyValuePair keyValuePair = ((KeyValuePair) param);
			Object pairValue = extractKeyValuePair(keyValuePair);
			String key = keyValuePair == null ? "null":keyValuePair.getKey();
			return key + ": " + pairValue;
		}else if( param instanceof Composite) {
			Composite comp = (Composite) param;
			List<CompositeValue> compositeValues= comp.getProperty();
			String type = comp == null? "null": comp.getType();
			return type + ": " + extractComposite(compositeValues);
		}else if( param instanceof CompositeValue) {
			CompositeValue compositeValue = ((CompositeValue) param);
			Object compValue = extractCompositeValue(compositeValue);
			String id = compositeValue == null ? "null":compositeValue.getId();
			return id + ": " + compValue;
		}
		
		return param;
	}

	private Object extractSdkObject(SdkObject sdkObject) {
		StringBuilder sb = new StringBuilder();
		if(StringUtils.isBlank( sdkObject.getDisplayValue())) {
			sb.append(sdkObject.getType());
			sb.append(": ");
			sb.append(sdkObject.getId());
		}else {
			sb.append( sdkObject.getDisplayValue());
		}
		return sb.toString();
	}

	private Object extractCompositeValue(CompositeValue compositeValue) {
		if(compositeValue.getString() != null)
			return compositeValue.getString();
		if(compositeValue.getNumber() != null)
			return compositeValue.getNumber();
		if(compositeValue.getSdkObject() != null)
			return extractDisplayName(compositeValue.getSdkObject());
		if(compositeValue.getSecureString() != null)
			return extractDisplayName(compositeValue.getSecureString());
		if(compositeValue.getDate() != null)
			return extractDisplayName(compositeValue.getDate());
		if(compositeValue.getMimeAttachment() != null)
			return extractDisplayName(compositeValue.getMimeAttachment());
		if(compositeValue.getArray() != null)
			return extractDisplayName(compositeValue.getArray());
		if(compositeValue.getProperties() != null)
			return extractDisplayName(compositeValue.getProperties());
		if(compositeValue.isBoolean() != null)
			return extractDisplayName(compositeValue.isBoolean());
		
		return compositeValue.toString();
	}

	private Object extractKeyValuePair(KeyValuePair keyValuePair) {
		if(keyValuePair.getString() != null)
			return keyValuePair.getString();
		if(keyValuePair.getNumber() != null)
			return keyValuePair.getNumber();
		if(keyValuePair.getSdkObject() != null)
			return extractDisplayName(keyValuePair.getSdkObject());
		if(keyValuePair.getSecureString() != null)
			return extractDisplayName(keyValuePair.getSecureString());
		if(keyValuePair.getDate() != null)
			return extractDisplayName(keyValuePair.getDate());
		if(keyValuePair.getMimeAttachment() != null)
			return extractDisplayName(keyValuePair.getMimeAttachment());
		if(keyValuePair.getArray() != null)
			return extractDisplayName(keyValuePair.getArray());
		if(keyValuePair.getProperties() != null)
			return extractDisplayName(keyValuePair.getProperties());
		if(keyValuePair.getComposite() != null)
			return extractDisplayName(keyValuePair.getComposite());
		if(keyValuePair.isBoolean() != null)
			return extractDisplayName(keyValuePair.isBoolean());
		
		return keyValuePair.toString();
	}
	
	private Object extractComposite(List<CompositeValue> compositeValues) {
		return extractList(compositeValues, "(", ")");
	}

	private Object extractArray(List<Object> listParams) {
		return extractList(listParams, "[", "]");
	}
	
	private Object extractProperties(List<KeyValuePair> props) {
		 return extractList(props, "{", "}");
	}
	
	private Object extractList(List<?> list, String open, String close) {
		if (list == null)
			return open + close;
		int counter = list.size() - 1;
		StringBuilder sb = new StringBuilder(counter * 2 + 4);
		sb.append(open);
		for (Object object : list) {
			if (object != null) {
				Object extrObj = extractDisplayName(object);
				sb.append(extrObj);
				if (counter != 0) {
					sb.append(", ");
					counter--;
				}
			}
		}
		sb.append(close);
		
		return sb.toString();
	}

	private String convertXmlDate(XMLGregorianCalendar xmlDate) {
		if (xmlDate == null)
			return null;
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		return dateFormat.format(xmlDate.toGregorianCalendar().getTime());
	}

    private Long convertXmlDateToMillis(XMLGregorianCalendar xmlDate) {
        if (xmlDate == null)
            return null;
        return xmlDate.toGregorianCalendar().getTimeInMillis();
    }

	public Object getDisplayValue() {
		if (displayValue == null)
			return value;
		return displayValue;
	}
	
	public String getParamType() {
		if(paramType != null) {
			return paramType.name();
		}
		return null;
	}
	
	public Object getValue() {
		return value;
	}
	
	/* need to expose those methods in order to show up in wavemaker designer */
	public String getName() {
		return name;
	}
	
	public String getType() {
		return type;
	}
}


