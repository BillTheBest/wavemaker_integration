package com.vmware.o11n.wm.services;

/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************
 */

import com.vmware.o11n.sdk.rest.client.stubs.AboutInfo;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.User;

public class VcoGeneralService extends VcoBaseService {
	private static final String TASK_COUNTER = "catalog/System/Task?maxResult=0";
	private static final String WORKFLOW_EXECUTION_COUNTER = "catalog/System/WorkflowExecution?conditions=state=running&maxResult=0";
	private static final String USER_INTERACTION_COUNTER = "catalog/System/UserInteraction?maxResult=0";
	private final static String SYSTEM_CONFIGURATION_CATEGORY = "workflow-catalog-system";// "system-configuration";
	private final static String SYSTEM_CONFIGURATION_RESOURCE = "system-configuration-resource";

	private VcoResourceService resourceService;
	private AboutInfo cachedAboutInfo;

	public VcoGeneralService(VcoConnectionService connectionService, VcoCacheManager cacheManager,
			VcoResourceService resourceService) {
		super(connectionService, cacheManager);
		this.resourceService = resourceService;
	}

	public User getCurrentUser() {
		return getRestObjectAppendingToRoot("users", User.class);
	}

	public boolean isCurrentUserInAdminRole() {
		return isCurrentUserAdmin();
	}

	public AboutInfo getAboutInfo() {
		if (cachedAboutInfo == null) {
			cachedAboutInfo = getRestObjectAppendingToRoot("about", AboutInfo.class);
			setConnectionInfo(cachedAboutInfo);
		}
		return cachedAboutInfo;
	}

	public synchronized void storeConnConfigJson(String connConfig) {
        // Disabling, for the following situation:
        // You change server IP (from possibly invalid IP), then the verification
        // goes against the old IP, or connection fails, if it is invalid.
//		verifyUserIsAdmin();
		getConnectionService().storeConnectionConfigFromJson(connConfig);
		if (cachedAboutInfo != null) {
			setConnectionInfo(cachedAboutInfo);
		}
	}

	public String getConnConfigJson() {
		return getConnectionService().getJsonConnectionConfig();
	}

	public void storeAppConfig(Object config) {
		storeJsonValue(SYSTEM_CONFIGURATION_RESOURCE, config);
	}

	public String loadAppConfig() {
		String json = loadJsonValue(SYSTEM_CONFIGURATION_RESOURCE);
		return json;
	}

	public void storeJsonValue(String key, Object value) {
		verifyUserIsAdmin();
		key += ".json";
		getCacheManager().putEternalObject(key, value);
		resourceService.store(key, SYSTEM_CONFIGURATION_CATEGORY, value);
	}

	public byte[] retrieveResourceFileById(String resourceId) {
		return resourceService.retrieveResourceFileById(resourceId);
	}

	public byte[] retrieveResourceFileByName(String resourceName) {
		return resourceService.retrieveResourceFileByName(resourceName);
	}

	public String getResourceCategoryId(String resourceCatagegoryName) {
		return resourceService.getResourceCategoryId(resourceCatagegoryName);
	}

	public void storeResourceFile(String vcoResourceName, String parentCategoryResourceId, byte[] value) {
		resourceService.storeResourceFile(vcoResourceName, parentCategoryResourceId, value);
	}

	public String loadJsonValue(String key) {
		key += ".json";
		Object value = getCacheManager().getEternalObject(key, Object.class);
		if (value == null) {
			value = resourceService.retriveResourceValue(key, Object.class);
			if (value == null) {
				return null;
			}
			getCacheManager().putEternalObject(key, value);
		}

		return value.toString();
	}

	public long getTotalScheduledTasks() {
		return getCounter(TASK_COUNTER);
	}

	public long getTotalRunningWorkflows() {
		return getCounter(WORKFLOW_EXECUTION_COUNTER);
	}

	public long getTotalUserInteractions() {
		return getCounter(USER_INTERACTION_COUNTER);
	}

	private long getCounter(String path) {
		InventoryItemsList result = getRestObjectAppendingToRoot(path, InventoryItemsList.class);
		if (result != null)
			return result.getTotal();
		return 0;
	}

	private void setConnectionInfo(AboutInfo aboutInfo) {
		String serverUri = getConnectionService().getSession().appendToRoot("").toString().replaceFirst("/api/", "/");
		aboutInfo.setApiVersion(serverUri);
	}

}
