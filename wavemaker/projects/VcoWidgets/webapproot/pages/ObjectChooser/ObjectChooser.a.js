dojo.declare("ObjectChooser", wm.Page, {
"preferredDevice": "desktop",
_dialog: null,
_inventoryChooser: null,
_currentSelection: null,
isTree: true,
start: function() {
},
selectButtonClick: function(inSender) {
if (this._dialog === null) {
this._dialog = new wm.Dialog({
owner: this,
corner: "cc", // first letter is (t)op,(b)ottom or (c)enter; second letter is (l)eft, (r)ight or (c)enter
width: "500px", // do not use % size for a dialog
height: "500px",
title: this.typeVar.dataValue,
footerBorder: 20,
useContainerWidget: true, // if you just want a domNode and not a true container, set this to false.
modal: true
});
var contentPanel = new wm.Panel({
owner: this,
parent: this._dialog.containerWidget,
width: "100%",
height: "100%"
});
var sdkTypeVar = this.typeVar.dataValue;
var chooserType = this.isTree ? "o11n.InventoryTree" : "o11n.ObjectFilter";
this._inventoryChooser = contentPanel.createComponent(this.id + "_chooser", chooserType,
{showing: true,
width: "100%",
height: "100%",
objType: sdkTypeVar
});
dojo.connect(this._inventoryChooser, "onSelect", this, function(inSender, inData) {
this._currentSelection = this._inventoryChooser.selectedItem;
});
var buttonPanel = new wm.Panel({
owner: this,
parent: this._dialog.containerWidget,
layoutKind: "left-to-right",
horizontalAlign: "right",
width: "100%",
height: "32px"
});
var cancelButton = new wm.Button({
owner: this,
parent: buttonPanel,
width: "100px",
height: "32px",
caption: "Cancel"
});
dojo.connect(cancelButton, "onclick", this, function() {
this._dialog.hide();
});
var okayButton = new wm.Button({
owner: this,
parent: buttonPanel,
width: "100px",
height: "32px",
caption: "OK"
});
dojo.connect(this._inventoryChooser, "onDblclick", this, this.makeSelection);
dojo.connect(okayButton, "onclick", this, this.makeSelection);
}
this._dialog.show();
},
makeSelection: function() {
this.selectionVar.setValue("dataValue", this._currentSelection);
this.selectField.setDataValue(this.selectionVar.getValue("dataValue").name);
this._dialog.hide();
},
_end: 0
});

ObjectChooser.widgets = {
componentPublisher: ["wm.CompositePublisher", {"description":"vCO Presentation Object Chooser","displayName":"ObjectChooser","group":"vCO Widgets","namespace":"o11n","publishName":"ObjectChooser"}, {}],
caption: ["wm.Property", {"bindSource":undefined,"property":"selectField.caption","type":"string"}, {}],
typeVar: ["wm.Variable", {"type":"StringData"}, {}],
sdkType: ["wm.Property", {"bindSource":undefined,"property":"typeVar.dataValue"}, {}],
selectionVar: ["wm.Variable", {"type":"AnyData"}, {}],
selection: ["wm.Property", {"bindSource":undefined,"property":"selectionVar.dataValue"}, {}],
layoutBox1: ["wm.Layout", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom"}, {}, {
selectField: ["wm.Text", {"caption":"vCO Object","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"desktopHeight":"48px","displayValue":"","height":"48px","width":"100%"}, {}],
selectButton: ["wm.Button", {"caption":"Select","margin":"4"}, {"onclick":"selectButtonClick"}]
}]
};

ObjectChooser.prototype._cssText = '';
ObjectChooser.prototype._htmlText = '';