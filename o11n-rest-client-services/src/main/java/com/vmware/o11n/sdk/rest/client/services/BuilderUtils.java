package com.vmware.o11n.sdk.rest.client.services;

import java.util.GregorianCalendar;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import com.vmware.o11n.sdk.rest.client.stubs.Linkable;
import com.vmware.o11n.sdk.rest.client.stubs.SdkObject;

public final class BuilderUtils {

    private BuilderUtils() {
    }

    /**
     * Helper method to construct a {@link XMLGregorianCalendar} from a Calendar instance
     * @param cal
     * @return
     */
    public static XMLGregorianCalendar toXml(GregorianCalendar cal) {
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(cal);
        } catch (DatatypeConfigurationException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Creates a {@link SdkObject} from a {@link Linkable} object most probably retrieved
     * by browsing the iventory/catalog service. 
     * @param catalogItem
     * @return
     */
    public static SdkObject newSdkObject(Linkable catalogItem) {
        SdkObject res = new SdkObject();
        res.setHref(catalogItem.getHref());
        return res;
    }

    /**
     * Creates a {@link SdkObject} from a type and id.
     * @param type must be in format Namespace:Type, for example VC:VirtualMachine
     * @param id the id is plugin specific free form string
     * @return
     */
    public static SdkObject newSdkObject(String type, String id) {
        SdkObject res = new SdkObject();
        res.setType(type);
        res.setId(id);
        return res;
    }
}
