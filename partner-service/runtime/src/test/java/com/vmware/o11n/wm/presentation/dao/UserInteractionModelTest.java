package com.vmware.o11n.wm.presentation.dao;

import static com.vmware.o11n.wm.StubObjectFactory.getDateFromXmlDateString;
import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItem;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;

public class UserInteractionModelTest {
	private UserInteractionModel userInteractionModel;

	@Test
	public void testUserInteractionShouldMapPropertiesFromLinkAttributes() {
		List<Attribute> attributes = new ArrayList<Attribute>();

		Attribute attrId = new Attribute();
		attrId.setName("id");
		attrId.setValue("ff80808139c275bc013a6d8da1c6076b");
		attributes.add(attrId);


		Attribute attrCreateDate = new Attribute();
		attrCreateDate.setName("createDate");
		attrCreateDate.setValue("2012-10-17T07:08:49.475Z");
		attributes.add(attrCreateDate);

		Attribute attrDescr = new Attribute();
		attrDescr.setName("description");
		attrDescr.setValue("Some Description");
		attributes.add(attrDescr);


		Attribute attrName = new Attribute();
		attrName.setName("name");
		attrName.setValue("Display all locks");
		attributes.add(attrName);
		
		userInteractionModel = new UserInteractionModel(attributes);

		assertEquals(attrId.getValue(), userInteractionModel.getId());
		assertEquals(getDateFromXmlDateString(attrCreateDate.getValue()), userInteractionModel.getCreateDate());
		assertEquals(attrName.getValue(), userInteractionModel.getName());
		assertEquals(attrDescr.getValue(), userInteractionModel.getDescription());
	}
	
	@Test
	public void shouldMapWorkflowIdAndExecutionIdFromInventoryItem() {
		InventoryItem inventoryItem = new InventoryItem();
		inventoryItem.setAttributes(new InventoryItem.Attributes());
		Relations relations = new Relations();
		inventoryItem.setRelations(relations);
		Link link = new Link();
		relations.getLink().add(link);
		
		
		link.setRel("down");
		String workflowId = "793f3fb6-f4cf-4ff5-b09b-45b8baac449c";
		String executionId = "ff80808139fb3080013ae91a26810399";
		link.setHref("https://10.23.34.109:8281/api/workflows/"+ workflowId + "/executions/"+ executionId + "/interaction/");
		
		userInteractionModel = new UserInteractionModel(inventoryItem);
		
		assertEquals(workflowId, userInteractionModel.getWorkflowId());
		assertEquals(executionId, userInteractionModel.getExecutionId());
	}
}
