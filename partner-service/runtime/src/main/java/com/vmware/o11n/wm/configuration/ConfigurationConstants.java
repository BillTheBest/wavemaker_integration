/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.configuration;

public enum ConfigurationConstants {
	HOST("host"), 
	SHARED_SESSION("sharedSession"),
	VCO_AUTH_MODE("vcoAuthMode"),
	VCO_CONF_XML("vco-conf.xml"),
	USER_PASSWORD("password"),
	USERNAME("username"),
	PORT("port"),
	//The default checksum is used for optimization to increase performance
	//the checksum should be in in sync with the icon config in DefaultCatalogItemiconUri
	DEFAULT_WORKFLOW_ICON_CHECKSUM("DefaultWorkflowIconChecksum"),
	//The default icon to be used in the catalog.
	DEFAULT_CATALOG_ITEM_ICON_URI("DefaultCatalogItemiconUri");
	
	
	private String name;
	
	ConfigurationConstants(String name){
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	
	
	
	
}
