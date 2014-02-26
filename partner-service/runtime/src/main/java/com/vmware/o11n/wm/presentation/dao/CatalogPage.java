package com.vmware.o11n.wm.presentation.dao;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class CatalogPage implements Serializable {
	private static final long serialVersionUID = 2993237844799742278L;
	private final CategoryModel category;
	private final List<WorkflowModel> catalogItems;
	
	// Don't use. needed by the Jackson
	protected CatalogPage() {
		category = null;
		catalogItems = null;
	}
	
	public CatalogPage(CategoryModel category) {
		if(category == null) {
			throw new IllegalArgumentException("category should not be null!");
		}
		this.category = category;
		this.catalogItems = new ArrayList<WorkflowModel>();
	}
	
	public void addCatalogItem(WorkflowModel catalogItem) {
		catalogItems.add(catalogItem);
	}
	
	public void addCatalogItems(List<WorkflowModel> catalogItems) {
		this.catalogItems.addAll(catalogItems);
	}
	
	public void clearCatalogItems() {
		this.catalogItems.clear();
	}

	public CategoryModel getCategory() {
		return category;
	}

	public List<WorkflowModel> getCatalogItems() {
		return catalogItems;
	}
}
