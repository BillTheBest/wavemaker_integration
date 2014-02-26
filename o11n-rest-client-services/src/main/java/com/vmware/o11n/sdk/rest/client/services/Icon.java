package com.vmware.o11n.sdk.rest.client.services;

/**
 * 
 * Wraps all information for a customized workflow icon.
 */
public class Icon {
    private final String contentType;
    private final byte[] data;
    private final String href;

    public Icon(String contentType, byte[] data, String href) {
        this.contentType = contentType;
        this.data = data;
        this.href = href;
    }

    public String getHref() {
        return href;
    }

    /**
     * @return the contentType <Describe purpose of {@link #contentType}> <Describe meaning of special values like null>
     */
    public String getContentType() {
        return contentType;
    }

    /**
     * @return the data <Describe purpose of {@link #data}> <Describe meaning of special values like null>
     */
    public byte[] getData() {
        return data;
    }
}
