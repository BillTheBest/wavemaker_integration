dojo.declare("BasicArrayChooser", wm.Page, {
	"preferredDevice": "desktop",
    
    item: null,

    arrayType: null,
    
    fieldType: null,
    
    decorators: null,
    
    constraints: null,
    
	start: function() {
        this.label1.setCaption("Array of " + this.arrayType);
        
        if (this.fieldType == "SIMPLE") {
            var componentType;
            if (this.arrayType == "string") {
                componentType = "o11n.VcoText";
            } else if (this.arrayType == "number") {
                componentType = "o11n.VcoNumber";
            } else if (this.arrayType == "boolean") {
                componentType = "wm.Checkbox";
            } else if (this.arrayType == "Date") {
                componentType = "o11n.VcoDate";
            }
            
            var decoratorsParam = {};
            if (this.decorators && this.decorators.predefinedList) {
                decoratorsParam.predefinedList = this.decorators.predefinedList;
            }
            
            this.item = this.itemPanel.createComponent("itemField_" + this.id, componentType, {
                showing: true,
                width: "500px",
                height: "26px",
                padding: "2, 5, 5, 10",
                caption: this.arrayType + ":",
                captionPosition: "top",
                captionAlign: "left",
                decorators: decoratorsParam,
                constraints: {},
                onEnterKeyPress: dojo.hitch(this, this.itemEnterKeyPress)
            });
            if (this.arrayType == "Date") {
                this.item.setCaption(this.arrayType + ":");  
            }
            
            this.item.setHeight("50px");
            this.itemPanel.setHeight("50px");
            
        } else if (this.fieldType == "SDK_OBJECT") {
            this.item = this.itemPanel.createComponent("itemField_" + this.id + "_chooser", "o11n.InventoryTree",
                            {showing: true,
                             width: "500px",
                             height: "100%",
                             objType: this.arrayType,
                             onDblclick: dojo.hitch(this, this.objChooserDblclick)
                            });
        } else {
            this.item = this.itemPanel.createComponent("itemField_" + this.id + "_chooser", "o11n.ObjectFilter",
                            {showing: true,
                             width: "500px",
                             height: "100%",
                             objType: this.arrayType,
                             onDblclick: dojo.hitch(this, this.objChooserDblclick)
                            });
        }
	},

    itemEnterKeyPress: function() {
        var simpleValue = this.item.dataValue;
        if (simpleValue) {
            if (this.item.displayValue) {
                this.addItem(this.item.displayValue, simpleValue);
            } else if (this.item.type == "o11n.VcoDate") {
                this.addItem(this.getFormattedDate(simpleValue), simpleValue);
            } else {
                this.addItem(simpleValue);
            }
        }
        this.item.clear();
	},
    
    getFormattedDate: function (millis) {
        return (new Date(millis)).toLocaleString();
    },
    
    objChooserDblclick: function() {
        this.addItem(this.item.selectedItem.name, this.item.selectedItem);
    },
    
    addItem: function(nameParam, valueParam) {
        if (!valueParam) {
            valueParam = nameParam;
        }
        this.selectionVar.addItem({dataValue: {name: nameParam, value: valueParam}});
    },
    
    setData: function(data) {
        this.selectionVar.setData(data);
        this.itemList.selectByIndex(-1); //visualization workaround        
    },
    
	deletePicClick: function(inSender) {
        if (!this.itemList.selectedItem.isEmpty()){
		    this.selectionVar.removeItem(this.itemList.getSelectedIndex());
        }
	},

    upPicClick: function(inSender) {
        var index = this.itemList.getSelectedIndex();
        // clone the item
        var thisItem = this.selectionVar.getItem(index);
        this.selectionVar.removeItem(index);
        this.selectionVar.addItem(thisItem, index - 1);
        this.itemList.selectByIndex(index - 1);
	},

    downPicClick: function(inSender) {
        var index = this.itemList.getSelectedIndex();
        // clone the item
        var thisItem = this.selectionVar.getItem(index);
        this.selectionVar.removeItem(index);
        this.selectionVar.addItem(thisItem, index + 1);
        this.itemList.selectByIndex(index + 1);
	},

	insertBtnClick: function(inSender) {
        if (this.fieldType == "SIMPLE") {
		    this.itemEnterKeyPress();
        } else {
            this.objChooserDblclick();    
        }
	},
	_end: 0
});