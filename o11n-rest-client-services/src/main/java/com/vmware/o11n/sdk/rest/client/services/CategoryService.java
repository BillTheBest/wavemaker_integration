package com.vmware.o11n.sdk.rest.client.services;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.CategoriesList;
import com.vmware.o11n.sdk.rest.client.stubs.Category;
import com.vmware.o11n.sdk.rest.client.stubs.CategoryContext;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;

public class CategoryService extends AbstractService {

    public CategoryService(VcoSession session) {
        super(session);
    }

    //GET /categories
    /**
     * 
     * @param query can be null
     * @return
     */
    public CategoriesList getAllCategories(CategoryQuerySpec query) {
        return getObjectAppending("categories" + qs(query), CategoriesList.class);
    }

    //GET /categories/{categoryId}
    public Category getCategory(String id) {
        return getObjectAppending("categories/" + id, Category.class);
    }

    public PermissionsList getPermissions(Category category) {
        return getPermissions(category.getHref());
    }

    public void deleteAllPermissions(Category category) {
        deleteAllPermissions(category.getHref());
    }

    public void addPermissions(Category category, PermissionsList permissions) {
        createPermissions(category.getHref(), permissions);
    }

    @Override
    public void deletePermission(PermissionEntry permission) {
        super.deletePermission(permission);
    }

    @Override
    public void updatePermission(PermissionEntry permission) {
        super.updatePermission(permission);
    }
    
    public Category createCategory(CategoryContext categoryContext) {
        return getRestTemplate().postForObject(appendToRoot("categories/"), categoryContext, Category.class);
    }
    
    public Category createCategory(CategoryContext categoryContext, String parentCategoryId) {
        return getRestTemplate().postForObject(appendToRoot("categories/" + parentCategoryId), categoryContext, Category.class);
    }
}
