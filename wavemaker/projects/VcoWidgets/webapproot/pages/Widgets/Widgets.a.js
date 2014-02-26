dojo.declare("Widgets", wm.Page, {
"preferredDevice": "desktop",
start: function() {},
userInteractionsLayerShow: function(inSender) {
this.o11nUserInteractions1.load();
},
recentRunsLayerShow: function(inSender) {
this.o11nRecentRuns1.load();
},
o11nHomeInfo1RunningExecutionsClick: function(inSender) {
app.toastInfo("[Home Info]: Running Workflows Count clicked for navigation ...");
},
o11nRecentRuns1RunningExecutionsClick: function(inSender) {
app.toastInfo("[Recent Runs]: 'More Runs' link clicked for Running tab executions...");
},
o11nRecentRuns1AllExecutionsClick: function(inSender) {
app.toastInfo("[Recent Runs]: 'More Runs' link clicked for All tab executions...");
},
o11nRecentRuns1FailedExecutionsClick: function(inSender) {
app.toastInfo("[Recent Runs]: 'More Runs' link clicked for Failed tab executions...");
},
o11nRecentRuns1UserInteractionsClick: function(inSender) {
app.toastInfo("[Recent Runs]: 'More Runs' link clicked for User Interactions tab executions...");
},
o11nRecentRuns1RunningCountChange: function(inSender, newCount) {
app.toastInfo("[Recent Runs]: Workflow Running Count changed to: " + newCount);
},
workflowRunsLayerShow: function(inSender) {
this.o11nWorkflowRuns1.load();
},
workflowListShow: function(inSender) {
this.o11nWorkflowList1.load();
//demonstration of how to bind a hanlder to a component event from a script with passing the parameters.
this.connect(this.o11nWorkflowList1, "onWorkflowInfoClick", dojo.hitch(this, "o11nWorkflowList1WorkflowInfoClick", this.o11nWorkflowList1));
},
o11nHomeInfo1UserInteractionsClick: function(inSender) {
app.toastInfo("[Home Info]: User Interactions Count clicked for navigation ...");
},
tabLayers2Show: function(inSender) {
this.o11nHomeInfo1.load();
//demonstration of how to bind a hanlder to a component event from a script.
this.connect(this.o11nHomeInfo1, "onRunningExecutionsClick", this, "o11nRecentRuns1RunningExecutionsClick");
},
o11nWorkflowList1WorkflowInfoClick: function(inSender, workflowId) {
app.toastInfo("[Workflow List]: Workflow with id: " + workflowId + " was clicked...");
},
fireEventButtonClick: function(inSender) {
dojo.publish("ExecutionStateChangeEvent", [{
status: "RUNNING",
executionId: "invalid executionId (mandatory)",
workflowId: "invalidWorkflowId (optional)",
workflowName: "Test Name For Demo"
}]);
},
o11WorklowTreePresentationSelect: function(inSender, inData) {
this.o11nPresentation1.workflowId = inData.data.data;
this.o11nPresentation1.load();
},
o11nWorkflowTreeInfoSelect: function(inSender, inData) {
this.o11nWorkflowInfo1.load(inData.data.data, inData.data.content, inData.data.type);
},
inventoryTreeLayerShow: function(inSender) {
if (!this.o11nInventoryTree1.showing) {
this.o11nInventoryTree1.show();
this.o11nInventoryTree1.load();
}
},
workflowTreeLayerShow: function(inSender) {
if (!this.o11nWorkflowTree1.showing) {
this.o11nWorkflowTree1.show();
this.o11nWorkflowTree1.load();
}
},
workflowInfoLayerShow: function(inSender) {
if (!this.o11nWorkflowTreeInfo.showing) {
this.o11nWorkflowTreeInfo.show();
this.o11nWorkflowTreeInfo.load();
}
},
presentationLayerShow: function(inSender) {
if (!this.o11nWorklowTreePresentation.showing) {
this.o11nWorklowTreePresentation.show();
this.o11nWorklowTreePresentation.load();
}
},
workflowCatalogLayerShow: function(inSender) {
this.o11nWorkflowCatalog1.load();
},
_end: 0
});

Widgets.widgets = {
widgetsLayoutBox: ["wm.Layout", {"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
tabLayers2: ["wm.TabLayers", {"headerWidth":"200px","layoutKind":"left-to-right","transition":"slide","verticalButtons":true}, {"onShow":"tabLayers2Show"}, {
homeInfoLayer: ["wm.Layer", {"border":"1","caption":"Home Info","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"homeInfoLayerShow"}, {
o11nHomeInfo1: ["o11n.HomeInfo", {"deferDataLoad":true,"height":"100%","width":"100%"}, {"onRunningExecutionsClick":"o11nHomeInfo1RunningExecutionsClick","onUserInteractionsClick":"o11nHomeInfo1UserInteractionsClick"}]
}],
workflowList: ["wm.Layer", {"border":"1","caption":"Workflow List","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowListShow"}, {
o11nWorkflowList1: ["o11n.WorkflowList", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
}],
workflowTreeLayer: ["wm.Layer", {"border":"1","caption":"Workflow Tree","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowTreeLayerShow"}, {
o11nWorkflowTree1: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"100%"}, {}]
}],
recentRunsLayer: ["wm.Layer", {"border":"1","caption":"Recent Runs","horizontalAlign":"right","layoutKind":"left-to-right","themeStyleType":"ContentPanel","verticalAlign":"bottom"}, {"onShow":"recentRunsLayerShow"}, {
fireEventButton: ["wm.Button", {"caption":"Fire Workfow Start Event","margin":"4","width":"230px"}, {"onclick":"fireEventButtonClick"}],
o11nRecentRuns1: ["o11n.RecentRuns", {"currentRunningCount":0,"height":"100%","timerInitialDelay":3000,"timerMaxCount":40,"width":"245px"}, {"onAllExecutionsClick":"o11nRecentRuns1AllExecutionsClick","onFailedExecutionsClick":"o11nRecentRuns1FailedExecutionsClick","onRunningCountChange":"o11nRecentRuns1RunningCountChange","onRunningExecutionsClick":"o11nRecentRuns1RunningExecutionsClick","onUserInteractionsClick":"o11nRecentRuns1UserInteractionsClick"}]
}],
workflowRunsLayer: ["wm.Layer", {"autoScroll":true,"border":"1","caption":"Workflow Runs","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowRunsLayerShow"}, {
o11nWorkflowRuns1: ["o11n.WorkflowRuns", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
}],
userInteractionsLayer: ["wm.Layer", {"autoScroll":true,"border":"1","caption":"User Interactions","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"userInteractionsLayerShow"}, {
o11nUserInteractions1: ["o11n.UserInteractions", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
}],
workflowInfoLayer: ["wm.Layer", {"border":"1","caption":"Workflow Info","horizontalAlign":"left","layoutKind":"left-to-right","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowInfoLayerShow"}, {
o11nWorkflowTreeInfo: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"240px"}, {"onSelect":"o11nWorkflowTreeInfoSelect"}],
splitter2: ["wm.Splitter", {"height":"100%","styles":{"backgroundColor":"#ffffff"},"width":"4px"}, {}],
o11nWorkflowInfo1: ["o11n.WorkflowInfo", {"height":"100%","width":"100%"}, {}]
}],
presentationLayer: ["wm.Layer", {"border":"1","caption":"Presentation","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"presentationLayerShow"}, {
o11nWorklowTreePresentation: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"100%"}, {"onSelect":"o11WorklowTreePresentationSelect"}],
o11nPresentation1: ["o11n.Presentation", {"deferDataLoad":"true","height":"1%","width":"1%"}, {}]
}],
inventoryTreeLayer: ["wm.Layer", {"border":"1","caption":"Plugin Inventory Tree","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"inventoryTreeLayerShow"}, {
o11nInventoryTree1: ["o11n.InventoryTree", {"deferDataLoad":true,"height":"100%","sdkType":"VC","showing":false,"width":"100%"}, {}]
}],
workflowCatalogLayer: ["wm.Layer", {"border":"1","caption":"Workflow Catalog","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowCatalogLayerShow"}, {
o11nWorkflowCatalog1: ["o11n.WorkflowCatalog", {"deferDataLoad":true,"height":"100%","infoImgPrefixId":"wf-info:","runImgPrefixId":"wf-run:","width":"100%"}, {}]
}]
}]
}]
};

Widgets.prototype._cssText = '';
Widgets.prototype._htmlText = '';