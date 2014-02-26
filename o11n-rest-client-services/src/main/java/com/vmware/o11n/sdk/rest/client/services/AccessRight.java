package com.vmware.o11n.sdk.rest.client.services;

/**
 * Represent on of the available access rights in vCO.
 * For information about access hierarchy consult vCO documentation.
 *
 */
public enum AccessRight {
    VIEW('r'), EDIT('c'), EXECUTE('x'), ADMIN('a'), INSPECT('i');
    private final char mnemonic;

    /**
     * Return the character representation of the AccessRight.
     * @return a single character as defind in vCO server
     */
    public char getMnemonic() {
        return mnemonic;
    }

    private AccessRight(char mnemonic) {
        this.mnemonic = mnemonic;
    }

    public static AccessRight forChar(char ch) {
        switch (ch) {
            case 'i':
                return INSPECT;
            case 'c':
                return EDIT;
            case 'r':
                return VIEW;
            case 'x':
                return EXECUTE;
            case 'a':
                return ADMIN;

            default:
                return null;
        }
    }
}
