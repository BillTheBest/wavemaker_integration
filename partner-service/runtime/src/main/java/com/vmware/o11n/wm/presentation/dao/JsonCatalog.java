package com.vmware.o11n.wm.presentation.dao;

import java.util.Date;
import java.util.List;


public class JsonCatalog {
	private List<CatalogPage> catalogPages;
	private long lastUpdated;
	
	protected JsonCatalog() {
	}
	
	public JsonCatalog(CatalogModel catalogModel) {
		if(catalogModel == null) {
			return;
		}
		this.catalogPages = catalogModel.getCatalogPages();
		if(catalogModel.getLastUpdatedTime() != null) {
			this.lastUpdated = catalogModel.getLastUpdatedTime().getTime();
		}
	}
	
	public CatalogModel mapToCatalog() {
		CatalogModel catalog  = new CatalogModel();
		if(lastUpdated != 0) {
			catalog.setLastUpdated(new Date(lastUpdated));
		}
		if(catalogPages !=null) {
			for (CatalogPage page : catalogPages) {
				catalog.addPage(page);
			}
		}
		
		return catalog;
	}

	public List<CatalogPage> getCatalogPages() {
		return catalogPages;
	}

	public void setCatalogPages(List<CatalogPage> catalogPages) {
		this.catalogPages = catalogPages;
	}

	public long getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(long lastUpdated) {
		this.lastUpdated = lastUpdated;
	}
}