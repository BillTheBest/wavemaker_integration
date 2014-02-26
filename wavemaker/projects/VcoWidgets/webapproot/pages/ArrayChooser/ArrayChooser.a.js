dojo.declare("ArrayChooser", wm.Page, {
"preferredDevice": "desktop",
caption: null,
arrayType: null,
fieldType: null,
basicChooser: null,
dataValue: null,
decorators: null,
constraints: null,
start: function() {
if (this.caption) {
this.arrayLabel.setCaption(this.caption);
}
},
setData: function(data) {
if (!data) {
return;
}
this.dataValue = [];
for (var i=0; i<data.length; i++) {
var item;
if (data[i] instanceof Date) {
item = {dataValue: {name: data[i].toLocaleString(), value: data[i].valueOf()}};
} else if (data[i] instanceof Object) {
item = {dataValue: {name: data[i].displayValue, value: {data: data[i].id}}};
} else {
item = {dataValue: {name: data[i], value: data[i]}};
}
this.dataValue.push(item);
}
this.updateDisplayValue();
},
selectBtnClick: function(inSender) {
var arrayDialog = main.createComponent("arrayChooser", "wm.DesignableDialog", {
showing: false,
modal: true,
width: "650px",
height: "450px",
useContainerWidget: true,
useButtonBar: true,
title: "Array Chooser"
});
this.basicChooser = arrayDialog.containerWidget.createComponent("basicArray", "o11n.BasicArrayChooser", {
showing: true,
width: "620px",
height: "100%",
caption: this.caption,
arrayType: this.arrayType,
fieldType: this.fieldType,
decorators: this.decorators,
constraints: this.constraints
});
if (this.dataValue !== null) {
this.basicChooser.setData(this.dataValue);
}
var buttonCancel = new wm.Button({
owner: this,
parent: arrayDialog.buttonBar,
width: "100px",
height: "32px",
caption: "Cancel"
});
dojo.connect(buttonCancel, "onclick", this, function() {
arrayDialog.dismiss();
});
var buttonOK = new wm.Button({
owner: this,
parent: arrayDialog.buttonBar,
width: "100px",
height: "32px",
caption: "OK"
});
dojo.connect(buttonOK, "onclick", this, function() {
arrayDialog.hide();
this.updateSelectedList();
});
this.basicChooser.reflow();
arrayDialog.show();
},
updateSelectedList: function () {
this.dataValue = [];
var count = this.basicChooser.selectedItems.getCount();
for (var i=0; i<count; i++) {
this.dataValue.push({dataValue: this.basicChooser.selectedItems.getData()[i].dataValue});
}
this.updateDisplayValue();
},
updateDisplayValue: function() {
var selList = "";
if (this.dataValue && this.dataValue.length > 0) {
selList = "Array [ ";
var itemCount = this.dataValue.length;
for (var i=0; i<itemCount; i++) {
selList += this.dataValue[i].dataValue.name;
if (i < itemCount-1) {
selList += ", ";
}
}
selList += " ]";
}
this.selectedList.setDataValue(selList);
},
_end: 0
});

ArrayChooser.widgets = {
componentPublisher: ["wm.CompositePublisher", {"description":"Array Chooser","displayName":"ArrayChooser","group":"vCO Widgets","namespace":"o11n","publishName":"ArrayChooser"}, {}],
selectedItems: ["wm.Property", {"bindTarget":undefined,"property":"selectionVar.queriedItems"}, {}],
layoutBox1: ["wm.Layout", {"height":"50px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
arrayLabel: ["wm.Label", {"caption":"Array Chooser","padding":"4","width":"478px"}, {}],
panel1: ["wm.Panel", {"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
selectedList: ["wm.Text", {"captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"disabled":true,"displayValue":"","width":"400px"}, {}],
selectBtn: ["wm.Button", {"caption":"Select...","desktopHeight":"24px","height":"24px","margin":"4"}, {"onclick":"selectBtnClick"}]
}]
}]
};

ArrayChooser.prototype._cssText = '';
ArrayChooser.prototype._htmlText = '';