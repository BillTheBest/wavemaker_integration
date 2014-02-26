package com.vmware.o11n.wm.common;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.wm.presentation.dao.WorkflowModel;

public class PaginatedWorkflows extends Paginated {
	private final static PaginatedWorkflows EMPTY = new PaginatedWorkflows(null);
	private final List<WorkflowModel> list;
	private Map<String, WorkflowModel> workflowsById;

	public static PaginatedWorkflows createPaginated(Relations relations) {
		if (isEmpty(relations)) {
			return EMPTY;
		}
		return new PaginatedWorkflows(relations);
	}

	private PaginatedWorkflows(Relations relations) {
		super(relations);
		if (isEmpty(relations)) {
			list = Collections.emptyList();
			return;
		}

		this.list = new ArrayList<WorkflowModel>(relations.getLink().size());
		filter(relations);
	}

	@Override
	protected void addToList(List<Attribute> attributes) {
		this.list.add(new WorkflowModel(attributes));
	}

	public List<WorkflowModel> getList() {
		return list;
	}

	public int getTotal() {
		return total;
	}

	public int getStart() {
		return start;
	}
	
	public WorkflowModel getWorkflow(String workflowId) {
		if(workflowsById == null) {
			workflowsById = new HashMap<String, WorkflowModel>(list.size());
			for (WorkflowModel workflow : list) {
				workflowsById.put(workflow.getId(), workflow);
			}
		}
		return workflowsById.get(workflowId);
	}

}
