/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.configuration;

import static com.vmware.o11n.wm.configuration.VcoConnectionConfigurationUtil.*;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.HOST;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.PORT;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.SHARED_SESSION;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.USERNAME;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.USER_PASSWORD;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.VCO_AUTH_MODE;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.VCO_CONF_XML;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.WMAppContext;

/**
 * A class that load the vCO configuration from a config file and parse the information. This class is private to
 * vCOConnectionService mainly because have access to sensitive information - password.
 */
public class VcoConnectionConfiguration {
	private Properties confProp;
	private URI vcoRestApiUri;
	private boolean sharedSessionAuth;
	private String confPathDir;

	public VcoConnectionConfiguration() {
		this(getConfPathDir());
	}

	public VcoConnectionConfiguration(Properties properties) {
		this.confProp = properties;
		initBaseProps();
	}

	public VcoConnectionConfiguration(String confPathDir) {
		this(loadConfiguration(confPathDir));
		this.confPathDir = confPathDir;
	}

	private static String getConfPathDir() {
		try {
			File confDir = new File(WMAppContext.getInstance().getAppContextRoot(), "WEB-INF");
			return confDir.getCanonicalPath();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	public String getJsonConnectionConfig() {
		return getJsonConfig(this.confProp);
	}
	
	public synchronized void storeConnectionConfigFromJson(String config) {
		File configFile = getConfigFile(confPathDir);
		this.confProp = storeConnConfigFromJson(config, configFile);
		initBaseProps();
	}

	private static Properties loadConfiguration(String confPathDir) {
		try {
			Properties properties = new Properties();
			File cfgFile = getConfigFile(confPathDir);
			if (cfgFile.exists()) {
				InputStream conf = new FileInputStream(cfgFile);
				properties.loadFromXML(conf);
			}

			return properties;

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static File getConfigFile(String confPathDir) {
		File cfgFile = new File(confPathDir, VCO_CONF_XML.getName());
		return cfgFile;
	}
	
	private void initBaseProps() {
		initVcoRestApiUri();
		initAuthMode();
	}
	
	private void initAuthMode() {
		this.sharedSessionAuth = SHARED_SESSION.getName().equals(confProp.getProperty(VCO_AUTH_MODE.getName()));
	}

	private void initVcoRestApiUri() {
		try {
			vcoRestApiUri = new URI("https://" + getServer() + ":" + getPort() + "/vco/api/");
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public String getPassword() {
		String decryptedPassword = confProp.getProperty(USER_PASSWORD.getName());
		if (decryptedPassword != null) {
			// decrypt method throws NullPointer if password is null
			decryptedPassword = SystemUtils.decrypt(decryptedPassword);
		}
		return decryptedPassword;
	}

	public boolean isSharedSession() {
		return sharedSessionAuth;
	}

	public String getUsername() {
		return confProp.getProperty(USERNAME.getName());
	}

	public String getServer() {
		return confProp.getProperty(HOST.getName());
	}

	public String getPort() {
		return confProp.getProperty(PORT.getName());
	}

	public URI getVcoRestApiUri() {
		return vcoRestApiUri;
	}
	
	public String getConfiguration(String configKey) {
		return confProp.getProperty(configKey);
	}
}
