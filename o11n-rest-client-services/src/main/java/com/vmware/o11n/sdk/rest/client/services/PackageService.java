package com.vmware.o11n.sdk.rest.client.services;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.Validate;
import org.springframework.http.ResponseEntity;

import com.vmware.o11n.sdk.rest.client.VcoSession;
import com.vmware.o11n.sdk.rest.client.stubs.PackageContentDetails;
import com.vmware.o11n.sdk.rest.client.stubs.PackageList;
/**
 *Entry point for all Package related operations.
 *
 */
public class PackageService extends AbstractService {

    public enum DeleteOption {
        PACKAGE_ONLY("deletePackage"), ENTIRE_CONTENT("deletePackageWithContent"), KEEP_SHARED("deletePackageKeepingShared");

        private String value;
        private DeleteOption(String value) {
            this.value = value;
        }
        public String getValue() {
            return value;
        }
    }

    public PackageService(VcoSession session) {
        super(session);

    }

    // GET /content/packages
    public PackageList getAllPackages() {
        return getObjectAppending("packages", PackageList.class);
    }

    // DELETE /content/packages/{packageName}?option=
    public void deletePackage(String packageName, DeleteOption option) {
        Validate.notEmpty(packageName, "packageName cannot be empty");
        Validate.notNull(option);
        getRestTemplate().delete(appendToRoot("packages/" + urlEncode(packageName) + "/?option=" + option.getValue()));
    }

    // DELETE /content/packages/{packageName}?option=deletePackage
    public void deletePackage(String packageName) {
        deletePackage(packageName, DeleteOption.PACKAGE_ONLY);
    }

    // GET /content/packages/{packageName}
    public void exportPackageToFile(String packageName, File localFile) throws IOException {
        Validate.notEmpty(packageName, "packageName cannot be empty");
        Validate.notNull(localFile, "localFile cannot be null");

        ResponseEntity<byte[]> forEntity = getSession().getRestTemplate().getForEntity(
                appendToRoot("packages/" + urlEncode(packageName) + "/"), byte[].class);

        FileUtils.writeByteArrayToFile(localFile, forEntity.getBody());
    }

    public PackageContentDetails getPackage(String name) {
        return getObjectAppending("packages/" + urlEncode(name), PackageContentDetails.class);
    }

    // POST /content/packages
    public PackageContentDetails importPackage(File packageContent, boolean overwrite) throws IOException {
        Validate.notNull(packageContent, "packageContent cannot be null");

        ResponseEntity<Void> entity = uploadFile(appendToRoot("packages/?overwrite=" + overwrite), packageContent);

        return getObject(entity.getHeaders().getLocation(), PackageContentDetails.class);
    }
}
