/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

import java.util.List;

/**
 *  Defines the presentation data model.
 */

public class PresentationModel extends BaseModel {

	private String id;
    /**
     * Indicates if the presentation is valid.
     */
    private Boolean valid = false;
    /**
     * Defines the steps in this presentation.
     */
    private List<StepModel> steps;
    
    private String name;
    
    private String description;
    
    /**
     * assigned after a valid presentation instance has been created/updated
     * and execution is started. It is temp id and not coming from the server.
     */
    private String associatedExecutionId;

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public List<StepModel> getSteps() {
        return steps;
    }

    public void setSteps(List<StepModel> steps) {
        this.steps = steps;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getAssociatedExecutionId() {
		return associatedExecutionId;
	}

	public void setAssociatedExecutionId(String associatedExecutionId) {
		this.associatedExecutionId = associatedExecutionId;
	}
}
