package com.vmware.o11n.wm.services;

import java.io.IOException;
import java.util.Collections;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.vmware.o11n.sdk.rest.client.services.CatalogService;
import com.vmware.o11n.sdk.rest.client.services.Condition;
import com.vmware.o11n.sdk.rest.client.services.InventoryItemQuerySpec;
import com.vmware.o11n.sdk.rest.client.services.ResourceService;
import com.vmware.o11n.sdk.rest.client.stubs.CategoryType;
import com.vmware.o11n.sdk.rest.client.stubs.InventoryItemsList;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Resource;
import com.vmware.o11n.wm.http.ByteArrayFileResource;

public class VcoResourceService extends VcoBaseService {
	private final ObjectMapper jsonMapper;

	public VcoResourceService(VcoConnectionService connectionService, VcoCacheManager cacheManager) {
		super(connectionService, cacheManager);
		jsonMapper = new ObjectMapper();
		jsonMapper.setSerializationInclusion(Inclusion.NON_DEFAULT);
	}

	/**
	 * Retrieves a json serialized object from a vco resource file.
	 * 
	 * @param vcoResourceName - the name of the vco resource file where the json
	 *            serialized object has been stored.
	 * @param type of the object to be deserialized from json string.
	 * @return object deserialized from json string. Null will be returned if no
	 *         resource file with such an id.
	 */
	public <T> T retriveResourceValue(String vcoResourceName, Class<T> type) {
		Resource resource = null;
		String resourceId = getResourceId(vcoResourceName);
		if (resourceId != null) {
			ResourceService resourceService = new ResourceService(getSession());
			resource = resourceService.getResource(resourceId);
		}

		if (resource == null) {
			return null;
		}

		T value = null;
		try {
			byte[] resourceBytes = exportResource(resourceId);
			value = getJsonMapper().readValue(resourceBytes, type);
		} catch (Exception e) {
			logger.error("Exception during retrieve system resource.", e);
			throw new RuntimeException(e);
		}

		return value;
	}
	
	public byte[] retrieveResourceFileByName(String resourceName) {
		String resourceId = getResourceId(resourceName);
		return retrieveResourceFileById(resourceId);
	}

	public byte[] retrieveResourceFileById(String resourceId) {
		Resource resource = null;
		if (resourceId != null) {
			ResourceService resourceService = new ResourceService(getSession());
			resource = resourceService.getResource(resourceId);
		}

		if (resource == null) {
			return null;
		}

		try {
			byte[] exportedResource = exportResource(resourceId);
			byte[] newResource = new byte[exportedResource.length + 1];
			System.arraycopy(exportedResource, 0, newResource, 1, exportedResource.length);
			newResource[0] = " ".getBytes()[0];
			return newResource;
		} catch (Exception e) {
			logger.error("Exception during retrieve resource.", e);
			throw new RuntimeException(e);
		}
	}
	
	public String getResourceCategoryId(String resourceCatagegoryName) {
		return getParentCategoryResourceId(resourceCatagegoryName);
	}
	
	public void storeResourceFile(String vcoResourceName, String parentCategoryResourceId, byte[] value) {
		try {
			deleteStoredResource(vcoResourceName);
			importResource(parentCategoryResourceId, vcoResourceName, value);
		} catch (Exception e) {
			logger.error("Exception during storing resource.", e);
			throw new RuntimeException(e);
		}
	}

	/**
	 * Import a json serialized object into vCO Resource file with vcoResourceNam as the name of the file, which will be
	 * imported under the resource category with parentCategoryResourceName. Usually, this method is used in conjunction
	 * with the long lived cached for persistent (backup) write through cache. Before using this method, make sure that
	 * parentCategoryResourceName is defined in the system vCO package to be imported to vCO initially.
	 * 
	 * @param vcoResourceName
	 *            - the name of the resource file to be imported.
	 * @param parentCategoryResourceName
	 *            - the folder under which the resource will be imported. Note, the category must exists in vCO already
	 *            (defined in the system export package)
	 * @param value
	 *            - the object to be serialized to json.
	 */
	public void store(String vcoResourceName, String parentCategoryResourceName, Object value) {
		deleteStoredResource(vcoResourceName);
		String parentCategoryResourceId = getParentCategoryResourceId(parentCategoryResourceName);
		try {
			byte[] json = getJsonMapper().writeValueAsBytes(value);
			logger.info("Storing resouce with  id: " + parentCategoryResourceId);
			importResource(parentCategoryResourceId, vcoResourceName, json);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * Delete resource file in vCO by its resource file name. No action will be performed if the resource file doesn't
	 * exist.
	 * 
	 * @param vcoResourceName
	 *            = the name of the resource file.
	 */
	public void deleteStoredResource(String vcoResourceName) {
		String resourceId = getResourceId(vcoResourceName);
		if (resourceId != null) {
			logger.info("Deleting resource with resource id: " + resourceId);
			ResourceService resourceService = new ResourceService(getSession());
			resourceService.deleteResource(resourceId);
		}
	}

	private byte[] exportResource(String id) throws IOException {
		HttpHeaders map = new HttpHeaders();
		map.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));
		HttpEntity<Void> req = new HttpEntity<Void>((Void) null, map);
		ResponseEntity<byte[]> entity = getSession().getRestTemplate().exchange(
				getSession().appendToRoot("resources/" + id), HttpMethod.GET, req, byte[].class);

		return entity.getBody();
	}

	private String getParentCategoryResourceId(String parentCategoryResourceName) {
		String parentCategoryResourceId = getCacheManager().getLongLivedObject(
				"resources:" + parentCategoryResourceName, String.class);
		if (parentCategoryResourceId == null) {
			uploadSystemPackage();
			InventoryItemQuerySpec spec = new InventoryItemQuerySpec();
			spec.addCondition(Condition.equal("name", parentCategoryResourceName));
			InventoryItemsList categories = getCatalogService().findPluginObjects("System",
					CategoryType.RESOURCE_ELEMENT_CATEGORY.value(), spec);

			if (categories == null || categories.getLink().isEmpty()) {
				String errorMsg = "The system resource catalog folder with name '"
						+ parentCategoryResourceName
						+ "' is not found in the system. Possible reason might be that the system package is not imported.";
				logger.error(errorMsg);
				throw new RuntimeException(errorMsg);
			}

			Link categoryLink = categories.getLink().get(0);
			parentCategoryResourceId = extractIdFromUrl(categoryLink.getHref(), "System/ResourceElementCategory/");
			getCacheManager().putLongLivedObject("resources:" + parentCategoryResourceName, parentCategoryResourceId);
		}

		return parentCategoryResourceId;
	}

	private String getResourceId(String vcoResourceName) {
		InventoryItemQuerySpec spec = new InventoryItemQuerySpec();
		spec.addCondition(Condition.equal("name", vcoResourceName));
		InventoryItemsList resources = getCatalogService().findPluginObjects("System", "ResourceElement", spec);
		if (resources == null || resources.getLink().isEmpty()) {
			return null;
		}
		String systemCatalogResourceId = extractIdFromUrl(resources.getLink().get(0).getHref(),
				"System/ResourceElement/");

		return systemCatalogResourceId;
	}

	private void importResource(String parentCategoryResourceId, String resourceName, byte[] resource) {
		MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
		ByteArrayResource resourceContent = new ByteArrayFileResource(resource, resourceName);
		parts.add("file", resourceContent);
		getSession().getRestTemplate().postForEntity(
				getSession().appendToRoot("resources?categoryId=" + parentCategoryResourceId + "&force=true"), parts, Void.class);
	}

	private ObjectMapper getJsonMapper() {
		return jsonMapper;
	}

	private CatalogService getCatalogService() {
		return new CatalogService(getSession());
	}
}
