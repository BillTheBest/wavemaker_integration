dojo.provide("common.packages.o11n.ObjectFilter");
 
dojo.declare("o11n.ObjectFilter", wm.Composite, {
  horizontalAlign: "right",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    objType: null,
    timeout: null,
    selectedItem: null,
	start: function() {
		
	},
	"preferredDevice": "desktop",

    searchFieldChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(dojo.hitch(this, this.updateVar), 1000);
    },
    updateVar: function() {
        //TODO: implement short delay
        this.components.searchVar.input.setValue("type", this.objType);
        this.components.searchVar.input.setValue("searchString", this.components.searchField.getDataValue());
		this.components.searchVar.update();
	},
	searchVarSuccess: function(inSender, inDeprecated) {
        this.components.objectList.setDataSet(this.components.searchVar);
	},
	objectListSelect: function(inSender, inItem) {
		// Workaround for the problem of not receiving inSender param in onSelect()
        // handler in ObjectChooser component.
        this.selectedItem = inSender.selectedItem.getData();
	},
	_end: 0
});
 
o11n.ObjectFilter.components = {
	searchVar: ["wm.ServiceVariable", {"autoUpdate":true,"inFlightBehavior":"executeLast","operation":"getItemsBySearchString","service":"CatalogService"}, {"onSuccess":"searchVarSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getItemsBySearchStringInputs"}, {}]
	}],
	searchField: ["wm.Text", {"caption":"Search","changeOnKey":true,"dataValue":undefined,"displayValue":"","width":"60%"}, {"onchange":"searchFieldChange"}],
	objectList: ["wm.List", {"_classes":{"domNode":["GridListStyle"]},"border":"1","columns":[{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"data","title":"Data","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"type","title":"Type","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"href","title":"Href","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n","mobileColumn":false}],"headerVisible":false,"height":"100%","minDesktopHeight":60}, {"onSelect":"objectListSelect"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"searchVar","targetProperty":"dataSet"}, {}]
		}]
	}]}
 
wm.publish(o11n.ObjectFilter, [
	["onSelect", "objectList.onSelect", {group: "Published", isEvent: true}],
	["onDblclick", "objectList.ondblclick", {group: "Published", isEvent: true}]
]);
 
wm.registerPackage(["vCO Widgets", "ObjectFilter", "o11n.ObjectFilter", "common.packages.o11n.ObjectFilter", "images/wm/widget.png", "Filtering object chooser", {width: "250px", height: "150px"},false]);