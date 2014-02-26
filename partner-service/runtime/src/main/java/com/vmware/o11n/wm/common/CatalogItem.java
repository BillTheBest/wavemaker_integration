package com.vmware.o11n.wm.common;

import java.io.Serializable;


public interface CatalogItem extends Serializable{
	String getId();
	String getName();
	String getDescription();
	String getIconHref();
	String getCategoryName();
	String getCategoryId();
}
