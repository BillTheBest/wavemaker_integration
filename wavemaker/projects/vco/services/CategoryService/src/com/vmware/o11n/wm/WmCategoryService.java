package com.vmware.o11n.wm;

import com.vmware.o11n.wm.services.VcoCategoryService;
import org.json.JSONException;

import java.io.IOException;

/**
 * This is a client-facing service class.  All
 * public methods will be exposed to the client.  Their return
 * values and parameters will be passed to the client or taken
 * from the client, respectively.  This will be a singleton
 * instance, shared between all requests.
 *
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception).
 * LOG_LEVEL is one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level.
 * For info on these levels, look for tomcat/log4j documentation
 */
public class WmCategoryService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {

    private VcoCategoryService service;

    public WmCategoryService(VcoCategoryService service) throws IOException {
        super(INFO);
        this.service = service;
    }

    public String getRootTreeData() {
        return service.getRootTreeData();
    }

    public String getCategoryRoot() throws JSONException {
        return service.getCategoryRoot();
    }

    public String getCategory(String catId) throws JSONException {
        return service.getCategory(catId);
    }
}

