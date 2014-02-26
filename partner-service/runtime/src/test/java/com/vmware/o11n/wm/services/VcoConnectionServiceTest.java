package com.vmware.o11n.wm.services;

import static org.junit.Assert.assertNotNull;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.*;

import java.util.Properties;

import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.services.VcoConnectionService;

public class VcoConnectionServiceTest {
	VcoConnectionConfiguration config = new VcoConnectionConfiguration(initProps());
	VcoConnectionService vcoConnectionService = new VcoConnectionService(config);

	@Test
	public void testConfigureConnectionSession() {
		VcoSession vcoSession = vcoConnectionService.configureConnectionSession("testUsername", "testPassword");
		assertNotNull(vcoSession);
	}

	private Properties initProps() {
		Properties prop = new Properties();
		prop.put(HOST.getName(), "10.23.65.11");
		prop.put(PORT.getName(), "8281");
		return prop;
	}

}
