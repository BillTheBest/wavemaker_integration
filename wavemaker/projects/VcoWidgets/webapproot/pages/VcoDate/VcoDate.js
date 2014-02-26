dojo.declare("VcoDate", wm.Page, {
    
    constraints: null,
    decorators: null,
    dataValue: null,
    caption: null,

	start: function() {
	    this.dateField.setDataValue(this.dataValue);
        this.dateField.required = this.constraints && this.constraints.mandatory;
	},

	"preferredDevice": "desktop",

	dateFieldChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
		this.dataValue = this.dateField.dataValue;
	},
    
    clear: function() {
        this.dateField.clear();
    },
    
    isValid: function() {
        //TODO: set range validation
        return true;
    },

    setCaption: function(captionParam) {
        this.caption = captionParam;
        this.dateField.setCaption(this.caption);
    },
    
	_end: 0
});