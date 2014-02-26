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
}