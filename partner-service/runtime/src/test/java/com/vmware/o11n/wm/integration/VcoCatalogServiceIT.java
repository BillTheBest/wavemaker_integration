package com.vmware.o11n.wm.integration;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.wm.presentation.dao.CatalogModel;
import com.vmware.o11n.wm.presentation.dao.CatalogPage;
import com.vmware.o11n.wm.presentation.dao.CategoryModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;
import com.vmware.o11n.wm.services.VcoCacheManager;
import com.vmware.o11n.wm.services.VcoCatalogService;
import com.vmware.o11n.wm.services.VcoResourceService;

public class VcoCatalogServiceIT extends BaseTestIntegration {

	@Autowired
	private VcoCatalogService vcoCatalogService;

	@Autowired
	private VcoCacheManager vcoCacheManager;
	
	@Autowired
	private VcoResourceService vcoResourceService;

	@Test
	public void shouldBuildDefaultCatalogWhenNoneSpecified() {
		CatalogModel catalog = vcoCatalogService.getWorkflowCatalog();

		assertNotNull(catalog);
		assertTrue(catalog.getCategories().size() > 0);
		assertTrue(catalog.getCatalogPages().size() > 0);
	}

	@Test
	public void shouldSearchCatalog() {
		String searchTerm = "simple";
		CatalogPage catalogPage = vcoCatalogService.searchCatalog(searchTerm);

		assertNotNull(catalogPage);
		assertTrue(catalogPage.getCatalogItems().size() > 0);
	}

	@Test
	public void shouldRetrieveOnlySinglePage() {
		CatalogModel catalog = vcoCatalogService.getWorkflowCatalog();
		CategoryModel waveCategory = null;
		for (CategoryModel category : catalog.getCategories()) {
			if (category.getName().toLowerCase().contains("wave")) {
				waveCategory = category;
			}
		}

		CatalogPage page = catalog.getPage(waveCategory);
		assertNotNull(page);
		assertTrue(page.getCatalogItems().size() > 0);
	}

	@Test
	public void shouldStoreCatalogInJsonResourceFileAndRetriveItBackToCatalogModel() throws Exception {
		try {
			CatalogModel catalog = createTestCatalog();
			vcoCatalogService.storeCatalog(catalog);

			CatalogModel retrievedCatalog = vcoCatalogService.retrieveSystemCatalog();

			assertNotNull(retrievedCatalog);
			assertNotNull(retrievedCatalog.getLastUpdatedTime());
			assertEquals(retrievedCatalog.getLastUpdatedTime(), catalog.getLastUpdatedTime());

			assertEquals(2, retrievedCatalog.getCategories().size());
			assertEquals(catalog.getCategories().get(0), retrievedCatalog.getCategories().get(0));
			assertEquals(catalog.getCategories().get(1), retrievedCatalog.getCategories().get(1));

			assertEquals(2, retrievedCatalog.getCatalogPages().size());

			CatalogPage page = catalog.getCatalogPages().get(1);
			CatalogPage retrievePage = retrievedCatalog.getCatalogPages().get(1);
			assertEquals(page.getCategory(), retrievePage.getCategory());
			assertEquals(2, retrievePage.getCatalogItems().size());

			WorkflowModel retrivedWorkflowModel = retrievePage.getCatalogItems().get(1);
			WorkflowModel workflowModel = page.getCatalogItems().get(1);
			assertEquals(workflowModel.getId(), retrivedWorkflowModel.getId());
			assertEquals(workflowModel.getName(), retrivedWorkflowModel.getName());
			assertEquals(workflowModel.getDescription(), retrivedWorkflowModel.getDescription());
			assertEquals(workflowModel.getCategoryName(), retrivedWorkflowModel.getCategoryName());
			assertEquals(workflowModel.getCategoryId(), retrivedWorkflowModel.getCategoryId());

			assertEquals(2, retrievedCatalog.getCatalogPages().get(1).getCatalogItems().size());

			CatalogModel systemCatalog = vcoCatalogService.getWorkflowCatalog();
			assertNotNull(systemCatalog);

			assertEquals(2, systemCatalog.getCategories().size());
			assertEquals(retrievedCatalog.getCategories().get(0), systemCatalog.getCategories().get(0));
			assertEquals(retrievedCatalog.getCategories().get(1), systemCatalog.getCategories().get(1));

			assertEquals(2, systemCatalog.getCatalogPages().size());
		} finally {
			vcoResourceService.deleteStoredResource(VcoCatalogService.SYSTEM_CATALOG_MODEL_RESOURCE_NAME);
			vcoCacheManager.clearSystemCatalogModel();
			vcoCacheManager.clearUserCatalogModel();
		}
	}

	private CatalogModel createTestCatalog() {
		CatalogModel catalog = new CatalogModel();
		CategoryModel category1 = new CategoryModel("categoryId1", "Category Name1");
		catalog.addCategory(category1);
		CategoryModel category2 = new CategoryModel("categoryId2", "Category Name2");
		catalog.addCategory(category2);

		WorkflowModel catalogItem1 = createWorkflowModel("name", "Workflow TestName1", "id", "wfId1", "description",
				"TestDescription1", "categoryName", category1.getName(), "categoryHref",
				"http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + category1.getId());
		catalog.addItem(catalogItem1);

		WorkflowModel catalogItem2 = createWorkflowModel("name", "Workflow TestName2", "id", "wfId2", "description",
				"TestDescription2", "categoryName", category1.getName(), "categoryHref",
				"http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + category1.getId());
		catalog.addItem(catalogItem2);

		WorkflowModel catalogItem3 = createWorkflowModel("name", "Workflow TestName3", "id", "wfId3", "description",
				"TestDescription3", "categoryName", category2.getName(), "categoryHref",
				"http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + category2.getId());
		catalog.addItem(catalogItem3);
		catalog.setLastUpdatedTime();

		return catalog;
	}

	private WorkflowModel createWorkflowModel(String... args) {
		List<Attribute> attributes = new ArrayList<Attribute>();
		for (int i = 0; i < args.length; i++) {
			String name = args[i];
			String value = args[++i];
			Attribute attr = new Attribute();
			attr.setName(name);
			attr.setValue(value);
			attributes.add(attr);
		}

		WorkflowModel workflowModel = new WorkflowModel(attributes);
		return workflowModel;
	}
}
