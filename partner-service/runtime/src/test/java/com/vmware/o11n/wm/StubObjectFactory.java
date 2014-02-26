package com.vmware.o11n.wm;

import static com.vmware.o11n.wm.configuration.ConfigurationConstants.HOST;
import static com.vmware.o11n.wm.configuration.ConfigurationConstants.PORT;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Properties;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.core.io.UrlResource;
import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.services.NotificationListener;
import com.vmware.o11n.wm.common.PaginatedWorkflows;
import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.security.VcoUserSession;
import com.vmware.o11n.wm.services.VcoCacheManager;
import com.vmware.o11n.wm.services.VcoConnectionService;

public class StubObjectFactory extends StubConstants {
	private static final VcoConnectionConfiguration config = new VcoConnectionConfiguration(initProps());
	private static final VcoConnectionService vcoConnectionService = new VcoConnectionServiceStub(config);
	private static VcoCacheManager vcoCacheManager;

	private StubObjectFactory() {
	};

	public static VcoSession getSession() {
		return vcoConnectionService.getSession();
	}

	public static VcoConnectionService getVcoConnectionService() {
		return vcoConnectionService;
	}
	
	public static VcoCacheManager getVcoCacheManager() throws IOException {
		if(vcoCacheManager == null) {
			vcoCacheManager = new VcoCacheManagerStub();
		}
		return vcoCacheManager;
	}

	public static XMLGregorianCalendar getXMLDate(Date date) {
		GregorianCalendar c = new GregorianCalendar();
		c.setTime(date);
		try {
			return DatatypeFactory.newInstance().newXMLGregorianCalendar(c);
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
			return null;
		}
	}

	public static Date getDateFromXmlDateString(String date) {
		try {
			return DatatypeFactory.newInstance().newXMLGregorianCalendar(date).toGregorianCalendar().getTime();
		} catch (DatatypeConfigurationException e) {
			e.printStackTrace();
			return null;
		}
	}

	private static Properties initProps() {
		Properties prop = new Properties();
		prop.put(HOST.getName(), "10.23.65.11");
		prop.put(PORT.getName(), "8281");
		return prop;
	}

	private static class VcoConnectionServiceStub extends VcoConnectionService {

		public VcoConnectionServiceStub(VcoConnectionConfiguration connectionConfiguration) {
			super(connectionConfiguration);
		}

		@Override
		public VcoUserSession getSession() throws IllegalStateException {
			return new VcoUserSession() {
				private static final long serialVersionUID = 1L;

				
				@Override
				public void removeListener(NotificationListener listener) {
					// TODO Auto-generated method stub

				}

				@Override
				public RestTemplate getRestTemplate() {
					throw new RuntimeException("This is a mock session implementation. Method not implemented.");
				}

				@Override
				public Authentication getAuthentication() {
					throw new RuntimeException("This is a mock session implementation. Method not implemented.");
				}

				@Override
				public void close() {
					// TODO Auto-generated method stub
				}

				@Override
				public URI appendToRoot(String part) {
					try {
						return new URI("https://10.23.34.34/api/" + part);
					} catch (URISyntaxException e) {
						e.printStackTrace();
						return null;
					}
				}

				@Override
				public void addListener(NotificationListener listener) {
					// TODO Auto-generated method stub
				}

				@Override
				public boolean isUserWithAdminRights() {
					// TODO Auto-generated method stub
					return false;
				}
			};
		}

	}

	private static class VcoCacheManagerStub extends VcoCacheManager {
		public VcoCacheManagerStub() throws IOException {
			super(new UrlResource(VcoCacheManager.class.getResource("/ehcache-vco.xml")), getVcoConnectionService());
		}

		@Override
		public void putAllWorkflow(PaginatedWorkflows paginatedWorkflows) {
			// disable cache for all workflows
		}
	}

}
