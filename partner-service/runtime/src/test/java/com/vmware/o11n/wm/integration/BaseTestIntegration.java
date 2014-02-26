package com.vmware.o11n.wm.integration;

import java.io.File;
import java.net.URI;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.services.ExecutionService;
import com.vmware.o11n.sdk.rest.client.services.PackageService;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;
import com.vmware.o11n.wm.services.VcoConnectionService;
import com.vmware.o11n.wm.services.VcoWorkflowService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:vco-runtime-beans.xml", "classpath:vco-runtime-beans-test.xml" })
public class BaseTestIntegration {
	private static boolean packageExported = true;
	
	@Autowired
	protected VcoConnectionService vcoConnectionService;
	
	@Autowired
	protected VcoWorkflowService vcoWorkflowService;
	
	@Before
	public void initializeTestWorkflows() throws Exception {
		if (packageExported)
			return;

		PackageService packageService = new PackageService(vcoConnectionService.getSession());
		String packagePath = new File(".").getCanonicalPath() + "/src/test/resources/com.vmware.vco.wave.package";
		File packageFile = new File(packagePath);
		packageService.importPackage(packageFile, false);
		packageExported = true;
	}
	
	@Test
	public void emtpy() {/* not to fail in the IDE tests */
	}

	protected void deleteExecution(WorkflowExecutionModel workflowExecution, String workflowId) {
		VcoSession session = vcoConnectionService.getSession();
		URI uri = session.appendToRoot("/workflows/" + workflowId + "/executions/" + workflowExecution.getId());
		session.getRestTemplate().delete(uri.toString());
	}

	protected void waitForExecutionToComplete(String executionId, String workflowId,
			WorkflowExecutionState... moreStates) {
		ExecutionService executionService = new ExecutionService(vcoConnectionService.getSession());
		WorkflowExecution sdkExecution = new WorkflowExecution();
		sdkExecution.setState(WorkflowExecutionState.WAITING_SIGNAL);
		Relations relations = new Relations();
		sdkExecution.setRelations(relations);
		Link link = new Link();
		link.setRel("state");
		String executionUrl = vcoConnectionService.getSession()
				.appendToRoot("workflows/" + workflowId + "/executions/" + executionId).toString();
		sdkExecution.setHref(executionUrl);
		link.setHref(executionUrl + "/state");
		relations.getLink().add(link);
		WorkflowExecutionState[] newStates = new WorkflowExecutionState[moreStates.length + 1];
		System.arraycopy(moreStates, 0, newStates, 0, moreStates.length);
		newStates[moreStates.length] = WorkflowExecutionState.FAILED;

		try {
			executionService.awaitState(sdkExecution, 3000, 5, WorkflowExecutionState.COMPLETED, newStates);
		} catch (Exception e) {
			System.out.println("waitForExecutionToComplete: " + e);
		}
	}
}
