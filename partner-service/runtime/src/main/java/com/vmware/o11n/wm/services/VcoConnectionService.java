/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm.services;

import java.io.IOException;
import java.net.ConnectException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;

import org.acegisecurity.AccessDeniedException;
import org.acegisecurity.BadCredentialsException;
import org.acegisecurity.context.SecurityContext;
import org.acegisecurity.context.SecurityContextHolder;
import org.acegisecurity.providers.anonymous.AnonymousAuthenticationToken;
import org.springframework.http.converter.BufferedImageHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;

import com.vmware.o11n.sdk.rest.client.DefaultVcoSessionFactory;
import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.VcoSessionFactory;
import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.authentication.UsernamePasswordAuthentication;
import com.vmware.o11n.sdk.rest.client.configuration.ConnectionConfiguration;
import com.vmware.o11n.sdk.rest.client.services.UtilService;
import com.vmware.o11n.sdk.rest.client.stubs.User;
import com.vmware.o11n.wm.configuration.VcoConnectionConfiguration;
import com.vmware.o11n.wm.http.VcoBufferedImageHttpMessageConverter;
import com.vmware.o11n.wm.security.VcoAuthenticationToken;
import com.vmware.o11n.wm.security.VcoUserSession;
import com.vmware.o11n.wm.security.VcoUserSessionImpl;

/**
 * This service provide the connection to vCO server and deals with vCO session
 * creation and authentication.
 */
public class VcoConnectionService {
	private static final String ANONYMOUS_NOT_AUTHENTICATED_USER = "anonymous";
	private volatile VcoSession sharedSession;
	private volatile User sharedUser;
	private VcoConnectionConfiguration config;

	public VcoConnectionService(VcoConnectionConfiguration connectionConfiguration) {
		config = connectionConfiguration;
	}

	public VcoUserSession authenticate(String username, String password) {
		User currentUser = null;
		VcoSession vcoSession = null;
		try {
			vcoSession = configureConnectionSession(username, password);
			UtilService utilService = new UtilService(vcoSession);
			currentUser = utilService.getCurrentUser();
		} catch (Exception e) {
			throw new BadCredentialsException("Can't authenticate with the vCO server: " + e.getMessage(), e);
		}
		if (vcoSession == null || currentUser == null) {
			throw new BadCredentialsException(
					"Can't authenticate with the vCO server because of invalud username, password or vCO configured server url.");
		}
		return new VcoUserSessionImpl(vcoSession, currentUser);
	}

	/**
	 * Configure the connection session for vCO server based on the current
	 * configuration.
	 * 
	 * @param username - the identity of a user.
	 * @param plainPassword - the password of a user in not encrypted format.
	 * @return ready to use VcoSession instance based on the type of
	 *         authentication mechanism configured.
	 */
	protected VcoSession configureConnectionSession(String username, String plainPassword) {
		VcoSessionFactory sessionFactory = createSessionFactory();
		Authentication auth = createAuthentication(sessionFactory, username, plainPassword);

		VcoSession newSession = sessionFactory.newSession(auth);
		addCustomBufferedImageConverter(newSession);
		return newSession;
	}

	private void addCustomBufferedImageConverter(VcoSession newSession) {
		VcoBufferedImageHttpMessageConverter bufferedImageConverter = new VcoBufferedImageHttpMessageConverter();
	
		List<HttpMessageConverter<?>> messageConvertes = new ArrayList<HttpMessageConverter<?>>();
		for (HttpMessageConverter<?> httpMessageConverter : newSession.getRestTemplate().getMessageConverters()) {
			if (httpMessageConverter.getClass() != BufferedImageHttpMessageConverter.class) {
				messageConvertes.add(httpMessageConverter);
			}
		}
		messageConvertes.add(bufferedImageConverter);
		newSession.getRestTemplate().setMessageConverters(messageConvertes);
	}

	private Authentication createAuthentication(VcoSessionFactory sessionFactory, String username, String password) {
		Authentication auth;
    	auth = new UsernamePasswordAuthentication(username, password);
		return auth;
	}

	protected VcoSessionFactory createSessionFactory() {
		ConnectionConfiguration.Builder builder = new ConnectionConfiguration.Builder();
		builder.withMaxConnectionsPerRoute(50);
		ConnectionConfiguration defaultConfiguration = builder.build();
        return new DefaultVcoSessionFactory(config.getVcoRestApiUri(), defaultConfiguration);
        // Disable ssl connections without server validation
/*
		return new DefaultVcoSessionFactory(config.getVcoRestApiUri(), defaultConfiguration) {
			@Override
			protected HostnameVerifier newHostnameVerifier() {
				return newUnsecureHostnameVerifier();
			}

			@Override
			protected SSLContext newSSLContext() throws KeyManagementException, NoSuchAlgorithmException {
				return newUnsecureSSLContext();
			}
		};
*/
	}

	/**
	 * @return current VcoSession used to connect to vCO server. The session
	 *         returned would depend what type of authentication is configured
	 *         for the Wavemaker application to connect to vCO server. There are
	 *         two possible choice: 1. Shared Session - every user logged in
	 *         Wavemaker application will be connected to the vCO server with
	 *         the same username/password entered in the configuration file
	 *         initially. During the initial instantiation of this service a
	 *         VcoSession object is instantiated and the same object will be
	 *         returned every time when this method is called. 2. Session Per
	 *         User - the currently logged user credentials will be used in this
	 *         case. Additional configuration changes in Wavemaker Acegi Spring
	 *         configuration files need to be done in order for this to work
	 *         (please see VcoAcegiAuthenticationProvider docs form more
	 *         details). The VcoAcegiAuthenticationProvider needs to be
	 *         registered as Acegi AuthenticationProvider. Otherwise,
	 *         IllegalStateException would be thrown. current VcoSession
	 *         instance based on the configured authentication mechanism.
	 * @throws IllegalStateException if Session Per User is configured and
	 *             VcoAcegiAuthenticationProvider has not been register as an
	 *             AuthenticationProvider in Wavemaker Acegi config file.
	 */
	public VcoSession getSession() throws IllegalStateException {
		VcoSession currentSession = null;
		if (config.isSharedSession()) {
			if (sharedSession == null) {
				// TODO: synchronization might be needed although even if two
				// sessions are created very rarely,
				// this wouldn't be an issue. This would be called only once in
				// web application with shared session.
				sharedSession = configureConnectionSession(config.getUsername(), config.getPassword());
			}
			currentSession = sharedSession;
		} else {
			org.acegisecurity.Authentication acegiAuthentication = getAuthenticatedAuthentication();
			if (acegiAuthentication instanceof VcoAuthenticationToken) {
				currentSession = ((VcoAuthenticationToken) acegiAuthentication).getVcoSession();
			}
		}

		if (currentSession == null) {
			throw new IllegalStateException(
					"VcoAuthenticationToken is not initialized in vCO Session per User configured authentication mode. "
							+ "Please, refer to the documentation of how to setup vCO Authentication Provider in WaveMaker "
							+ "or change to Shared Session Authentication.");
		}

		return currentSession;
	}

	/**
	 * @return the username that is used to connect to the vCO server. The
	 *         username returned would depend what type of authentication is
	 *         configured for the Wavemaker application to connect to vCO
	 *         server. There are two possible choice: 1. Shared Session - every
	 *         user logged in Wavemaker application will be connected to the vCO
	 *         server with the same username/password entered in the
	 *         configuration file initially. During the initial instantiation of
	 *         this service a VcoSession object and the username used would be
	 *         returned every time. 2. Session Per User - the currently logged
	 *         in username will be returned. In case, Wavemaker security is not
	 *         enabled or there is no authenticated user, a string "anonymous"
	 *         will be return as a username.
	 */
	public String getVcoUsername() {
		if (config.isSharedSession()) {
			return config.getUsername();
		}

		return getCurrentUsername();
	}

	public String getCurrentUsername() {
		if (isCurrentUserAuthenticated()) {
			return getAuthenticatedAuthentication().getName();
		}

		return ANONYMOUS_NOT_AUTHENTICATED_USER;
	}

	public String getServer() {
		return config.getServer();
	}

	public boolean isCurrentUserAdmin() {
		org.acegisecurity.Authentication acegiAuthentication = getAuthenticatedAuthentication();
		if (acegiAuthentication instanceof VcoAuthenticationToken) {
			VcoAuthenticationToken vcoAuthenticationToken = ((VcoAuthenticationToken) acegiAuthentication);
			return vcoAuthenticationToken.isUserInAdminRole();
		}

		// this is supposed to be the case only in development/test env when no
		// any authentication exists.
		// in such a case, the shared vco user admin role is checked.
		if (config.isSharedSession() && ANONYMOUS_NOT_AUTHENTICATED_USER.equalsIgnoreCase(getCurrentUsername())) {
			if (sharedUser == null) {
				UtilService utilService = new UtilService(getSession());
				sharedUser = utilService.getCurrentUser();
			}
			return sharedUser != null && sharedUser.isAdminRights();
		}

		return false;
	}

	public void verifyCurrentUserIsAdmin() {
		if (!isCurrentUserAdmin()) {
			throw new AccessDeniedException("Only users with Admin rights can access this operation.");
		}
	}

	private org.acegisecurity.Authentication getAuthenticatedAuthentication() {
		SecurityContext context = SecurityContextHolder.getContext();
		if (context == null) {
			return null;
		}
		org.acegisecurity.Authentication authentication = context.getAuthentication();
		return authentication instanceof AnonymousAuthenticationToken ? null : authentication;
	}

	public boolean isCurrentUserAuthenticated() {
		return getAuthenticatedAuthentication() != null;
	}
	
	public String getConfiguration(String configKey) {
		return config.getConfiguration(configKey);
	}
	
	public String getJsonConnectionConfig() {
		 return config.getJsonConnectionConfig();
	}
	
	public synchronized void  storeConnectionConfigFromJson(String configValue) {
		//reset the cached values
		this.sharedSession = null;
		this.sharedUser = null;
		this.config.storeConnectionConfigFromJson(configValue);
	}

}
