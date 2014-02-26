package com.vmware.o11n.wm.services;

/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************
 */

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.Validate;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.LogEntry;
import com.vmware.o11n.sdk.rest.client.stubs.LogsList;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution.InputParameters;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;
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

public class VcoWorkflowService extends VcoBaseService {
	private static final String CATLOG_EXECUTIONS_URL_PART = "catalog/System/WorkflowExecution";
	private static final String WORKFLOW_ICON_URL_PART = "/icon";

	public VcoWorkflowService(VcoConnectionService connectionService, VcoCacheManager cacheManager) throws IOException {
		super(connectionService, cacheManager);
	}

	public WorkflowModel getWorkflow(String workflowId) {
		Validate.notEmpty(workflowId, "workflowId cannot be empty");
		WorkflowModel workflow = getCacheManager().getWorkflow(workflowId);
		if (workflow == null || workflow.isPartial()) {
			Workflow sdkWorkflow = getWorkflowService().getWorkflow(workflowId);
			workflow = new WorkflowModel(sdkWorkflow);
			getCacheManager().putWorkflow(workflow);
		}

		return workflow;
	}

	public PaginatedWorkflows getWorkflows(QuerySpec spec) {
		String qs = qs(spec);
		PaginatedWorkflows workflows = null;
		if (StringUtils.isEmpty(qs)) {
			workflows = getCacheManager().getAllWorkflows();
			if (workflows != null) {
				return workflows;
			}
		}

		InventoryItemsList inventoryList = getRestObjectAppendingToRoot(WORKFLOW_PART_URL + qs,
				InventoryItemsList.class);
		workflows = PaginatedWorkflows.createPaginated(inventoryList);

		if (StringUtils.isEmpty(qs)) {
			getCacheManager().putAllWorkflow(workflows);
		}

		return workflows;
	}

	public WorkflowExecutionModel startWorkflow(String workflowId) {
		return startWorkflow(workflowId, null);
	}

	public WorkflowExecutionModel runWorkflow(String workflowId, List<PresentationParameter> params) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		ExecutionContext execContext = mapParameters(params);

		Workflow workflow = createWorkflowLink(workflowId, WORKFLOW_EXECUTION);
		WorkflowExecution workflowExecution = getExecutionService().execute(workflow, execContext);

		return new WorkflowExecutionModel(workflowExecution);
	}

	public WorkflowExecutionModel startWorkflow(String workflowId, List<Parameter> params) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		ExecutionContext execContext = new ExecutionContext();
		if (params != null) {
			ExecutionContext.Parameters parameters = new ExecutionContext.Parameters();
			parameters.getParameter().addAll(params);
			execContext.setParameters(parameters);
		}

		Workflow workflow = createWorkflowLink(workflowId, WORKFLOW_EXECUTION);
		WorkflowExecution workflowExecution = getExecutionService().execute(workflow, execContext);

		return new WorkflowExecutionModel(workflowExecution);
	}

	public List<WorkflowExecutionModel> getExecutionsForWorkflow(String workflowId) {
		return getExecutionsForWorkflow(workflowId, null).getList();
	}

	public PaginatedWorkflowExecutions getExecutionsForWorkflow(String workflowId, QuerySpec spec) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		PresentationExecutionsList executionList = getRestObjectAppendingToRoot(WORKFLOW_PART_URL + workflowId + "/"
				+ WORKFLOW_EXECUTION + qs(spec), PresentationExecutionsList.class);
		if (executionList == null)
			return PaginatedWorkflowExecutions.createPaginated(null);

		return PaginatedWorkflowExecutions.createPaginated(executionList.getRelations());
	}

	public PaginatedWorkflowExecutions getWorkflowExecutions(QuerySpec spec) {
		InventoryItemsList inventoryList = getRestObjectAppendingToRoot(CATLOG_EXECUTIONS_URL_PART + qs(spec),
				InventoryItemsList.class);
		return PaginatedWorkflowExecutions.createPaginated(inventoryList);
	}

	public WorkflowExecutionModel getWorkflowExecution(String workflowId, String executionId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");

		WorkflowExecution execution = getExecutionService().getExecution(
				createWorkflowLink(workflowId, WORKFLOW_EXECUTION), executionId);
		return new WorkflowExecutionModel(execution);
	}

	public String getWorkflowIdForExecutionId(String executionId) {
		Validate.notEmpty(executionId, "executionId cannot be null");

		InventoryItem executionItem = getRestObjectAppendingToRoot(CATLOG_EXECUTIONS_URL_PART + "/" + executionId,
				InventoryItem.class);
		if (executionItem == null)
			return null;
		Relations relations = executionItem.getRelations();
		if (relations == null || relations.getLink().isEmpty())
			return null;
		String url = relations.getLink().get(0).getHref();
		String workflowId = extractIdFromUrl(url, WORKFLOW_PART_URL);
		return workflowId;
	}

	public ExecutionStateModel getExecutionState(String workflowId, String executionId) {
		Validate.notEmpty(executionId, "executionId cannot be null");
		if (workflowId == null) {
			workflowId = getWorkflowIdForExecutionId(executionId);
		}
		WorkflowExecutionState state = getRestObjectAppendingToRoot(WORKFLOW_PART_URL + workflowId + "/"
				+ WORKFLOW_EXECUTION + "/" + executionId + "/state", WorkflowExecutionState.class);

		return new ExecutionStateModel(executionId, workflowId, state);
	}

	public List<WorkflowRunEvent> getWorkflowRunEvents(String workflowId, String executionId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		Validate.notEmpty(executionId, "executionId cannot be null");

		LogsList executionList = getRestObjectAppendingToRoot(WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION
				+ "/" + executionId + "/logs", LogsList.class);

		if (executionList == null || executionList.getEntry().isEmpty())
			return Collections.emptyList();

		List<WorkflowRunEvent> workflowRunEvents = new ArrayList<WorkflowRunEvent>(executionList.getEntry().size());
		for (LogEntry entry : executionList.getEntry()) {
			workflowRunEvents.add(new WorkflowRunEvent(entry));
		}

		return workflowRunEvents;
	}

	// GET catalog/System/UserInteraction?...
	public PaginatedUserInteractions getUserInteractions(QuerySpec spec) {
		InventoryItemsList inventoryList = getRestObjectAppendingToRoot("catalog/System/UserInteraction" + qs(spec),
				InventoryItemsList.class);
		return PaginatedUserInteractions.createPaginated(inventoryList);
	}

	// GET catalog/System/UserInteraction/{userInteractionId}
	public UserInteractionModel getUserInteraction(String userInteractionId) {
		Validate.notEmpty(userInteractionId, "userInteractionId cannot be null");
		InventoryItem inventoryItem = getRestObjectAppendingToRoot("catalog/System/UserInteraction/"
				+ userInteractionId, InventoryItem.class);
		return new UserInteractionModel(inventoryItem);
	}

	// POST /workflows/{workflowId}/executions/{executionId}/
	public void answerUserInteraction(String workflowId, String executionId, List<PresentationParameter> params) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		Validate.notEmpty(executionId, "executionId cannot be null");

		ExecutionContext executionContext = mapParameters(params);
		URI uri = getSession().appendToRoot(
				WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION + "/" + executionId + "/interaction");
		getSession().getRestTemplate().postForObject(uri, executionContext, Void.class);
	}

	public void cancelWorkflowExecution(String workflowId, String executionId) {
		Validate.notEmpty(workflowId, "workflowExecution cannot be null");
		Validate.notEmpty(executionId, "executionId cannot be null");

		getSession().getRestTemplate().delete(
				getSession().appendToRoot(
						WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION + "/" + executionId + "/state"));
	}

	public WorkflowExecutionModel rerunWorklfowExecution(String workflowId, String executionId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		Validate.notEmpty(executionId, "executionId cannot be null");

		WorkflowExecution workflowExecution = getRestObjectAppendingToRoot(WORKFLOW_PART_URL + workflowId + "/"
				+ WORKFLOW_EXECUTION + "/" + executionId, WorkflowExecution.class);
		if (workflowExecution == null) {
			throw new RuntimeException("Workflow Execution with id: " + executionId + " for workflow id: " + workflowId
					+ " is not found or has been deleted!");
		}

		InputParameters inputParameters = workflowExecution.getInputParameters();

		WorkflowExecutionModel newExecution = null;
		if (inputParameters == null) {
			newExecution = startWorkflow(workflowId);
		} else {
			newExecution = startWorkflow(workflowId, inputParameters.getParameter());
		}

		return newExecution;
	}

	public ResponseEntity<BufferedImage> getWorkflowIcon(String workflowId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		String href = getSession().appendToRoot(WORKFLOW_PART_URL + workflowId + WORKFLOW_ICON_URL_PART).toASCIIString();
		ResponseEntity<BufferedImage> data = getSession().getRestTemplate().getForEntity(href, BufferedImage.class,
				(Map<?, ?>) null);
		
		return data;
	}

}
