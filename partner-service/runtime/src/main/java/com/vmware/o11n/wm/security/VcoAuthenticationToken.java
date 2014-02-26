/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.security;

import java.util.Arrays;

import org.acegisecurity.Authentication;
import org.acegisecurity.GrantedAuthority;
import org.acegisecurity.GrantedAuthorityImpl;
import org.acegisecurity.providers.UsernamePasswordAuthenticationToken;
import org.springframework.util.Assert;

/**
 * This class is part of the Acegi Security Implementation. Inherit all of the
 * functionality of the Acegi framework UsernamePasswordAuthenticationToken
 * class with addition of storing the vCO REST API Session, which contains
 * AuthenticationToke needed to be provided on every REST API call to the vCO
 * server.
 */
public class VcoAuthenticationToken extends UsernamePasswordAuthenticationToken {
	private static final long serialVersionUID = 1L;
	protected static final String ADMIN_ROLE = "ROLE_admin";
	private VcoUserSession vcoUserSession;

	/**
	 * This constructor should only be used by AuthenticationManager or
	 * AuthenticationProvider implementations that are satisfied with producing
	 * a trusted (i.e. AbstractAuthenticationToken.isAuthenticated() = true)
	 * authentication token. It is a copy constructor accepting an instance of
	 * Acegi security Authentication interface and copy all of its data.
	 * 
	 * @param authentication - an instance of object implementing Acegi security
	 *            Authentication interface. This parameter must not be null.
	 *            NullPointerException would be thrown otherwise.
	 * @param vcoUserSession - VcoUserSession returned from vCO Rest API
	 *            authentication call. This parameter must not be null.
	 * @throws IllegalArgumentException when @param vcoSession is null.
	 * @throws NullPointerException when @param authentication is null.
	 */
	public VcoAuthenticationToken(Authentication authentication, VcoUserSession vcoUserSession)
			throws IllegalArgumentException {
		super(authentication.getPrincipal(), authentication.getCredentials(), getGrantedAuthoritiesWithAdminRole(
				authentication.getAuthorities(), vcoUserSession));
		setDetails(authentication.getDetails());
		this.vcoUserSession = vcoUserSession;
	}

	public VcoUserSession getVcoSession() {
		return vcoUserSession;
	}

	protected static GrantedAuthority[] getGrantedAuthoritiesWithAdminRole(GrantedAuthority[] grantedAuthorities,
			VcoUserSession vcoUserSession) {
		Assert.notNull(vcoUserSession);

		boolean adminRolePresented = isAdminRolePresented(grantedAuthorities);

		if (!adminRolePresented && vcoUserSession.isUserWithAdminRights()) {
			if (grantedAuthorities == null) {
				grantedAuthorities = new GrantedAuthority[] { new GrantedAuthorityImpl(ADMIN_ROLE) };
			} else {
				grantedAuthorities = Arrays.copyOf(grantedAuthorities, grantedAuthorities.length + 1);
				grantedAuthorities[grantedAuthorities.length - 1] = new GrantedAuthorityImpl(ADMIN_ROLE);
			}
		}

		return grantedAuthorities;
	}

	public boolean isUserInAdminRole() {
		GrantedAuthority[] grantedAuthorities = getAuthorities();
		return isAdminRolePresented(grantedAuthorities);
	}

	private static boolean isAdminRolePresented(GrantedAuthority[] grantedAuthorities) {
		if (grantedAuthorities == null) {
			return false;
		}

		for (GrantedAuthority grantedAuthority : grantedAuthorities) {
			if (ADMIN_ROLE.equals(grantedAuthority.getAuthority())) {
				return true;
			}
		}

		return false;
	}
}
