dojo.declare("InventoryTree", wm.Page, {
"preferredDevice": "desktop",
deferDataLoad: false,
_root: null,
_currentNode: null,
_pluginName: null,
_type: null,
_server: null,
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
this.invTree.selectedItem = this.selectionVar;
this._type = this.typeVar.getValue("dataValue");
if (!this._type) {
var errMessage = "InventoryTree: objType has not been set.";
app.toastError(errMessage);
throw errMessage;
}
if (this._type.indexOf(":") === -1) {
this._type = "System/" + this._type + ":" + this._type;
}
this._pluginName = this._type.split(":")[0];
this.pluginRoot.input.setValue("plugin", this._pluginName);
this.pluginRoot.update();
} catch (e) {
app.toastError(this.name + ".start() Failed: " + e.toString());
}
},
pluginRootResult: function(inSender, inDeprecated) {
try {
var dataValue = this.pluginRoot.getValue("dataValue");
if (dataValue === undefined) {
throw "Plugin root data could not be retrieved";
}
var parsedData = JSON.parse(dataValue);
this.server = parsedData["server"];
var rootData = parsedData["inventory"];
this._root = new wm.TreeNode(this.invTree.root, {
content: "<span style=\"background-image:url('https://" + this.server + ":8281/vmo/app?service=pluginimage&type=" + this._pluginName + "')\">" + this._pluginName + "</span>",
canSelect: false
});
if (rootData instanceof Array) {
for (var i = 0; i < rootData.length; i++) {
new wm.TreeNode(this._root, {
//todo: fix port!!!
content: "<span style=\"background-image:url('https://" + this.server + ":8281/vmo/app?service=pluginimage&type=" + this._pluginName + ":" + rootData[i].type + "')\">" + rootData[i].name + "</span>",
data: rootData[i],
_hasChildren: true,
closed: true,
canSelect: this._pluginName + ":" + rootData[i].type == this._type,
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
this.getChildren.input.setValue("href", inNode.data.href);
this.getChildren.update();
},
getChildrenResult: function(inSender, inDeprecated) {
try {
var data = JSON.parse(this.getChildren.getValue("dataValue"));
if (data instanceof Array) {
for (var i = 0; i < data.length; i++) {
new wm.TreeNode(this._currentNode, {
content: "<span style=\"background-image:url('https://" + this.server + ":8281/vmo/app?service=pluginimage&type=" + this._pluginName + ":" +data[i].type + "')\">" + data[i].name + "</span>",
data: data[i],
_hasChildren: true,
closed: true,
canSelect: this._pluginName + ":" + data[i].type == this._type,
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

InventoryTree.widgets = {
pluginRoot: ["wm.ServiceVariable", {"operation":"getPluginRoot","service":"CatalogService"}, {"onError":"pluginRootError","onResult":"pluginRootResult"}, {
input: ["wm.ServiceInput", {"type":"getPluginRootInputs"}, {}]
}],
getChildren: ["wm.ServiceVariable", {"operation":"getChildrenByHref","service":"CatalogService"}, {"onResult":"getChildrenResult"}, {
input: ["wm.ServiceInput", {"type":"getChildrenByHrefInputs"}, {}]
}],
componentPublisher: ["wm.CompositePublisher", {"description":"Inventory Tree Selector","displayName":"InventoryTree","group":"vCO Widgets","namespace":"o11n","publishName":"InventoryTree"}, {}],
typeVar: ["wm.Variable", {"type":"StringData"}, {}],
objType: ["wm.Property", {"bindSource":undefined,"property":"typeVar.dataValue"}, {}],
selectionVar: ["wm.Variable", {"type":"AnyData"}, {}],
onSelect: ["wm.Property", {"isEvent":true,"property":"invTree.onselect","type":"string"}, {}],
onDblclick: ["wm.Property", {"isEvent":true,"property":"invTree.ondblclick","type":"string"}, {}],
treeLayout: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"bottom"}, {}, {
invTree: ["wm.PropertyTree", {"connectors":false,"height":"100%"}, {"onselect":"invTreeSelect"}]
}]
};

InventoryTree.prototype._cssText = '';
InventoryTree.prototype._htmlText = '';