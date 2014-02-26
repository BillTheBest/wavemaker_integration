dojo.declare("ObjectFilter", wm.Page, {
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
        this.searchVar.input.setValue("type", this.objType);
        this.searchVar.input.setValue("searchString", this.searchField.getDataValue());
		this.searchVar.update();
	},
	searchVarSuccess: function(inSender, inDeprecated) {
        this.objectList.setDataSet(this.searchVar);
	},
	objectListSelect: function(inSender, inItem) {
		// Workaround for the problem of not receiving inSender param in onSelect()
        // handler in ObjectChooser component.
        this.selectedItem = inSender.selectedItem.getData();
	},
	_end: 0
});