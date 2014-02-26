/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************
 */
package com.vmware.o11n.wm;

import static com.vmware.o11n.wm.configuration.ConfigurationConstants.HOST;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.PORT;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.USERNAME;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.USER_PASSWORD;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.VCO_AUTH_MODE;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.VCO_CONF_XML;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Writer;
import java.util.InvalidPropertiesFormatException;
import java.util.List;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.FileType;
import org.apache.commons.vfs2.VFS;
import org.apache.commons.vfs2.provider.zip.ZipFileObject;
import org.json.JSONObject;

import com.wavemaker.common.util.StringUtils;
import com.wavemaker.common.util.SystemUtils;
import com.wavemaker.runtime.WMAppContext;
import com.wavemaker.tools.io.File;
import com.wavemaker.tools.io.Folder;
import com.wavemaker.tools.io.Resource;
import com.wavemaker.tools.project.ProjectManager;
import com.wavemaker.tools.pws.IPwsRestImporter;

public class VcoRestImporter implements IPwsRestImporter {
	private static final String INSTALLED = "Installed";
	private static final String NOT_INSTALLED = "Not Installed";
	private static final String O11N_LIB_PREFIX = "common.packages.o11n.";
	private static final String NEW_LINE = System.getProperty("line.separator", "\n");
    private static final String BUILD_INFO_PROP_FILE_NAME = "vco-build-version.properties";	
    private static final String WAVEOPERATOR_VERSION_PROP_NAME = "version";	
    private static final String WAVEOPERATOR_BUILD_NUMBER_PROP_NAME = "build";	
    
	private ProjectManager projectManager;

	@Override
	public String listServices(com.wavemaker.runtime.pws.PwsLoginInfo pwsLoginInfo) throws Exception {
		return "[]";
	}

	@Override
	public String listOperations(com.wavemaker.runtime.pws.PwsLoginInfo pwsLoginInfo, String s) throws Exception {
		return "[]";
	}

	/**
	 * Provide basic login and state info. 3in1
	 */
	@Override
	public String listAllOperations(com.wavemaker.runtime.pws.PwsLoginInfo pwsLoginInfo) throws Exception {
		JSONObject info = new JSONObject();
		JSONObject auth = new JSONObject();

		Properties confProp = new Properties();
		Folder confDir = projectManager.getCurrentProject().getRootFolder().getFolder("webapproot")
				.getFolder("WEB-INF");
		File cfgFile = confDir.getFile(VCO_CONF_XML.getName());
		if (cfgFile.exists()) {
			InputStream conf = cfgFile.getContent().asInputStream();
			confProp.loadFromXML(conf);

			auth.accumulate("host", confProp.get(HOST.getName()));
			auth.accumulate("port", confProp.get(PORT.getName()));
			auth.accumulate("username", confProp.get(USERNAME.getName()));
			auth.accumulate("miscInfo", confProp.get(VCO_AUTH_MODE.getName()));

		} else {
			auth.accumulate("host", "localhost");
			auth.accumulate("port", "8281");
		}
		info.accumulate("servicesState", getServiceState());
		info.accumulate("widgetsState", getWidgetState());

		info.accumulate("auth", auth);

		return info.toString();
	}

	/**
	 * Save different types of configuration information
	 * 
	 * @param loginInfo
	 *            Login info data (if available)
	 * @param serviceName
	 *            What to save: [SAVEAUTH|INSTSERV|INSTWIDG]
	 * @param projectName
	 *            Ignored/Reserved
	 * @param selected
	 *            Ignored/Reserved
	 * @throws Exception
	 */
	@Override
	public void importOperations(com.wavemaker.runtime.pws.PwsLoginInfo loginInfo, String serviceName,
			String projectName, List<String> selected) throws Exception {
		System.out.println("IN IMPORT OPS");

		if ("SAVEAUTH".equals(serviceName)) {
			saveVcoConfigurationInfo(loginInfo);
		} else if ("INSTSERV".equals(serviceName)) {
			installVcoServices();
		} else if ("INSTWIDG".equals(serviceName)) {
			installVcoWidgets();
		}
	}

	private void saveVcoConfigurationInfo(com.wavemaker.runtime.pws.PwsLoginInfo loginInfo) throws IOException {
		Properties authConfig = new Properties();

		authConfig.put(HOST.getName(), StringUtils.removeSpaces(loginInfo.getHost()));
		authConfig.put(PORT.getName(), StringUtils.removeSpaces(loginInfo.getPort()));
		authConfig.put(USERNAME.getName(), StringUtils.removeSpaces(loginInfo.getUserName()));
		authConfig.put(USER_PASSWORD.getName(), SystemUtils.encrypt(StringUtils.removeSpaces(loginInfo.getPassword())));

		authConfig.put(VCO_AUTH_MODE.getName(), StringUtils.removeSpaces(loginInfo.getMiscInfo()));

		Folder confDir = projectManager.getCurrentProject().getRootFolder().getFolder("webapproot")
				.getFolder("WEB-INF");
		File cfgFile = confDir.getFile(VCO_CONF_XML.getName());
		cfgFile.createIfMissing();
		OutputStream conf = cfgFile.getContent().asOutputStream();
		authConfig.storeToXML(conf, "Generated by VcoRestImporter");
	}

	private void installVcoServices() throws FileSystemException, IOException {
		java.io.File servicesDist = new java.io.File(WMAppContext.getInstance().getAppContextRoot()
				+ java.io.File.separator + "WEB-INF" + java.io.File.separator + "lib", "vco-services.zip");
		if (!servicesDist.isFile()) {
			throw new RuntimeException("Services distribution not available. Reinstall partner service");
		}
		FileSystemManager fsManager = VFS.getManager();
		FileObject zipFile = fsManager.resolveFile("zip:" + servicesDist.getAbsolutePath());
		Folder serviceRoot = getServiceRoot();
		
		FileObject[] children = zipFile.getChildren();
		for (int i = 0; i < children.length; i++) {
			FileObject child = children[i];
			if ("lib".equals(child.getName().getBaseName())) {
				FileObject[] libs = child.getChildren();
				for (int j = 0; j < libs.length; j++) {
					FileObject lib = libs[j];
					File destFile = getLibFolder().getFile(lib.getName().getBaseName());
					destFile.createIfMissing();
					IOUtils.copy(((ZipFileObject) lib).getInputStream(), destFile.getContent().asOutputStream());
				}
			} else if ("src".equals(child.getName().getBaseName())) {
				FileObject[] services = child.getChildren();
				for (int j = 0; j < services.length; j++) {
					FileObject service = services[j];
					writeVfsToWmIo(service, serviceRoot);
				}

			}
		}
		
		addVersionInfo("services", serviceRoot);
	}

	private String getBuildInfo() throws IOException {
		InputStream stream = this.getClass().getClassLoader().getResourceAsStream(BUILD_INFO_PROP_FILE_NAME);
		if(stream == null) {
			throw new IllegalStateException(BUILD_INFO_PROP_FILE_NAME + "is not found as part of the binaries in vco.zip.");
		}
		
		Properties prop = new Properties();
		prop.load(stream);
		
		String version = prop.getProperty(WAVEOPERATOR_VERSION_PROP_NAME);
		String buildNumber = prop.getProperty(WAVEOPERATOR_BUILD_NUMBER_PROP_NAME);
		String buildInfo = version + "-" + buildNumber;
		
		return buildInfo;
	}

	private void installVcoWidgets() throws FileSystemException, IOException {
		java.io.File widgetDist = new java.io.File(WMAppContext.getInstance().getAppContextRoot()
				+ java.io.File.separator + "WEB-INF" + java.io.File.separator + "lib", "vco-widgets.zip");
		if (!widgetDist.isFile()) {
			throw new RuntimeException("Widgets distribution not available. Reinstall partner service");
		}
		
		Folder o11nPackageRoot = getO11nPackageRoot();
		
		FileSystemManager fsManager = VFS.getManager();
		FileObject zipFile = fsManager.resolveFile("zip:" + widgetDist.getAbsolutePath());
		FileObject[] children = zipFile.getChildren();
		for (int i = 0; i < children.length; i++) {
			FileObject widget = children[i];
			patchLibFile(widget.getName().getBaseName());
			writeVfsToWmIo(widget, o11nPackageRoot);
		}
		
		addVersionInfo("widgets", getWidgetRoot());
	}

	private void patchLibFile(String widgetFileName) throws IOException {
        String widgetName = widgetFileName.substring(0, widgetFileName.indexOf(".js"));
		File libFile = getPackagesRoot().getFile("lib.js");
		if (!libFile.exists()) {
			throw new RuntimeException(
					"lib.js file does not exist in packages root directory. This is a problem with the wavemaker installation or a newer not supported version.");
		}
		InputStream fstream = libFile.getContent().asInputStream();
		DataInputStream in = new DataInputStream(fstream);
		BufferedReader br = new BufferedReader(new InputStreamReader(in));
		StringBuilder patchedContent = new StringBuilder();
		String strLine;
		boolean patched = false;
		try {
			while ((strLine = br.readLine()) != null) {
				patchedContent.append(strLine).append(NEW_LINE);
				if (strLine.contains(O11N_LIB_PREFIX + widgetName)) {
					patched = true;
					break;
				}
			}
		} finally {
			fstream.close();
		}
		if (!patched) {
			Writer fos = libFile.getContent().asWriter();
			try {
				patchedContent.append("dojo.require(\"" + O11N_LIB_PREFIX + widgetName + "\");" + NEW_LINE);
				fos.write(patchedContent.toString());
			} finally {
				fos.close();
			}
		}
	}

	private void writeVfsToWmIo(FileObject vfsObj, Folder wmIoFolder) throws IOException {
		Resource destFile;
		if (FileType.FOLDER.equals(vfsObj.getType())) {
			destFile = wmIoFolder.getFolder(vfsObj.getName().getBaseName());
			destFile.createIfMissing();
			FileObject[] files = vfsObj.getChildren();
			for (FileObject file : files) {
				writeVfsToWmIo(file, (Folder) destFile);
			}
		} else if (FileType.FILE.equals(vfsObj.getType())) {
			destFile = wmIoFolder.getFile(vfsObj.getName().getBaseName());
			destFile.createIfMissing();
			IOUtils.copy(((ZipFileObject) vfsObj).getInputStream(), ((File) destFile).getContent().asOutputStream());
		}
	}
	
	private void addVersionInfo(String type, Folder parent) throws IOException, FileNotFoundException, InvalidPropertiesFormatException {
		Properties serviceConfig = new Properties();
		File serviceInfo = parent.getFile("vco-" + type + ".info");
		serviceInfo.createIfMissing();
		serviceConfig.setProperty("vco." + type + ".version",  getBuildInfo());
		
		OutputStream out = serviceInfo.getContent().asOutputStream();
		serviceConfig.storeToXML(out, "vCO version information for " + type + ".");
	}

	private String getWidgetState() throws IOException {
		return getState("widgets", getWidgetRoot());
	}

	private Folder getWidgetRoot() {
		Folder packagesRoot = projectManager.getFileSystem().getCommonFolder().getFolder("packages");
		if (!packagesRoot.exists()) {
			throw new IllegalStateException("Packages folder does not exist");
		}
		return packagesRoot;
	}

	private String getServiceState() throws IOException {
		return getState("services", getServiceRoot());
	}
	
	private String getState(String type, Folder parent) throws IOException {
		File file = parent.getFile("vco-" + type + ".info");
		if(file.exists()) {
			Properties prop = new Properties();
			prop.loadFromXML(file.getContent().asInputStream());
			return INSTALLED + ": " + prop.getProperty("vco." + type + ".version") + " version.";
		}
		
		return NOT_INSTALLED;
	}

	private Folder getO11nPackageRoot() {
		Folder o11nDir = getPackagesRoot().getFolder("o11n");
		o11nDir.createIfMissing();
		return o11nDir;
	}

	private Folder getServiceRoot() {
		Folder serviceRoot = projectManager.getCurrentProject().getRootFolder().getFolder("services");
		serviceRoot.createIfMissing();
		if (!serviceRoot.exists()) {
			throw new IllegalStateException("Unable to create Services folder in project");
		}
		return serviceRoot;
	}

	private Folder getLibFolder() {
		Folder libRoot = projectManager.getCurrentProject().getRootFolder().getFolder("lib");
		if (!libRoot.exists()) {
			throw new IllegalStateException("Lib folder does not exist in project");
		}
		return libRoot;
	}

	private Folder getPackagesRoot() {
		Folder commonRoot = projectManager.getFileSystem().getCommonFolder();
		if (!commonRoot.exists()) {
			throw new IllegalStateException("Common folder does not exist in workspace");
		}
		Folder pkgDir = commonRoot.getFolder("packages");
		if (!pkgDir.exists()) {
			throw new IllegalStateException("Packages folder does not exist in workspace");
		}

		return pkgDir;
	}

	public void setProjectManager(ProjectManager projectManager) {
		this.projectManager = projectManager;
	}
}