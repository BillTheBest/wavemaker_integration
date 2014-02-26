package com.vmware.o11n.wm.common;

public class FilterType {
	private Object value;
	private String displayValue;

	public FilterType() {
	}

	public FilterType(Object value, String displayValue) {
		this.value = value;
		this.displayValue = displayValue;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getDisplayValue() {
		return displayValue;
	}

	public void setDisplayValue(String displayValue) {
		this.displayValue = displayValue;
	}
}
