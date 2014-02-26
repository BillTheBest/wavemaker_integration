package com.vmware.o11n.wm.services;

import java.io.IOException;
import java.io.InputStream;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.springframework.core.io.Resource;
import org.springframework.util.Assert;

import com.vmware.o11n.wm.common.ItemIcon;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.presentation.dao.CatalogModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;

public class VcoCacheManager {
	private static final String SYSTEM_CATALOG_CACHE_NAME = "systemCatalogCache";
	private static final String LONG_LIVED_CACHE_NAME = "longLivedCache";
	private static final String ETERNAL_CACHE_NAME = "eternalCache";
	private static final String ICONS_CACHE_NAME = "iconsCache";
	private static final String ALL_WORKFLOWS_KEY = "all-workflows";
	private final CacheManager cacheManager;
	private final VcoConnectionService connectionService;

	public VcoCacheManager(Resource configLocation, VcoConnectionService connectionService) throws IOException {
		Assert.notNull(configLocation);
		this.connectionService = connectionService;
		InputStream is = configLocation.getInputStream();
		try {
			this.cacheManager = new CacheManager(is);
		} finally {
			is.close();
		}
	}

	public Cache getCache(String cacheName) {
		return cacheManager.getCache(cacheName);
	}

	public CatalogModel getSystemCatalogModel() {
		return getValue(getSystemCatalogCache().get(SYSTEM_CATALOG_CACHE_NAME));
	}

	public void putSystemCatalogModel(CatalogModel catalogModel) {
		if (catalogModel == null) {
			return;
		}
		catalogModel.setLastUpdatedTime();
		getSystemCatalogCache().put(new Element(SYSTEM_CATALOG_CACHE_NAME, catalogModel));
		getSystemCatalogCache().flush();
	}
	
	public void clearSystemCatalogModel() {
		getSystemCatalogCache().remove(SYSTEM_CATALOG_CACHE_NAME);
	}

	public CatalogModel getUserCatalogModel() {
		return getValue(getLongLivedCache().get(connectionService.getVcoUsername()));
	}

	public void putUserCatalogModel(CatalogModel catalogModel) {
		if (catalogModel == null) {
			return;
		}
		catalogModel.setLastUpdatedTime();
		getLongLivedCache().put(new Element(connectionService.getVcoUsername(), catalogModel));
	}

	public boolean clearUserCatalogModel() {
		return getLongLivedCache().remove(connectionService.getVcoUsername());
	}

	public WorkflowModel getWorkflow(String workflowId) {
		return getValue(getLongLivedCache().get(buildSessionKey(workflowId)));
	}

	public void putWorkflow(WorkflowModel workflow) {
		if (workflow != null && workflow.getId() != null) {
			getLongLivedCache().put(new Element(buildSessionKey(workflow.getId()), workflow));
		}
	}

	public boolean clearWorkflow(String workflowId) {
		return getLongLivedCache().remove(buildSessionKey(workflowId));
	}
	
	public <T> T getLongLivedObject(String id, Class<T> type) {
		return getValue(getLongLivedCache().get(buildSessionKey(id)));
	}

	public <T> void putLongLivedObject(String id, T obj) {
		if (id != null && obj != null) {
			getLongLivedCache().put(new Element(buildSessionKey(id), obj));
		}
	}

	public boolean clearLongLivedObject(String id) {
		return getLongLivedCache().remove(buildSessionKey(id));
	}

	public PaginatedWorkflows getAllWorkflows() {
		return getValue(getLongLivedCache().get(buildSessionKey(ALL_WORKFLOWS_KEY)));
	}

	public void putAllWorkflow(PaginatedWorkflows paginatedWorkflows) {
		getLongLivedCache().put(new Element(buildSessionKey(ALL_WORKFLOWS_KEY), paginatedWorkflows));
	}

	public boolean clearAllWorkflows() {
		return getLongLivedCache().remove(buildSessionKey(ALL_WORKFLOWS_KEY));
	}

	public void clearLongLivedCache() {
		getLongLivedCache().removeAll();
	}

	public ItemIcon getIcon(String workflowId) {
		return getValue(getIconsCache().get(workflowId));
	}

	public void putIcon(String workflowId, ItemIcon icon) {
		if (workflowId != null && icon != null) {
			getIconsCache().put(new Element(workflowId, icon));
			getIconsCache().flush();
		}
	}

	public boolean clearIcon(String workflowId) {
		return getIconsCache().remove(workflowId);
	}

	public void clearAllIcons() {
		getIconsCache().removeAll();
	}
	
	
	public <T> T getEternalObject(String id, Class<T> type) {
		return getValue(getEternalCache().get(id));
	}

	public <T> void putEternalObject(String id, T obj) {
		if (id != null && obj != null) {
			getEternalCache().put(new Element(id, obj));
		}
	}

	private Cache getSystemCatalogCache() {
		return getCache(SYSTEM_CATALOG_CACHE_NAME);
	}

	private Cache getLongLivedCache() {
		return getCache(LONG_LIVED_CACHE_NAME);
	}

	private Cache getIconsCache() {
		return getCache(ICONS_CACHE_NAME);
	}
	
	private Cache getEternalCache() {
		return getCache(ETERNAL_CACHE_NAME);
	}

	@SuppressWarnings("unchecked")
	private <T> T getValue(Element element) {
		if (element == null)
			return null;
		return (T) element.getObjectValue();
	}

	private String buildSessionKey(String key) {
		if (connectionService.isCurrentUserAdmin()) {
			return key;
		}
		return connectionService.getVcoUsername() + ":" + key;
	}
}
