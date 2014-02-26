package com.vmware.o11n.wm.integration;


import static com.vmware.o11n.wm.StubConstants.*;
import static org.junit.Assert.*;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.vmware.o11n.wm.services.VcoRestJsonService;

public class VcoRestJsonServiceIT extends BaseTestIntegration {
	private static ObjectMapper jsonMapper;
	
	@Autowired
	private VcoRestJsonService restJsonService;
	
	@BeforeClass
	public static void beforeClass() {
		jsonMapper = new ObjectMapper();
		jsonMapper.setSerializationInclusion(Inclusion.NON_DEFAULT);
	}
	
	@Test
	public void shouldRetriveWorkflowViaRestJsonCall() {
		String workflow = restJsonService.get("workflows/" + DISPLAY_ALL_LOCKS_WORKFLOW_ID);
		String expectedJsonString = "{\"name\":\"Display all locks\",\"id\":\"8E81808080808080808080808080808080808080011809756029349943be4c882\"";
		assertTrue(workflow.contains(expectedJsonString));
	}

}
