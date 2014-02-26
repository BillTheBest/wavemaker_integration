package com.vmware.o11n.wm.common;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static com.vmware.o11n.wm.StubObjectFactory.getXMLDate;

import java.util.ArrayList;
import java.util.Date;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.CompositeValue;
import com.vmware.o11n.sdk.rest.client.stubs.KeyValuePair;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;

public class ExecutionParameterTest {
	private Parameter sdkParam = new Parameter();
	private ExecutionParameter executionParam;

	@Test
	public void testShouldMapStringToValue() {
		sdkParam.setType(BaseParameter.STRING_TYPE);
		sdkParam.setString("SomeString");
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals(sdkParam.getString(), executionParam.getValue());
		assertEquals(sdkParam.getString(), executionParam.getDisplayValue());
	}

	@Test
	public void testShouldMapPathToValue() {
		sdkParam.setType(BaseParameter.PATH_TYPE);
		sdkParam.setString("Path");
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals(sdkParam.getString(), executionParam.getValue());
		assertEquals(sdkParam.getString(), executionParam.getDisplayValue());
	}
	
	@Test
	public void testShouldMapDateToValue() {
		sdkParam.setType(BaseParameter.DATE_TYPE);
		sdkParam.setDate(getXMLDate(new Date(1351358194770L)));
		executionParam = new ExecutionParameter(sdkParam);

		assertNotNull(executionParam.getValue());
		assertEquals("2012-10-27", executionParam.getDisplayValue());
	}

	@Test
	public void testShouldMapSecureStringToValue() {
		sdkParam.setType(BaseParameter.SECURE_STRING_TYPE);
		SecureString secureString = new SecureString();
		secureString.setValue("SecureString");
		sdkParam.setSecureString(secureString);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals(secureString.getValue(), executionParam.getValue());
		assertEquals("****", executionParam.getDisplayValue());
	}

	@Test
	public void testShouldMapMimeAttachmentToValue() {
		sdkParam.setType(BaseParameter.MIME_TYPE);
		MimeAttachment mimeAttachment = new MimeAttachment();
		mimeAttachment.setName("Name");
		sdkParam.setMimeAttachment(mimeAttachment);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals("mime: " + mimeAttachment.getName(), executionParam.getDisplayValue());
		assertEquals(mimeAttachment, executionParam.getValue());
	}

	@Test
	public void testShouldMapSdkObjectToValue() {
		sdkParam.setType(BaseParameter.SDK_OBJECT);
		SdkObject sdkObject = initSdkObject();
		sdkParam.setSdkObject(sdkObject);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals(sdkObject.getDisplayValue(), executionParam.getDisplayValue());
		assertEquals(sdkObject, executionParam.getValue());
	}
	
	@Test
	public void testShouldMapSdkPropertiesToValue() {
		sdkParam.setType(BaseParameter.PROPERTIES);
		Properties props = new Properties();
		KeyValuePair kv1 = new KeyValuePair();
		kv1.setKey("kv1");
		kv1.setSdkObject(initSdkObject());
		props.getProperty().add(kv1);
		KeyValuePair kv2 = new KeyValuePair();
		kv2.setKey("kv2");
		kv2.setString("String");
		props.getProperty().add(kv2);
		KeyValuePair kv3 = new KeyValuePair();
		kv3.setKey("kv3");
		MimeAttachment mimeAttachment = new MimeAttachment();
		mimeAttachment.setName("Name");
		kv3.setMimeAttachment(mimeAttachment);
		props.getProperty().add(kv3);
		KeyValuePair kv4 = new KeyValuePair();
		kv4.setKey("kv4");
		SecureString secureString = new SecureString();
		secureString.setValue("SecureString");
		kv4.setSecureString(secureString);
		props.getProperty().add(kv4);
		KeyValuePair kv5 = new KeyValuePair();
		kv5.setKey("kv5");
		Properties nestedProps = new Properties();
		nestedProps.getProperty().addAll(new ArrayList<KeyValuePair>(props.getProperty()));
		kv5.setProperties(nestedProps);
		props.getProperty().add(kv5);
		
		sdkParam.setProperties(props);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals("{kv1: sdk: Display Name, kv2: String, kv3: mime: Name, kv4: ****, kv5: {kv1: sdk: Display Name, kv2: String, kv3: mime: Name, kv4: ****}}", executionParam.getDisplayValue());
		assertEquals(props, executionParam.getValue());
	}
	
	@Test
	public void testShouldMapSdkCompositeToValue() {
		sdkParam.setType(BaseParameter.COMPOSITE);
		Composite composite = new Composite();
		composite.setType("compType");
		CompositeValue cv1 = new CompositeValue();
		cv1.setId("cv1");
		cv1.setSdkObject(initSdkObject());
		composite.getProperty().add(cv1);
		CompositeValue cv2 = new CompositeValue();
		cv2.setId("cv2");
		cv2.setString("String");
		composite.getProperty().add(cv2);
		CompositeValue cv3 = new CompositeValue();
		cv3.setId("cv3");
		MimeAttachment mimeAttachment = new MimeAttachment();
		mimeAttachment.setName("Name");
		cv3.setMimeAttachment(mimeAttachment);
		composite.getProperty().add(cv3);
		CompositeValue cv4 = new CompositeValue();
		cv4.setId("cv4");
		SecureString secureString = new SecureString();
		secureString.setValue("SecureString");
		cv4.setSecureString(secureString);
		composite.getProperty().add(cv4);
		
		sdkParam.setComposite(composite);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals("compType: (cv1: sdk: Display Name, cv2: String, cv3: mime: Name, cv4: ****)", executionParam.getDisplayValue());
		assertEquals(composite, executionParam.getValue());
	}

	@Test
	public void testShouldMapArrayToValue() {
		sdkParam.setType(BaseParameter.ARRAY_TYPE_PREFIX);
		Array array = new Array();
		String stringParam = "SringParam";
		array.getSdkObjectOrStringOrSecureString().add(stringParam);
		String stringParam2 = "StringParam2";
		array.getSdkObjectOrStringOrSecureString().add(stringParam2);
		SdkObject sdkObject = initSdkObject();
		array.getSdkObjectOrStringOrSecureString().add(sdkObject);
		Array nestedArray = new Array();
		nestedArray.getSdkObjectOrStringOrSecureString().addAll( new ArrayList<Object>(array.getSdkObjectOrStringOrSecureString()));
		array.getSdkObjectOrStringOrSecureString().add(nestedArray);
		
		sdkParam.setArray(array);
		executionParam = new ExecutionParameter(sdkParam);

		assertEquals("[SringParam, StringParam2, sdk: Display Name, [SringParam, StringParam2, sdk: Display Name]]", executionParam.getDisplayValue());
		assertEquals(array.getSdkObjectOrStringOrSecureString(), executionParam.getValue());
	}

	private SdkObject initSdkObject() {
		SdkObject sdkObject = new SdkObject();
		sdkObject.setDisplayValue("sdk: Display Name");
		sdkObject.setHref("http://url/something");
		sdkObject.setId("id");
		sdkObject.setType("type");
		return sdkObject;
	}
}
