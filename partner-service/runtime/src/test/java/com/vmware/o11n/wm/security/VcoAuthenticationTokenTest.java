package com.vmware.o11n.wm.security;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import org.acegisecurity.Authentication;
import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.GrantedAuthorityImpl;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.junit.Test;

public class VcoAuthenticationTokenTest {
	Object principal = "testUser";
	Object credentials = "testCredentials";
	Object details = "Details";
	GrantedAuthority[] authorities;

	@Test
	public void shouldInitialisedVcoAuthenticationTokenWithAllProperties() {
		authorities = new GrantedAuthority[0];
		Authentication authentication = initializeAuthentication(authorities);
		VcoUserSession vcoSession = mock(VcoUserSession.class);

		VcoAuthenticationToken vcoAuthenticationToken = new VcoAuthenticationToken(authentication, vcoSession);

		assertSame(vcoSession, vcoAuthenticationToken.getVcoSession());

		assertEquals(principal, vcoAuthenticationToken.getPrincipal());
		assertEquals(credentials, vcoAuthenticationToken.getCredentials());
		assertEquals(details, vcoAuthenticationToken.getDetails());
		assertArrayEquals(authorities, vcoAuthenticationToken.getAuthorities());
	}

	@Test(expected = IllegalArgumentException.class)
	public void shouldThrowExceptionWhenVcoAuthenticationTokenIsConstructedWithNoVcoSession() {
		new VcoAuthenticationToken(initializeAuthentication(new GrantedAuthority[0]), null);
	}
	
	@Test
	public void shouldAddAdminRoleIfUserIsAdminAndAuthoritiesNull() {
		VcoUserSession vcoSession = mock(VcoUserSession.class);
		when(vcoSession.isUserWithAdminRights()).thenReturn(true);
		
		authorities = VcoAuthenticationToken.getGrantedAuthoritiesWithAdminRole(null, vcoSession);
		
		assertNotNull(authorities);
		assertEquals(1, authorities.length);
		assertEquals(VcoAuthenticationToken.ADMIN_ROLE, authorities[0].getAuthority());
	}
	
	@Test
	public void shouldAddAdminRoleIfUserIsAdminAndNoOtherAuthorities() {
		authorities = new GrantedAuthority[] {new GrantedAuthorityImpl("Test Role")};
		VcoUserSession vcoSession = mock(VcoUserSession.class);
		when(vcoSession.isUserWithAdminRights()).thenReturn(true);
		
		assertEquals(1, authorities.length);
		
		authorities = VcoAuthenticationToken.getGrantedAuthoritiesWithAdminRole(authorities, vcoSession);
		
		assertEquals(2, authorities.length);
		assertEquals(VcoAuthenticationToken.ADMIN_ROLE, authorities[1].getAuthority());
	}
	
	@Test
	public void shouldNotAddAdminRoleIfUserIsAdminAndAdminRoleAlreadyPresented() {
		authorities = new GrantedAuthority[] {new GrantedAuthorityImpl("Test Role"), new GrantedAuthorityImpl(VcoAuthenticationToken.ADMIN_ROLE)};
		VcoUserSession vcoSession = mock(VcoUserSession.class);
		when(vcoSession.isUserWithAdminRights()).thenReturn(true);
		
		assertEquals(2, authorities.length);
		
		GrantedAuthority[] grantedAuthorities = VcoAuthenticationToken.getGrantedAuthoritiesWithAdminRole(authorities, vcoSession);
		
		assertEquals(2, grantedAuthorities.length);
		assertSame(authorities, grantedAuthorities);
	}
	
	@Test
	public void shouldNotBeUserInAdminRoleIfNotAdminAuthoritiyPresented() {
		authorities = new GrantedAuthority[] {new GrantedAuthorityImpl("Test Role"), new GrantedAuthorityImpl(VcoAuthenticationToken.ADMIN_ROLE)};
		VcoUserSession vcoSession = mock(VcoUserSession.class);
		Authentication authentication = initializeAuthentication(authorities);
		
		VcoAuthenticationToken vcoAuthenticationToken = new VcoAuthenticationToken(authentication, vcoSession);
		
		assertTrue(vcoAuthenticationToken.isUserInAdminRole());
	}
	
	@Test
	public void shouldBeUserInAdminRoleIfAdminAuthoritiyPresented() {
		authorities = new GrantedAuthority[] {new GrantedAuthorityImpl("Test Role")};
		VcoUserSession vcoSession = mock(VcoUserSession.class);
		Authentication authentication = initializeAuthentication(authorities);
		when(vcoSession.isUserWithAdminRights()).thenReturn(false);
		
		VcoAuthenticationToken vcoAuthenticationToken = new VcoAuthenticationToken(authentication, vcoSession);
		
		assertFalse(vcoAuthenticationToken.isUserInAdminRole());
	}
	
	private Authentication initializeAuthentication( GrantedAuthority[] authorities) {
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(principal,
				credentials, authorities);
		authenticationToken.setDetails(details);

		return authenticationToken;
	}

}
