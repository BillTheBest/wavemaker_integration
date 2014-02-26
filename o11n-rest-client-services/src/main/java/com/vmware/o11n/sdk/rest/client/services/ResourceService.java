package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.IOException;
import java.util.Collections;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.Resource;
import com.vmware.o11n.sdk.rest.client.stubs.ResourcesList;
/**
 *Entry point for all ResourceElement related operations.  
 *
 */
public class ResourceService extends AbstractService {

    public ResourceService(VcoSession session) {
        super(session);
    }

    public ResourcesList getAllResources() {
        return getObjectAppending("resources", ResourcesList.class);
    }

    public Resource getResource(String id) {
        return getObjectAppending("resources/" + id, Resource.class);
    }

    public void deleteResource(String id) {
        getRestTemplate().delete(appendToRoot("resources/" + id));
    }

    public void exportResource(String id, File localFile) throws IOException {
        HttpHeaders map = new HttpHeaders();
        map.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));
        HttpEntity<Void> req = new HttpEntity<Void>((Void) null, map);
        ResponseEntity<byte[]> entity = getRestTemplate().exchange(appendToRoot("resources/" + id), HttpMethod.GET,
                req, byte[].class);

        FileUtils.writeByteArrayToFile(localFile, entity.getBody());
    }

    public Resource importResource(String categoryId, File resourceContent) {
        Validate.notEmpty(categoryId, "categoryId cannot be empty");
        Validate.notNull(resourceContent, "workflowContent cannot be null");

        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
        parts.add("file", new FileSystemResource(resourceContent));
        ResponseEntity<Void> entity = getRestTemplate().postForEntity(appendToRoot("resources?categoryId=" + categoryId), parts, Void.class);
        
        return getObject(entity.getHeaders().getLocation(), Resource.class);
    }
}
