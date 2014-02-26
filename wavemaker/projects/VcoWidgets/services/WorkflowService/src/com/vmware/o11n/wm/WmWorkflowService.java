package com.vmware.o11n.wm;

import java.util.List;

import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.wm.common.BaseParameter;
import com.vmware.o11n.wm.common.ExecutionParameter;
import com.vmware.o11n.wm.common.FilterType;
import com.vmware.o11n.wm.common.PaginatedUserInteractions;
import com.vmware.o11n.wm.common.PaginatedWorkflowExecutions;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.common.PresentationParameter;
import com.vmware.o11n.wm.common.QuerySpec;
import com.vmware.o11n.wm.presentation.dao.ExecutionStateModel;
import com.vmware.o11n.wm.presentation.dao.UserInteractionModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowRunEvent;
import com.vmware.o11n.wm.services.VcoWorkflowService;

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
public class WmWorkflowService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
    private VcoWorkflowService service;

    /**
     * Pass in one of FATAL, ERROR, WARN,  INFO and DEBUG to modify your log level;
     *  recommend changing this to FATAL or ERROR before deploying.  For info on these levels, look for tomcat/log4j documentation
     */
    public WmWorkflowService(VcoWorkflowService service) {
        super(INFO);
        this.service = service;
    }

    public WorkflowExecutionModel startWorkflow(String workflowId) {
        return service.startWorkflow(workflowId);
    }

    public WorkflowExecutionModel startWorkflowWithParams(String workflowId, List<Parameter> params) {
        return service.startWorkflow(workflowId, params);
    }
    
    public WorkflowExecutionModel runWorkflow(String workflowId, List<PresentationParameter> params) {
        return service.runWorkflow(workflowId, params);
    }
    
    public WorkflowModel getWorkflow(String workflowId) {
    	return service.getWorkflow(workflowId);
    }
    
    public PaginatedWorkflows getWorkflows(QuerySpec spec) {
    	return service.getWorkflows(spec);
    }
    
    public WorkflowExecutionModel getWorkflowExecution(String workflowId, String executionId) {
    	return service.getWorkflowExecution(workflowId, executionId);
    }
    
    public ExecutionStateModel getExecutionState(String workflowId, String executionId) {
    	return service.getExecutionState(workflowId, executionId);
    }
    
    public PaginatedWorkflowExecutions getWorkflowAllExecutions(QuerySpec spec){
    	return service.getWorkflowExecutions(spec);
    }
    
    public PaginatedWorkflowExecutions getWorkflowExecutions(String workflowId, QuerySpec spec){
    	PaginatedWorkflowExecutions workflowExecutions;
    	if(workflowId == null) {
    		workflowExecutions =  service.getWorkflowExecutions(spec);
    	}else {
    		workflowExecutions =  service.getExecutionsForWorkflow(workflowId, spec);
    	}
    	return workflowExecutions;
    }
    
    public List<WorkflowRunEvent> getRunEvents(String workflowId, String executionId){
    	return service.getWorkflowRunEvents(workflowId, executionId);
    }
    
    public String getWorkflowIdForExecutionId(String executionId){
    	return service.getWorkflowIdForExecutionId(executionId);
    }
    
    public PaginatedUserInteractions getUserInteractions(QuerySpec spec) {
    	return service.getUserInteractions(spec);
    }
    
    public UserInteractionModel getUserInteraction(String userInteractionId) {
    	return service.getUserInteraction(userInteractionId);
    }
    
    public void answerUserInteraction(String workflowId, String executionId, List<PresentationParameter> params) {
    	service.answerUserInteraction(workflowId, executionId, params);
    }
    
    public void cancelWorkflowExecution(String workflowId, String executionId) {
    	service.cancelWorkflowExecution(workflowId, executionId);
    }
    
    public WorkflowExecutionModel rerunWorklfowExecution(String workflowId, String executionId) {
    	return service.rerunWorklfowExecution(workflowId, executionId);
    }
    
    /* Dummy getter, needed by the Service Variable to generate 
     * the stubs in types.js.
     */
    public ExecutionParameter _ExecutionParameterStub() {
        throw new RuntimeException("Dummy method. Not to be called directly.");
    }
    
    /* Dummy getter, needed by the Service Variable to generate 
     * the stubs in types.js.
     */
    public BaseParameter _BaseParameterStub() {
    	throw new RuntimeException("Dummy method. Not to be called directly.");
    }
    
    /* Dummy getter, needed by the Service Variable to generate 
     * the stubs in types.js.
     */
    public WorkflowRunEvent _WorkflowRunEventParameterStub() {
    	throw new RuntimeException("Dummy method. Not to be called directly.");
    }
    
    /* Dummy getter, needed by the Service Variable to generate 
     * the stubs in types.js.
     */
    public FilterType _FilterTypeStub() {
    	throw new RuntimeException("Dummy method. Not to be called directly.");
    }
}
