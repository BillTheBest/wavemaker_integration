package com.vmware.o11n.wm.mapper;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.AbstractPresentationContent.Steps;
import com.vmware.o11n.sdk.rest.client.stubs.Group;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution;
import com.vmware.o11n.sdk.rest.client.stubs.PrimaryField;
import com.vmware.o11n.sdk.rest.client.stubs.Step;
import com.vmware.o11n.wm.presentation.dao.FieldModel;
import com.vmware.o11n.wm.presentation.dao.GroupModel;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;
import com.vmware.o11n.wm.presentation.dao.StepModel;

public class PresentationModelMapperTest {
	private PresentationExecution presentationExecution = new PresentationExecution();
	private PresentationModel model;
	
	
	@Test
	public void testShouldOutputParamToFields() {
		PresentationExecution.OutputParameters outputParameters = new PresentationExecution.OutputParameters();
		Parameter param = new Parameter();
		param.setBoolean(true);
		param.setType("boolean");
		param.setName("someName");
		outputParameters.getParameter().add(param);
		presentationExecution.setOutputParameters(outputParameters);
		
		Steps steps = new Steps();
		Step step = new Step();
		PrimaryField field = new PrimaryField();
		field.setType("boolean");
		field.setId("someName");
		
		Group group = new Group();
		group.setFields(new Group.Fields());
		group.getFields().getField().add(field);
		step.getGroupOrField().add(group);
		steps.getStep().add(step);
		
		presentationExecution.setSteps(steps);
		
		model = new PresentationModelMapper(presentationExecution).getPresentationModel();
		
		StepModel stepModel = model.getSteps().get(0);
		GroupModel groupModel = stepModel.getGroups().get(0);
		FieldModel fieldModel = groupModel.getFields().get(0);
		
		assertEquals(field.getId(), fieldModel.getId());
	    assertEquals(field.getType(), fieldModel.getType());
	    assertEquals(param.isBoolean(), fieldModel.getValue());
	}
	
	
}
