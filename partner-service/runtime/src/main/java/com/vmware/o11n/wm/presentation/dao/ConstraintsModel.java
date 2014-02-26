/** Copyright 2011 VMware, Inc. All rights reserved. -- VMware Confidential */
package com.vmware.o11n.wm.presentation.dao;

/**
 * Represents the constraints assigned to a {@link FieldModel}.
 */
public class ConstraintsModel {
    /**
     * Defines if the field is mandatory.
     */
    private Boolean mandatory = false;
    /**
     * Defines the regular expression for that field to be validated by.
     */
    private String regExp;

    private RangeModel range;

    private boolean restrictDuplicates;

    public class RangeModel {
        private Object min;
        private Object max;

        public Object getMin() {
            return min;
        }

        public void setMin(Object min) {
            this.min = min;
        }

        public Object getMax() {
            return max;
        }

        public void setMax(Object max) {
            this.max = max;
        }
    }
    
    private String format;

    public Boolean getMandatory() {
        return mandatory;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }

    public String getRegExp() {
        return regExp;
    }

    public void setRegExp(String regExp) {
        this.regExp = regExp;
    }

    public RangeModel getRange() {
        return range;
    }

    public void setRange(RangeModel range) {
        this.range = range;
    }

    public boolean isRestrictDuplicates() {
        return restrictDuplicates;
    }

    public void setRestrictDuplicates(boolean restrictDuplicates) {
        this.restrictDuplicates = restrictDuplicates;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
