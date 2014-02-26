dojo.provide("common.packages.o11n.ArrayChooser");
 
dojo.declare("o11n.ArrayChooser", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
	"preferredDevice": "desktop",
    
    item: null,

    arrayType: null,
    
    fieldType: null,
    
    maxListSize: 8,
    
	start: function() {
        this.components.label1.setCaption("Array of " + this.arrayType + " (coming soon)");
        
        if (this.fieldType == "SIMPLE") {
            var componentType;
            if (this.arrayType == "string") {
                componentType = "wm.Text";
            } else if (this.arrayType == "number") {
                componentType = "wm.Number";
            } else if (this.arrayType == "boolean") {
                componentType = "wm.Checkbox";
            } else if (this.arrayType == "Date") {
                componentType = "wm.Date";
            }

            this.item = this.components.itemPanel.createComponent("itemField_" + this.id, componentType, {
                showing: true,
                width: "500px",
                height: "24px",
                padding: "2, 5, 5, 10",
                caption: this.arrayType + ":",
                captionPosition: "left",
                captionAlign: "left",
                onEnterKeyPress: dojo.hitch(this, this.itemEnterKeyPress)
            });
        } else if (this.fieldType == "SDK_OBJECT") {
            this.item = this.components.itemPanel.createComponent("itemField_" + this.id + "_chooser", "o11n.InventoryTree",
                            {showing: true,
                             width: "500px",
                             height: "200px",
                             objType: this.arrayType,
                             onDblclick: dojo.hitch(this, this.objChooserDblclick)
                            });
        } else {
            this.item = this.components.itemPanel.createComponent("itemField_" + this.id + "_chooser", "o11n.ObjectFilter",
                            {showing: true,
                             width: "500px",
                             height: "200px",
                             objType: this.arrayType,
                             onDblclick: dojo.hitch(this, this.objChooserDblclick)
                            });
        }
	},

    itemEnterKeyPress: function(inSender, inEvent) {
        var simpleValue = inSender[0].dataValue;
        if (simpleValue) {
            this.addItem(simpleValue);
        }
        this.item.clear();
	},
    
    objChooserDblclick: function() {
        this.addItem(this.item.selectedItem.name, this.item.selectedItem);
    },
    
    addItem: function(nameParam, valueParam) {
        if (!valueParam) {
            valueParam = nameParam;
        }
        this.components.selectionVar.addItem({dataValue: {name: nameParam, value: valueParam}});
        if (this.components.selectionVar.getCount() >= this.maxListSize) {
            this.components.itemListPanel.fitToContentHeight = false;
            this.components.itemScrollerPanel.autoScroll = true;
        }
        this.parent.parent.parent.reflowParent();
    },
    
	deletePicClick: function(inSender) {
        if (!this.itemList.selectedItem.isEmpty()){
		    this.components.selectionVar.removeItem(this.itemList.getSelectedIndex());
            if (this.components.selectionVar.getCount() < this.maxListSize) {
                this.components.itemListPanel.fitToContentHeight = true;
                this.components.itemScrollerPanel.autoScroll = false;
            }
            if (this.components.selectionVar.getCount() === 0) {
                this.itemList.setHeight("100%");
            }
            this.parent.parent.parent.reflowParent();
        }
	},
	upPicClick: function(inSender) {
        var index = this.itemList.getSelectedIndex();
        // clone the item
        var thisItem = this.components.selectionVar.getItem(index);
        this.components.selectionVar.removeItem(index);
        this.components.selectionVar.addItem(thisItem, index - 1);
        this.itemList.selectByIndex(index - 1);
	},
	downPicClick: function(inSender) {
        var index = this.itemList.getSelectedIndex();
        // clone the item
        var thisItem = this.components.selectionVar.getItem(index);
        this.components.selectionVar.removeItem(index);
        this.components.selectionVar.addItem(thisItem, index + 1);
        this.itemList.selectByIndex(index + 1);
	},
	_end: 0
});
 
o11n.ArrayChooser.components = {
	selectionVar: ["wm.Variable", {"isList":true,"json":"[]","type":"AnyData"}, {}],
	label1: ["wm.Label", {"caption":"Array","padding":"4"}, {}],
	itemPanel: ["wm.Panel", {"fitToContentHeight":true,"height":"15px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}],
	itemListPanel: ["wm.Panel", {"fitToContentHeight":true,"height":"64px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		itemScrollerPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			itemList: ["wm.List", {"_classes":{"domNode":["GridListStyle"]},"autoSizeHeight":true,"columns":[{"show":true,"field":"dataValue.name","title":"Name","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","displayType":"Any","align":"left","formatFunc":""}],"headerVisible":false,"height":"100%","minDesktopHeight":60,"renderVisibleRowsOnly":false,"scrollToSelection":true}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"selectionVar","targetProperty":"dataSet"}, {}]
				}]
			}]
		}],
		panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"24px"}, {}, {
			deletePic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/deleteIconEnabled.png","width":"18px"}, {"onclick":"deletePicClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"${itemList.emptySelection}","targetProperty":"disabled"}, {}]
				}]
			}],
			upPic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/moveUp.png","width":"18px"}, {"onclick":"upPicClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"${itemList.emptySelection} || ${itemList.selectedIndex} == 0","targetProperty":"disabled"}, {}]
				}]
			}],
			downPic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/moveDown.png","width":"18px"}, {"onclick":"downPicClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"${itemList.emptySelection} || ${itemList.selectedIndex} == ${itemList.count} - 1","targetProperty":"disabled"}, {}]
				}]
			}]
		}]
	}]}
 
wm.registerPackage(["vCO Widgets", "ArrayChooser", "o11n.ArrayChooser", "common.packages.o11n.ArrayChooser", "images/wm/widget.png", "Array Chooser", {width: "250px", height: "150px"},false]);