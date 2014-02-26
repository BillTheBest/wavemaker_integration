package com.vmware.o11n.wm.presentation.dao;

import java.io.Serializable;
import java.util.UUID;

public class CategoryModel implements Comparable<CategoryModel>, Serializable {
	private static final long serialVersionUID = -8044212933269607579L;
	public static final String CATEGORY_ID = "categoryId";
	public static final String CATEGORY_NAME = "categoryName";
	public static final String SEARCH = "search";
	public static final CategoryModel SEARCH_CATEGORY = new CategoryModel("10101", "Search");

	private final int order;
	private final String id;
	private final String name;

	public static CategoryModel create(String name, int order) {
		return new CategoryModel(UUID.randomUUID().toString(), name, order);
	}

	// Don't use. needed by the Jackson
	protected CategoryModel() {
		order = 0;
		id = null;
		name = null;
	}

	public CategoryModel(String id, String name) {
		this(id, name, 0);
	}

	public CategoryModel(String id, String name, int order) {
		this.id = id;
		this.name = name;
		this.order = order;
	}

	public String getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public int getOrder() {
		return order;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CategoryModel other = (CategoryModel) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

	@Override
	public int compareTo(CategoryModel o) {
		if (this.order > o.order)
			return -1;
		if (this.order < o.order)
			return 1;

		if (this.name != null && o.name != null) {
			return this.name.compareToIgnoreCase(o.name);
		}

		return 0;
	}
}
