package com.vmware.o11n.wm.integration;

import static com.vmware.o11n.wm.StubConstants.CREATE_TASK_WORKFLOW_ID;
import static com.vmware.o11n.wm.WorkflowNameForTesting.Longer_10sec_Running;
import static com.vmware.o11n.wm.WorkflowNameForTesting.Simple_Workflow;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.services.Condition;
import com.vmware.o11n.sdk.rest.client.services.Order;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;
import com.vmware.o11n.wm.common.BaseParameter;
import com.vmware.o11n.wm.common.PaginatedWorkflowExecutions;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.common.QuerySpec;
import com.vmware.o11n.wm.presentation.dao.ExecutionStateModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowRunEvent;

public class VcoWorkflowServiceIT extends BaseTestIntegration {

	@Test
	public void shouldRetriveValidWorkflowWhenGetWorkflow() {
		WorkflowModel workflowModel = vcoWorkflowService.getWorkflow(CREATE_TASK_WORKFLOW_ID);

		assertNotNull(workflowModel);
		assertEquals(CREATE_TASK_WORKFLOW_ID, workflowModel.getId());
		assertEquals("Create task", workflowModel.getName());
		assertEquals("Schedules a workflow to run at a later time and date, as a task.", workflowModel.getDescription());
		assertNotNull(workflowModel.getHref());
		assertFalse(workflowModel.getCustomizedIconExists());
		assertEquals(workflowModel.getHref() + "icon/", workflowModel.getIconHref());

		assertEquals(3, workflowModel.getInputParameters().size());

		BaseParameter inParam = workflowModel.getInputParameters().get(0);
		assertEquals("workflowId", inParam.getName());
		assertEquals("string", inParam.getType());
		assertEquals("ID of the workflow to run", inParam.getDescription());

		assertEquals(1, workflowModel.getOutputParameters().size());

		BaseParameter outParam = workflowModel.getOutputParameters().get(0);
		assertEquals("newTask", outParam.getName());
		assertEquals("Task", outParam.getType());
		assertEquals("The task that this workflow creates", outParam.getDescription());
	}

	@Test
	public void shouldExecuteAWorkflowAWorkflow() throws Exception {
		WorkflowExecutionModel workflowExecution = vcoWorkflowService.startWorkflow(Simple_Workflow.getWorkflowId());
		assertNotNull(workflowExecution);
		assertNotNull(workflowExecution.getId());
		assertNotNull(workflowExecution.getStartDate());
		assertNotNull(workflowExecution.getState());
		assertNotNull(workflowExecution.getStartedBy());
		assertEquals(Simple_Workflow.getWorkflowName(), workflowExecution.getName());

		waitForExecutionToComplete(workflowExecution.getId(), Simple_Workflow.getWorkflowId());
		
		
		String workflowId = vcoWorkflowService.getWorkflowIdForExecutionId(workflowExecution.getId());
		assertEquals(Simple_Workflow.getWorkflowId(), workflowId);
		
		ExecutionStateModel executionState = vcoWorkflowService.getExecutionState(workflowId, workflowExecution.getId());
		assertEquals(WorkflowExecutionState.COMPLETED.value().toUpperCase(), executionState.state);
		assertEquals(workflowId, executionState.workflowId);
		assertEquals(workflowExecution.getId(), executionState.executionId);
		
		deleteExecution(workflowExecution, Simple_Workflow.getWorkflowId());
	}

	@Test
	public void shouldRetrieveExecutions() {
		WorkflowExecutionModel workflowExecution = vcoWorkflowService.startWorkflow(Simple_Workflow.getWorkflowId());
		waitForExecutionToComplete(workflowExecution.getId(), Simple_Workflow.getWorkflowId());

		List<WorkflowExecutionModel> workflowExecutions = vcoWorkflowService.getExecutionsForWorkflow(Simple_Workflow
				.getWorkflowId());
		assertTrue(workflowExecutions.size() > 0);

		workflowExecution = vcoWorkflowService.getWorkflowExecution(Simple_Workflow.getWorkflowId(), workflowExecutions
				.get(0).getId());
		assertNotNull(workflowExecution);
		assertNotNull(workflowExecution.getId());
		assertNotNull(workflowExecution.getStartDate());
		assertNotNull(workflowExecution.getEndDate());
		assertEquals(WorkflowExecutionState.COMPLETED.value().toUpperCase(), workflowExecution.getState());
		assertEquals("root@localos", workflowExecution.getStartedBy());
		assertEquals(Simple_Workflow.getWorkflowName(), workflowExecution.getName());
	}

	@Test
	public void shouldRetrieveAllWorkflowExecutions() {
		QuerySpec querySpec = new QuerySpec();
		querySpec.addCondition(Condition.contain("name", "Display all locks"));
		querySpec.addSortOrder(Order.descendingBy("startDate"));
		PaginatedWorkflowExecutions workflowExecutions = vcoWorkflowService.getWorkflowExecutions(querySpec);
		assertTrue(workflowExecutions.getList().size() > 0);
	}

	@Test
	public void shouldRetrieveWorkflowRunEvents() throws Exception {
		WorkflowExecutionModel workflowExecution = vcoWorkflowService.startWorkflow(Simple_Workflow.getWorkflowId());
		assertNotNull(workflowExecution.getId());
		waitForExecutionToComplete(workflowExecution.getId(), Simple_Workflow.getWorkflowId());

		List<WorkflowRunEvent> runEvents = vcoWorkflowService.getWorkflowRunEvents(Simple_Workflow.getWorkflowId(),
				workflowExecution.getId());
		assertTrue(runEvents.size() > 0);

		deleteExecution(workflowExecution, Simple_Workflow.getWorkflowId());
	}

	@Test
	public void shouldRetrieveWorkflows() throws Exception {
		QuerySpec querySpec = new QuerySpec();
		querySpec.setMaxResult(10);
		querySpec.setStartIndex(10);
		PaginatedWorkflows paginatedWorkflows = vcoWorkflowService.getWorkflows(querySpec);
		assertNotNull(paginatedWorkflows);
		assertTrue(paginatedWorkflows.getTotal() > 10);
		assertEquals(10, paginatedWorkflows.getList().size());
		assertEquals(10, paginatedWorkflows.getStart());
	}

	@Test
	public void testShouldCancelAndRestartWorkflow() {
		WorkflowExecutionModel workflowExecution = vcoWorkflowService.startWorkflow(Longer_10sec_Running
				.getWorkflowId());
		assertNotNull(workflowExecution.getId());
		waitForExecutionToComplete(workflowExecution.getId(), Longer_10sec_Running.getWorkflowId(),
				WorkflowExecutionState.RUNNING);

		vcoWorkflowService.cancelWorkflowExecution(Longer_10sec_Running.getWorkflowId(), workflowExecution.getId());
		waitForExecutionToComplete(workflowExecution.getId(), Longer_10sec_Running.getWorkflowId(), WorkflowExecutionState.CANCELED);

		WorkflowExecutionModel restartedExecution = vcoWorkflowService.rerunWorklfowExecution(
				Longer_10sec_Running.getWorkflowId(), workflowExecution.getId());

		waitForExecutionToComplete(restartedExecution.getId(), Longer_10sec_Running.getWorkflowId(),
				WorkflowExecutionState.RUNNING);
		vcoWorkflowService.cancelWorkflowExecution(Longer_10sec_Running.getWorkflowId(), restartedExecution.getId());
		waitForExecutionToComplete(restartedExecution.getId(), Longer_10sec_Running.getWorkflowId(), WorkflowExecutionState.CANCELED);
		deleteExecution(restartedExecution, Longer_10sec_Running.getWorkflowId());
	}
}
