package com.vmware.o11n.wm.security;

import java.net.URI;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertNotNull;

import org.acegisecurity.Authentication;
import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.junit.Before;
import org.junit.Test;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.services.NotificationListener;
import com.vmware.o11n.sdk.rest.client.stubs.User;
import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.security.VcoAcegiAuthenticationProvider;
import com.vmware.o11n.wm.security.VcoAuthenticationToken;
import com.vmware.o11n.wm.services.VcoConnectionService;

public class VcoAcegiAuthenticationProviderTest {
	VcoAcegiAuthenticationProvider vcoAcegiAuthenticationProvider;
	VcoConnectionService vcoConnectionService;

	@Before
	public void setUp() throws Exception {
		vcoConnectionService = getVcoConnectionService();
		vcoAcegiAuthenticationProvider = new VcoAcegiAuthenticationProvider(vcoConnectionService);
	}

	@Test
	public void shouldAuthenticateAndReturnvCOTokenWithVcoSession() {
		Authentication authenticate = vcoAcegiAuthenticationProvider.authenticate(initializeAuthentication());
		assertTrue(authenticate instanceof VcoAuthenticationToken);
		VcoAuthenticationToken token = (VcoAuthenticationToken) authenticate;
		assertNotNull(token.getVcoSession());
		assertTrue(token.isAuthenticated());
	}

	private Authentication initializeAuthentication() {
		Object principal = "testUser";
		Object credentials = "testCredentials";
		Object details = "Details";
		GrantedAuthority[] authorities = new GrantedAuthority[] {};
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(principal,
				credentials, authorities);
		authenticationToken.setDetails(details);

		return authenticationToken;
	}

	private VcoConnectionService getVcoConnectionService() {
		return new VcoConnectionService(new VcoConnectionConfiguration("src/test/resources/")) {

			@Override
			public VcoSession configureConnectionSession(String username, String pass) {
				return new VcoSession() {

					@Override
					public RestTemplate getRestTemplate() {
						return new RestTemplate() {
							@SuppressWarnings("unchecked")
							public <T> T getForObject(URI url, Class<T> responseType) throws RestClientException {
								if(responseType == User.class)
									return (T) new User();
								return null;
							}
						};
					}

					@Override
					public com.vmware.o11n.sdk.rest.client.authentication.Authentication getAuthentication() {
						return null;
					}

					@Override
					public URI appendToRoot(String part) {
						return null;
					}

					@Override
					public void addListener(NotificationListener listener) {
					}

					@Override
					public void close() {
					}

					@Override
					public void removeListener(NotificationListener listener) {
					}
				};
			}
		};
	}

}
