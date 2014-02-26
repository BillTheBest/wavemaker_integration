package com.vmware.o11n.wm.presentation.dao;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Workflow;
import com.vmware.o11n.wm.common.BaseParameter;
import com.vmware.o11n.wm.common.CatalogItem;

public class WorkflowModel extends BaseModel implements CatalogItem, Serializable {
	private static final long serialVersionUID = 6345338723095897156L;
	private String id;
	private String name;
	private String description;
	private List<BaseParameter> inputParameters;
	private List<BaseParameter> outputParameters;
	private boolean customizedIconExists;
	private String iconHref;
	
	private String categoryName;
	private String categoryId;
	private boolean canExecute;
	private boolean canEdit;
	private boolean partial;
	
	protected WorkflowModel() {}

	protected WorkflowModel(String id, String name) {
		this.id = id;
		this.name = name;
		this.partial = true;
	}

	public WorkflowModel(Workflow sdkWorkflow) {
		if(sdkWorkflow == null)
			return;
		this.id = sdkWorkflow.getId();
		this.name = sdkWorkflow.getName();
		this.setHref(sdkWorkflow.getHref());
		this.description = replaceNewLinesWithBreakLines(sdkWorkflow.getDescription());
		this.customizedIconExists = sdkWorkflow.isCustomizedIcon();
		if(sdkWorkflow.getHref() != null) {
			this.iconHref = sdkWorkflow.getHref() + "icon/";
		}
		mapInputParams(sdkWorkflow.getInputParameters());
		mapOutputParams(sdkWorkflow.getOutputParameters());
		this.partial = false;
	}
	
	public WorkflowModel(List<Attribute> attributes) {
		Map<String, String> attrs = convertAttributesToMap(attributes);
		this.id = attrs.get("id");
		this.name = attrs.get("name");
		this.description = attrs.get("description");
		this.categoryName = attrs.get("categoryName");
		this.categoryId = extractCategoryId(attrs.get("categoryHref"));
		this.canExecute = Boolean.valueOf(attrs.get("canExecute"));
		this.canEdit = Boolean.valueOf(attrs.get("canEdit"));
		this.partial = true;
	}

	private void mapInputParams(Workflow.InputParameters inputParams) {
		if (inputParams == null || inputParams.getParameter().isEmpty())
			return;

		inputParameters = new ArrayList<BaseParameter>(inputParams.getParameter().size());
		for (Parameter skdParameter : inputParams.getParameter()) {
			inputParameters.add(new BaseParameter(skdParameter));
		}
	}

	private void mapOutputParams(Workflow.OutputParameters outputParams) {
		if (outputParams == null || outputParams.getParameter().isEmpty())
			return;

		outputParameters = new ArrayList<BaseParameter>(outputParams.getParameter().size());
		for (Parameter skdParameter : outputParams.getParameter()) {
			outputParameters.add(new BaseParameter(skdParameter));
		}
	}
	
	private String extractCategoryId(String categoryHref) {
		if(categoryHref == null) {
			return null;
		}
		String categoryPath = "/catalog/System/WorkflowCategory/";
		int beginIndex = categoryHref.indexOf(categoryPath);
		if(beginIndex == -1) {
			return null;
		}
		int endIndex = categoryHref.length()-1;
		if(categoryHref.lastIndexOf("/") != endIndex) {
			endIndex++;
		}
		return categoryHref.substring(beginIndex + categoryPath.length(), endIndex);
	}
	
	private String replaceNewLinesWithBreakLines(String str) {
		if(str == null)
			return str;
		String result =  str.replaceAll("\n", "<br/>");
		return result;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getDescription() {
		return description;
	}

	public List<BaseParameter> getInputParameters() {
		return inputParameters;
	}

	public List<BaseParameter> getOutputParameters() {
		return outputParameters;
	}

	public boolean getCustomizedIconExists() {
		return customizedIconExists;
	}

	@Override
	public String getIconHref() {
		return iconHref;
	}
	
	@Override
	public String getCategoryName() {
		return categoryName;
	}
	
	public String getCategoryId() {
		return categoryId;
	}

	public boolean getCanExecute() {
		return canExecute;
	}

	public boolean getCanEdit() {
		return canEdit;
	}
	
	public boolean isPartial() {
		return partial;
	}
}
