package com.vmware.o11n.wm.integration;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.acegisecurity.Authentication;
import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.vmware.o11n.wm.security.VcoAcegiAuthenticationProvider;
import com.vmware.o11n.wm.security.VcoAuthenticationToken;


public class VcoAcegiAuthenticationProviderIT extends BaseTestIntegration {
	@Autowired
	VcoAcegiAuthenticationProvider vcoAcegiAuthenticationProvider;

	@Test
	public void shouldAuthenticateAndReturnvCOTokenWithVcoSession() {
		Authentication authenticate = vcoAcegiAuthenticationProvider
				.authenticate(new UsernamePasswordAuthenticationToken("root", "vmware01", new GrantedAuthority[] {}));
		assertTrue(authenticate instanceof VcoAuthenticationToken);
		VcoAuthenticationToken token = (VcoAuthenticationToken) authenticate;
		assertNotNull(token.getVcoSession());
		assertTrue(token.isAuthenticated());
	}

}
