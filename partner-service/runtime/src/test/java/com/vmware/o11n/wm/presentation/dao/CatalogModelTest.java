package com.vmware.o11n.wm.presentation.dao;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;
import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;

public class CatalogModelTest {
	private CatalogModel catalog;
	private CategoryModel testCategory;
	private CatalogPage page;

	@Before
	public void setUp() throws Exception {
		catalog = new CatalogModel();
		testCategory = new CategoryModel("someId", "Name TestCategory");
		page = new CatalogPage(testCategory);
		catalog.addPage(page);
	}

	@Test
	public void testAddCatalogPage() {
		WorkflowModel workflowItem = new WorkflowModel("workflowId", "WorkflowName");
		page.addCatalogItem(workflowItem);

		assertSame(page, catalog.getPage(testCategory));
		assertSame(page, catalog.getPage(testCategory.getId()));

		assertEquals(1, catalog.getCategories().size());
		assertEquals(testCategory, catalog.getCategories().iterator().next());

		assertEquals(1, catalog.getCatalogPages().size());
		assertSame(page, catalog.getCatalogPages().iterator().next());
	}

	@Test
	public void testAddWorkflowItem() {
		List<Attribute> attributes = new ArrayList<Attribute>();
		addAttribute("name", "Workflow Name", attributes);
		addAttribute("id", "wfId", attributes);
		addAttribute("categoryName", testCategory.getName(), attributes);
		addAttribute("categoryHref", "http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + testCategory.getId(),
				attributes);

		WorkflowModel workflowItem = new WorkflowModel(attributes);
		assertEquals(testCategory.getId(), workflowItem.getCategoryId());

		catalog.addItem(workflowItem);

		CatalogPage catalogPage = catalog.getPage(testCategory);
		assertSame(page, catalogPage);
		assertSame(page, catalog.getPage(testCategory.getId()));

		assertEquals(1, page.getCatalogItems().size());
		assertSame(workflowItem, page.getCatalogItems().iterator().next());

		assertEquals(1, catalog.getCategories().size());
		assertEquals(testCategory, catalog.getCategories().iterator().next());

		assertEquals(1, catalog.getCatalogPages().size());
		assertSame(page, catalog.getCatalogPages().iterator().next());
	}

	@Test
	public void testSearchCatalog() throws Exception {
		WorkflowModel catalogItem1 = new WorkflowModel("workflowId", "WorkflowName");
		page.addCatalogItem(catalogItem1);

		List<Attribute> attributes = new ArrayList<Attribute>();
		addAttribute("name", "Workflow TestName", attributes);
		addAttribute("id", "wfId", attributes);
		addAttribute("description", "Some testDescription", attributes);
		addAttribute("categoryName", testCategory.getName(), attributes);
		addAttribute("categoryHref", "http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + testCategory.getId(),
				attributes);
		WorkflowModel catalogItem2 = new WorkflowModel(attributes);
		catalog.addItem(catalogItem2);

		String categoryNameSearch = "TestCategory";
		CatalogPage searchResult = catalog.searchCatalog(categoryNameSearch);
		assertEquals(2, searchResult.getCatalogItems().size());
		assertTrue(searchResult.getCatalogItems().get(1).getCategoryName().contains(categoryNameSearch));

		String workflowNameSearch = "TestName";
		searchResult = catalog.searchCatalog(workflowNameSearch);
		assertEquals(1, searchResult.getCatalogItems().size());
		assertTrue(searchResult.getCatalogItems().get(0).getName().contains(workflowNameSearch));

		String descriptionSearch = "testDescription";
		searchResult = catalog.searchCatalog(descriptionSearch);
		assertEquals(1, searchResult.getCatalogItems().size());
		assertTrue(searchResult.getCatalogItems().get(0).getDescription().contains(descriptionSearch));
	}

	@Test
	public void testDeleteGivenCategories() {
		CategoryModel category1 = new CategoryModel("categoryId1", "CategoryName1");
		catalog.addPage(new CatalogPage(category1));

		CategoryModel category2 = new CategoryModel("categoryId2", "CategoryName2");
		catalog.addPage(new CatalogPage(category2));

		assertEquals(3, catalog.getCategories().size());
		assertEquals(3, catalog.getCatalogPages().size());

		List<String> categoryIdsToBeDeleted = Arrays.asList(category1.getId(), category2.getId());

		catalog.deleteCategories(categoryIdsToBeDeleted);

		assertEquals(1, catalog.getCategories().size());
		assertEquals(1, catalog.getCatalogPages().size());
		assertEquals(testCategory, catalog.getCategories().get(0));
	}

	@Test
	public void testSaveNewCategory() {
		try {
			catalog.addCategory(null);
			fail("should throw exception when category is null");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.addCategory(new CategoryModel(null, "name"));
			fail("should throw exception when id is null");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.addCategory(new CategoryModel("id", null));
			fail("should throw exception when name is null");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.addCategory(CategoryModel.create(testCategory.getName(), 0));
			fail("should throw exception when the new category name is not unique.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.addCategory(new CategoryModel(testCategory.getId(), "Some unique name"));
			fail("should throw exception when the category id already exists in the catalog.");
		} catch (IllegalArgumentException e) {
		}

		assertEquals(1, catalog.getCategories().size());
		String newCategoryName = "New Name";
		CategoryModel newCategory = catalog.addCategory(CategoryModel.create(newCategoryName, 0));

		assertNotNull(newCategory);
		assertEquals(2, catalog.getCategories().size());
		assertNotNull(catalog.getPage(newCategory));
		assertNotNull(catalog.getPage(newCategory.getId()));
	}

	@Test
	public void testUpdateCategory() {
		try {
			catalog.updateCategory(null);
			fail("should throw exception when argument null");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updateCategory(new CategoryModel(null, "New Name"));
			fail("should throw exception when the category id is null.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updateCategory(new CategoryModel("categoryid", null));
			fail("should throw exception when new category name is null.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updateCategory(new CategoryModel("non existent id", "New Name"));
			fail("should throw exception when the category id is not presented in the catalog.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updateCategory(testCategory);
			fail("should throw exception when the category name is not unique among the other categories.");
		} catch (IllegalArgumentException e) {
		}

		CategoryModel updatedCategory = new CategoryModel(testCategory.getId(), "New Name");

		assertEquals(1, catalog.getCategories().size());
		CategoryModel category = catalog.updateCategory(updatedCategory);
		assertEquals(1, catalog.getCategories().size());
		assertEquals(1, catalog.getCatalogPages().size());

		assertEquals(updatedCategory, category);
	}

	@Test
	public void testUpdateCatalogPage() {
		try {
			catalog.updatePage(null, Collections.<WorkflowModel> emptyList());
			fail("should throw exception when categoryId is null.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updatePage(testCategory.getId(), null);
			fail("should throw exception when catalog items collection is null.");
		} catch (IllegalArgumentException e) {
		}
		try {
			catalog.updatePage("categoryId", Collections.<WorkflowModel> emptyList());
			fail("should throw exception when page not presented in the catalog.");
		} catch (IllegalArgumentException e) {
		}

		WorkflowModel workflowItem1 = new WorkflowModel("workflowId1", "WorkflowName1");
		page.addCatalogItem(workflowItem1);
		WorkflowModel workflowItem2 = new WorkflowModel("workflowId2", "WorkflowName2");
		page.addCatalogItem(workflowItem2);
		WorkflowModel workflowItem3 = new WorkflowModel("workflowId3", "WorkflowName3");
		page.addCatalogItem(workflowItem3);

		WorkflowModel upagedWorkflowItem1 = new WorkflowModel(workflowItem1.getId(), null);
		WorkflowModel newWorkflowItem = new WorkflowModel("newWorkflowId", null);

		page = catalog.updatePage(testCategory.getId(), Arrays.asList(upagedWorkflowItem1, newWorkflowItem));

		assertEquals(2, page.getCatalogItems().size());
	}

	@Test
	public void testJsonSerialization() throws Exception {
		WorkflowModel catalogItem1 = new WorkflowModel("workflowId", "WorkflowName");
		page.addCatalogItem(catalogItem1);

		List<Attribute> attributes = new ArrayList<Attribute>();
		addAttribute("name", "Workflow TestName", attributes);
		addAttribute("id", "wfId", attributes);
		addAttribute("description", "Some testDescription", attributes);
		addAttribute("categoryName", testCategory.getName(), attributes);
		addAttribute("categoryHref", "http://10.23.45.67:8281/catalog/System/WorkflowCategory/" + testCategory.getId(),
				attributes);
		WorkflowModel catalogItem2 = new WorkflowModel(attributes);
		catalog.addItem(catalogItem2);

		catalog.setLastUpdatedTime();
		ObjectMapper jsonMapper = new ObjectMapper();
		jsonMapper.setSerializationInclusion(Inclusion.NON_EMPTY);
		String json = jsonMapper.writeValueAsString(new JsonCatalog(catalog));
		
		JsonCatalog model = jsonMapper.readValue(json.getBytes(), JsonCatalog.class);
		
		CatalogModel deserializedCatalog = model.mapToCatalog();
		
		assertNotNull(deserializedCatalog.getLastUpdatedTime());
		
		assertEquals(1, deserializedCatalog.getCategories().size());
		assertEquals(testCategory, deserializedCatalog.getCategories().get(0));
		
		assertEquals(1, deserializedCatalog.getCatalogPages().size());
		CatalogPage page = deserializedCatalog.getCatalogPages().get(0);
		assertEquals(testCategory, page.getCategory());
		assertEquals(2, page.getCatalogItems().size());
		
		WorkflowModel workflowModel = page.getCatalogItems().get(1);
		assertEquals(catalogItem2.getId(), workflowModel.getId());
		assertEquals(catalogItem2.getName(), workflowModel.getName());
		assertEquals(catalogItem2.getDescription(), workflowModel.getDescription());
		assertEquals(catalogItem2.getCategoryName(), workflowModel.getCategoryName());
		assertEquals(catalogItem2.getCategoryId(), workflowModel.getCategoryId());
	}

	private void addAttribute(String name, String value, List<Attribute> attributes) {
		Attribute attr = new Attribute();
		attr.setName(name);
		attr.setValue(value);
		attributes.add(attr);
	}
}
