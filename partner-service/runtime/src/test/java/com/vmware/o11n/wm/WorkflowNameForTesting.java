package com.vmware.o11n.wm;

public enum WorkflowNameForTesting {
	Simple_Workflow("ce7fa0ff-00b5-498f-92c2-558cd2ed81c5", "simple-workflow"),
	Simple_User_Interaction("793f3fb6-f4cf-4ff5-b09b-45b8baac449c", "simple-user-interaction"),
	Simple_Presentation("7f6f17c1-3a28-4a0c-9d4e-ac0cab8e449f", "simple-presentation"),
	Longer_10sec_Running("51862e6d-683e-4e93-b597-908fb14189a5", "longer-10sec-running");
	
	private String workflowId;
	private String workflowName;

	WorkflowNameForTesting(String workflowId, String worklfowName) {
		this.workflowId = workflowId;
		this.workflowName = worklfowName;
	}

	public String getWorkflowId() {
		return workflowId;
	}

	public String getWorkflowName() {
		return workflowName;
	}
}
