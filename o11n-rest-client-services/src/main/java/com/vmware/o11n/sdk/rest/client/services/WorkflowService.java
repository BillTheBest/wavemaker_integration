package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;

/**
 * Entry point for all Workflow related operations.  
 *
 */
public class WorkflowService extends AbstractService {
    public WorkflowService(VcoSession session) {
        super(session);
    }

    //GET /workflows
    public InventoryItemsList getAll(InventoryItemQuerySpec queryParamters) {
        return getObjectAppending("workflows" + qs(queryParamters), InventoryItemsList.class);
    }

    //GET /workflows/{id}
    public Workflow getWorkflow(String id) {
        Validate.notEmpty(id, "id cannot be empty");

        return getObjectAppending("workflows/" + id, Workflow.class);
    }

    //POST /content/workflows/{categoryId}
    public void importWorkflowInCategory(String categoryId, File workflowContent) throws IOException {
        Validate.notEmpty(categoryId, "categoryId cannot be empty");
        Validate.notNull(workflowContent, "workflowContent cannot be null");

        uploadFile(appendToRoot("workflows?categoryId=" + categoryId), workflowContent);
    }

  //POST /content/workflows/{categoryId}
    public void importWorkflowInCategory(String categoryId, File workflowContent, boolean overwrite) throws IOException {
        Validate.notEmpty(categoryId, "categoryId cannot be empty");
        Validate.notNull(workflowContent, "workflowContent cannot be null");

        uploadFile(appendToRoot("workflows?categoryId=" + categoryId + "&overwrite=" + overwrite), workflowContent);
    }
    
    // GET /content/workflows/{workflowId}
    public void exportWorkflowToFile(String workflowId, File localFile) throws IOException {
        Validate.notEmpty(workflowId, "packageName cannot be empty");
        Validate.notNull(localFile, "localFile cannot be null");

        HttpHeaders map = new HttpHeaders();
        map.setAccept(Collections.singletonList(APPLICATION_ZIP));
        HttpEntity<Void> req = new HttpEntity<Void>((Void) null, map);
        ResponseEntity<byte[]> entity = getRestTemplate().exchange(appendToRoot("workflows/" + workflowId),
                HttpMethod.GET, req, byte[].class);

        FileUtils.writeByteArrayToFile(localFile, entity.getBody());
    }

    //GET /workflows/{id}/icon
    public Icon getIcon(Workflow workflow) {
        Validate.notNull(workflow, "workflow cannot be empty");

        Link link = findRelation(workflow, "icon");
        URI uri = toUri(link.getHref());
        return getIcon(uri);
    }

    // DELETE /content/workflows/{workflowId}
    public void deleteWorkflow(String workflowId, boolean force) {
        Validate.notEmpty(workflowId, "workflowId cannot be empty");

        getRestTemplate().delete(appendToRoot("workflows/" + workflowId+ "/?force=" + force));
    }

    public PermissionsList getPermissions(Workflow workflow) {
        return getPermissions(workflow.getHref());
    }

    public void deleteAllPermissions(Workflow workflow) {
        deleteAllPermissions(workflow.getHref());
    }

    public void addPermissions(Workflow workflow, PermissionsList permissions) {
        createPermissions(workflow.getHref(), permissions);
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
