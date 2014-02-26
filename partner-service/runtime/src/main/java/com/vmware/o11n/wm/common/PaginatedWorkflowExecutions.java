package com.vmware.o11n.wm.common;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.wm.presentation.dao.WorkflowExecutionModel;

public class PaginatedWorkflowExecutions extends Paginated {
	private final static PaginatedWorkflowExecutions EMPTY = new PaginatedWorkflowExecutions(null);
	private final List<WorkflowExecutionModel> list;

	public static PaginatedWorkflowExecutions createPaginated(Relations relations) {
		if (isEmpty(relations)) {
			return EMPTY;
		}
		return new PaginatedWorkflowExecutions(relations);
	}

	private PaginatedWorkflowExecutions(Relations relations) {
		super(relations);
		if (isEmpty(relations)) {
			list = Collections.emptyList();
			return;
		}

		this.list = new ArrayList<WorkflowExecutionModel>(relations.getLink().size());
		filter(relations);
	}

	@Override
	protected void addToList(List<Attribute> attributes) {
		this.list.add(new WorkflowExecutionModel(attributes));
	}

	public List<WorkflowExecutionModel> getList() {
		return list;
	}

	public int getTotal() {
		return total;
	}

	public int getStart() {
		return start;
	}

}
