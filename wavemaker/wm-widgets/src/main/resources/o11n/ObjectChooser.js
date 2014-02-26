dojo.provide("common.packages.o11n.ObjectChooser");
 
dojo.declare("o11n.ObjectChooser", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "bottom",
  layoutKind: "left-to-right",
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
                title: this.components.typeVar.dataValue,
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

            var sdkTypeVar = this.components.typeVar.dataValue;

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
                this.components.selectionVar.setValue("dataValue", this._currentSelection);
                this.components.selectField.setDataValue(this.components.selectionVar.getValue("dataValue").name);
                this._dialog.hide();
    },

	_end: 0
});
 
o11n.ObjectChooser.components = {
	typeVar: ["wm.Variable", {"type":"StringData"}, {}],
	selectionVar: ["wm.Variable", {"type":"AnyData"}, {}],
	selectField: ["wm.Text", {"caption":"vCO Object","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"desktopHeight":"48px","displayValue":"","height":"48px","width":"100%"}, {}],
	selectButton: ["wm.Button", {"caption":"Select","margin":"4"}, {"onclick":"selectButtonClick"}]}
 
wm.publish(o11n.ObjectChooser, [
	["caption", "selectField.caption", {group: "Published", bindTarget: true, type: "string"}],
	["sdkType", "typeVar.dataValue", {group: "Published", bindTarget: true}],
	["selection", "selectionVar.dataValue", {group: "Published", bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "ObjectChooser", "o11n.ObjectChooser", "common.packages.o11n.ObjectChooser", "images/wm/widget.png", "vCO Presentation Object Chooser", {width: "250px", height: "150px"},false]);