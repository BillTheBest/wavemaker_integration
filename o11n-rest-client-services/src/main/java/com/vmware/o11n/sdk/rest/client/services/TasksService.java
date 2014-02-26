package com.vmware.o11n.sdk.rest.client.services;

import java.net.URI;

import org.apache.commons.lang.Validate;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.Task;
import com.vmware.o11n.sdk.rest.client.stubs.TaskData;
import com.vmware.o11n.sdk.rest.client.stubs.TaskList;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;

/**
 *Entry point for all Scheduled Tasks related operations.  
 *
 */
public class TasksService extends AbstractService {

    public TasksService(VcoSession session) {
        super(session);
    }

    /* TASKS */

    //GET /workflows/{workflowId}/tasks
    public TaskList getTasksForWorkflow(Workflow workflow) {
        Validate.notNull(workflow, "workflow cannot be null");

        Link tasks = findRelation(workflow, "tasks");
        return getObject(tasks, TaskList.class);
    }

    //GET /tasks
    public TaskList getAllTasks() {
        return getObjectAppending("tasks", TaskList.class);
    }

    //POST /tasks
    public Task createTask(Task task) {
        Validate.notNull(task, "task cannot be null");

        ResponseEntity<Void> entity = getRestTemplate().postForEntity(appendToRoot("tasks"), task, Void.class);
        URI location = entity.getHeaders().getLocation();
        return getRestTemplate().getForObject(location, Task.class);
    }

    //GET /tasks/{id}
    public Task getTask(String taskId) {
        Validate.notEmpty(taskId, "taskId cannot be empty");

        return getObjectAppending("tasks/" + taskId, Task.class);
    }

    //POST /tasks/{id}
    public Task updateTask(Task task, TaskData taskData) {
        Validate.notNull(task, "task cannot be null");
        Validate.notNull(taskData, "taskData cannot be null");

        ResponseEntity<Task> entity = getRestTemplate().postForEntity(task.getHref(), taskData, Task.class);
        return entity.getBody();
    }

    //DELETE /tasks/{id}
    public void deleteTask(Task task) {
        Validate.notNull(task, "task cannot be null");

        getRestTemplate().delete(task.getHref());
    }

    //GET /tasks/{id}/executions
    public PresentationExecutionsList getTaskExecution(Task task) {
        Validate.notNull(task, "task cannot be null");

        Link executionsLink = findRelation(task, "executions");
        return getObject(executionsLink, PresentationExecutionsList.class);
    }

    public PermissionsList getPermissions(Task task) {
        return getPermissions(task.getHref());
    }

    public void deleteAllPermissions(Task task) {
        deleteAllPermissions(task.getHref());
    }

    public void addPermissions(Task task, PermissionsList permissions) {
        createPermissions(task.getHref(), permissions);
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
