package com.vmware.o11n.wm.presentation.dao;

import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;

public class ExecutionStateModel {
	public final String executionId;
	public final String workflowId;
	public final String state;
	
	public ExecutionStateModel(String executionId, String workflowId, WorkflowExecutionState state) {
		this.executionId = executionId;
		this.workflowId = workflowId;
		this.state = state == null ? null : state.value().toUpperCase();
	}

	public String getExecutionId() {
		return executionId;
	}

	public String getWorkflowId() {
		return workflowId;
	}

	public String getState() {
		return state;
	}
}
