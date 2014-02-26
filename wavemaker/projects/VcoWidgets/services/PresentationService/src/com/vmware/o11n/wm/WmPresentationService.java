package com.vmware.o11n.wm;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import com.vmware.o11n.wm.common.PresentationParameter;
import com.vmware.o11n.wm.presentation.dao.FieldModel;
import com.vmware.o11n.wm.presentation.dao.GroupModel;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;
import com.vmware.o11n.wm.presentation.dao.StepModel;
import com.vmware.o11n.wm.services.VcoPresentationService;
import com.wavemaker.common.util.IOUtils;
import com.wavemaker.runtime.RuntimeAccess;
import com.wavemaker.runtime.server.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * This is a client-facing service class. All public methods will be exposed to the client. Their return values and
 * parameters will be passed to the client or taken from the client, respectively. This will be a singleton instance,
 * shared between all requests.
 * 
 * To log, call the superclass method log(LOG_LEVEL, String) or log(LOG_LEVEL, String, Exception). LOG_LEVEL is one of
 * FATAL, ERROR, WARN, INFO and DEBUG to modify your log level. For info on these levels, look for tomcat/log4j
 * documentation
 */
public class WmPresentationService extends com.wavemaker.runtime.javaservice.JavaServiceSuperClass {
	private VcoPresentationService service;
    private String uploadDir = "";
	/*
	 * Pass in one of FATAL, ERROR, WARN, INFO and DEBUG to modify your log level; recommend changing this to FATAL or
	 * ERROR before deploying. For info on these levels, look for tomcat/log4j documentation
	 */
	public WmPresentationService(VcoPresentationService service) {
		super(INFO);
		this.service = service;
	}

	public PresentationModel getPresentation(String workflowId) {
		return service.getPresentation(workflowId);
	}

	public PresentationModel createPresentationInstance(String workflowId, List<PresentationParameter> params) {
		return service.createPresentationInstance(workflowId, params);
	}

	public PresentationModel updatePresentationInstance(String workflowId, String presentationId,
			List<PresentationParameter> params) {
		return service.updatePresentationInstance(workflowId, presentationId, params);
	}

	public PresentationModel runWorkflowPresentation(String workflowId, String presentationId,
			List<PresentationParameter> params) {
		return service.runWorkflowPresentation(workflowId, presentationId, params);
	}

	public PresentationModel getPresentationInstance(String workflowId, String presentationId) {
		return service.getPresentationInstance(workflowId, presentationId);
	}

	public PresentationModel deletePresentationInstance(String workflowId, String presentationId) {
		return service.deletePresentationInstance(workflowId, presentationId);
	}

	public PresentationModel getUserInteractionPresentation(String workflowId, String executionId) {
		return service.getUserInteractionPresentation(workflowId, executionId);
	}

	public PresentationModel createUserInteractionPresentationInstance(String workflowId, String executionId,
			List<PresentationParameter> params) {
		return service.createUserInteractionPresentationInstance(workflowId, executionId, params);
	}

	public PresentationModel updateUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId, List<PresentationParameter> params) {
		return service.updateUserInteractionPresentationInstance(workflowId, executionId, presentationExecutionId,
				params);
	}

	public PresentationModel answerUserInteractionPresentation(String workflowId, String executionId,
			String presentationExecutionId, List<PresentationParameter> params) {
		return service.answerUserInteractionPresentation(workflowId, executionId, presentationExecutionId, params);
	}

	public PresentationModel getUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId) {
		return service.getUserInteractionPresentationInstance(workflowId, executionId, presentationExecutionId);
	}

	public void deleteUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId) {
		service.deleteUserInteractionPresentationInstance(workflowId, executionId, presentationExecutionId);
	}

    /**
     * File upload handler, used from the MIME-TYPE chooser.
     *
     * @param file
     * @return
     * @throws IOException
     */
    public FileUploadResponse uploadFile(MultipartFile file) throws IOException
    {
        // Create our return object
        FileUploadResponse ret = new FileUploadResponse();
        try {
            /* Find our upload directory, make sure it exists */
            File dir = getUploadDir();
            if (!dir.exists())
                dir.mkdirs();

            /* Create a file object that does not point to an existing file.
             * Loop through names until we find a filename not already in use */
            String filename = file.getOriginalFilename(); /*.replaceAll("[^a-zA-Z0-9 ._-]","");*/
            boolean hasExtension = filename.indexOf(".") != -1;
            String name = (hasExtension) ?
                    filename.substring(0, filename.lastIndexOf(".")) : filename;
            String ext  = (hasExtension) ?
                    filename.substring(filename.lastIndexOf(".")) : "";
            File outputFile = new File(dir, filename);
            for (int i = 0; i < 10000 && outputFile.exists(); i++) {
                outputFile = new File(dir, name + i + ext);
            }

            /* Write the file to the filesystem */
            FileOutputStream fos = new FileOutputStream(outputFile);
            IOUtils.copy(file.getInputStream(), fos);
            file.getInputStream().close();
            fos.close();

            /* Setup the return object */
            ret.setPath(outputFile.getPath());
            ret.setError("");
            ret.setWidth("");
            ret.setHeight("");
        } catch(Exception e) {
            System.out.println("ERROR:" + e.getMessage() + " | " + e.toString());
            ret.setError(e.getMessage());
        }
        return ret;
    }

    protected File getUploadDir() {
        if (uploadDir.length() == 0) {
            uploadDir = RuntimeAccess.getInstance().getSession().getServletContext().getRealPath("resources/data");
        }
        File f = new File(uploadDir);
        f.mkdirs();
        return f;
    }


    /*
	 * Dummy getter, needed by the Service Variable to generate the stubs in types.js.
	 */
	public StepModel _StepStub() {
		throw new RuntimeException("Dummy method. Not to be called directly.");
	}

	/*
	 * Dummy getter, needed by the Service Variable to generate the stubs in types.js.
	 */
	public GroupModel _GroupStub() {
		throw new RuntimeException("Dummy method. Not to be called directly.");
	}

	/*
	 * Dummy getter, needed by the Service Variable to generate the stubs in types.js.
	 */
	public FieldModel _FieldStub() {
		throw new RuntimeException("Dummy method. Not to be called directly.");
	}

	/*
	 * Dummy getter, needed by the Service Variable to generate the stubs in types.js.
	 */
	public PresentationParameter _PresentationParameterStub() {
		throw new RuntimeException("Dummy method. Not to be called directly.");
	}

}
