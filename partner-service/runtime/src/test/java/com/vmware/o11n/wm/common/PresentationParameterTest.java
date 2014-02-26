package com.vmware.o11n.wm.common;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;

public class PresentationParameterTest {
	private Parameter sdkParam;
	private PresentationParameter presentationParam;

	@Before
	public void setup() {
		presentationParam = new PresentationParameter();
		presentationParam.setName("nameOfParam");
	}
	
	@Test
	public void testShouldMapNameAndType() {
		presentationParam.setType(BaseParameter.STRING_TYPE);
		
		sdkParam = presentationParam.toParameter();

		assertEquals(sdkParam.getName(), presentationParam.getName());
		assertEquals(sdkParam.getType(), presentationParam.getType());
	}
	
	@Test
	public void testShouldMapString() {
		initParam(BaseParameter.STRING_TYPE, "String Value");
		assertEqualValue(sdkParam.getString());
	}
	
	@Test
	public void testShouldMapPath() {
		initParam(BaseParameter.PATH_TYPE, "/PATH/");
		assertEqualValue(sdkParam.getString());
	}
	
	@Test
	public void testShouldMapBoolean() {
		initParam(BaseParameter.BOOLEAN_TYPE, "true");
		assertTrue(sdkParam.isBoolean());
		initParam(BaseParameter.BOOLEAN_TYPE, true);
		assertTrue(sdkParam.isBoolean());
		
		initParam(BaseParameter.BOOLEAN_TYPE, "false");
		assertFalse(sdkParam.isBoolean());
		initParam(BaseParameter.BOOLEAN_TYPE, false);
		assertFalse(sdkParam.isBoolean());
	}
	
	@Test
	public void testShouldMapNumber() {
		initParam(BaseParameter.NUMBER_TYPE, 23);
		assertEquals(new Double(23.0), sdkParam.getNumber());
	}
	
	@Test
	public void testShouldMapSecureString() {
		initParam(BaseParameter.SECURE_STRING_TYPE, "SomeSecureString");
		assertEqualValue(sdkParam.getSecureString().getValue());
	}
	
	@Test
	public void testShouldMapSdkObject() {
		SdkObject sdkObject = new SdkObject();
		sdkObject.setId("someId");
		sdkObject.setType("SDK:Type");
		
		initParam(BaseParameter.SDK_OBJECT, sdkObject);
		assertEqualValue(sdkParam.getSdkObject());
		
		initParam("unknown", sdkObject);
		assertEqualValue(sdkParam.getSdkObject());
	}

	private void initParam(String type, Object value) {
		presentationParam.setType(type);
		presentationParam.setValue(value);
		
		sdkParam = presentationParam.toParameter();
	}
	
	private void assertEqualValue(Object value) {
 	    assertNotNull(value);
		assertEquals(value, presentationParam.getValue());
	}
	
}
