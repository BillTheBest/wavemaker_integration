/* **********************************************************************
 * Copyright 2012 VMware, Inc. All rights reserved. VMware Confidential
 * *******************************************************************
 */
package com.vmware.o11n.wm;

import com.wavemaker.runtime.pws.IPwsLoginManager;
import com.wavemaker.runtime.pws.PwsLoginInfo;

/**
 * This class is required by the wavemaker partner services framework
 */
public class VcoLoginManager implements IPwsLoginManager {

    private String partnerName;
    private String sessionId;

    public VcoLoginManager () {
    }

    @Override
    public String logIn(String serviceId) throws Exception {
        return null;
    }

    @Override
    public String logIn(PwsLoginInfo pwsLoginInfo) throws Exception {
        return null;
    }

    @Override
    public String logOut(String host, String port, String sessId) throws Exception {
        return null;
    }

    @Override
    public PwsLoginInfo getPwsLoginInfo() {
        return null;
    }

    @Override
    public String getSessionId() {
        return sessionId;
    }

    @Override
    public void setPartnerName(String s) {
        partnerName = s;
    }

    @Override
    public String getPartnerName() {
        return partnerName;
    }
}
