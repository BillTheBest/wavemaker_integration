package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.util.Map;

import org.apache.commons.lang.Validate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.Link;
import com.vmware.o11n.sdk.rest.client.stubs.Linkable;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;
import com.vmware.o11n.sdk.rest.client.stubs.PermissionsList;

/**
 * Parent of all service. Users may not need to sublcass this class
 * as all endpoints are already represented by direct subclasses.
 * However it is a good starting point when trying to provide new features
 * as it contains several utility methods (downloading/uploading a file, etc.)
 * and has direct access to the RestTempalte associated with this {@link VcoSession}.
 *
 */
public abstract class AbstractService {

    protected static final MediaType APPLICATION_ZIP = MediaType.parseMediaType("application/zip");

    private final VcoSession session;

    public AbstractService(VcoSession session) {
        Validate.notNull(session, "session cannot be null");

        this.session = session;
    }

    public VcoSession getSession() {
        return session;
    }

    protected URI appendToRoot(String part) {
        return session.appendToRoot(part);
    }

    protected RestTemplate getRestTemplate() {
        return session.getRestTemplate();
    }

    protected URI buildUri(String part) {
        return getSession().appendToRoot(part);
    }

    protected <T> T getObjectAppending(String path, Class<? extends T> type) {
        try {
            return getRestTemplate().getForObject(appendToRoot(path), type);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                return null;
            } else {
                throw e;
            }
        }
    }

    protected String urlEncode(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
    protected PermissionsList getPermissions(String resourceHref) {
        return getObject(resourceHref + "/permissions", PermissionsList.class);
    }

    protected PermissionEntry getPermission(String resourceHref, String ruleId) {
        return getObject(resourceHref + "/permissions/" + ruleId, PermissionEntry.class);
    }

    protected void deleteAllPermissions(String resourceHref) {
        getRestTemplate().delete(resourceHref + "/permissions");
    }

    protected void deletePermission(String resourceHref, String ruleId) {
        getRestTemplate().delete(resourceHref + "/permissions/" + ruleId);
    }

    public void deletePermission(PermissionEntry permission) {
        getRestTemplate().delete(permission.getHref());
    }

    protected void createPermissions(String resourceHref, PermissionsList permissions) {
        getRestTemplate().postForLocation(resourceHref + "/permissions", permissions);
    }

    protected void updatePermission(String resourceHref, String ruleId, PermissionEntry permission) {
        getRestTemplate().postForLocation(resourceHref + "/permissions/" + ruleId, permission);
    }

    public void updatePermission(PermissionEntry permission) {
        getRestTemplate().postForLocation(permission.getHref(), permission);
    }

    protected String qs(AbstractQuerySpec query) {
        if (query != null) {
            return query.toQueryString();
        } else {
            return "";
        }
    }

    protected URI toUri(String uri) {
        try {
            return new URI(uri);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    protected Link findRelation(Linkable linkable, String relation) {
        for (Link link : linkable.getRelations().getLink()) {
            if (link.getRel().equals(relation)) {
                return link;
            }
        }

        return null;
    }

    protected Icon getIcon(URI linkHref) {
        String href = linkHref.toASCIIString();
        ResponseEntity<byte[]> data = getRestTemplate().getForEntity(href, byte[].class, (Map<?, ?>) null);
        String contentType = data.getHeaders().getContentType().toString();
        return new Icon(contentType, data.getBody(), href);
    }

    public <T> T getObject(Link link, Class<T> type) {
        try {
            return getObject(toUri(link.getHref()), type);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                return null;
            } else {
                throw e;
            }
        }
    }

    public <T> T getObject(URI location, Class<T> type) {
        try {
            return getRestTemplate().getForObject(location, type);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                return null;
            } else {
                throw e;
            }
        }
    }

    public <T> T getObject(String href, Class<T> type) {
        try {
            return getRestTemplate().getForObject(toUri(href), type);
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().equals(HttpStatus.NOT_FOUND)) {
                return null;
            } else {
                throw e;
            }
        }
    }

    protected ResponseEntity<Void> uploadFile(URI uri, File file) {
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<String, Object>();
        parts.add("file", new FileSystemResource(file));
        return getRestTemplate().postForEntity(uri, parts, Void.class);
    }

    @SuppressWarnings("unchecked")
    public <T> T getObject(Linkable linkable) {
        return (T) getObject(linkable.getHref(), linkable.getClass());
    }
}
