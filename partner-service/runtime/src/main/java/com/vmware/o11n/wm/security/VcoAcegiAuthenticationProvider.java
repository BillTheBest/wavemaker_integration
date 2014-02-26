/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.security;

import org.acegisecurity.Authentication;
import org.acegisecurity.AuthenticationException;
import org.acegisecurity.BadCredentialsException;
import org.acegisecurity.providers.AuthenticationProvider;

import com.vmware.o11n.wm.services.VcoConnectionService;

/**
 * This class implements Acegi {@link AuthenticationProvider} in order to plug-in the vCO authentication within
 * Wavemaker authentication mechanism. In order for this to work, vCO Wavemaker application should be configured in
 * Session Per User mode. Then, the Wavemkaer security service should be enabled from the Wavemaker designer. After the
 * security configuration is generated, the currently registered AuthenticationProvider should be deleted and this class
 * bean should be registered in Wavemaker Acegi Spring configuration file. The file is located in
 * {name_of_wavemaker_project}/webapproot/WEB-INF/project-security.xml.
 * 
 * Once project-security.xml, find the bean with id="authenticationManager" and then change the first item in the list
 * of providers from bean="daoAuthenticationProvider" to bean="vcoAuthenticationProvider". This should enable the
 * VcoAcegiAuthenticationProvider to handle the authentication of the application.
 * 
 */
public class VcoAcegiAuthenticationProvider implements AuthenticationProvider {
	private VcoConnectionService connectionService;

	public VcoAcegiAuthenticationProvider(VcoConnectionService connectionService) {
		this.connectionService = connectionService;
	}

	/**
	 * Authenticate the current user base on provided username/credentials.
	 * 
	 * @return VcoAuthenticationToken instance with newly created VcoSession.
	 * @throws BadCredentialsException
	 *             if username/password is not correct and for any other reason that would not allow the user to
	 *             authenticate
	 */
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		VcoUserSession vcoSession = connectionService.authenticate(authentication.getName(),
				String.valueOf(authentication.getCredentials()));
		Authentication vcoAuthenticationToken = new VcoAuthenticationToken(authentication, vcoSession);
		return vcoAuthenticationToken;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public boolean supports(Class arg0) {
		return true;
	}

}
