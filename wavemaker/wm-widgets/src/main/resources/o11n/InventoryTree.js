dojo.provide("common.packages.o11n.InventoryTree");
 
dojo.declare("o11n.InventoryTree", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "bottom",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
    deferDataLoad: false,
    _root: null,
    _currentNode: null,
    _pluginName: null,
    _type: null,
    selectedItem: null,
    start: function() {
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[WorkflowTree]: data load deferred...");
        }
    },

    load: function() {
        try {
            // Workaround for a *problem* "cannot call setData on undefined
            this.components.invTree.selectedItem = this.components.selectionVar;
            this._type = this.components.typeVar.getValue("dataValue");
            if (!this._type) {
                var errMessage = "InventoryTree: objType has not been set.";
                app.toastError(errMessage);
                throw errMessage;
            }
            if (this._type.indexOf(":") === -1) {
                this._type = "System/" + this._type + ":" + this._type;
            }
            this._pluginName = this._type.split(":")[0];
            this.components.pluginRoot.input.setValue("plugin", this._pluginName);
            this.components.pluginRoot.update();
        } catch (e) {
            app.toastError(this.name + ".start() Failed: " + e.toString());
        }
    },

    pluginRootResult: function(inSender, inDeprecated) {
        try {
            this._root = new wm.TreeNode(this.components.invTree.root, {
                content: "<span class=\"invRoot\">" + this._pluginName + "</span>"
            });
            var dataValue = this.components.pluginRoot.getValue("dataValue");
            if (dataValue === undefined) {
                throw "Plugin root data could not be retrieved";
            }
            var rootData = JSON.parse(dataValue);
            if (rootData instanceof Array) {
                for (var i = 0; i < rootData.length; i++) {
                    new wm.TreeNode(this._root, {
                        content: "<span class=\"" + rootData[i].type + "\">" + rootData[i].name + "</span>",
                        data: rootData[i],
                        _hasChildren: true,
                        closed: true,
                        initNodeChildren: dojo.hitch(this, "loadChildren")
                    });
                }
            } else {
                console.error("ERROR: Inventory root can not be parsed to array.");
                return;
            }
        } catch (e) {
            console.error('ERROR IN pluginRootResult: ' + e);
        }
    },

    loadChildren: function(inNode) {
        this._currentNode = inNode;
        this.components.getChildren.input.setValue("href", inNode.data.href);
        this.components.getChildren.update();
    },

    getChildrenResult: function(inSender, inDeprecated) {
        try {
            var data = JSON.parse(this.components.getChildren.getValue("dataValue"));
            if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    new wm.TreeNode(this._currentNode, {
                        content: "<span class=\"" + data[i].type + "\">" + data[i].name + "</span>",
                        data: data[i],
                        _hasChildren: true,
                        closed: true,
                        initNodeChildren: dojo.hitch(this, "loadChildren")
                    });

                }
            } else {
                console.error("ERROR: Inventory data can not be parsed to array.");
            }


        } catch (e) {
            console.error('ERROR IN getChildrenResult: ' + e);
        }
    },

    pluginRootError: function(inSender, inError) {
        console.error(inError);
        app.toastError(inError);
    },

    invTreeSelect: function(inSender, inNode, inSelectedDataList, inSelectedPropertyName, inSelectedPropertyValue) {
		this.selectedItem = inSelectedDataList[0];
	},
	_end: 0
});
 
o11n.InventoryTree.components = {
	pluginRoot: ["wm.ServiceVariable", {"operation":"getPluginRoot","service":"CatalogService"}, {"onError":"pluginRootError","onResult":"pluginRootResult"}, {
		input: ["wm.ServiceInput", {"type":"getPluginRootInputs"}, {}]
	}],
	getChildren: ["wm.ServiceVariable", {"operation":"getChildrenByHref","service":"CatalogService"}, {"onResult":"getChildrenResult"}, {
		input: ["wm.ServiceInput", {"type":"getChildrenByHrefInputs"}, {}]
	}],
	typeVar: ["wm.Variable", {"type":"StringData"}, {}],
	selectionVar: ["wm.Variable", {"type":"AnyData"}, {}],
	invTree: ["wm.PropertyTree", {"connectors":false,"height":"100%"}, {"onselect":"invTreeSelect"}]}
 
wm.publish(o11n.InventoryTree, [
	["objType", "typeVar.dataValue", {group: "Published", bindTarget: true}],
	["onSelect", "invTree.onselect", {group: "Published", isEvent: true}],
	["onDblclick", "invTree.ondblclick", {group: "Published", isEvent: true}]
]);
 
wm.registerPackage(["vCO Widgets", "InventoryTree", "o11n.InventoryTree", "common.packages.o11n.InventoryTree", "images/wm/widget.png", "Inventory Tree Selector", {width: "250px", height: "150px"},false]);