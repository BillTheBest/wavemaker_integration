/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************/
package com.vmware.o11n.wm;

import com.wavemaker.runtime.ws.BindingProperties;
import com.wavemaker.runtime.ws.RESTService;

import javax.xml.namespace.QName;

/**
 * This class is required by the wavemaker partner service framework
 */
public class VcoRestService extends RESTService {
	public VcoRestService(String serviceId, QName serviceQName, String parameterizedURI) {
		super(serviceId, serviceQName, parameterizedURI);
	}

	public VcoRestService(String serviceId, QName serviceQName, String parameterizedURI,
			BindingProperties bindingProperties) {
		super(serviceId, serviceQName, parameterizedURI, bindingProperties);
	}
}
