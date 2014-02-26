package com.vmware.o11n.wm.services;

/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.util.Assert;

import com.vmware.o11n.sdk.rest.client.services.CatalogService;
import com.vmware.o11n.sdk.rest.client.services.Condition;
import com.vmware.o11n.sdk.rest.client.services.InventoryItemQuerySpec;
import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.wm.common.CatalogItem;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.presentation.dao.CatalogModel;
import com.vmware.o11n.wm.presentation.dao.CatalogPage;
import com.vmware.o11n.wm.presentation.dao.CategoryModel;
import com.vmware.o11n.wm.presentation.dao.InventoryObjectModel;
import com.vmware.o11n.wm.presentation.dao.JsonCatalog;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;

public class VcoCatalogService extends VcoBaseService {
	public final static String SYSTEM_CATALOG_MODEL_CATEGORY_NAME = "workflow-catalog-system";
	public final static String SYSTEM_CATALOG_MODEL_RESOURCE_NAME = "waveoperator-catalog-model-resource.json";
	private final VcoWorkflowService vcoWorkflowService;
	private final VcoResourceService resourceService;

	public VcoCatalogService(VcoConnectionService connectionService, VcoWorkflowService vcoWorkflowService,
			VcoCacheManager cacheManager, VcoResourceService resourceService) {
		super(connectionService, cacheManager);
		this.vcoWorkflowService = vcoWorkflowService;
		this.resourceService = resourceService;
	}

	public String getPluginRoot(String plugin) throws JSONException {
		InventoryItem item = getCatalogService().findRootPluginObject(plugin, null);
		Relations relations = item.getRelations();
		if (relations == null) {
			throw new RuntimeException("No relations found. Check configuration for plug-in " + plugin);
		}
        JSONArray jsonArray = parseLinksToJson(relations.getLink());
        JSONObject obj = new JSONObject();
        obj.put("server", getConnectionService().getServer());
        obj.put("inventory", jsonArray);
		String jsonString = obj.toString();
		return jsonString;
	}

    public List<InventoryObjectModel> getItemsBySearchString(String type, String searchString) {
        if (searchString.isEmpty()) {
            return new ArrayList<InventoryObjectModel>();
        }
        InventoryItemQuerySpec spec = new InventoryItemQuerySpec();
        spec.addCondition(Condition.contain("name", searchString));
        InventoryItemsList items = getCatalogService().findPluginObjects("System", type, spec);
        List<InventoryObjectModel> result = parseLinksToModel(items.getLink());
        return result;
    }

	public String getChildrenByHref(String href) throws JSONException {
		InventoryItemsList children = getCatalogService().getObject(href + "CHILDREN/", InventoryItemsList.class);
		String jsonString = parseLinksToJson(children.getLink()).toString();
		return jsonString;
	}

	private JSONArray parseLinksToJson(List<Link> links) throws JSONException {
		JSONArray result = new JSONArray();
		for (Link link : links) {
			if (link != null && link.getAttributes() != null && "down".equals(link.getRel())) {
				JSONObject obj = new JSONObject();
				// parse attributes
				Map<String, String> attrMap = new HashMap<String, String>();
				List<Attribute> attrs = link.getAttributes().getAttribute();
				for (Attribute attr : attrs) {
					attrMap.put(attr.getName(), attr.getValue());
				}
				// populate JSON object
				obj.accumulate("href", link.getHref());
                if (attrMap.containsKey("display name")) {
    				obj.accumulate("name", attrMap.get("display name"));
                } else {
                    obj.accumulate("name", attrMap.get("name"));
                }
				obj.accumulate("data", attrMap.get("dunesId"));
				obj.accumulate("type", attrMap.get("type"));
				result.put(obj);
			}
		}

		return result;
	}

    private List<InventoryObjectModel> parseLinksToModel(List<Link> links) {
        List<InventoryObjectModel> result = new ArrayList<InventoryObjectModel>();
        for (Link link : links) {
            if (link != null && link.getAttributes() != null && "down".equals(link.getRel())) {
                InventoryObjectModel obj = new InventoryObjectModel();
                // parse attributes
                Map<String, String> attrMap = new HashMap<String, String>();
                List<Attribute> attrs = link.getAttributes().getAttribute();
                for (Attribute attr : attrs) {
                    attrMap.put(attr.getName(), attr.getValue());
                }
                // populate JSON object
                obj.setHref(link.getHref());
                obj.setName(attrMap.get("name"));
                obj.setData(attrMap.get("id"));
                obj.setType(attrMap.get("type"));
                result.add(obj);
            }
        }

        return result;
    }

    public CatalogModel getWorkflowCatalog() {
		CatalogModel systemCatalog = getCacheManager().getSystemCatalogModel();
		if (systemCatalog == null) {
			systemCatalog = retrieveSystemCatalog();
			if (systemCatalog != null) {
				getCacheManager().putSystemCatalogModel(systemCatalog);
			}
		}

		if (systemCatalog == null) {
			systemCatalog = new CatalogModel();
			PaginatedWorkflows workflows = vcoWorkflowService.getWorkflows(null);
			for (WorkflowModel workflowModel : workflows.getList()) {
				systemCatalog.addItem(workflowModel);
			}
		}

		if (isCurrentUserAdmin()) {
			return systemCatalog;
		}

		CatalogModel userCatalog = getCacheManager().getUserCatalogModel();
		if (userCatalog != null && systemCatalog.isLastUpdatedAfter(userCatalog.getLastUpdatedTime())) {
			userCatalog = null;
		}

		if (userCatalog == null) {
			userCatalog = new CatalogModel();
			PaginatedWorkflows userWorkflows = vcoWorkflowService.getWorkflows(null);
			for (CatalogPage systemPage : systemCatalog.getCatalogPages()) {
				CategoryModel category = userCatalog.addCategory(systemPage.getCategory());
				CatalogPage userPage = userCatalog.getPage(category);
				for (CatalogItem catalogItem : systemPage.getCatalogItems()) {
					WorkflowModel userWorkflowModel = userWorkflows.getWorkflow(catalogItem.getId());
					if (userWorkflowModel != null) {
						userPage.addCatalogItem(userWorkflowModel);
					}
				}
			}

			getCacheManager().putUserCatalogModel(userCatalog);
		}

		return userCatalog;
	}

	public List<CategoryModel> getAllCatageories() {
		CatalogModel catalog = getWorkflowCatalog();

		return catalog.getCategories();
	}

	public CatalogPage getCatalogPage(String categoryId) {
		CatalogModel catalog = getWorkflowCatalog();
		CatalogPage page = catalog.getPage(categoryId);

		return page;
	}

	public CatalogPage searchCatalog(String searchTerm) {
		CatalogModel catalog = getWorkflowCatalog();
		CatalogPage page = catalog.searchCatalog(searchTerm);

		return page;
	}

	public CatalogModel deleteCategories(List<String> categoryIds) {
		verifyUserIsAdmin();
		CatalogModel catalog = getWorkflowCatalog();
		catalog.deleteCategories(categoryIds);
		saveCatalog(catalog);

		return catalog;
	}

	public CatalogModel addCategory(String categoryName, int order) {
		verifyUserIsAdmin();
		CatalogModel catalog = getWorkflowCatalog();
		catalog.addCategory(CategoryModel.create(categoryName, order));
		saveCatalog(catalog);

		return catalog;
	}

	public CatalogModel updateCategory(CategoryModel categoryToBeUpdated) {
		verifyUserIsAdmin();
		CatalogModel catalog = getWorkflowCatalog();
		catalog.updateCategory(categoryToBeUpdated);
		saveCatalog(catalog);

		return catalog;
	}

	public CatalogModel updatePage(String categoryId, List<String> catalogItemIds) {
		verifyUserIsAdmin();
		Assert.hasText(categoryId);
		Assert.notNull(catalogItemIds);

		PaginatedWorkflows workflows = vcoWorkflowService.getWorkflows(null);
		List<WorkflowModel> workflowItems = new ArrayList<WorkflowModel>(catalogItemIds.size());
		for (String workflowId : catalogItemIds) {
			WorkflowModel workflowItem = workflows.getWorkflow(workflowId);
			if (workflowItem == null) {
				workflowItem = vcoWorkflowService.getWorkflow(workflowId);
			}
			if (workflowItem != null) {
				workflowItems.add(workflowItem);
			}
		}

		CatalogModel catalog = getWorkflowCatalog();
		catalog.updatePage(categoryId, workflowItems);

		saveCatalog(catalog);

		return catalog;
	}

	public CatalogModel refreshCatalog() {
		CatalogModel catalog = getWorkflowCatalog();
		if (isCurrentUserAdmin()) {
			getCacheManager().clearLongLivedCache();
			getCacheManager().clearAllIcons();
			PaginatedWorkflows workflows = vcoWorkflowService.getWorkflows(null);
			CatalogModel updatedCatalog = new CatalogModel();
			for (CatalogPage page : catalog.getCatalogPages()) {
				updatedCatalog.addCategory(page.getCategory());
				CatalogPage updatedPage = updatedCatalog.getPage(page.getCategory());
				for (CatalogItem catalogItem : page.getCatalogItems()) {
					WorkflowModel workflowItem = workflows.getWorkflow(catalogItem.getId());
					updatedPage.addCatalogItem(workflowItem);
				}
			}
			saveCatalog(updatedCatalog);
		} else {
			getCacheManager().clearUserCatalogModel();
			getCacheManager().clearAllWorkflows();
			for (CatalogPage page : catalog.getCatalogPages()) {
				for (CatalogItem catalogItem : page.getCatalogItems()) {
					getCacheManager().clearWorkflow(catalogItem.getId());
					getCacheManager().clearIcon(catalogItem.getId());
				}
			}
		}

		catalog = getWorkflowCatalog();
		return catalog;
	}

	private void saveCatalog(CatalogModel catalog) {
		getCacheManager().putSystemCatalogModel(catalog);
		storeCatalog(catalog);
	}

	public void storeCatalog(CatalogModel catalog) {
		JsonCatalog jsonCatalog = new JsonCatalog(catalog);
		logger.info(jsonCatalog);
		resourceService.store(SYSTEM_CATALOG_MODEL_RESOURCE_NAME, SYSTEM_CATALOG_MODEL_CATEGORY_NAME, jsonCatalog);
	}

	public CatalogModel retrieveSystemCatalog() {
		JsonCatalog jsonCatalog = resourceService.retriveResourceValue(SYSTEM_CATALOG_MODEL_RESOURCE_NAME,
				JsonCatalog.class);
		if (jsonCatalog == null) {
			return null;
		}
		CatalogModel catalog = jsonCatalog.mapToCatalog();
		return catalog;
	}

	private CatalogService getCatalogService() {
		return new CatalogService(getSession());
	}

}
