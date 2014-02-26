WorkflowTree.widgets = {
	childCategory: ["wm.ServiceVariable", {"operation":"getCategory","service":"CategoryService"}, {"onResult":"childCategoryResult"}, {
		input: ["wm.ServiceInput", {"type":"getCategoryInputs"}, {}]
	}],
	rootCategories: ["wm.ServiceVariable", {"operation":"getCategoryRoot","service":"CategoryService"}, {"onResult":"rootCategoriesResult"}, {
		input: ["wm.ServiceInput", {"type":"getCategoryRootInputs"}, {}]
	}],
	rootTreeData: ["wm.ServiceVariable", {"operation":"getRootTreeData","service":"CategoryService"}, {"onResult":"rootTreeDataResult"}, {
		input: ["wm.ServiceInput", {"type":"getRootTreeDataInputs"}, {}]
	}],
	onSelect: ["wm.Property", {"isEvent":true,"property":"workflowTree.onselect","type":"string"}, {}],
	workflowTreePublisher: ["wm.CompositePublisher", {"description":"vCO Inventory Tree","displayName":"WorkflowTree","group":"vCO Widgets","height":"250px","namespace":"o11n","publishName":"WorkflowTree","width":"150px"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		serviceError: ["wm.Label", {"caption":"CategoryService not available","padding":"4","showing":false}, {}],
		workflowTree: ["wm.PropertyTree", {"configJson":"{}","connectors":false,"height":"100%"}, {}]
	}]
}