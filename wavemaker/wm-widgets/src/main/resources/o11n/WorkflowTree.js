dojo.provide("common.packages.o11n.WorkflowTree");
 
dojo.declare("o11n.WorkflowTree", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
    deferDataLoad: false,
    _rootNode: null,
    _catNode: null,
    start: function() {
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[WorkflowTree]: data load deferred...");
        }
    },
    load: function() {
        try {
            console.log("[WorkflowTree]: data loading started...");
            this.components.rootTreeData.update();
        } catch (e) {
            app.toastError(this.name + ".start() Failed: " + e.toString());
        }
    },
    rootTreeDataResult: function(inSender, inDeprecated) {
        try {
            var rootData = this.components.rootTreeData.getValue("dataValue");
            this._rootNode = new wm.TreeNode(this.components.workflowTree.root, {
                content: "<span class=\"catRoot\">" + rootData + "</span>"
            });
            this.components.rootCategories.update();
        } catch (e) {
            console.error('[WorkflowTree][Error][rootTreeDataResult]: ' + e);
        }
    },
    rootCategoriesResult: function(inSender, inDeprecated) {
        try {
            var rootCatContent = this.components.rootCategories.getValue("dataValue");
            var jsonRes = JSON.parse(rootCatContent);
            if (jsonRes instanceof Array) {
                for (var i = 0; i < jsonRes.length; i++) {
                    var contentObj;
                    if (jsonRes[i].type == "Error") {
                        contentObj = {
                            content: "<span class=\"error\">" + jsonRes[i].content + "</span>",
                            data: jsonRes[i]
                        };
                    } else {
                        contentObj = {
                            content: "<span class=\"category\">" + jsonRes[i].content + "</span>",
                            data: jsonRes[i],
                            _hasChildren: true,
                            closed: true,
                            initNodeChildren: dojo.hitch(this, "loadCategory")
                        };
                    }

                    var subNode = new wm.TreeNode(this._rootNode, contentObj);
                }
            } else {
                console.error("[WorkflowTree][Error]: Root Category list can not be parsed to array.");
                return;
            }

        } catch (e) {
            console.error('[WorkflowTree][Error][rootCategoriesResult]: ' + e);
        }
    },
    loadCategory: function(inNode) {
        this.components.childCategory.input.setValue("catId", inNode.data.data);
        this._catNode = inNode;
        this.components.childCategory.update();
    },
    childCategoryResult: function(inSender, inDeprecated) {
        try {
            var catContent = this.components.childCategory.getValue("dataValue");
            var jsonRes = JSON.parse(catContent);
            if (jsonRes instanceof Array) {
                for (var i = 0; i < jsonRes.length; i++) {
                    var contentObj;
                    if (jsonRes[i].type == "WorkflowCategory") {
                        contentObj = {
                            content: "<span class=\"category\">" + jsonRes[i].content + "</span>",
                            data: jsonRes[i],
                            _hasChildren: true,
                            closed: true,
                            initNodeChildren: dojo.hitch(this, "loadCategory")
                        };
                    } else {
                        contentObj = {
                            content: "<span class=\"workflow\">" + jsonRes[i].content + "</span>",
                            data: jsonRes[i]
                        };
                    }
                    var subNode = new wm.TreeNode(this._catNode, contentObj);
                }
            } else {
                console.error("[WorkflowTree][Error]: Root Category list can not be parsed to array.");
                return;
            }

        } catch (e) {
            console.error('[WorkflowTree][Error][childCategoryResult]: ' + e);
        }
    },
    _end: 0
});
 
o11n.WorkflowTree.components = {
	childCategory: ["wm.ServiceVariable", {"operation":"getCategory","service":"CategoryService"}, {"onResult":"childCategoryResult"}, {
		input: ["wm.ServiceInput", {"type":"getCategoryInputs"}, {}]
	}],
	rootCategories: ["wm.ServiceVariable", {"operation":"getCategoryRoot","service":"CategoryService"}, {"onResult":"rootCategoriesResult"}, {
		input: ["wm.ServiceInput", {"type":"getCategoryRootInputs"}, {}]
	}],
	rootTreeData: ["wm.ServiceVariable", {"operation":"getRootTreeData","service":"CategoryService"}, {"onResult":"rootTreeDataResult"}, {
		input: ["wm.ServiceInput", {"type":"getRootTreeDataInputs"}, {}]
	}],
	serviceError: ["wm.Label", {"caption":"CategoryService not available","padding":"4","showing":false}, {}],
	workflowTree: ["wm.PropertyTree", {"configJson":"{}","connectors":false,"height":"100%"}, {}]}
 
wm.publish(o11n.WorkflowTree, [
	["onSelect", "workflowTree.onselect", {group: "Published", isEvent: true}]
]);
 
wm.registerPackage(["vCO Widgets", "WorkflowTree", "o11n.WorkflowTree", "common.packages.o11n.WorkflowTree", "images/wm/widget.png", "vCO Inventory Tree", {width: "150px", height: "250px"},false]);