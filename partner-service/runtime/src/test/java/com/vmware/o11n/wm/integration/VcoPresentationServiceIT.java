package com.vmware.o11n.wm.integration;

import static com.vmware.o11n.wm.WorkflowNameForTesting.Simple_Presentation;
import static com.vmware.o11n.wm.WorkflowNameForTesting.Simple_User_Interaction;
import static com.vmware.o11n.wm.common.BaseParameter.BOOLEAN_TYPE;
import static com.vmware.o11n.wm.common.BaseParameter.NUMBER_TYPE;
import static com.vmware.o11n.wm.common.BaseParameter.PATH_TYPE;
import static com.vmware.o11n.wm.common.BaseParameter.STRING_TYPE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecutionState;
import com.vmware.o11n.wm.common.PaginatedUserInteractions;
import com.vmware.o11n.wm.common.PresentationParameter;
import com.vmware.o11n.wm.presentation.dao.FieldModel;
import com.vmware.o11n.wm.presentation.dao.GroupModel;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;
import com.vmware.o11n.wm.presentation.dao.StepModel;
import com.vmware.o11n.wm.presentation.dao.UserInteractionModel;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;
import com.vmware.o11n.wm.services.VcoPresentationService;

public class VcoPresentationServiceIT extends BaseTestIntegration {
	@Autowired
	VcoPresentationService vcoPresentationService;

	@Test
	public void shouldRetrivePresentation() {
		PresentationModel presentation = vcoPresentationService.getPresentation(Simple_Presentation.getWorkflowId());
		verifySimplePresentation(presentation);
	}

	@Test
	public void testPresentationInstanceLifeCycle() {
		PresentationModel presentation = vcoPresentationService.createPresentationInstance(
				Simple_Presentation.getWorkflowId(), null);
		verifySimplePresentation(presentation);

		presentation = vcoPresentationService.getPresentationInstance(Simple_Presentation.getWorkflowId(),
				presentation.getId());
		verifySimplePresentation(presentation);

		List<PresentationParameter> params = new ArrayList<PresentationParameter>();
		params.add(createParam("name", STRING_TYPE, "String Value"));
		params.add(createParam("booleanCheck", BOOLEAN_TYPE, "true"));
		params.add(createParam("number", NUMBER_TYPE, new Double(34.0)));
		params.add(createParam("path", PATH_TYPE, "/Path/"));
		params.add(createParam("mandatory", STRING_TYPE, "Manadatory String Value"));
		// params.add(createParam("enumsRam",SDK_OBJECT, "512"));

		presentation = vcoPresentationService.updatePresentationInstance(Simple_Presentation.getWorkflowId(),
				presentation.getId(), params);
		boolean isValid = true;
		verifySimplePresentation(presentation, isValid);
		verifySimplePresentationParameterValues(presentation);

		presentation = vcoPresentationService.runWorkflowPresentation(Simple_Presentation.getWorkflowId(), presentation.getId(), params);
		assertEquals(isValid, presentation.getValid());
		
		waitForExecutionToComplete(presentation.getAssociatedExecutionId(), Simple_Presentation.getWorkflowId(), WorkflowExecutionState.COMPLETED);
		WorkflowExecutionModel execution = vcoWorkflowService.getWorkflowExecution(Simple_Presentation.getWorkflowId(), presentation.getAssociatedExecutionId());
		assertEquals(WorkflowExecutionState.COMPLETED.toString(), execution.getState());

		
		vcoPresentationService.deletePresentationInstance(Simple_Presentation.getWorkflowId(), presentation.getId());
		try {
			vcoPresentationService.getPresentationInstance(
					Simple_User_Interaction.getWorkflowId(), presentation.getId());
			fail("Presentation Instance should've been deleted!");
		} catch (HttpClientErrorException e) {
			assertEquals(HttpStatus.NOT_FOUND, e.getStatusCode());
		}
		deleteExecution(execution, Simple_Presentation.getWorkflowId());
	}

	@Test
	public void shouldRetriveUserInteractionPresentation() {
		WorkflowExecutionModel execution = vcoWorkflowService.startWorkflow(Simple_User_Interaction.getWorkflowId());
		waitForExecutionToComplete(execution.getId(), Simple_User_Interaction.getWorkflowId(), WorkflowExecutionState.WAITING);

		PresentationModel presentation = vcoPresentationService.getUserInteractionPresentation(
				Simple_User_Interaction.getWorkflowId(), execution.getId());

		assertNotNull(presentation);
		assertFalse(presentation.getValid());

		List<StepModel> steps = presentation.getSteps();
		assertEquals(1, steps.size());
		StepModel stepModel = steps.get(0);
		GroupModel groupModel = stepModel.getGroups().get(0);
		FieldModel fieldModel = groupModel.getFields().get(0);
		assertEquals("Should I continue?", fieldModel.getDisplayName());
		assertEquals("decision", fieldModel.getId());
		assertEquals("boolean", fieldModel.getType());

		vcoWorkflowService.cancelWorkflowExecution(Simple_User_Interaction.getWorkflowId(), execution.getId());
		waitForExecutionToComplete(execution.getId(), Simple_User_Interaction.getWorkflowId(), WorkflowExecutionState.CANCELED);
		deleteExecution(execution, Simple_User_Interaction.getWorkflowId());
	}

	@Test
	public void shouldCreateUserUpdateAndRetriveInteractionPresentationInstance() {
		//create User Interaction
		WorkflowExecutionModel execution = vcoWorkflowService.startWorkflow(Simple_User_Interaction.getWorkflowId());
		waitForExecutionToComplete(execution.getId(), Simple_User_Interaction.getWorkflowId(), WorkflowExecutionState.WAITING);
		
		PaginatedUserInteractions paginatedInteractions = vcoWorkflowService.getUserInteractions(null);
		assertTrue(paginatedInteractions.getTotal() > 0);
		assertFalse(paginatedInteractions.getList().isEmpty());
		UserInteractionModel userInteraction = paginatedInteractions.getList().get(0);
		assertNotNull(userInteraction.getCreateDate());
		assertEquals(Simple_User_Interaction.getWorkflowName() + " : User interaction",
				userInteraction.getName());
		
		userInteraction = vcoWorkflowService.getUserInteraction(userInteraction.getId());
		
		assertEquals(Simple_User_Interaction.getWorkflowId(), userInteraction.getWorkflowId());
		
        //create User Interaction Presentation
		PresentationModel presentationInstance = vcoPresentationService.createUserInteractionPresentationInstance(
				Simple_User_Interaction.getWorkflowId(), execution.getId(), null);

		assertNotNull(presentationInstance);
		FieldModel field = presentationInstance.getSteps().get(0).getGroups().get(0).getFields().get(0);
		assertNotNull(field);
		assertNull(field.getValue());

		presentationInstance = vcoPresentationService.getUserInteractionPresentationInstance(
				Simple_User_Interaction.getWorkflowId(), execution.getId(), presentationInstance.getId());

		assertNotNull(presentationInstance);
		field = presentationInstance.getSteps().get(0).getGroups().get(0).getFields().get(0);
		assertNotNull(field);
		assertNull(field.getValue());

		List<PresentationParameter> params = new ArrayList<PresentationParameter>();
		PresentationParameter param = new PresentationParameter();
		param.setName("decision");
		param.setType(BOOLEAN_TYPE);
		param.setValue(true);
		params.add(param);

		//update User Interaction Presentation
		presentationInstance = vcoPresentationService.updateUserInteractionPresentationInstance(
				Simple_User_Interaction.getWorkflowId(), execution.getId(), presentationInstance.getId(), params);

		field = presentationInstance.getSteps().get(0).getGroups().get(0).getFields().get(0);
		assertEquals(param.getName(), field.getId());
		assertEquals(param.getType(), field.getType());
		assertEquals(Boolean.TRUE, field.getValue());

		//answer User Interaction Presentation
		PresentationModel presentation = vcoPresentationService.answerUserInteractionPresentation(Simple_User_Interaction.getWorkflowId(), execution.getId(), presentationInstance.getId(), params);
		assertTrue(presentation.getValid());
		
		waitForExecutionToComplete(execution.getId(), Simple_User_Interaction.getWorkflowId(), WorkflowExecutionState.COMPLETED);
		execution = vcoWorkflowService.getWorkflowExecution(Simple_User_Interaction.getWorkflowId(), execution.getId());
		assertEquals(WorkflowExecutionState.COMPLETED.toString(), execution.getState());

		//delete User Interaction Presentation
		vcoPresentationService.deleteUserInteractionPresentationInstance(Simple_User_Interaction.getWorkflowId(),
				execution.getId(), presentationInstance.getId());

		try {
			presentationInstance = vcoPresentationService.getUserInteractionPresentationInstance(
					Simple_User_Interaction.getWorkflowId(), execution.getId(), presentationInstance.getId());
			fail("Presentation Instance should've been deleted!");
		} catch (HttpClientErrorException e) {
			assertEquals(HttpStatus.NOT_FOUND, e.getStatusCode());
		}

		deleteExecution(execution, Simple_User_Interaction.getWorkflowId());
	}

	private void verifySimplePresentation(PresentationModel presentation) {
		verifySimplePresentation(presentation, false);
	}

	private static final Map<String, PresentationParameter> PARAMS = new HashMap<String, PresentationParameter>();

	private void verifySimplePresentationParameterValues(PresentationModel presentation, String... paramNames) {
		List<String> names = Arrays.asList(paramNames);
		List<FieldModel> fields = presentation.getSteps().get(0).getGroups().get(0).getFields();
		for (FieldModel field : fields) {
			if (names.isEmpty() || names.contains(field.getId())) {
				PresentationParameter param = PARAMS.get(field.getId());
				if(param == null)
					continue;
				if(BOOLEAN_TYPE.equals(param.getType())) {
					assertEquals(Boolean.valueOf(param.getValue().toString()), field.getValue());
				}else {
					assertEquals(param.getValue(), field.getValue());
				}
			}
		}
	}

	private PresentationParameter createParam(String name, String type, Object value) {
		PresentationParameter param = new PresentationParameter();
		param.setName(name);
		param.setType(type);
		param.setValue(value);
		PARAMS.put(param.getName(), param);
		return param;
	}

	private void verifySimplePresentation(PresentationModel presentation, boolean isValid) {
		assertNotNull(presentation);
		assertEquals(isValid, presentation.getValid());

		List<StepModel> steps = presentation.getSteps();
		assertEquals(1, steps.size());
		StepModel stepModel = steps.get(0);
		GroupModel groupModel = stepModel.getGroups().get(0);
		List<FieldModel> fields = groupModel.getFields();
		assertEquals(6, fields.size());

		FieldModel nameField = fields.get(0);
		assertEquals("name", nameField.getId());
		assertEquals("This is a name", nameField.getDisplayName());
		assertEquals("string", nameField.getType());
		assertEquals(FieldModel.FieldTypeModel.SIMPLE, nameField.getFieldType());
		assertFalse(nameField.getHidden());

		FieldModel boleanField = fields.get(1);
		assertEquals("booleanCheck", boleanField.getId());
		assertEquals("This is a boolean", boleanField.getDisplayName());
		assertEquals("boolean", boleanField.getType());
		assertEquals(FieldModel.FieldTypeModel.SIMPLE, nameField.getFieldType());
		assertFalse(boleanField.getHidden());

		FieldModel sdkTypeField = fields.get(5);
		assertEquals("enumsRam", sdkTypeField.getId());
		assertEquals("Enums:Ram", sdkTypeField.getDisplayName());
		assertEquals("Enums:RAM", sdkTypeField.getType());
		// FIXME: Enum types are not handled yet!
		// assertEquals(FieldModel.FieldTypeModel.SDK_OBJECT, sdkTypeField.getFieldType());
		assertFalse(sdkTypeField.getHidden());
	}

}
