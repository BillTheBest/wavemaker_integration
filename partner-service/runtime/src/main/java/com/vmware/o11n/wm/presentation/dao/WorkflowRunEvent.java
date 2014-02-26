package com.vmware.o11n.wm.presentation.dao;

import java.util.Date;

import com.vmware.o11n.sdk.rest.client.stubs.LogEntry;

public class WorkflowRunEvent extends BaseModel {

	private String displayName;
	private String description;
	private String severity;
	private Date date;
	private String user;

	public WorkflowRunEvent(LogEntry entry) {
    	if(entry == null)
    		return;
    	 this.displayName = entry.getShortDescription();
    	 this.description = entry.getLongDescription();
    	 if(entry.getSeverity() != null) {
    		 this.severity =  entry.getSeverity().name();
    	 }
         this.user = entry.getUser();
         if (entry.getTimeStamp() != null) {
             this.date = entry.getTimeStamp().toGregorianCalendar().getTime();
         }
    }

	public String getDisplayName() {
		return displayName;
	}
	
	public String getDescription() {
		return description;
	}

	public String getSeverity() {
		return severity;
	}

	public Date getDate() {
		return date;
	}

	public String getUser() {
		return user;
	}

}
