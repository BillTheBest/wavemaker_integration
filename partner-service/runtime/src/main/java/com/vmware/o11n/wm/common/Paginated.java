package com.vmware.o11n.wm.common;

import java.util.List;

import com.vmware.o11n.sdk.rest.client.stubs.Attribute;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Relations;

public abstract class Paginated {
	protected int total;
	protected int start;

	protected static boolean isEmpty(Relations relations) {
		return relations == null || relations.getLink() == null;
	}

	protected Paginated(Relations relations) {
		if (isEmpty(relations)) {
			return;
		}

		if (relations.getStart() != null) {
			this.start = relations.getStart();
		}

		if (relations.getTotal() != null) {
			this.total = relations.getTotal();
		}
	}

	protected void filter(Relations relations) {
		for (Link link : relations.getLink()) {
			if (link != null && link.getAttributes() != null && link.getAttributes().getAttribute() != null
					&& link.getAttributes().getAttribute().size() > 0) {
				addToList(link.getAttributes().getAttribute());
			}
		}
	}

	protected abstract void addToList(List<Attribute> attributes);
}
