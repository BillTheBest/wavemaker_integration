package com.vmware.o11n.sdk.rest.client.services;

import java.net.URI;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.Validate;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.LogsList;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.UserInteraction;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;

/**
 * Entry point for Workflow execution related operations. 
 *
 */
public class ExecutionService extends AbstractService {
    public ExecutionService(VcoSession session) {
        super(session);
    }

    //GET /workflows/{workflowId}/executions
    public WorkflowExecution execute(Workflow workflow, ExecutionContext executionContext) {
        Validate.notNull(workflow, "workflow cannot be null");
        Validate.notNull(executionContext, "executionContext cannot be null");

        Link link = findRelation(workflow, "executions");
        ResponseEntity<Void> entity = getRestTemplate().postForEntity(link.getHref(), executionContext, Void.class);
        URI location = entity.getHeaders().getLocation();
        return getRestTemplate().getForObject(location, WorkflowExecution.class);
    }

    public WorkflowExecution executeUsingPresentation(Workflow workflow, PresentationExecution presentationExecution) {
        Validate.notNull(workflow, "workflow cannot be null");
        Validate.notNull(presentationExecution, "executionContext cannot be null");

        PresentationService presentationService = new PresentationService(getSession());
        ExecutionContext ctx = presentationService
                .createExecutionContextFromPresentationExecution(presentationExecution);
        return execute(workflow, ctx);
    }

    //GET /workflows/{workflowId}/executions/{executionId}/state
    public WorkflowExecutionState getExecutionState(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "state");
        return getRestTemplate().getForObject(link.getHref(), WorkflowExecutionState.class);
    }

    //DELETE /workflows/{workflowId}/executions/{executionId}/state
    public void cancelWorkflowExecution(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "state");
        getRestTemplate().delete(link.getHref());
    }

    //GET /workflows/{workflowId}/executions
    public PresentationExecutionsList getExecutions(Workflow workflow) {
        Validate.notNull(workflow, "workflow cannot be null");

        Link link = findRelation(workflow, "executions");
        return getRestTemplate().getForObject(link.getHref(), PresentationExecutionsList.class);
    }

    //GET /workflows/{workflowId}/executions/{executionId}
    public WorkflowExecution getExecution(Workflow workflow, String executionId) {
        Validate.notNull(workflow, "workflow cannot be null");
        Validate.notEmpty(executionId, "executionContext cannot be empty");

        Link link = findRelation(workflow, "executions");
        String uri = link.getHref() + executionId;
        return getRestTemplate().getForObject(uri, WorkflowExecution.class);
    }

    //DELETE /workflows/{workflowId}/executions/{executionId}
    public void deleteExecution(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "remove");
        getRestTemplate().delete(link.getHref());
    }

    //GET /workflows/{workflowId}/executions/{executionId}/logs
    public LogsList getLogs(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "logs");
        return getRestTemplate().getForObject(link.getHref(), LogsList.class);
    }

    //GET /workflows/{workflowId}/executions/{executionId}/interaction
    public UserInteraction getUserInteraction(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "interaction");
        return getRestTemplate().getForObject(link.getHref(), UserInteraction.class);
    }

    //POST /workflows/{workflowId}/executions/{executionId}/interaction
    public void answerUserInteraction(WorkflowExecution workflowExecution, ExecutionContext executionContext) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");
        Validate.notNull(executionContext, "executionContext cannot be null");

        Link link = findRelation(workflowExecution, "interaction");
        getRestTemplate().postForObject(link.getHref(), executionContext, Void.class);
    }

    //POST /workflows/{workflowId}/executions/{executionId}/interaction
    public void answerUserInteractionUsingPresentation(WorkflowExecution workflowExecution,
            PresentationExecution presentationExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");
        Validate.notNull(presentationExecution, "presentationExecution cannot be null");

        PresentationService presentationService = new PresentationService(getSession());
        ExecutionContext ctx = presentationService
                .createExecutionContextFromPresentationExecution(presentationExecution);
        answerUserInteraction(workflowExecution, ctx);
    }

    public WorkflowExecution awaitState(WorkflowExecution workflowExecution, long pollTimeoutMillis, int maxAttempts,
            WorkflowExecutionState expectedState, WorkflowExecutionState... moreStates) throws InterruptedException {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        if (pollTimeoutMillis < 200) {
            pollTimeoutMillis = 200;
        }
        if (maxAttempts <= 0) {
            maxAttempts = 1;
        }

        Set<WorkflowExecutionState> set = toSet(expectedState, moreStates);

        if (set.isEmpty()) {
            throw new IllegalArgumentException("must provide at least one non-null expected WorkflowExecutionState");
        }

        WorkflowExecutionState state = workflowExecution.getState();

        int i = 0;
        while (!set.contains(state)) {
            if (i > maxAttempts) {
                return null;
            }
            i++;
            Thread.sleep(pollTimeoutMillis);
            state = getExecutionState(workflowExecution);
        }

        return getObject(workflowExecution);
    }

    private Set<WorkflowExecutionState> toSet(WorkflowExecutionState expectedState,
            WorkflowExecutionState... moreStates) {
        HashSet<WorkflowExecutionState> set = new HashSet<WorkflowExecutionState>();
        if (expectedState != null) {
            set.add(expectedState);
        }

        for (WorkflowExecutionState wes : moreStates) {
            if (wes != null) {
                set.add(wes);
            }
        }
        return set;
    }
}
