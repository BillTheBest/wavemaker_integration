package com.vmware.o11n.wm.presentation.dao;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.Assert;

public class CatalogModel implements Serializable {
	private static final long serialVersionUID = -736004974334647109L;
	private List<CategoryModel> categories;
	private List<CatalogPage> catalogPages;
	private Map<CategoryModel, CatalogPage> catalog = new HashMap<CategoryModel, CatalogPage>();
	private Map<String, CategoryModel> categoriesById = new HashMap<String, CategoryModel>();
	private Map<String, CategoryModel> categoriesByName = new HashMap<String, CategoryModel>();
	private Date lastUpdated;
	
	public CatalogPage searchCatalog(String searchTerm) {
		if (searchTerm == null) {
			return null;
		}

		searchTerm = searchTerm.toLowerCase();
		CatalogPage resultPage = new CatalogPage(CategoryModel.SEARCH_CATEGORY);
		for (CatalogPage page : catalog.values()) {
			if (page.getCategory() != null && page.getCategory().getName() != null
					&& page.getCategory().getName().toLowerCase().contains(searchTerm)) {
				resultPage.addCatalogItems(page.getCatalogItems());
			} else {
				for (WorkflowModel item : page.getCatalogItems()) {
					if (item.getName() != null && item.getName().toLowerCase().contains(searchTerm)) {
						resultPage.addCatalogItem(item);
					} else if (item.getDescription() != null
							&& item.getDescription().toLowerCase().contains(searchTerm)) {
						resultPage.addCatalogItem(item);
					}
				}
			}
		}

		return resultPage;
	}

	public List<CategoryModel> getCategories() {
		if (categories == null) {
			categories = new ArrayList<CategoryModel>(catalog.keySet());
			Collections.sort(categories);
		}

		return categories;
	}

	public List<CatalogPage> getCatalogPages() {
		if (catalogPages == null) {
			catalogPages = new ArrayList<CatalogPage>(catalog.values());
		}

		return catalogPages;
	}

	public void addPage(CatalogPage page) {
		if (page == null) {
			return;
		}
		registerCategory(page.getCategory());
		catalog.put(page.getCategory(), page);
		resetCatalogQueries();
	}

	public CatalogPage updatePage(String categoryId, List<WorkflowModel> workflowItems) {
		Assert.hasText(categoryId);
		Assert.notNull(workflowItems);
		
		CategoryModel category = categoriesById.get(categoryId);
		if(category == null) {
			throw new IllegalArgumentException("There is no assoicated Category for the given categoryId.");
		}
		CatalogPage originalPage = catalog.get(category);
		if(originalPage == null) {
			throw new IllegalArgumentException("The page to be updated is not presented in the catalog.");
		}
		
		originalPage.clearCatalogItems();
		originalPage.addCatalogItems(workflowItems);
		return originalPage;
	}

	public void addItem(WorkflowModel workflowModel) {
		String categoryId = workflowModel.getCategoryId();
		CategoryModel category = categoriesById.get(categoryId);
		if (category == null) {
			category = categoriesByName.get(workflowModel.getCategoryName());
			if (category == null) {
				category = new CategoryModel(categoryId, workflowModel.getCategoryName());
				registerCategory(category);
			}
		}

		CatalogPage page = catalog.get(category);
		if (page == null) {
			page = new CatalogPage(category);
			catalog.put(category, page);
		}
		page.addCatalogItem(workflowModel);
	}

	public CatalogPage getPage(CategoryModel category) {
		if (category == null) {
			return null;
		}

		return catalog.get(category);
	}

	public CatalogPage getPage(String categoryId) {
		if (categoryId == null) {
			return null;
		}
		CategoryModel category = categoriesById.get(categoryId);

		return getPage(category);
	}

	public void deleteCategories(List<String> categoryIds) {
		if (categoryIds == null) {
			return;
		}

		for (String categoryId : categoryIds) {
			CategoryModel category = categoriesById.remove(categoryId);
			if(category != null) {
				catalog.remove(category);
				categoriesByName.remove(category.getName());
			}
		}

		resetCatalogQueries();
	}

	public CategoryModel addCategory(CategoryModel category) {
		if (category == null || category.getName() == null || category.getId() == null) {
			throw new IllegalArgumentException("The category or some of the category properties is null.");
		}

		if (categoriesByName.containsKey(category.getName())) {
			throw new IllegalArgumentException("The new name should be unique among all categories in the catalog.");
		}
		
		if(categoriesById.containsKey(category.getId())) {
			throw new IllegalArgumentException("The category with id: " + category.getId() + " already exists in this catalog."); 
		}
		
		addPage(new CatalogPage(category));
		
		return category;
	}

	public CategoryModel updateCategory(CategoryModel updatedCategory) {
		if (updatedCategory == null || updatedCategory.getName() == null || updatedCategory.getId() == null) {
			throw new IllegalArgumentException("The category, category.name or category.id should not be null.");
		}

		if (categoriesByName.get(updatedCategory.getName()) != null) {
			throw new IllegalArgumentException("The new name should be unique among all categories in the catalog.");
		}

		CategoryModel originalCategory = categoriesById.remove(updatedCategory.getId());
		if (originalCategory == null) {
			throw new IllegalArgumentException("The category id is not presented in the catalog.");
		}

		categoriesByName.remove(originalCategory.getName());
		CatalogPage page = catalog.remove(originalCategory);

		CatalogPage newPage = new CatalogPage(updatedCategory);
		newPage.addCatalogItems(page.getCatalogItems());
		addPage(newPage);

		return updatedCategory;
	}
	
	public void setLastUpdatedTime() {
		this.lastUpdated = new Date();
	}
	
	public boolean isLastUpdatedAfter(Date date) {
		if(date == null) {
			return true;
		}
		
		if(this.lastUpdated == null) {
			return false;
		}
			
		return this.lastUpdated.after(date);
	}
	
	public Date getLastUpdatedTime() {
		return lastUpdated;
	}

	private void resetCatalogQueries() {
		this.catalogPages = null;
		this.categories = null;
	}

	private void registerCategory(CategoryModel category) {
		categoriesById.put(category.getId(), category);
		categoriesByName.put(category.getName(), category);
	}
	
	protected void setLastUpdated(Date lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
	
	
}
