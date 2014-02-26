package com.vmware.o11n.sdk.rest.client.services;

import com.vmware.o11n.sdk.rest.client.Notification;

public interface NotificationListener {
 
    public void onMessage(Notification msg);
    
}
