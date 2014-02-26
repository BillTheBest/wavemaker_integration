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

VcoDate.widgets = {
compositePublisher1: ["wm.CompositePublisher", {"description":"vCO Date","displayName":"VcoDate","group":"vCO Widgets","namespace":"o11n","publishName":"VcoDate"}, {}],
caption1: ["wm.Property", {"bindSource":undefined,"property":"dateField.caption","type":"string"}, {}],
onChange: ["wm.Property", {"isEvent":true,"property":"dateField.onchange","type":"string"}, {}],
onEnterKeyPress: ["wm.Property", {"isEvent":true,"property":"dateField.onEnterKeyPress","type":"string"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
dateField: ["wm.DateTime", {"caption":"date:","captionAlign":"left","captionPosition":"top","captionSize":"22px","datePattern":"MMM dd, yy","desktopHeight":"48px","displayValue":"","height":"48px"}, {"onchange":"dateFieldChange"}]
}]
};

VcoDate.prototype._cssText = '';
VcoDate.prototype._htmlText = '';