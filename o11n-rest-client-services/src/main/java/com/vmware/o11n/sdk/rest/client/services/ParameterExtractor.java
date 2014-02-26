package com.vmware.o11n.sdk.rest.client.services;

import java.util.Collections;
import java.util.List;

import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Array;
import com.vmware.o11n.sdk.rest.client.stubs.Composite;
import com.vmware.o11n.sdk.rest.client.stubs.Configuration;
import com.vmware.o11n.sdk.rest.client.stubs.Configuration.Attributes;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext;
import com.vmware.o11n.sdk.rest.client.stubs.ExecutionContext.Parameters;
import com.vmware.o11n.sdk.rest.client.stubs.MimeAttachment;
import com.vmware.o11n.sdk.rest.client.stubs.Parameter;
import com.vmware.o11n.sdk.rest.client.stubs.Properties;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;
import com.vmware.o11n.sdk.rest.client.stubs.SecureString;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution.InputParameters;
import com.vmware.o11n.sdk.rest.client.stubs.WorkflowExecution.OutputParameters;

/**
 * Fluent api for extracting {@link Parameter} objects by their name from collections
 * of  {@link Parameter}. Many entities are described by a collection of parameters, most notably
 * {@link WorkflowExecution} and {@link ExecutionContext}.
 * Saves keystrokes and your sanity. 
 * @see WorkflowExecution
 * @see Configuration
 * @see ExecutionContext
 *
 */
public final class ParameterExtractor {
    private List<Parameter> list;

    public ParameterExtractor() {
        list = null;
    }

    public ParameterExtractor fromTheOutputOf(WorkflowExecution workflowExecution) {
        OutputParameters temp = workflowExecution.getOutputParameters();
        if (temp != null) {
            list = temp.getParameter();
        } else {
            list = Collections.emptyList();
        }
        return this;
    }

    public ParameterExtractor fromTheExecutionContext(ExecutionContext executionContext) {
        Parameters temp = executionContext.getParameters();

        if (temp != null) {
            list = temp.getParameter();
        } else {
            list = Collections.emptyList();
        }
        return this;
    }

    public ParameterExtractor fromTheInputOf(WorkflowExecution workflowExecution) {
        InputParameters temp = workflowExecution.getInputParameters();

        if (temp != null) {
            list = temp.getParameter();
        } else {
            list = Collections.emptyList();
        }

        return this;
    }

    public ParameterExtractor fromTheConfiguration(Configuration configuration) {
        Attributes temp = configuration.getAttributes();
        if (temp != null) {
            list = temp.getAttribute();
        } else {
            list = Collections.emptyList();
        }

        return this;
    }

    public ParameterExtractor fromTheList(List<Parameter> params) {
        if (params != null) {
            list = params;
        } else {
            list = Collections.emptyList();
        }

        return this;
    }

    public SecureString extractSecureString(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getSecureString();
        } else {
            return null;
        }
    }

    public SdkObject extractSdkObject(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getSdkObject();
        } else {
            return null;
        }
    }

    public Properties extractProperties(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getProperties();
        } else {
            return null;
        }
    }

    public MimeAttachment extractMimeAttachment(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getMimeAttachment();
        } else {
            return null;
        }
    }

    public XMLGregorianCalendar extractDate(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getDate();
        } else {
            return null;
        }
    }

    public Composite extractComposite(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getComposite();
        } else {
            return null;
        }
    }

    public Double extractNumber(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getNumber();
        } else {
            return null;
        }
    }

    public String extractString(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getString();
        } else {
            return null;
        }
    }

    public Array extractArray(String name) {
        Parameter param = extractParam(name);
        if (param != null) {
            return param.getArray();
        } else {
            return null;
        }
    }

    public Parameter extractParam(String name) {
        if (list == null) {
            return null;
        }
        for (Parameter p : list) {
            if (p.getName().equals(name)) {
                return p;
            }
        }
        return null;
    }
}
