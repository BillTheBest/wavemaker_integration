package com.vmware.o11n.wm.presentation.dao;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;

public class BaseModel  {
	private String href;

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	protected Date convertXmlDate(XMLGregorianCalendar xmlDate) {
		if (xmlDate == null)
			return null;
		return xmlDate.toGregorianCalendar().getTime();
	}

	protected Date convertXmlStringDate(String xmlDate) throws RuntimeException {
		if (xmlDate == null)
			return null;
		try {
			return DatatypeFactory.newInstance().newXMLGregorianCalendar(xmlDate).toGregorianCalendar().getTime();
		} catch (DatatypeConfigurationException e) {
			throw new RuntimeException(e);
		}
	}
	
	protected Map<String, String> convertAttributesToMap(List<Attribute> attributes) {
		if(attributes == null)
			return Collections.emptyMap();
		Map<String, String> keyValueAttr = new HashMap<String, String>();
		for (Attribute attr : attributes) {
			if(attr != null) {
				keyValueAttr.put(attr.getName(), attr.getValue());
			}
		}
		return keyValueAttr;
	}
}
