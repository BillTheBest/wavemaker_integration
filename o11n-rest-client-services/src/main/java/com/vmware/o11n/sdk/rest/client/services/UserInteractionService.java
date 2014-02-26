package com.vmware.o11n.sdk.rest.client.services;

import org.apache.commons.lang.Validate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.UserInteraction;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;

/**
 *Entry point for all User Interaction related operations.  
 *
 */
public class UserInteractionService extends AbstractService {
    public UserInteractionService(VcoSession session) {
        super(session);
    }

    //GET /workflows/{workflowId}/executions/{executionId}/interaction/presentation/
    public UserInteraction getPresentationForExecution(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");

        Link link = findRelation(workflowExecution, "interaction");
        if (link == null) {
            return null;
        }
        return getRestTemplate().getForObject(link.getHref(), UserInteraction.class);
    }

    //POST /workflows/{workflowId}/executions/{executionId}/interaction/  presentation/instances
    public PresentationExecution createPresentationExecution(UserInteraction userInteraction,
            ExecutionContext executionContext) {
        Validate.notNull(userInteraction, "userInteraction cannot be null");
        Validate.notNull(executionContext, "executionContext cannot be null");

        Link link = findRelation(userInteraction, "add");
        return getRestTemplate().postForObject(link.getHref() + "presentation/instances", executionContext,
                PresentationExecution.class);
    }

    //POST /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances/{presentationExecutionId}
    public PresentationExecution updatePresentationExecution(PresentationExecution presentationExecution,
            ExecutionContext executionContext) {
        Validate.notNull(presentationExecution, "presentationExecution cannot be null");
        Validate.notNull(executionContext, "executionContext cannot be null");
        
        return getRestTemplate().postForObject(presentationExecution.getHref(), executionContext,
                PresentationExecution.class);
    }

    //GET /workflows/{workflowId}/executions/{executionId}/   interaction/presentation/instances
    public PresentationExecutionsList getInteractionPresentationExecutions(WorkflowExecution workflowExecution) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");
        
        Link link = findRelation(workflowExecution, "interaction");
        return getRestTemplate().getForObject(link.getHref() + "presentation/instances",
                PresentationExecutionsList.class);
    }

    //GET /workflows/{workflowId}/executions/{executionId}/    interaction/presentation/instances/{presentationExecutionId}
    public PresentationExecution getPresentationExecutionForId(WorkflowExecution workflowExecution,
            String presentationExecutionId) {
        Validate.notNull(workflowExecution, "workflowExecution cannot be null");
        Validate.notEmpty(presentationExecutionId, "presentationExecutionId cannot be empty");
        
        return getRestTemplate().getForObject(
                workflowExecution.getHref() + "interaction/presentation/instances/" + presentationExecutionId,
                PresentationExecution.class);
    }

    //DELETE /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances/{presentationExecutionId}
    public void cancelPresentationExecution(PresentationExecution presentationExecution) {
        Validate.notNull(presentationExecution, "presentationExecution cannot be null");
        
        getRestTemplate().delete(presentationExecution.getHref());
    }
}
