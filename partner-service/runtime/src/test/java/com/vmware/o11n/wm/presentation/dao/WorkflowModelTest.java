package com.vmware.o11n.wm.presentation.dao;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.wm.common.BaseParameter;

public class WorkflowModelTest {
	private WorkflowModel workflowModel;
	private Workflow workflow = new Workflow();

	@Before
	public void setUp() throws Exception {
		workflow.setId("Id");
		workflow.setName("Name");
		workflow.setDescription("description");
		workflow.setHref("http://someip/api/workflows/a1423fasaf");
		workflow.setCustomizedIcon(true);
	}

	@Test
	public void testWorkflowModelShouldMapWorkflowProperties() {
		workflowModel = new WorkflowModel(workflow);

		assertEquals(workflow.getId(), workflowModel.getId());
		assertEquals(workflow.getName(), workflowModel.getName());
		assertEquals(workflow.getDescription(), workflowModel.getDescription());
		assertEquals(workflow.getHref(), workflowModel.getHref());
		assertEquals(workflow.isCustomizedIcon(), workflowModel.getCustomizedIconExists());
		assertEquals(workflow.getHref() + "icon/", workflowModel.getIconHref());
	}
	
	@Test
	public void testWorkflowModelShouldReplaceNewLinesWithHtmlBreakLines() {
		workflow.setDescription("description\n that has new\n lines\n");
		
		workflowModel = new WorkflowModel(workflow);
		
		assertEquals("description<br/> that has new<br/> lines<br/>", workflowModel.getDescription());
	}


	@Test
	public void testShouldMapInputAndOutputParameters() {
		workflow.setInputParameters(new Workflow.InputParameters());
		List<Parameter> inputParams = workflow.getInputParameters().getParameter();
		addParams(inputParams);

		workflowModel = new WorkflowModel(workflow);

		assertEquals(inputParams.size(), workflowModel.getInputParameters().size());
		testParamValues(inputParams, workflowModel.getInputParameters());
	}

	@Test
	public void testShouldMapOuputParameters() {
		workflow.setOutputParameters(new Workflow.OutputParameters());
		List<Parameter> outputParams = workflow.getOutputParameters().getParameter();
		addParams(outputParams);

		workflowModel = new WorkflowModel(workflow);

		assertEquals(outputParams.size(), workflowModel.getOutputParameters().size());
		testParamValues(outputParams, workflowModel.getOutputParameters());
	}
	
	@Test
	public void testShouldMapAttributesToWorkflowModeL() {
		List<Attribute> attributes = new ArrayList<Attribute>();

		Attribute attrId = new Attribute();
		attrId.setName("id");
		attrId.setValue("ff80808139c275bc013a6d8da1c6076b");
		attributes.add(attrId);
		
		Attribute attrName = new Attribute();
		attrName.setName("name");
		attrName.setValue("workflow name");
		attributes.add(attrName);
		
		Attribute attrDesc = new Attribute();
		attrDesc.setName("description");
		attrDesc.setValue("workflow description");
		attributes.add(attrDesc);
		
		Attribute attrCategoryName = new Attribute();
		attrCategoryName.setName("categoryName");
		attrCategoryName.setValue("workflow Category Name");
		attributes.add(attrCategoryName);
		
		Attribute attrCategoryHref = new Attribute();
		attrCategoryHref.setName("categoryHref");
		attrCategoryHref.setValue("https://10.23.34.109:8281/api/catalog/System/WorkflowCategory/ff80808139c5fa810139c5faaab10009/");
		attributes.add(attrCategoryHref);
		
		Attribute attrCanExecute = new Attribute();
		attrCanExecute.setName("canExecute");
		attrCanExecute.setValue("true");
		attributes.add(attrCanExecute);
		
		Attribute attrCanEdit = new Attribute();
		attrCanEdit.setName("canEdit");
		attrCanEdit.setValue("false");
		attributes.add(attrCanEdit);
		
		workflowModel = new WorkflowModel(attributes);
		
		assertEquals(attrId.getValue(), workflowModel.getId());
		assertEquals(attrName.getValue(), workflowModel.getName());
		assertEquals(attrDesc.getValue(), workflowModel.getDescription());
		assertEquals(attrCategoryName.getValue(), workflowModel.getCategoryName());
		assertEquals("ff80808139c5fa810139c5faaab10009", workflowModel.getCategoryId());
		assertTrue(workflowModel.getCanExecute());
		assertFalse(workflowModel.getCanEdit());
	}

	private void testParamValues(List<Parameter> fromParams, List<BaseParameter> toParams) {
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
