package com.vmware.o11n.wm;

import java.lang.String;
import java.util.List;

import com.vmware.o11n.wm.presentation.dao.InventoryObjectModel;
import org.json.JSONException;

import com.vmware.o11n.wm.presentation.dao.CatalogModel;
import com.vmware.o11n.wm.presentation.dao.CatalogPage;
import com.vmware.o11n.wm.presentation.dao.CategoryModel;
import com.vmware.o11n.wm.services.VcoCatalogService;

/**
 * This is a client-facing service class. All public methods will be exposed to
 * the client. Their return values and parameters will be passed to the client
 * or taken from the client, respectively. This will be a singleton instance,
 * shared between all requests.
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL,
 * String, Exception). LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to
 * modify your log level. For info on these levels, look for tomcat/log4j
 * documentation
 */
public class WmCatalogService extends
		com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
	private VcoCatalogService service;

	/*
	 * Pass in one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log
	 * level; recommend changing this to FATAL or ERROR before deploying. For
	 * info on these levels, look for tomcat/log4j documentation
	 */
	public WmCatalogService(VcoCatalogService service) {
		super(INFO);
		this.service = service;
	}

	public String getPluginRoot(String plugin) throws JSONException {
		return service.getPluginRoot(plugin);
	}

	public String getChildrenByHref(String href) throws JSONException {
		return service.getChildrenByHref(href);
	}

    public List<InventoryObjectModel> getItemsBySearchString(String type, String searchString) throws JSONException {
        return service.getItemsBySearchString(type, searchString);
    }

	public CatalogModel getWorkflowCatalog() {
		return service.getWorkflowCatalog();
	}

	public CatalogPage getCatalogPage(String categoryId) {
		return service.getCatalogPage(categoryId);
	}

	public List<CategoryModel> getAllCatageories() {
		return service.getAllCatageories();
	}

	public CatalogPage searchCatalog(String searchTerm) {
		return service.searchCatalog(searchTerm);
	}

	public CatalogModel deleteCategories(List<String> categoryIds) {
		return service.deleteCategories(categoryIds);
	}

	public CatalogModel addCategory(String categoryName, int order) {
		return service.addCategory(categoryName, order);
	}

	public CatalogModel updateCategory(String categoryId, String categoryName, int order) {
		CategoryModel categoryToBeUpdated = new CategoryModel(categoryId, categoryName, order);
		return service.updateCategory(categoryToBeUpdated);
	}

	public CatalogModel updatePage(String categoryId, List<String> catalogItemIds) {
		return service.updatePage(categoryId, catalogItemIds);
	}
	
	public CatalogModel refreshCatalog() {
		return service.refreshCatalog();
	}

	/*
	 * Dummy getter, needed by the Service Variable to generate the stubs in
	 * types.js.
	 */
	public CategoryModel _CategoryModelStub() {
		throw new RuntimeException("Dummy method. Not to be called directly.");
	}
    public InventoryObjectModel _InventoryObjectModelStub() {
        throw new RuntimeException("Dummy method. Not to be called directly.");
    }
}
