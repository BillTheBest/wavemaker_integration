package com.vmware.o11n.sdk.rest.client.services;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

import com.vmware.o11n.sdk.rest.client.stubs.PermissionEntry;

/**
 * Value object class whos puprose is to simplify accessrights arithmetic.
 * It also provides a fluent interface for building a set of AccessRight object. 
 *
 */
public final class AccessRightSet {
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((permissions == null) ? 0 : permissions.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        AccessRightSet other = (AccessRightSet) obj;
        if (permissions == null) {
            if (other.permissions != null)
                return false;
        } else if (!permissions.equals(other.permissions))
            return false;
        return true;
    }

    public boolean contains(AccessRight ar) {
        return permissions.contains(ar);
    }

    private Set<AccessRight> permissions;

    private AccessRightSet() {
        this.permissions = new TreeSet<AccessRight>(new Comparator<AccessRight>() {
            @Override
            public int compare(AccessRight o1, AccessRight o2) {
                return o1.getMnemonic() - o2.getMnemonic();
            }
        });
    }

    private AccessRightSet(AccessRight p) {
        this.permissions.add(p);
    }

    public static AccessRightSet empty() {
        return new AccessRightSet();
    }

    public static AccessRightSet valueOf(PermissionEntry entry) {
        return valueOf(entry.getRights());
    }

    public static AccessRightSet valueOf(String s) {
        AccessRightSet res = empty();
        for (char ch : s.toCharArray()) {
            AccessRight r = AccessRight.forChar(ch);
            if (r != null) {
                res = res.add(r);
            }
        }

        return res;
    }

    public AccessRightSet add(AccessRight p) {
        AccessRightSet res = new AccessRightSet();
        res.permissions.addAll(this.permissions);
        res.permissions.add(p);
        return res;
    }

    public AccessRightSet remove(AccessRight p) {
        AccessRightSet res = new AccessRightSet();
        res.permissions.addAll(this.permissions);

        res.permissions.remove(p);
        return res;
    }

    public AccessRightSet union(AccessRightSet ps) {
        AccessRightSet res = new AccessRightSet();
        res.permissions.addAll(this.permissions);

        res.permissions.addAll(ps.permissions);
        return res;
    }

    /**
     * Converts this object to its string representation. For example "arx", "aci". 
     * @return An alphabetically sorted string ready to be used for {@link PermissionEntry#getRights()}
     */
    public String toMnemonic() {
        StringBuilder sb = new StringBuilder();
        for (AccessRight p : permissions) {
            sb.append(p.getMnemonic());
        }

        return sb.toString();
    }
}
