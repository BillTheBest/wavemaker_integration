package com.vmware.o11n.wm.presentation.dao;

import static org.junit.Assert.*;
import static com.vmware.o11n.wm.StubObjectFactory.getXMLDate;

import java.util.Date;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.LogEntry;
import com.vmware.o11n.sdk.rest.client.stubs.LogSeverity;
import com.vmware.o11n.sdk.rest.client.stubs.LogsList;


public class WorkflowRunEventTest {
	private WorkflowRunEvent workflowRunEvent;
	private LogEntry logEntry;

	@Before
	public void setUp() throws Exception {
		logEntry = new LogEntry();
		logEntry.setLongDescription("This is some description");
		logEntry.setSeverity(LogSeverity.DEBUG);
		logEntry.setShortDescription("Short description");
		logEntry.setTimeStamp(getXMLDate(new Date()));
		logEntry.setUser("some user");
	}

	@Test
	public void testMapWorkflowRunEventToLogEntry() {
		workflowRunEvent = new WorkflowRunEvent(logEntry);
		
		assertEquals(logEntry.getLongDescription(), workflowRunEvent.getDescription());
		assertEquals(logEntry.getShortDescription(), workflowRunEvent.getDisplayName());
		assertEquals(logEntry.getSeverity().name(), workflowRunEvent.getSeverity());
		assertEquals(logEntry.getUser(), workflowRunEvent.getUser());
		assertNotNull(logEntry.getTimeStamp());
	}
	
	
	@Test
	public void testMapLogListToListOfWorkflowRunEvents() {
		LogsList logsList = new LogsList();
		logsList.getEntry().add(logEntry);
		logsList.getEntry().add(logEntry);
		logsList.getEntry().add(logEntry);
		
		
		
		workflowRunEvent = new WorkflowRunEvent(logEntry);
		
		assertEquals(logEntry.getLongDescription(), workflowRunEvent.getDescription());
		assertEquals(logEntry.getShortDescription(), workflowRunEvent.getDisplayName());
		assertEquals(logEntry.getSeverity().name(), workflowRunEvent.getSeverity());
		assertEquals(logEntry.getUser(), workflowRunEvent.getUser());
		assertNotNull(logEntry.getTimeStamp());
	}
	
	

}
