package com.vmware.o11n.wm.common;

import com.vmware.o11n.sdk.rest.client.services.AbstractQuerySpec;
import com.vmware.o11n.sdk.rest.client.services.Condition;
import com.vmware.o11n.sdk.rest.client.services.Order;

public class QuerySpec extends AbstractQuerySpec {
	private int maxResult;
	private int startIndex;
	private boolean queryCount;
	private String conditions;
	private String sortOrders;
	private String keys;
	private String search;

	private void init() {
		if (maxResult > 0)
			setParam("maxResult", maxResult);
		if (startIndex > 0)
			setParam("startIndex", startIndex);
		if (queryCount)
			setParam("queryCount", queryCount);
		if (conditions != null)
			setParam("conditions", conditions);
		if (sortOrders != null)
			setParam("sortOrders", sortOrders);
		if (keys != null)
			setParam("keys", keys);
	}

	@Override
	public String toString() {
		init();
		return toQueryString();
	}

	public QuerySpec addCondition(Condition param) {
		append("conditions", param);
		return this;
	}

	public QuerySpec addSortOrder(Order param) {
		append("sortOrder", param);
		return this;
	}
	
	public int getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(int maxResult) {
		this.maxResult = maxResult;
	}

	public int getStartIndex() {
		return startIndex;
	}

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

	public boolean isQueryCount() {
		return queryCount;
	}

	public void setQueryCount(boolean queryCount) {
		this.queryCount = queryCount;
	}

	public String getConditions() {
		return conditions;
	}

	public void setConditions(String conditions) {
		this.conditions = conditions;
	}

	public String getSortOrders() {
		return sortOrders;
	}

	public void setSortOrders(String sortOrders) {
		this.sortOrders = sortOrders;
	}

	public String getKeys() {
		return keys;
	}

	public void setKeys(String keys) {
		this.keys = keys;
	}

	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}
}
