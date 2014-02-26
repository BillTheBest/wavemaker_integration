package com.vmware.o11n.wm.services;

/* **********************************************************************
 * Copyright 2011 VMware, Inc. All rights reserved. VMware Confidential
 * *********************************************************************
 */

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import com.vmware.o11n.sdk.rest.client.stubs.*;
import com.vmware.o11n.wm.common.BaseParameter;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.Validate;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.stubs.PresentationExecution.OutputParameters;
import com.vmware.o11n.wm.common.PresentationParameter;
import com.vmware.o11n.wm.mapper.PresentationModelMapper;
import com.vmware.o11n.wm.presentation.dao.PresentationModel;
import org.springframework.mail.javamail.ConfigurableMimeFileTypeMap;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

public class VcoPresentationService extends VcoBaseService {
	private static final String INSTANCES = "instances/";

	public VcoPresentationService(VcoConnectionService service) {
		super(service);
	}

	// GET /workflows/{workflowId}/presentation
	public PresentationModel getPresentation(String workflowId) {
		Presentation presentation = getRestObjectAppendingToRoot(presentationUrl(workflowId), Presentation.class);
		if (presentation == null) {
			throw new RuntimeException("Presentation for workflow id: " + workflowId + " is not found.");
		}

		PresentationModel presentationModel = new PresentationModelMapper(presentation).getPresentationModel();
		return presentationModel;
	}

	// GET /workflows/{workflowId}/executions/{executionId}/interaction/presentation/
	public PresentationModel getUserInteractionPresentation(String workflowId, String executionId) {
		Presentation presentation = getRestObjectAppendingToRoot(
				userInteractionPresentationUrl(workflowId, executionId), Presentation.class);

		if (presentation == null) {
			throw new RuntimeException("User Interaction Presentation for workflow execution id: " + executionId
					+ " and workflow id: " + workflowId + " is not found or has been deleted!");
		}

		PresentationModel presentationModel = new PresentationModelMapper(presentation).getPresentationModel();
		return presentationModel;
	}

	// POST /workflows/{workflowId}/presentation/instances
	public PresentationModel createPresentationInstance(String workflowId, List<PresentationParameter> params) {
		return presentation(POST, presentationUrl(workflowId) + INSTANCES, params);
	}

	// POST /workflows/{workflowId}/presentation/instances/{presentationId}
	public PresentationModel updatePresentationInstance(String workflowId, String presentationId,
			List<PresentationParameter> params) {
		return presentation(POST, presentationUrl(workflowId, presentationId), params);
	}

	public PresentationModel runWorkflowPresentation(String workflowId, String presentationId,
			List<PresentationParameter> params) {
        adjustParams(params);
		String presentationUrl = presentationUrl(workflowId, presentationId);
		String workflowUrl = WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION;
		return execute(presentationUrl, workflowUrl, params);
	}

	// GET /workflows/{workflowId}/presentation/instances/{presentationId}
	public PresentationModel getPresentationInstance(String workflowId, String presentationId) {
		return presentation(GET, presentationUrl(workflowId, presentationId), null);
	}

	// DELETE /workflows/{workflowId}/presentation/instances/{presentationId}
	public PresentationModel deletePresentationInstance(String workflowId, String presentationId) {
		return presentation(DELETE, presentationUrl(workflowId, presentationId), null);
	}

	// POST /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances
	public PresentationModel createUserInteractionPresentationInstance(String workflowId, String executionId,
			List<PresentationParameter> params) {
		return presentation(POST, userInteractionPresentationUrl(workflowId, executionId) + INSTANCES, params);
	}

	// POST
	// /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances/{presentationExecutionId}
	public PresentationModel updateUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId, List<PresentationParameter> params) {
		return presentation(POST, userInteractionPresentationUrl(workflowId, executionId, presentationExecutionId),
				params);
	}

	public PresentationModel answerUserInteractionPresentation(String workflowId, String executionId,
			String presentationExecutionId, List<PresentationParameter> params) {
		String presentationUrl = userInteractionPresentationUrl(workflowId, executionId, presentationExecutionId);
		String workflowUrl = WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION + "/" + executionId
				+ "/interaction";
		return execute(presentationUrl, workflowUrl, params);
	}

	// GET /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances/{presentationExecutionId}
	public PresentationModel getUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId) {
		return presentation(GET, userInteractionPresentationUrl(workflowId, executionId, presentationExecutionId), null);
	}

	// DELETE
	// /workflows/{workflowId}/executions/{executionId}/interaction/presentation/instances/{presentationExecutionId}
	public void deleteUserInteractionPresentationInstance(String workflowId, String executionId,
			String presentationExecutionId) {
		presentation(DELETE, userInteractionPresentationUrl(workflowId, executionId, presentationExecutionId), null);
	}

	private PresentationModel execute(String presentationUrl, String workflowUrl, List<PresentationParameter> params) {
		URI presentationUri = getSession().appendToRoot(presentationUrl);
		ExecutionContext execContext = mapParameters(params);
		PresentationExecution presentationExecution = getSession().getRestTemplate().postForObject(presentationUri,
				execContext, PresentationExecution.class);

		PresentationModel presentationModel;
		if (presentationExecution.isValid()) {
			execContext = new ExecutionContext();
			OutputParameters outputParameters = presentationExecution.getOutputParameters();
			if (outputParameters != null && !outputParameters.getParameter().isEmpty()) {
				ExecutionContext.Parameters executionParam = new ExecutionContext.Parameters();
				execContext.setParameters(executionParam);
				executionParam.getParameter().addAll(outputParameters.getParameter());
			}

			URI workflowUri = getSession().appendToRoot(workflowUrl);
			ResponseEntity<Void> entity = getSession().getRestTemplate().postForEntity(workflowUri, execContext, Void.class);
			presentationModel = new PresentationModel();
			
	        URI location = entity.getHeaders().getLocation();
	        if(location != null) {
	        	String url = location.toString();
	        	int beginIndex = url.indexOf(workflowUrl) + workflowUrl.length() + 1;
	        	int endIndex = url.indexOf("/", beginIndex);
	        	String executionId = url.substring(beginIndex, endIndex);
	        	presentationModel.setAssociatedExecutionId(executionId);
	        }
			
			presentationModel.setValid(true);
			presentationModel.setId(presentationExecution.getId());
			
		} else {
			presentationModel = new PresentationModelMapper(presentationExecution).getPresentationModel();
		}

		return presentationModel;
	}

	private PresentationModel presentation(HttpMethod method, String urlPath, List<PresentationParameter> params) {
		PresentationExecution presentationExecution = null;
		URI url = getSession().appendToRoot(urlPath);
		if (DELETE == method) {
			getSession().getRestTemplate().delete(url);
			return null;
		} else if (POST == method) {
			ExecutionContext execContext = mapParameters(params);
			presentationExecution = getSession().getRestTemplate().postForObject(url.toString(), execContext,
					PresentationExecution.class);
		} else {
			presentationExecution = getSession().getRestTemplate().getForObject(url.toString(), PresentationExecution.class);
		}

		PresentationModel presentationModel = new PresentationModelMapper(presentationExecution).getPresentationModel();
		return presentationModel;
	}

	private String presentationUrl(String workflowId, String presentationId) {
		Validate.notEmpty(presentationId, "presentationId cannot be null");
		return presentationUrl(workflowId) + INSTANCES + presentationId;
	}

	private String presentationUrl(String workflowId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		return WORKFLOW_PART_URL + workflowId + PRESENTATION_PART_URL;
	}

	private String userInteractionPresentationUrl(String workflowId, String executionId, String presentationExecutionId) {
		Validate.notEmpty(presentationExecutionId, "presentationExecutionId cannot be null");
		return userInteractionPresentationUrl(workflowId, executionId) + INSTANCES + presentationExecutionId;
	}

	private String userInteractionPresentationUrl(String workflowId, String executionId) {
		Validate.notEmpty(workflowId, "workflowId cannot be null");
		Validate.notEmpty(executionId, "executionId cannot be null");
		return WORKFLOW_PART_URL + workflowId + "/" + WORKFLOW_EXECUTION + "/" + executionId
				+ "/interaction/presentation/";
	}

    private void adjustParams(List<PresentationParameter> params) {
    	if(params == null) {
    		return;
    	}
        for (PresentationParameter param : params) {
            Object value = param.getValue();
            if (value instanceof Long && BaseParameter.DATE_TYPE.equalsIgnoreCase(param.getType())) {
                param.setValue(getDateFromLong((Long) param.getValue()));
            } else if (value instanceof JSONArray) {
                List<Object> arrayValue = new ArrayList<Object>();
                int length = ((JSONArray) value).length();
                for (int i = 0; i < length; i++) {
                    Object item = null;
                    try {
                        item = ((JSONArray) value).get(i);
                        if (item instanceof JSONObject) {
                            String itemType = (String)((JSONObject) item).get("type");
                            Object itemValue = ((JSONObject) item).get("value");
                            // TODO add other types - date, properties, mime, composite, etc.
                            if (itemType.equals("string")) {
                                arrayValue.add((String) itemValue);
                            } else if ( itemType.equals("number")) {
                                arrayValue.add(itemValue instanceof Double ? itemValue
                                                                           : ((Long) itemValue).doubleValue());
                            } else if (BaseParameter.DATE_TYPE.equalsIgnoreCase(itemType)) {
                                arrayValue.add(getDateFromLong((Long) itemValue));
                            } else {
                                arrayValue.add(getSdkObjectFromJson((JSONObject) itemValue));
                            }
                        } else {
                            arrayValue.add(item);
                        }
                    } catch (JSONException e) {
                        throw new RuntimeException("JSON parse failed.", e);
                    }

                }
                param.setValue(arrayValue);
            } else if (value instanceof JSONObject) {
                if (BaseParameter.MIME_TYPE.equals(param.getType())) {
                    param.setValue(getMimeFromJson((JSONObject) value));
                } else {
                    param.setValue(getSdkObjectFromJson((JSONObject) value));
                }
            }
        }
    }

    private MimeAttachment getMimeFromJson(JSONObject value) {
        MimeAttachment mime = new MimeAttachment();
        try {
            mime.setName((String) value.get("name"));
            File file = new File((String) value.get("path"));
            InputStream stream = new FileInputStream(file);
            mime.setContent(IOUtils.toByteArray(stream));
            mime.setMimeType(guessMimeType(file));

        } catch (FileNotFoundException e) {
            throw new RuntimeException("File not found.", e);
        } catch (IOException e) {
            throw new RuntimeException("Unable to process stream.", e);
        } catch (JSONException e) {
            throw new RuntimeException("JSON parse failed.", e);
        }
        return mime;
    }

    private String guessMimeType(File file) throws IOException {
        String type;
        type = URLConnection.guessContentTypeFromStream(new FileInputStream(file));
        if (type == null) {
            type = URLConnection.guessContentTypeFromName(file.getName());
        }
        if (type == null) {
            type = new ConfigurableMimeFileTypeMap().getContentType(file);
        }
        return type;
    }

    private SdkObject getSdkObjectFromJson(JSONObject value) {
        SdkObject result = null;
        if (value instanceof JSONObject) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                result = mapper.readValue(((JSONObject) value).toString(), SdkObject.class);
            } catch (IOException e) {
                throw new RuntimeException("Unable to parse value object", e);
            }
        }
        return result;
    }

    private XMLGregorianCalendar getDateFromLong(Long value) {
        XMLGregorianCalendar xCal = null;
        Date date = new Date((value).longValue());
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);
        try {
            xCal = DatatypeFactory.newInstance().newXMLGregorianCalendar(cal);
        } catch (DatatypeConfigurationException e) {
            throw new RuntimeException("Unable to parse date.");
        }
        return xCal;
    }
}
