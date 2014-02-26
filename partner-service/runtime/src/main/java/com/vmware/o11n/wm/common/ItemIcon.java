package com.vmware.o11n.wm.common;

import java.io.Serializable;
import java.util.Date;
import java.util.zip.CRC32;
import java.util.zip.Checksum;

public class ItemIcon implements Serializable {
	private static final long serialVersionUID = -7842364882729811643L;
	private final String contentType;
    private final byte[] data;
    private final String href;
    private final String workflowId;
    private long checksum;
    private Date modifiedSince;

    public ItemIcon(String contentType, byte[] data, String href, String workflowId) {
        this.contentType = contentType;
        this.data = data;
        this.href = href;
        this.workflowId = workflowId;
    }

    public String getHref() {
        return href;
    }

    public String getContentType() {
        return contentType;
    }

    public byte[] getData() {
        return data;
    }

	public long getChecksum() {
		if(checksum == 0) {
			checksum = calculateChecksum(data);
		}
		return checksum;
	}
	
	public Date getModifiedSince() {
		return modifiedSince;
	}
	
	public void setLastModifiedDate() {
		this.modifiedSince = new Date();
	}
	
	public String getWorkflowId() {
		return workflowId;
	}

	public static long calculateChecksum(byte[] bytes) {
		Checksum checksum = new CRC32();
		checksum.update(bytes, 0, bytes.length);
		return checksum.getValue();
	}
}
