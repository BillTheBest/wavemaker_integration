package com.vmware.o11n.wm.security;

import java.io.Serializable;

import com.vmware.o11n.sdk.rest.client.VcoSession;

public interface VcoUserSession extends VcoSession, Serializable {
	boolean isUserWithAdminRights();
}
