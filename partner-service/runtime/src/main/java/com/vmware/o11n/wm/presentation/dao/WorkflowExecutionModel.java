package com.vmware.o11n.wm.presentation.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.wm.common.ExecutionParameter;
import com.vmware.o11n.wm.common.ExecutionParameterType;

public class WorkflowExecutionModel extends BaseModel {
	private final static String USER_INTERACTION_TYPE = "WorkflowInput";
	private String id;
	private String state;
	private Date startDate;
	private Date endDate;
	private String businessState;
	private String startedBy;
	private String name;
	private String type;

	private String contentException;
	private List<ExecutionParameter> inputParameters = Collections.emptyList();
	private List<ExecutionParameter> outputParameters = Collections.emptyList();

	public WorkflowExecutionModel() {
	}
	
	public WorkflowExecutionModel(List<Attribute> attributes) {
		Map<String, String> attrs = convertAttributesToMap(attributes);
		this.id = attrs.get("id");
		this.state = attrs.get("state");
		transformStateToCapitalLetters();
		this.startDate = convertXmlStringDate(attrs.get("startDate"));
		this.endDate = convertXmlStringDate(attrs.get("endDate"));
		this.businessState = attrs.get("businessState");
		this.startedBy = attrs.get("startedBy");
		this.name = attrs.get("name");
		this.type = attrs.get("type");
		if(USER_INTERACTION_TYPE.equals(this.type)) {
			this.businessState = attrs.get("description");
			this.startDate = convertXmlStringDate(attrs.get("createDate"));
		}
	}

	public WorkflowExecutionModel(WorkflowExecution execution) {
		if (execution == null)
			return;
		setHref(execution.getHref());
		this.id = execution.getId();
		if (execution.getState() != null) {
			this.state = execution.getState().value();
			transformStateToCapitalLetters();
		}
		this.startDate = convertXmlDate(execution.getStartDate());
		this.endDate = convertXmlDate(execution.getEndDate());
		this.businessState = execution.getBusinessState();
		this.startedBy = execution.getStartedBy();
		this.name = execution.getName();
		this.contentException = execution.getContentException();

		mapInputParams(execution.getInputParameters());
		mapOutputParams(execution.getOutputParameters());
	}

	private void transformStateToCapitalLetters() {
		if(this.state != null) {
			this.state = this.state.toUpperCase();
		}
	}
	private void mapInputParams(WorkflowExecution.InputParameters inputParams) {
		if (inputParams == null || inputParams.getParameter().isEmpty())
			return;

		inputParameters = new ArrayList<ExecutionParameter>(inputParams.getParameter().size());
		for (Parameter skdParameter : inputParams.getParameter()) {
			inputParameters.add(new ExecutionParameter(skdParameter, ExecutionParameterType.Input));
		}
	}

	private void mapOutputParams(WorkflowExecution.OutputParameters outputParams) {
		if (outputParams == null || outputParams.getParameter().isEmpty())
			return;

		outputParameters = new ArrayList<ExecutionParameter>(outputParams.getParameter().size());
		for (Parameter skdParameter : outputParams.getParameter()) {
			outputParameters.add(new ExecutionParameter(skdParameter, ExecutionParameterType.Output));
		}
	}
	
	public String getId() {
		return id;
	}

	public String getState() {
		return state;
	}

	public Date getStartDate() {
		return startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public String getBusinessState() {
		return businessState;
	}

	public String getStartedBy() {
		return startedBy;
	}

	public String getName() {
		return name;
	}

	public String getContentException() {
		return contentException;
	}
	
	public String getType() {
		return type;
	}

	public List<ExecutionParameter> getInputParameters() {
		return inputParameters;
	}

	public List<ExecutionParameter> getOutputParameters() {
		return outputParameters;
	}
	
	private List<ExecutionParameter> params;
	/*Used only from UI to combine the two list os parameters*/
	public List<ExecutionParameter> getParameters() {
		if(params == null) {
			params = new ArrayList<ExecutionParameter>(getOutputParameters().size() + getInputParameters().size());
			params.addAll(getOutputParameters());
			params.addAll(getInputParameters());
		}
		
		return params;
	}
}
