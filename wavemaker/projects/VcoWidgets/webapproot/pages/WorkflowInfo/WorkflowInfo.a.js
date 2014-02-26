dojo.declare("WorkflowInfo", wm.Page, {
"preferredDevice": "desktop",
presentation: null,
deferDataLoad: false,
start: function() {
if (!this.deferDataLoad) {
this.load(this.varWorkflowId.data.dataValue, this.varWorkflowName.data.dataValue, this.varWorkflowType.data.dataValue);
} else {
console.log("[WorkflowInfo]: data load deferred...");
}
},
load: function(workflowId, workflowName, workflowType) {
try {
console.log("Workflow Id: " + workflowId + " - type: " + workflowType + " - Workflow Name: " + workflowName);
this.wf_name.setCaption(workflowName);
if (!workflowId) {
this.wf_description_panel.hide();
this.runWorkflowImg.hide();
this.name_icon.setValue("source", "");
return;
}
if (workflowType == "WorkflowCategory") {
this.name_icon.setValue("source", "resources/images/o11n/workflow-category_16x16.png");
this.wf_description_panel.hide();
this.wf_input_param_grid.hide();
this.input_parameters_label.hide();
this.wf_output_param_grid.hide();
this.output_parameters_label.hide();
this.runWorkflowImg.hide();
} else {
//invoke getWorkflow via binding this.workflowServiceVariable
this.varWorkflowId.setValue("dataValue", workflowId);
this.name_icon.setValue("source", "resources/images/o11n/workflow-item_16x16.png");
this.wf_description_panel.show();
this.runWorkflowImg.show();
}
} catch (e) {
console.error('"[WorkflowInfo][ERROR]: in the initialization of the component: ' + e);
}
},
workflowServiceVariableSuccess: function(inSender, inDeprecated) {
var workflowModel = inSender.getData();
this.wf_description.setValue("showing", workflowModel.description);
this.input_parameters_label.setValue("showing", workflowModel.inputParameters);
this.wf_input_param_grid.setValue("showing", workflowModel.inputParameters);
this.output_parameters_label.setValue("showing", workflowModel.outputParameters);
this.wf_output_param_grid.setValue("showing", workflowModel.outputParameters);
},
workflowServiceVariableError: function(inSender, inError) {
var errMsg = "[WorkflowInfo][Error]: " + inError;
app.toastError(errMsg);
console.error(errMsg);
},
runWorkflowImgClick: function(inSender) {
if (!this.presentation) {
this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
width: "100%",
height: "100%",
workflowId: this.varWorkflowId.data.dataValue
});
this.presentationRootPanel.reflow();
}else{
this.presentation.workflowId = this.varWorkflowId.data.dataValue;
this.presentation.start();
}
},
_end: 0
});

WorkflowInfo.widgets = {
workflowInfoPublisher: ["wm.CompositePublisher", {"description":"vCO Workflow Information","displayName":"WorkflowInfo","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"WorkflowInfo","width":"100%"}, {}],
varWorkflowId: ["wm.Variable", {"type":"StringData"}, {}],
varWorkflowType: ["wm.Variable", {"type":"StringData"}, {}],
varWorkflowName: ["wm.Variable", {"type":"StringData"}, {}],
workflowId: ["wm.Property", {"property":"varWorkflowId.dataValue"}, {}],
workflowType: ["wm.Property", {"property":"varWorkflowType.dataValue"}, {}],
workflowName: ["wm.Property", {"property":"varWorkflowName.dataValue"}, {}],
workflowServiceVariable: ["wm.ServiceVariable", {"autoUpdate":true,"inFlightBehavior":"executeLast","operation":"getWorkflow","service":"WorkflowService"}, {"onError":"workflowServiceVariableError","onSuccess":"workflowServiceVariableSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"wfInfoPanel","targetProperty":"loadingDialog"}, {}]
}],
input: ["wm.ServiceInput", {"type":"getWorkflowInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"varWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
}]
}]
}],
workflowInfoLayout: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
wfInfoPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
wfHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"bottom","width":"100%"}, {}, {
name_icon: ["wm.Picture", {"height":"22px","padding":"2,0,2,5","source":"resources/images/o11n/workflow-item_16x16.png","width":"22px"}, {}],
runWorkflowImg: ["wm.Picture", {"height":"20px","margin":"0,2,0,0","showing":false,"source":"resources/images/o11n/run.png","width":"18px"}, {"onclick":"runWorkflowImgClick"}],
wf_name: ["wm.Label", {"autoSizeWidth":true,"borderColor":"","minWidth":50,"padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"6px"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowServiceVariable.name","targetProperty":"caption"}, {}]
}]
}],
presentationRootPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"10px"}, {}]
}],
wf_description_panel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","minDesktopHeight":300,"minHeight":300,"minWidth":300,"padding":"4","verticalAlign":"top","width":"100%"}, {}, {
wf_description: ["wm.Label", {"autoSizeHeight":true,"height":"40px","minDesktopHeight":30,"minHeight":30,"padding":"12,0,0,2","showing":false,"singleLine":false,"styles":{"color":"#000000","fontSize":"15px","fontWeight":"lighter","fontFamily":"arrial-narrow"},"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowServiceVariable.description","targetProperty":"caption"}, {}]
}]
}],
input_parameters_label: ["wm.Label", {"caption":"Input Parameters","padding":"10,0,0,2","showing":false,"styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"}}, {}],
wf_input_param_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":true,"field":"name","title":"Name","width":"200px","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":true,"field":"type","title":"Type","width":"180px","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true}],"height":"100%","localizationStructure":{},"margin":"0","minDesktopHeight":70,"minHeight":70,"minWidth":200,"selectionMode":"none","showing":false,"styles":{"color":""}}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowServiceVariable.inputParameters","targetProperty":"dataSet"}, {}]
}]
}],
output_parameters_label: ["wm.Label", {"caption":"Output Parameters","padding":"10,0,0,2","showing":false,"styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"}}, {}],
wf_output_param_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":true,"field":"name","title":"Name","width":"200px","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":true,"field":"type","title":"Type","width":"180px","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true}],"height":"100%","margin":"0","minDesktopHeight":70,"minHeight":70,"minWidth":200,"selectionMode":"none","showing":false,"styles":{"color":""}}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowServiceVariable.outputParameters","targetProperty":"dataSet"}, {}]
}]
}]
}]
}]
}]
};

WorkflowInfo.prototype._cssText = '';
WorkflowInfo.prototype._htmlText = '';