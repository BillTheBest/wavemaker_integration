package com.vmware.o11n.wm.presentation.dao;

import static com.vmware.o11n.wm.StubObjectFactory.getXMLDate;
import static com.vmware.o11n.wm.StubObjectFactory.getDateFromXmlDateString;
import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;
import com.vmware.o11n.wm.common.BaseParameter;
import com.vmware.o11n.wm.common.ExecutionParameter;

public class WorkflowExecutionModelTest {
	private WorkflowExecutionModel executionModel;
	private WorkflowExecution execution = new WorkflowExecution();

	@Test
	public void testWorkflowExecutionModelShouldMapPropertiesFromLinkAttributes() {
		List<Attribute> attributes = new ArrayList<Attribute>();

		Attribute attrId = new Attribute();
		attrId.setName("id");
		attrId.setValue("ff80808139c275bc013a6d8da1c6076b");
		attributes.add(attrId);

		Attribute attrState = new Attribute();
		attrState.setName("state");
		attrState.setValue("completed");
		attributes.add(attrState);

		Attribute attrStartDate = new Attribute();
		attrStartDate.setName("startDate");
		attrStartDate.setValue("2012-10-17T07:08:49.475Z");
		attributes.add(attrStartDate);

		Attribute attrEndDate = new Attribute();
		attrEndDate.setName("endDate");
		attrEndDate.setValue("2012-10-17T07:08:49.580Z");
		attributes.add(attrEndDate);

		Attribute attrBusinessState = new Attribute();
		attrBusinessState.setName("businessState");
		attrBusinessState.setValue("Some Business State");
		attributes.add(attrBusinessState);

		Attribute attrStartedBy = new Attribute();
		attrStartedBy.setName("startedBy");
		attrStartedBy.setValue("root@localos");
		attributes.add(attrStartedBy);

		Attribute attrName = new Attribute();
		attrName.setName("name");
		attrName.setValue("Display all locks");
		attributes.add(attrName);
		
		Attribute attrType = new Attribute();
		attrType.setName("type");
		attrType.setValue("WorkflowToken");
		attributes.add(attrType);

		executionModel = new WorkflowExecutionModel(attributes);

		assertEquals(attrId.getValue(), executionModel.getId());
		assertEquals(attrState.getValue().toUpperCase(), executionModel.getState());
		assertEquals(getDateFromXmlDateString(attrStartDate.getValue()), executionModel.getStartDate());
		assertEquals(getDateFromXmlDateString(attrEndDate.getValue()), executionModel.getEndDate());
		assertEquals(attrBusinessState.getValue(), executionModel.getBusinessState());
		assertEquals(attrStartedBy.getValue(), executionModel.getStartedBy());
		assertEquals(attrName.getValue(), executionModel.getName());
		assertEquals(attrType.getValue(), executionModel.getType());
	}

	@Test
	public void testWorkflowExecutionModelShouldMapPropertiesFromWorkflowExecution() {
		execution.setHref("http://someurl/");
		execution.setId("someId");
		execution.setState(WorkflowExecutionState.COMPLETED);
		execution.setStartDate(getXMLDate(new Date()));
		execution.setEndDate(getXMLDate(new Date()));
		execution.setBusinessState("Some business state");
		execution.setStartedBy("some user");
		execution.setName("Workflow Name");
		execution.setContentException("Exception content");

		executionModel = new WorkflowExecutionModel(execution);

		assertEquals(execution.getHref(), executionModel.getHref());
		assertEquals(execution.getId(), executionModel.getId());
		assertEquals(execution.getState().value().toUpperCase(), executionModel.getState());
		assertEquals(execution.getStartDate().toGregorianCalendar().getTime(), executionModel.getStartDate());
		assertEquals(execution.getEndDate().toGregorianCalendar().getTime(), executionModel.getEndDate());
		assertEquals(execution.getBusinessState(), executionModel.getBusinessState());
		assertEquals(execution.getStartedBy(), executionModel.getStartedBy());
		assertEquals(execution.getName(), executionModel.getName());
		assertEquals(execution.getContentException(), executionModel.getContentException());
	}

	@Test
	public void testShouldMapInputAndOutputParameters() {
		execution.setInputParameters(new WorkflowExecution.InputParameters());
		List<Parameter> inputParams = execution.getInputParameters().getParameter();
		addParams(inputParams);

		executionModel = new WorkflowExecutionModel(execution);

		assertEquals(inputParams.size(), executionModel.getInputParameters().size());
		testParamValues(inputParams, executionModel.getInputParameters());
	}

	@Test
	public void testShouldMapOuputParameters() {
		execution.setOutputParameters(new WorkflowExecution.OutputParameters());
		List<Parameter> outputParams = execution.getOutputParameters().getParameter();
		addParams(outputParams);

		executionModel = new WorkflowExecutionModel(execution);

		assertEquals(outputParams.size(), executionModel.getOutputParameters().size());
		testParamValues(outputParams, executionModel.getOutputParameters());
	}

	private void testParamValues(List<Parameter> fromParams, List<ExecutionParameter> toParams) {
		for (int i = 0; i < fromParams.size(); i++) {
			Parameter parameter = fromParams.get(i);
			BaseParameter baseParam = toParams.get(i);
			assertEquals(parameter.getName(), baseParam.getName());
			assertEquals(parameter.getType(), baseParam.getType());
			assertEquals(parameter.getDescription(), baseParam.getDescription());
		}
	}

	private void addParams(List<Parameter> parameters) {
		Parameter param1 = new Parameter();
		param1.setName("param1");
		param1.setType("type1");
		param1.setDescription("description1");

		parameters.add(param1);

		Parameter param2 = new Parameter();
		param2.setName("param2");
		param2.setType("type2");
		param2.setDescription("description2");

		parameters.add(param2);
	}

}
