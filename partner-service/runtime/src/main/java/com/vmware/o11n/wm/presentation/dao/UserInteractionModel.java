package com.vmware.o11n.wm.presentation.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.Link;

public class UserInteractionModel extends BaseModel {
	private String id;
	private Date createDate;
	private String name;
	private String description;
	private String executionId;
	private String workflowId;
	
	public UserInteractionModel() {
	}
	
	public UserInteractionModel(InventoryItem item) {
		this(item.getAttributes().getAttribute());
		if(item.getRelations() == null && item.getRelations().getLink().isEmpty()) {
			return;
		}
		
		for (Link link : item.getRelations().getLink()) {
			if("down".equals(link.getRel())) {
				String[] tokens = link.getHref().split("/");
				workflowId = tokens[5];
				executionId = tokens[7];
			}
		}
	}
	
	public UserInteractionModel(List<Attribute> attributes) {
		Map<String, String> attrs = convertAttributesToMap(attributes);
		this.id = attrs.get("id");
		this.createDate = convertXmlStringDate(attrs.get("createDate"));
		this.name = attrs.get("name");
		this.description = attrs.get("description");
	}
	
	public String getId() {
		return id;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getExecutionId() {
		return executionId;
	}

	public String getWorkflowId() {
		return workflowId;
	}
}
