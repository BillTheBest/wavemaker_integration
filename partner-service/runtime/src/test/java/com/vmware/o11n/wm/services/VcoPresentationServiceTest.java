package com.vmware.o11n.wm.services;

import static com.vmware.o11n.wm.StubConstants.DISPLAY_ALL_LOCKS_WORKFLOW_ID;
import static com.vmware.o11n.wm.StubObjectFactory.getVcoConnectionService;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

import org.junit.Before;
import org.junit.Test;

import com.vmware.o11n.sdk.rest.client.stubs.Presentation;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;

public class VcoPresentationServiceTest {
	private VcoPresentationService presentationService;
	
	@Before
	public void setup() throws Exception {
		presentationService = new VcoPresentationServiceUnderTest(getVcoConnectionService());
	}

	@Test
	public void testGetPresentationByWorkflowId() {
		PresentationModel presentation = presentationService.getPresentation(DISPLAY_ALL_LOCKS_WORKFLOW_ID);
		assertNotNull(presentation);
	}
	
	private static class VcoPresentationServiceUnderTest extends VcoPresentationService{

		public VcoPresentationServiceUnderTest(VcoConnectionService service) {
			super(service);
		}
		
		@SuppressWarnings("unchecked")
		@Override
		protected <T> T getRestObjectAppendingToRoot(String path, Class<? extends T> type) {
			assertSame(Presentation.class, type);
			assertEquals("workflows/"+ DISPLAY_ALL_LOCKS_WORKFLOW_ID + "/presentation/", path);
			Presentation presentation = new Presentation();
			return (T) presentation;
		}
	}
	
}
