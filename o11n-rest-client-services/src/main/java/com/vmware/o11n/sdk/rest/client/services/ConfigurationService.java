package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.IOException;
import java.util.Collections;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.Configuration;
import com.vmware.o11n.sdk.rest.client.stubs.ConfigurationsList;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;

/**
 *Entry point for all ConfigurationElement related operations.  
 *
 */
public class ConfigurationService extends AbstractService {

    private static final MediaType VCOOBJECT = new MediaType("application", "vcoobject+xml");

    public ConfigurationService(VcoSession session) {
        super(session);
    }

    public ConfigurationsList getAllConfigurations() {
        return getObjectAppending("configurations", ConfigurationsList.class);
    }

    public Configuration getConfiguration(String id) {
        return getObject(appendToRoot("configurations/" + id), Configuration.class);
    }

    public Configuration importConfiguration(String categoryId, File localFile) {
        Validate.notEmpty(categoryId, "categoryId cannot be empty");
        Validate.notNull(localFile, "localFile cannot be empty");

        ResponseEntity<Void> entity = uploadFile(appendToRoot("configurations?categoryId=" + categoryId), localFile);

        return getObject(entity.getHeaders().getLocation(), Configuration.class);
    }

    public void exportConfiguration(String id, File localFile) throws IOException {
        Validate.notEmpty(id, "id cannot be empty");
        Validate.notNull(localFile, "localFile cannot be null");

        HttpHeaders map = new HttpHeaders();
        map.setAccept(Collections.singletonList(VCOOBJECT));
        HttpEntity<Void> req = new HttpEntity<Void>((Void) null, map);
        ResponseEntity<byte[]> entity = getRestTemplate().exchange(appendToRoot("configurations/" + id),
                HttpMethod.GET, req, byte[].class);

        FileUtils.writeByteArrayToFile(localFile, entity.getBody());

    }

    public void deleteConfiguration(String id) {
        getRestTemplate().delete(appendToRoot("configurations/" + id));
    }

    public void deleteAllPermissions(Configuration conf) {
        deleteAllPermissions(conf.getHref());
    }

    public void addPermissions(Configuration conf, PermissionsList permissions) {
        createPermissions(conf.getHref(), permissions);
    }

    @Override
    public void deletePermission(PermissionEntry permission) {
        super.deletePermission(permission);
    }

    @Override
    public void updatePermission(PermissionEntry permission) {
        super.updatePermission(permission);
    }
}
