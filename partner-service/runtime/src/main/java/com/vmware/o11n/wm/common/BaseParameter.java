/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.common;

import java.io.Serializable;

import com.vmware.o11n.sdk.rest.client.stubs.Parameter;

public class BaseParameter implements Serializable{
	private static final long serialVersionUID = -4658848668290186253L;
	public static final String STRING_TYPE = "string";
	public static final String PATH_TYPE = "path";
	public static final String SECURE_STRING_TYPE = "SecureString";
	public static final String DATE_TYPE = "date";
	public static final String ARRAY_TYPE = "array";
	public static final String BOOLEAN_TYPE = "boolean";
	public static final String NUMBER_TYPE = "number";
	public static final String MIME_TYPE = "MimeAttachment";
	public static final String SDK_OBJECT = "sdkobject";
	public static final String PROPERTIES = "properties";
	public static final String COMPOSITE = "composite";
	public static final String SCOPE = "scope";
	public static final String ARRAY_TYPE_PREFIX = "Array/";
	
	protected String name;
	protected String type;
	private String description;

	public BaseParameter() {
	}

	public BaseParameter(Parameter sdkParameter) {
		if (sdkParameter != null) {
			this.name = sdkParameter.getName();
			this.type = sdkParameter.getType();
			this.description = sdkParameter.getDescription();
		}
	}

	public String getName() {
		return name;
	}

	public String getType() {
		return type;
	}

	public String getDescription() {
		return description;
	}
}
