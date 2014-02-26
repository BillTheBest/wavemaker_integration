dojo.declare("VcoText", wm.Page, {
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
if (this.constraints && this.constraints.regExp) {
widgetConfig.regExp = this.constraints.regExp;
}
if (this.constraints && this.constraints.range && this.constraints.range.max) {
widgetConfig.maxChars = this.constraints.range.max;
}
if (this.decorators && this.decorators.predefinedList && this.decorators.predefinedList.length > 0) {
var options = this.decorators.predefinedList[0];
for (var i=1; i<this.decorators.predefinedList.length; i++) {
options += ", " + this.decorators.predefinedList[i];
}
widgetConfig.options = options;
this._widget = new wm.SelectMenu(widgetConfig);
} else if (this.decorators && this.decorators.multiline) {
widgetConfig.height = "80px";
this._widget = new wm.LargeTextArea(widgetConfig);
} else {
this._widget = new wm.Text(widgetConfig);
}
dojo.connect(this._widget, "onchange", this, function() {
this.dataValue = this._widget.dataValue;
if (this.decorators && this.decorators.refreshOnChange && this.isValid()) {
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

VcoText.widgets = {
compositePublisher1: ["wm.CompositePublisher", {"description":"Text widget","displayName":"VcoText","group":"vCO Widgets","namespace":"o11n","publishName":"VcoText"}, {}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}]
};

VcoText.prototype._cssText = '';
VcoText.prototype._htmlText = '';