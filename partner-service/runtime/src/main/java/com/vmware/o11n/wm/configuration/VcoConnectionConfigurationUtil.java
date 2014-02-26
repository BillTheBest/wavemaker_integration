package com.vmware.o11n.wm.configuration;

import static com.vmware.o11n.wm.configuration.ConfigurationConstants.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.Properties;

import org.json.JSONObject;

import com.wavemaker.common.util.SystemUtils;

class VcoConnectionConfigurationUtil {

	static String getJsonConfig(Properties confProp) {
		try {
			JSONObject auth = new JSONObject();

			auth.accumulate(HOST.getName(), confProp.getProperty(HOST.getName(), "localhost"));
			auth.accumulate(PORT.getName(), confProp.getProperty(PORT.getName(), "8281"));
			auth.accumulate(USERNAME.getName(), confProp.getProperty(USERNAME.getName()));
			auth.accumulate(VCO_AUTH_MODE.getName(), confProp.getProperty(VCO_AUTH_MODE.getName()));

			return auth.toString();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	static Properties storeConnConfigFromJson(String config, File configFile) {
		try {
			JSONObject json = new JSONObject(config);
			Properties confProp = new Properties();
			if (configFile.exists()) {
				InputStream stream = new FileInputStream(configFile);
				confProp.loadFromXML(stream);
			}

			Iterator<?> keys = json.keys();
			while (keys.hasNext()) {
				String key = keys.next().toString();
				String value = json.getString(key);
				if(USER_PASSWORD.getName().equals(key) && value != null) {
					value = SystemUtils.encrypt(value);
				}
				confProp.put(key, value);
			}

			OutputStream out = new FileOutputStream(configFile);
			confProp.storeToXML(out, "vCO configuration properties stored during runtime.");
			
			return confProp;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
