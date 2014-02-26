package com.vmware.o11n.wm.services;

import static com.vmware.o11n.wm.StubObjectFactory.getVcoCacheManager;
import static com.vmware.o11n.wm.StubObjectFactory.getVcoConnectionService;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.services.ExecutionService;
import com.vmware.o11n.sdk.rest.client.services.WorkflowService;
import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.LogEntry;
import com.vmware.o11n.sdk.rest.client.stubs.LogsList;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecutionsList;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.common.QuerySpec;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowRunEvent;

public class VcoWorkflowServiceTest {
	private VcoWorkflowService workflowService;
	private WorkflowService sdkWorkflowService = mock(WorkflowService.class); 
	private ExecutionService sdkExecutionService = mock(ExecutionService.class);
	private Workflow workflow;
	private WorkflowExecution workflowExecution;
	private Object mockObjectToBeReturned; 
	
	@Before
	public void setup() throws Exception {
		workflowService = new VcoWorkflowServiceUnderTest(getVcoConnectionService(), getVcoCacheManager());
		workflow = new Workflow();
		workflow.setId("workflowId");
	}

	@Test
	public void testGetWorkflow() {
		when(sdkWorkflowService.getWorkflow(workflow.getId())).thenReturn(workflow);
		
		WorkflowModel workflowModel = workflowService.getWorkflow(workflow.getId());
		
		assertEquals(workflow.getId(), workflowModel.getId());
	}
	
	
	@Test
	public void testStartWorkflow() {
		workflowExecution = new WorkflowExecution();
		when(sdkExecutionService.execute(workflow, null)).thenReturn(workflowExecution);
		
		workflowService.startWorkflow(workflow.getId());
	}
	
	@Test
	public void testGetWorkflowExecutions() {
		List<WorkflowExecutionModel> workflowExecutions = null;
		
		mockObjectToBeReturned = null;
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		mockObjectToBeReturned = new PresentationExecutionsList();
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		Relations relations = new Relations();
		((PresentationExecutionsList)mockObjectToBeReturned).setRelations(relations);
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		
		relations.getLink().add(null);
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		Link link = new Link();
		relations.getLink().add(link);
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		Link.Attributes attributes = new Link.Attributes();
		link.setAttributes(attributes);
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(0, workflowExecutions.size());
		
		Attribute attribute1 = new Attribute();
		attributes.getAttribute().add(attribute1);
		workflowExecutions = workflowService.getExecutionsForWorkflow(workflow.getId());
		assertEquals(1, workflowExecutions.size());
	}
	
	@Test
	public void testGetWorkflows() {
		PaginatedWorkflows paginatedWorkflows = null;
		QuerySpec spec = new QuerySpec();
		spec.setKeys("test");
		mockObjectToBeReturned = null;
		paginatedWorkflows = workflowService.getWorkflows(spec);
		assertEquals(0, paginatedWorkflows.getList().size());
		
		mockObjectToBeReturned = new InventoryItemsList();
		paginatedWorkflows = workflowService.getWorkflows(spec);
		assertEquals(0, paginatedWorkflows.getList().size());
		
		Link link = new Link();
		((InventoryItemsList)mockObjectToBeReturned).getLink().add(link);
		paginatedWorkflows = workflowService.getWorkflows(spec);
		assertEquals(0, paginatedWorkflows.getList().size());
		
		Link.Attributes attributes = new Link.Attributes();
		link.setAttributes(attributes);
		paginatedWorkflows = workflowService.getWorkflows(spec);
		assertEquals(0, paginatedWorkflows.getList().size());
		
		Attribute attribute1 = new Attribute();
		attributes.getAttribute().add(attribute1);
		paginatedWorkflows = workflowService.getWorkflows(spec);
		assertEquals(1, paginatedWorkflows.getList().size());
		
		int start = 7;
		((InventoryItemsList)mockObjectToBeReturned).setStart(start);
		int total = 24;
		((InventoryItemsList)mockObjectToBeReturned).setTotal(total);
		
		paginatedWorkflows = workflowService.getWorkflows(spec);
		
		assertEquals(start, paginatedWorkflows.getStart());
		assertEquals(total, paginatedWorkflows.getTotal());
	}
	
	@Test
	public void testGetWorkflowRunEvents() {
		LogsList logsList = new LogsList();
		logsList.getEntry().add(new LogEntry());
		logsList.getEntry().add(new LogEntry());
		logsList.getEntry().get(1).setShortDescription("Some desc");
		
		mockObjectToBeReturned = logsList;
		
		List<WorkflowRunEvent> runEvents = workflowService.getWorkflowRunEvents("workflowId", "executionId");
		
		assertEquals(2, runEvents.size());
		assertEquals(logsList.getEntry().get(1).getShortDescription(), runEvents.get(1).getDisplayName());
	}
	
	@Test
	public void testGetWorkflowIdBasedOnExecutionId() {
		String executionId = "ff80808139f9be680139fad23b4b00f5";
		String workflowId;
		
		mockObjectToBeReturned = null;
		workflowId = workflowService.getWorkflowIdForExecutionId(executionId);
		assertNull(workflowId);
		
		InventoryItem inventoryItem = new InventoryItem();
		mockObjectToBeReturned = inventoryItem;
		workflowId = workflowService.getWorkflowIdForExecutionId(executionId);
		assertNull(workflowId);
		
		Relations relations = new Relations();
		inventoryItem.setRelations(relations);
		workflowId = workflowService.getWorkflowIdForExecutionId(executionId);
		assertNull(workflowId);
		
		
		String expectedWorkflowId = "8F8080808080808080808080808080808080808001299080088268176866967b3";
		Link link = new Link();
		link.setHref("https://10.23.34.109:8281/api/workflows/"+expectedWorkflowId+ "/executions/" +executionId +"/");
		relations.getLink().add(link);
		
		workflowId = workflowService.getWorkflowIdForExecutionId(executionId);
		assertEquals(expectedWorkflowId, workflowId);
	}
	
	
	private class VcoWorkflowServiceUnderTest extends VcoWorkflowService {
		
		public VcoWorkflowServiceUnderTest(VcoConnectionService connectionService, VcoCacheManager cacheManager) throws IOException {
			super(connectionService, cacheManager);
		}
		
		@Override
		protected WorkflowService getWorkflowService() {
			return sdkWorkflowService;
		}
		
		@Override
		protected ExecutionService getExecutionService() {
			return sdkExecutionService;
		}
		
		@Override
		protected Workflow createWorkflowLink(String workflowId, String linkName) {
			return workflow;
		}
		
		@SuppressWarnings("unchecked")
		@Override
		protected <T> T getRestObjectAppendingToRoot(String path, Class<? extends T> type) {
			return  (T) mockObjectToBeReturned;
		}
	}
}
