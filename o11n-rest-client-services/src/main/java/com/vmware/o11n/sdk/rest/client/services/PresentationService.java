package com.vmware.o11n.sdk.rest.client.services;

import org.apache.commons.lang.Validate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext.Parameters;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Presentation;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution.OutputParameters;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;

/**
 *Entry point for all Presentation related operations.  
 *
 */
public class PresentationService extends AbstractService {
    public PresentationService(VcoSession session) {
        super(session);
    }

    /* PRESENTATION */

    //GET /workflows/{workflowId}/presentation
    public Presentation getPresentation(Workflow workflow) {
        Validate.notNull(workflow, "workflow cannot be null");

        Link link = findRelation(workflow, "presentation");
        return getRestTemplate().getForObject(link.getHref(), Presentation.class);
    }

    //POST /workflows/{workflowId}/presentation/instances
    public PresentationExecution createPresentationExecution(Presentation presentation,
            ExecutionContext executionContext) {
        Validate.notNull(presentation, "presentation cannot be null");
        Validate.notNull(executionContext, "executionContext cannot be null");

        Link link = findRelation(presentation, "add");
        return getRestTemplate().postForObject(link.getHref(), executionContext, PresentationExecution.class);
    }

    //GET /workflows/{workflowId}/presentation/instances
    public PresentationExecutionsList getPresentationExecutions(Presentation presentation) {
        Validate.notNull(presentation, "presentation cannot be null");

        Link link = findRelation(presentation, "instances");
        return getRestTemplate().getForObject(link.getHref(), PresentationExecutionsList.class);
    }

    //GET /workflows/{workflowId}/presentation/instances/{executionId}
    public PresentationExecution getPresentationExecution(Presentation presentation, String presentationExecutionId) {
        Validate.notNull(presentation, "presentation cannot be null");
        Validate.notEmpty(presentationExecutionId, "presentationExecutionId cannot be empty");

        Link link = findRelation(presentation, "instances");
        return getRestTemplate().getForObject(link.getHref() + presentationExecutionId, PresentationExecution.class);
    }

    //POST /workflows/{workflowId}/presentation/instances/{executionId}
    public PresentationExecution updatePresentationExecution(PresentationExecution presentationExecution,
            ExecutionContext executionContext) {
        Validate.notNull(presentationExecution, "presentationExecution cannot be empty");
        Validate.notNull(executionContext, "executionContext cannot be empty");

        return getRestTemplate().postForObject(presentationExecution.getHref(), executionContext,
                PresentationExecution.class);
    }

    //DELETE /workflows/{workflowId}/presentation/instances/{executionId}
    public void cancelPresentationExecution(PresentationExecution presentationExecution) {
        Validate.notNull(presentationExecution, "presentationExecution cannot be null");

        getRestTemplate().delete(presentationExecution.getHref());
    }

    public ExecutionContext createExecutionContextFromPresentationExecution(PresentationExecution presentationExecution) {
        Validate.notNull(presentationExecution, "presentationExecution cannot be null");

        ExecutionContext res = new ExecutionContext();

        OutputParameters outputParameters = presentationExecution.getOutputParameters();
        if (outputParameters != null) {
            res.setParameters(new Parameters());
            for (Parameter p : outputParameters.getParameter()) {
                res.getParameters().getParameter().add(p);
            }
        }

        return res;
    }
}
