package com.vmware.o11n.wm.common;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;
import com.vmware.o11n.wm.presentation.dao.UserInteractionModel;

public class PaginatedUserInteractions extends Paginated {
	private final static PaginatedUserInteractions EMPTY = new PaginatedUserInteractions(null);
	private final List<UserInteractionModel> list;

	public static PaginatedUserInteractions createPaginated(Relations relations) {
		if (isEmpty(relations)) {
			return EMPTY;
		}
		return new PaginatedUserInteractions(relations);
	}

	private PaginatedUserInteractions(Relations relations) {
		super(relations);
		if (isEmpty(relations)) {
			list = Collections.emptyList();
			return;
		}

		this.list = new ArrayList<UserInteractionModel>(relations.getLink().size());
		filter(relations);
	}

	@Override
	protected void addToList(List<Attribute> attributes) {
		this.list.add(new UserInteractionModel(attributes));
	}

	public List<UserInteractionModel> getList() {
		return list;
	}

	public int getTotal() {
		return total;
	}

	public int getStart() {
		return start;
	}
}
