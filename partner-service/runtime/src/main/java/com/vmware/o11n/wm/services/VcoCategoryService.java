package com.vmware.o11n.wm.services;
/* **********************************************************************
 * Copyright 2011 VMware, Inc.  All rights reserved. VMware Confidential
 * **********************************************************************/

import com.vmware.o11n.sdk.rest.client.services.CategoryQuerySpec;
import com.vmware.o11n.sdk.rest.client.services.CategoryService;
import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Category;
import com.vmware.o11n.sdk.rest.client.stubs.CategoryType;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.client.HttpClientErrorException;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class VcoCategoryService extends VcoBaseService {
            
    public VcoCategoryService(VcoConnectionService service) throws IOException {
        super(service);
    }

    public String getRootTreeData() {
        String result  = getConnectionService().getVcoUsername() + "@" + getConnectionService().getServer();
        return result;
    }

    public String getCategoryRoot() throws JSONException {
        CategoryQuerySpec rootQuery =  new CategoryQuerySpec().setIsRoot(true)
                .setCategoryType(CategoryType.WORKFLOW_CATEGORY);
        String jsonString;
        try {
            List<Link> rootCats = getCategoryService().getAllCategories(rootQuery).getLink();
            jsonString = parseLinksToJson(rootCats).toString();
        } catch (HttpClientErrorException e) {
            jsonString = getErrorContent(e.getStatusText());
        }
        return jsonString;
    }

    public String getCategory(String catId) throws JSONException {
        Category cat = getCategoryService().getCategory(catId);
        String jsonString = parseLinksToJson(cat.getRelations().getLink()).toString();
        return jsonString;
    }

    private JSONArray parseLinksToJson(List<Link> links) throws JSONException {
        JSONArray result = new JSONArray();
        Set<String> ids = new HashSet<String>();
        for (Link link : links) {
            if(link!=null && link.getAttributes()!=null && "down".equals(link.getRel())){
                JSONObject obj = new JSONObject();
                // parse attributes
                Map<String,String> attrMap = new HashMap<String, String>();
                List<Attribute> attrs = link.getAttributes().getAttribute();
                for (Attribute attr : attrs) {
                    attrMap.put(attr.getName(), attr.getValue());
                }
                // check for ID duplication
                // (in order to avoid bug in the REST API of 5.1.1
                String id = attrMap.get("id");
                if (ids.contains(id)) {
                    continue;
                } else {
                    ids.add(id);
                }
                // populate JSON object
                if ("Workflow".equals(attrMap.get("type"))){
                    obj.accumulate("content", attrMap.get("name"));
                    obj.accumulate("data", attrMap.get("id"));
                    obj.accumulate("type", "Workflow");
                } else if ("WorkflowCategory".equals(attrMap.get("type"))){
                    obj.accumulate("content", attrMap.get("name"));
                    obj.accumulate("data", attrMap.get("id"));
                    obj.accumulate("type", "WorkflowCategory");
                } else {
                    //TODO: log error or throw exception.
                }
                result.put(obj);
            }
        }
        return result;
    }

    private String getErrorContent(String message) {
        return "[{\"content\":\"" + message + "\",\"data\":\"undefined\",\"type\":\"Error\"}]";
    }
    
    private CategoryService getCategoryService() {
    	return new CategoryService(getSession());
    }
}
