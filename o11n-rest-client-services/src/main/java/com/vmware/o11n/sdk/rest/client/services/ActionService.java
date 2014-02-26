package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.Action;
import com.vmware.o11n.sdk.rest.client.stubs.ActionsList;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;

/**
 * Entry point for all Action related operations.
 *
 */
public class ActionService extends AbstractService {

    public ActionService(VcoSession session) {
        super(session);

    }

    // DELETE /content/actions/{actionName}
    public void deleteAction(String actionName, boolean force) {
        Validate.notEmpty(actionName, "actionName cannot be empty");

        getRestTemplate().delete(appendToRoot("actions/" + urlEncode(actionName) + "/?force=" + force));
    }

    // POST/content/actions/{categoryName}
    public Action importAction(String categoryName, File actionContent) throws IOException {
        Validate.notEmpty(categoryName, "categoryName cannot be empty");
        Validate.notNull(actionContent, "actionContent cannot be null");

        ResponseEntity<Void> entity = uploadFile(appendToRoot("actions?categoryName=" + urlEncode(categoryName)), actionContent);

        return getObject(entity.getHeaders().getLocation(), Action.class);

    }

    // POST/content/actions/{categoryName}
    public Action importAction(String categoryName, File actionContent, boolean overwrite) throws IOException {
        Validate.notEmpty(categoryName, "categoryName cannot be empty");
        Validate.notNull(actionContent, "actionContent cannot be null");

        ResponseEntity<Void> entity = uploadFile(appendToRoot("actions?categoryName=" + urlEncode(categoryName) + "&overwrite=" + overwrite), actionContent);

        return getObject(entity.getHeaders().getLocation(), Action.class);

    }

    public Action getAction(String moduleName, String actionName) {
        Validate.notEmpty(moduleName, "moduleName cannot be empty");
        Validate.notEmpty(actionName, "actionName cannot be empty");

        return getObjectAppending("actions/" + urlEncode(moduleName) + "/" + urlEncode(actionName), Action.class);
    }

    public Action getAction(String actionId) {
        Validate.notEmpty(actionId, "actionId cannot be empty");
        return getObjectAppending("actions/" + actionId, Action.class);
    }

    //GET /content/actions/{actionName}
    public void exportActionToFile(String actionId, File localFile) throws IOException {
        Validate.notEmpty(actionId, "actionId cannot be empty");
        Validate.notNull(localFile, "localFile cannot be null");

        ResponseEntity<byte[]> forEntity = getSession().getRestTemplate().getForEntity(
                appendToRoot("actions/" + actionId), byte[].class);

        FileUtils.writeByteArrayToFile(localFile, forEntity.getBody());
    }

    public ActionsList getAllActions() {
        return getObjectAppending("actions", ActionsList.class);
    }

    public PermissionsList getPermissions(Action action) {
        return getPermissions(action.getHref());
    }

    public void deleteAllPermissions(Action action) {
        deleteAllPermissions(action.getHref());
    }

    public void addPermissions(Action action, PermissionsList permissions) {
        createPermissions(action.getHref(), permissions);
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
