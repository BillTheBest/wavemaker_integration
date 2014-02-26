package com.vmware.o11n.wm.security;

import java.io.Serializable;
import java.net.URI;

import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.authentication.Authentication;
import com.vmware.o11n.sdk.rest.client.services.NotificationListener;
import com.vmware.o11n.sdk.rest.client.stubs.User;

public class VcoUserSessionImpl implements VcoUserSession, Serializable {
	private static final long serialVersionUID = 4420628718978042230L;
	private final VcoSession vcoSession;
	private final boolean userWithAdminRights;

	public VcoUserSessionImpl(VcoSession vcoSession, User currentUser) {
		Assert.notNull(currentUser);
		Assert.notNull(vcoSession);
		this.vcoSession = vcoSession;
		this.userWithAdminRights = currentUser.isAdminRights();
	}

	@Override
	public RestTemplate getRestTemplate() {
		return vcoSession.getRestTemplate();
	}

	@Override
	public URI appendToRoot(String part) {
		return vcoSession.appendToRoot(part);
	}

	@Override
	public Authentication getAuthentication() {
		return vcoSession.getAuthentication();
	}

	@Override
	public void addListener(NotificationListener listener) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void removeListener(NotificationListener listener) {
		throw new UnsupportedOperationException();
	}

	@Override
	public void close() {
		vcoSession.close();
	}

	@Override
	public boolean isUserWithAdminRights() {
		return userWithAdminRights;
	}
}
