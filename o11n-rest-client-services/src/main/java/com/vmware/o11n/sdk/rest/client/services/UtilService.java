package com.vmware.o11n.sdk.rest.client.services;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.AboutInfo;
import com.vmware.o11n.sdk.rest.client.stubs.ServiceDescriptorList;
import com.vmware.o11n.sdk.rest.client.stubs.SupportedApiVersionsList;
import com.vmware.o11n.sdk.rest.client.stubs.User;

/**
 * Entry point for all operations that are specific to the REST interface and
 * not to the domain of vCenter Orchestrator.  
 *
 */
public class UtilService extends AbstractService {

    public UtilService(VcoSession session) {
        super(session);
    }

    /* SERVICE DESCRIPTOR */
    //GET /
    public ServiceDescriptorList getServiceDesriptors() {
        return getObjectAppending("", ServiceDescriptorList.class);
    }

    //GET /schema
    public String getSchema() {
        return getObjectAppending("schema", String.class);
    }

    //GET /versions
    public SupportedApiVersionsList getSupportedApiVersions() {
        return getObjectAppending("versions", SupportedApiVersionsList.class);
    }

    /* USER */

    //GET /users
    public User getCurrentUser() {
        return getObjectAppending("users", User.class);
    }
    
    //GET /about
    public AboutInfo getAboutInfo() {
        return getObjectAppending("about", AboutInfo.class);
    }
}
