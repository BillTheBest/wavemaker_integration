dojo.declare("WorkflowList", wm.Page, {
"preferredDevice": "desktop",
sortOrders: [],
presentation: null,
deferDataLoad: false,
start: function() {
if (!this.deferDataLoad) {
this.load();
} else {
console.log("[WorkflowList]: data load deferred...");
}
},
load: function() {
this.currentPagination.setValue("dataValue", 1);
this.specVar.setData({
startIndex: 0,
maxResult: 20
});
this.workflowService.update();
console.log("[WorkflowList]: initial data load...");
},
/**************************** Service event handlers:Start **********************/
workflowServiceSuccess: function(inSender, inDeprecated) {
this.setMaxPagination(inSender.getData().total);
this.workflows_grid.show();
},
workflowServiceError: function(inSender, inError) {
app.toastError("Error: " + inError);
},
/**************************** Service event handlers:End **********************/
/**************************** Grid event handlers:Start **********************/
workflows_gridRenderData: function(inSender) {
this.disableDefaultSortingIfPagination();
},
disableDefaultSortingIfPagination: function() {
if (this.maxPaginationVar.data.dataValue > 1) {
this.workflows_grid.dojoObj.canSort = function() {
return false;
};
}
},
workflows_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
if (this.maxPaginationVar.data.dataValue <= 1) {
return;
}
if (fieldId === "description") {
//the vco server throws null pointer exception when description.
return;
}
this.set_selected_field_sorted_order(fieldId);
var sortOrdersReverse = this.sortOrders.concat([]).reverse();
this.specVar.setValue("sortOrders", sortOrdersReverse.toString());
this.workflowService.update();
console.log("[WorkflowList]: On sort update... ");
},
set_selected_field_sorted_order: function(fieldId) {
var asending = "+";
var desending = "-";
var i = this.sortOrders.indexOf(asending + fieldId);
if (i != -1) {
this.sortOrders.splice(i, 1);
this.sortOrders.push(desending + fieldId);
return;
}
i = this.sortOrders.indexOf(desending + fieldId);
if (i != -1) {
this.sortOrders.splice(i, 1);
this.sortOrders.push(asending + fieldId);
return;
}
this.sortOrders.push(asending + fieldId);
},
workflows_gridClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
if ("id" === fieldId) {
this.onWorkflowInfoClick(selectedItem.getData().id);
}
},
/**************************** Grid event handlers:End **********************/
/****************************Pagination: Start **********************/
setMaxPagination: function(total) {
total = total > 1 ? total : 1;
var value = Math.ceil(total / this.specVar.getValue("maxResult"));
value = value === 0 ? 1 : value;
this.maxPaginationVar.setValue("dataValue", value);
},
paginationPageNumberChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
if (inSetByCode) {
return;
}
this.paginate(inDataValue);
},
paginate: function(paginationPageNum) {
if (!this.isPaginationNumValid(paginationPageNum)) {
return;
}
if (this.currentPagination.data.dataValue == paginationPageNum) {
return;
}
this.currentPagination.setValue("dataValue", paginationPageNum);
this.specVar.setValue("startIndex", (paginationPageNum - 1) * this.specVar.getValue("maxResult"));
this.workflowService.update();
console.log("[WorkflowList]: Paginate Update...");
},
isPaginationNumValid: function(paginationPageNum) {
return paginationPageNum >= 1 && this.maxPaginationVar.data.dataValue >= paginationPageNum;
},
next_page_imgClick: function(inSender) {
this.paginate(this.currentPagination.data.dataValue + 1);
},
prev_page_imgClick: function(inSender) {
this.paginate(this.currentPagination.data.dataValue - 1);
},
last_page_imgClick: function(inSender) {
this.paginate(this.maxPaginationVar.data.dataValue);
},
first_page_imgClick: function(inSender) {
this.paginate(1);
},
/****************************Pagination: End **********************/
runPresentation: function(workflowId) {
if (!this.presentation) {
this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
width: "100%",
height: "100%",
workflowId: workflowId
});
this.presentationRootPanel.reflow();
} else {
this.presentation.workflowId = workflowId;
this.presentation.start();
}
},
runButtonClick: function(inSender) {
var workflowId = this.workflows_grid.selectedItem.getData().id;
this.runPresentation(workflowId);
},
infoButtonClick: function(inSender) {
var workflowId = this.workflows_grid.selectedItem.getData().id;
this.onWorkflowInfoClick(workflowId);
},
onWorkflowInfoClick: function(workflowId) {
console.log("[WorkflowList]: wf id: " + workflowId);
},
searchChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
console.log("[WorkflowList]: search for:  " + inDataValue);
if (inDataValue) {
this.specVar.setValue("conditions", "name~" + inDataValue);
} else {
this.specVar.setValue("conditions", null);
}
this.specVar.setValue("startIndex", 0);
this.currentPagination.setValue("dataValue", 1);
this.workflowService.update();
},
_end: 0
});

WorkflowList.widgets = {
workflowService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflows","service":"WorkflowService"}, {"onError":"workflowServiceError","onSuccess":"workflowServiceSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflows_panel","targetProperty":"loadingDialog"}, {}]
}],
input: ["wm.ServiceInput", {"type":"getWorkflowsInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
}]
}]
}],
specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
currentPagination: ["wm.Variable", {"type":"NumberData"}, {}],
maxPaginationVar: ["wm.Variable", {}, {}],
workflowListPublisher: ["wm.CompositePublisher", {"description":"List of all workflows.","displayName":"WorkflowList","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"WorkflowList","width":"100%"}, {}],
workflowListLayout: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
workflows_panel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
panel5: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
label1: ["wm.Label", {"borderColor":"","caption":"Workflows","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"80px"}, {}],
panel6: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
runButton: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"run workflow","margin":"1,1,1,1","source":"resources/images/o11n/run.png","width":"16px"}, {"onclick":"runButtonClick"}],
infoButton: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"go to workflow","margin":"1,1,1,1","showing":false,"source":"resources/images/o11n/info_24x.png","width":"16px"}, {"onclick":"infoButtonClick"}],
presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
}],
search: ["wm.Text", {"caption":"Search:","captionSize":"52px","desktopHeight":"23px","displayValue":"","emptyValue":"null","height":"23px","helpText":undefined,"maxHeight":0,"mobileHeight":"20%","placeHolder":"by workflow name...","resetButton":true,"selectOnClick":true,"width":"250px"}, {"onchange":"searchChange"}],
separator6: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"4","width":"10px"}, {}],
refreshImg: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"workflowService"}],
separator8: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"4","width":"10px"}, {}]
}]
}],
workflows_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Category: \" + ${categoryName} + \"</div>\"\n+ \"<div class='MobileRow'>Description: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"id","title":" ","width":"18px","align":"center","formatFunc":"wm_image_formatter","formatProps":{"width":16,"height":16},"editorProps":{"restrictValues":true},"expression":"\"resources/images/o11n/info_24x.png\"","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"320px","align":"left","formatFunc":"","editorProps":null,"mobileColumn":false},{"show":true,"field":"categoryName","title":"Category","width":"250px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"canExecute","title":"CanExecute","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"canEdit","title":"CanEdit","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"iconHref","title":"IconHref","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"customizedIconExists","title":"CustomizedIconExists","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":600,"primaryKeyFields":["id"],"selectFirstRow":true,"showing":false,"styles":{"color":"#000000"}}, {"onClick":"workflows_gridClick","onHeaderClick":"workflows_gridHeaderClick","onRenderData":"workflows_gridRenderData"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowService.list","targetProperty":"dataSet"}, {}]
}]
}],
panel1: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
paginigPanel: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"170px"}, {}, {
first_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"first page","margin":"8,0,0,0","width":"13px"}, {"onclick":"first_page_imgClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${currentPagination.dataValue} <=1 ? \"resources/images/o11n/first_page_disabled.gif\" : \"resources/images/o11n/first_page.gif\";","targetProperty":"source"}, {}]
}]
}],
prev_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"previous page","margin":"8,0,0,0","width":"13px"}, {"onclick":"prev_page_imgClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${currentPagination.dataValue} > 1 ? \"resources/images/o11n/prev_page.gif\" : \"resources/images/o11n/prev_page_disabled.gif\";","targetProperty":"source"}, {}]
}]
}],
separator2: ["wm.Label", {"align":"left","caption":"|","height":"100%","padding":"0,4,0,0","width":"5px"}, {}],
paginationPageNumber: ["wm.Number", {"borderColor":"","caption":"Page:","captionSize":"39px","displayValue":"1","height":"100%","helpText":undefined,"margin":"1,0,0,0","minimum":1,"padding":"5,0,5,0","placeHolder":undefined,"places":0,"selectOnClick":true,"width":"65px"}, {"onEnterKeyPress":"paginationPageNumberEnterKeyPress","onchange":"paginationPageNumberChange"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"currentPagination.dataValue","targetProperty":"dataValue"}, {}],
wire1: ["wm.Wire", {"expression":undefined,"source":"maxPaginationVar.dataValue","targetProperty":"maximum"}, {}],
wire2: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} <= 1","targetProperty":"disabled"}, {}]
}]
}],
separator5: ["wm.Label", {"align":"center","borderColor":"","caption":"/","height":"25px","padding":"0","width":"10px"}, {}],
pageCount: ["wm.Label", {"align":"center","autoSizeWidth":true,"height":"100%","hint":"number of pages","padding":"0","width":"2px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"maxPaginationVar.dataValue","targetProperty":"caption"}, {}]
}]
}],
separator3: ["wm.Label", {"align":"center","caption":"|","height":"100%","padding":"4","width":"8px"}, {}],
next_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"next page","margin":"8,0,0,0","width":"13px"}, {"onclick":"next_page_imgClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} > ${currentPagination.dataValue} ? \"resources/images/o11n/next_page.gif\" : \"resources/images/o11n/next_page_disabled.gif\";\n\n\n","targetProperty":"source"}, {}]
}]
}],
last_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"last page","margin":"8,0,0,0","width":"13px"}, {"onclick":"last_page_imgClick"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} != ${currentPagination.dataValue} ? \"resources/images/o11n/last_page.gif\" : \"resources/images/o11n/last_page_disabled.gif\";\n\n\n","targetProperty":"source"}, {}]
}]
}],
separator7: ["wm.Label", {"align":"center","caption":"","height":"100%","padding":"4","width":"12px"}, {}]
}]
}]
}]
}]
};

WorkflowList.prototype._cssText = '';
WorkflowList.prototype._htmlText = '';