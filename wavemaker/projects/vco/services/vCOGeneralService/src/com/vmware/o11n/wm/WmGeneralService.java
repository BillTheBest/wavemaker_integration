package com.vmware.o11n.wm;

import com.vmware.o11n.sdk.rest.client.stubs.AboutInfo;
import com.vmware.o11n.sdk.rest.client.stubs.User;
import com.vmware.o11n.wm.services.VcoGeneralService;
import com.wavemaker.runtime.javaservice.JavaServiceSuperClass;
import com.wavemaker.runtime.service.annotations.ExposeToClient;

/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests. 
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).
 * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.
 * For info on these levels, look for tomcat/log4j documentation
 */
@ExposeToClient
public class WmGeneralService extends JavaServiceSuperClass {
    
    private VcoGeneralService service;
    
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
	public WmGeneralService(VcoGeneralService service) {
		super(INFO);
		this.service = service;
	}

	public User getCurrentUser() {
		return this.service.getCurrentUser();
	}
	
	public boolean isCurrentUserInAdminRole() {
		return service.isCurrentUserInAdminRole();
	}

	public AboutInfo getAboutInfo() {
		return this.service.getAboutInfo();
	}

	public long getTotalScheduledTasks() {
		return this.service.getTotalScheduledTasks();
	}

	public long getTotalRunningWorkflows() {
		return this.service.getTotalRunningWorkflows();
	}

	public long getTotalUserInteractions() {
		return this.service.getTotalUserInteractions();
	}
	
	public void storeJsonValue(String key, Object value) {
		this.service.storeJsonValue(key, value);
	}
	
	public String loadJsonValue(String key) {
		return this.service.loadJsonValue(key);
	}
	
	public void storeAppConfig(Object config) {
		this.service.storeAppConfig(config);
	}
	
	public String loadAppConfig() {
		return this.service.loadAppConfig();
	}
	
	public void storeConnConfigJson(String connConfig) {
		this.service.storeConnConfigJson(connConfig);
	}
	
	public String getConnConfigJson() {
		return this.service.getConnConfigJson();
	}
	
	public void storeResourceFile(String resourceName, String parentCategoryResourceId, byte[] value) {
		this.service.storeResourceFile(resourceName, parentCategoryResourceId, value);
	}
	
	public byte[] retrieveResourceFileById(String resourceId) {
		return service.retrieveResourceFileById(resourceId);
	}

	public byte[] retrieveResourceFileByName(String resourceName) {
		return service.retrieveResourceFileByName(resourceName);
	}

	public String getResourceCategoryId(String resourceCatagegoryName) {
		return service.getResourceCategoryId(resourceCatagegoryName);
	}
	
}
