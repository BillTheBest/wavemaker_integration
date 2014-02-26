package com.vmware.o11n.wm.http;

import org.springframework.core.io.ByteArrayResource;

/**
 * This class is a workaround for NullPointerException thrown by the Spring
 * RestTemplate. The assumption there is that the Resource has always a file
 * name and throws exception because the default implementation of getFileName()
 * return null. The primary purpose of this class is to override getFileName()
 * to not return null.
 */
public class ByteArrayFileResource extends ByteArrayResource {
	private final String fileName;

	public ByteArrayFileResource(byte[] byteArray, String fileName) {
		super(byteArray);
		this.fileName = fileName;
	}

	@Override
	public String getFilename() throws IllegalStateException {
		return fileName;
	}

}
