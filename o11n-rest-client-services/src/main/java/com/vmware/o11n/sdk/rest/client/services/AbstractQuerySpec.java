package com.vmware.o11n.sdk.rest.client.services;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Parent of all Queries. Users may not need to extend this class
 * as for every service method that can be parameterized by a spec
 * there is already a subclass provided.
 * @see InventoryItemQuerySpec 
 *
 */
public abstract class AbstractQuerySpec {

    private Map<String, Object> params;

    public AbstractQuerySpec() {
        params = new LinkedHashMap<String, Object>();
    }

    protected void setParam(String name, String value) {
        params.put(name, value);
    }

    protected void setParam(String name, Collection<?> value) {
        params.put(name, value);
    }

    @SuppressWarnings("unchecked")
    protected <T> void append(String name, T obj) {
        Object object = params.get(name);
        if (object == null) {
            object = new ArrayList<T>();
            params.put(name, object);
        }

        if (object instanceof Collection<?>) {
            Collection<T> coll = (Collection<T>) object;
            coll.add(obj);
        }
    }

    @SuppressWarnings("unchecked")
    public final String toQueryString() {
        if (params.isEmpty()) {
            return "";
        } else {
            StringBuilder sb = new StringBuilder("?");
            for (Map.Entry<String, Object> e : params.entrySet()) {
                if (e.getValue() instanceof Collection<?>) {
                    Collection<?> c = (Collection<String>) e.getValue();
                    if (!c.isEmpty()) {
                        for (Object v : c) {
                            sb.append(encode(e.getKey()));
                            sb.append("=");
                            sb.append(encode(v));
                            sb.append("&");
                        }
                    }
                } else {
                    sb.append(encode(e.getKey()));
                    sb.append("=");
                    sb.append(encode(e.getValue()));
                    sb.append("&");
                }
            }

            sb.delete(sb.length() - 1, sb.length());
            return sb.toString();
        }
    }

    protected void setParam(String name, int value) {
        setParam(name, "" + value);
    }

    protected void setParam(String name, boolean value) {
        setParam(name, "" + value);
    }

    private String encode(Object v) {
        if (v instanceof QueryParam) {
            QueryParam qp = (QueryParam) v;
            return encode(qp.toParamValue());
        } else {
            try {
                return URLEncoder.encode(v.toString(), "UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
