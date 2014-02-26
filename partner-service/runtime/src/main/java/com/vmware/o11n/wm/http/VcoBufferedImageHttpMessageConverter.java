package com.vmware.o11n.wm.http;

import java.awt.image.BufferedImage;
import java.io.IOException;

import org.springframework.http.HttpInputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.BufferedImageHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;

public class VcoBufferedImageHttpMessageConverter extends BufferedImageHttpMessageConverter {

	public VcoBufferedImageHttpMessageConverter() {
		super();
	}
	
	public boolean canRead(Class<?> clazz, MediaType mediaType) {
		return super.canRead(clazz, cleanMediaType(mediaType));
	}

	public BufferedImage read(Class<? extends BufferedImage> clazz, HttpInputMessage inputMessage)
			throws IOException, HttpMessageNotReadableException {
		MediaType mediaType = inputMessage.getHeaders().getContentType();
		inputMessage.getHeaders().setContentType(cleanMediaType(mediaType));
		return super.read(clazz, inputMessage);
	}

	private MediaType cleanMediaType(MediaType mediaType) {
		if(mediaType != null) {
			String mediaTypeStr = mediaType.toString();
			if(mediaTypeStr.indexOf(MediaType.IMAGE_PNG_VALUE) != -1) {
				return MediaType.IMAGE_PNG;
			}
			if(mediaTypeStr.indexOf(MediaType.IMAGE_JPEG_VALUE) != -1) {
				return MediaType.IMAGE_JPEG;
			}
			if(mediaTypeStr.indexOf(MediaType.IMAGE_GIF_VALUE) != -1) {
				return MediaType.IMAGE_GIF;
			}
		}
		
		return mediaType;
	}
}
