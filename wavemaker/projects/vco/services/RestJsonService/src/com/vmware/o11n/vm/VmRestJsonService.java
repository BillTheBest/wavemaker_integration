package com.vmware.o11n.vm;

import com.vmware.o11n.wm.services.VcoRestJsonService;
import com.wavemaker.runtime.javaservice.JavaServiceSuperClass;
import com.wavemaker.runtime.service.annotations.ExposeToClient;

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
@ExposeToClient 
public class VmRestJsonService extends JavaServiceSuperClass {
	
	private VcoRestJsonService service;
	
	
    /* Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    public VmRestJsonService(VcoRestJsonService service) {
       super(INFO);
       this.service = service;
    }

    public String get(String url) {
    	return service.get(url);
    }
   
    public String postForLocation(String url, String jsonBody) {
    	return service.postForLocation(url, jsonBody);
    }
    
    public String post(String url, String jsonBody) {
    	return service.post(url, jsonBody);
    }
    
    public void put(String url, String jsonBody) {
    	service.put(url, jsonBody);
    }
    
    public void delete(String url) {
    	service.delete(url);
    }
}
