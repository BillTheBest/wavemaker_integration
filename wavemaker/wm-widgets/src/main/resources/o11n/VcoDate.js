dojo.provide("common.packages.o11n.VcoDate");
 
dojo.declare("o11n.VcoDate", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    
    constraints: null,
    decorators: null,
    dataValue: null,
    caption: null,

	start: function() {
	    this.components.dateField.setDataValue(this.dataValue);
        this.components.dateField.required = this.constraints && this.constraints.mandatory;
	},

	"preferredDevice": "desktop",

	dateFieldChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
		this.dataValue = this.components.dateField.dataValue;
	},
    
    clear: function() {
        this.components.dateField.clear();
    },
    
    isValid: function() {
        //TODO: set range validation
        return true;
    },

    setCaption: function(captionParam) {
        this.caption = captionParam;
        this.components.dateField.setCaption(this.caption);
    },
    
	_end: 0
});
 
o11n.VcoDate.components = {
	dateField: ["wm.DateTime", {"caption":"date:","captionAlign":"left","captionPosition":"top","captionSize":"22px","datePattern":"MMM dd, yy","desktopHeight":"48px","displayValue":"","height":"48px"}, {"onchange":"dateFieldChange"}]}
 
wm.publish(o11n.VcoDate, [
	["caption1", "dateField.caption", {group: "Published", bindTarget: true, type: "string"}],
	["onChange", "dateField.onchange", {group: "Published", isEvent: true}],
	["onEnterKeyPress", "dateField.onEnterKeyPress", {group: "Published", isEvent: true}]
]);
 
wm.registerPackage(["vCO Widgets", "VcoDate", "o11n.VcoDate", "common.packages.o11n.VcoDate", "images/wm/widget.png", "vCO Date", {width: "250px", height: "150px"},false]);