dojo.declare("VcoNumber", wm.Page, {
constraints: null,
decorators: null,
caption: null,
captionPosition: "top",
captionAlign: "left",
_widget: null,
dataValue: null,
start: function() {
var widgetConfig = {
owner: this,
parent: this,
caption: this.caption,
width: "100%",
height: "50px",
captionPosition: this.captionPosition,
captionAlign: this.captionAlign,
dataValue: this.dataValue,
required: this.constraints ? this.constraints.mandatory : false
};
if (this.decorators && this.decorators.predefinedList && this.decorators.predefinedList.length > 0) {
var options = this.decorators.predefinedList[0];
for (var i=1; i<this.decorators.predefinedList.length; i++) {
options += ", " + this.decorators.predefinedList[i];
}
widgetConfig.options = options;
this._widget = new wm.SelectMenu(widgetConfig);
} else {
this._widget = new wm.Number(widgetConfig);
}
if (this.constraints && this.constraints.range) {
if (this.constraints.range.min) {
this._widget.setMinimum(this.constraints.range.min);
}
if (this.constraints.range.max) {
this._widget.setMaximum(this.constraints.range.max);
}
}
dojo.connect(this._widget, "onchange", this, function() {
this.dataValue = this._widget.dataValue;
if (this.decorators.refreshOnChange && this._widget.isValid()) {
dojo.publish("RefreshEvent");
}
});
},
clear: function() {
this._widget.clear();
},
isValid: function() {
return this._widget.isValid();
},
"preferredDevice": "desktop",
_end: 0
});

VcoNumber.widgets = {
compositePublisher1: ["wm.CompositePublisher", {"description":"Number Widget","displayName":"VcoNumber","group":"vCO Widgets","namespace":"o11n","publishName":"VcoNumber"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}]
};

VcoNumber.prototype._cssText = '';
VcoNumber.prototype._htmlText = '';