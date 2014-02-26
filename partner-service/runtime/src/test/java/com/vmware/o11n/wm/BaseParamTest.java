package com.vmware.o11n.wm;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.wm.common.BaseParameter;

public class BaseParamTest {
	private BaseParameter baseParameter;
	private Parameter sdkParameter;
	@Before
	public void setUp() throws Exception {
		sdkParameter = new Parameter();
		sdkParameter.setName("param1");
		sdkParameter.setType("type1");
		sdkParameter.setDescription("description1");
	}

	@Test
	public void testBaseParameterParameter() {
		baseParameter = new BaseParameter(sdkParameter);
		
		assertEquals(sdkParameter.getName(), baseParameter.getName());
		assertEquals(sdkParameter.getType(), baseParameter.getType());
		assertEquals(sdkParameter.getDescription(), baseParameter.getDescription());
	}

}
