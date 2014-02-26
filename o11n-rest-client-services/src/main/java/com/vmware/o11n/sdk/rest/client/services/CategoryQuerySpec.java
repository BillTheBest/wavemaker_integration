package com.vmware.o11n.sdk.rest.client.services;

import com.vmware.o11n.sdk.rest.client.stubs.CategoryType;

/**
 * Typesafe representation of the query used by {@link CategoryService#getAllCategories(CategoryQuerySpec)}
 *
 */
public class CategoryQuerySpec extends AbstractQuerySpec {

    public CategoryQuerySpec setCategoryType(CategoryType categoryType) {
        setParam("categoryType", categoryType.value());
        return this;
    }

    public CategoryQuerySpec setIsRoot(boolean param) {
        setParam("isRoot", param);
        return this;
    }
}
