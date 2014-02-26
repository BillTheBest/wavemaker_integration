dojo.declare("Main", wm.Page, {
"preferredDevice": "desktop",
workflowInfo: null,
workflowRuns: null,
currentWorkflowId: null,
currentWorkflowName: null,
currentWorkflowType: null,
start: function() {},
o11nWorkflowTreeInfoSelect: function(inSender, inData) {
try {
this.workflowDetailsLayers.show();
this.currentWorkflowId = inData.data.data;
this.currentWorkflowName = inData.data.content;
this.currentWorkflowType = inData.data.type;
if (this.currentWorkflowType == "Workflow") {
this.monitorTab.show();
} else {
this.monitorTab.hide();
}
var activeLayer = this.workflowDetailsLayers.getActiveLayer();
if (activeLayer.name === "summaryTab") {
this.summaryTabShow();
} else {
this.monitorTabShow();
}
} catch (e) {
console.error('ERROR IN o11nWorkflowTree1Select: ' + e);
}
},
monitorTabShow: function(inSender) {
this.createWorkflowMonitor();
},
summaryTabShow: function(inSender) {
this.createWorkflowInfo();
},
createWorkflowInfo: function() {
try {
if (!this.workflowInfo) {
this.workflowInfo = this.workflowInfoPanel.createComponent("o11nWorkflowInfo", "o11n.WorkflowInfo", {
width: "100%",
height: "100%",
deferDataLoad: true
});
this.workflowInfoPanel.reflow();
}
this.workflowInfo.load(this.currentWorkflowId, this.currentWorkflowName, this.currentWorkflowType);
} catch (e) {
console.error('ERROR IN workflowInfo: ' + e);
}
},
createWorkflowMonitor: function() {
if (!this.currentWorkflowId || this.currentWorkflowType != "Workflow") {
return;
}
try {
this.loadingDialogMonitorTab.show();
console.log("Start WorkflowRuns Component - Workflow Id: " + this.currentWorkflowId + " - type: " + this.currentWorkflowType + " - Workflow Name: " + this.currentWorkflowName);
if (!this.workflowRuns) {
this.workflowRuns = this.runsPanel.createComponent("o11nWorkflowRuns", "o11n.WorkflowRuns", {
width: "100%",
height: "100%",
executionsPerWorkflow: true,
workflowId: this.currentWorkflowId,
deferDataLoad: true
});
this.runsPanel.reflow();
}
this.workflowRuns.load(this.currentWorkflowId);
this.loadingDialogMonitorTab.hide();
} catch (e) {
this.loadingDialogMonitorTab.hide();
console.error('ERROR IN createWorkflowMonitor: ' + e);
}
},
startButtonClick: function(inSender) {
try {
this.startButton.hide();
this.startPanel.show();
} catch (e) {
console.error('ERROR IN startButtonClick: ' + e);
}
},
_end: 0
});

Main.widgets = {
workflowVariable: ["wm.ServiceVariable", {"operation":"startWorkflow","service":"WorkflowService"}, {}, {
input: ["wm.ServiceInput", {"type":"startWorkflowInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"idField.dataValue","targetProperty":"id"}, {}]
}]
}]
}],
navigationCallWorkflowRuns: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"WorkflowRuns\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCallWorkflowTree: ["wm.NavigationCall", {}, {}, {
input: ["wm.ServiceInput", {"type":"gotoLayerInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"workflowLayer","targetProperty":"layer"}, {}]
}]
}]
}],
navigationCallUserInteractions: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"UserInteractions\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCallHomeInfo: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"HomeInfo\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCallWorkflowList: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"WorkflowList\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCallRecentActivities: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"RecentRuns\"","targetProperty":"pageName"}, {}]
}]
}]
}],
navigationCallWorkflowCatalog: ["wm.NavigationCall", {"operation":"gotoPage"}, {}, {
input: ["wm.ServiceInput", {"type":"gotoPageInputs"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":"\"WorkflowCatalog\"","targetProperty":"pageName"}, {}]
}]
}]
}],
loadingDialogMonitorTab: ["wm.LoadingDialog", {"showTitleButtonsWhenDocked":true,"titlebarButtons":undefined}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"monitorTab","targetProperty":"widgetToCover"}, {}]
}]
}],
layoutBox1: ["wm.Layout", {"horizontalAlign":"left","padding":"8","verticalAlign":"top"}, {"onEnterKeyPress":"layoutBox1EnterKeyPress"}, {
panel3: ["wm.Panel", {"height":"48px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"15,15,5,5","styles":{"backgroundGradient":"","backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_24px","wm_FontColor_White","wm_FontFamily_Times"]},"align":"left","caption":"waveoperator","height":"40px","padding":"0,4,20,4","width":"172px"}, {}]
}],
tabLayers1: ["wm.TabLayers", {"_classes":{"domNode":["wm_BackgroundColor_White"]},"transition":"fade"}, {}, {
helloLayer: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#999999","caption":"Hello!","horizontalAlign":"center","themeStyleType":"ContentPanel","verticalAlign":"middle"}, {}, {
startPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"20,20,10,40","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
panel19: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"50%"}, {}, {
label27: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Evergreen"]},"caption":"vCO and Wavemaker","height":"76px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}],
picture1: ["wm.Picture", {"aspect":"v","height":"282px","source":"resources/images/conducting-mahler.jpg","width":"348px"}, {}],
label28: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Evergreen"]},"align":"center","caption":"Integration Project","height":"121px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}],
label29: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Black"]},"align":"center","caption":"2012","height":"121px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}]
}],
bevel1: ["wm.Bevel", {"_classes":{"domNode":["wm_BackgroundColor_Evergreen"]},"bevelSize":"4","height":"100%","width":"4px"}, {}],
panel20: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"50%"}, {}, {
Next: ["wm.Button", {"caption":"Next ","desktopHeight":"40px","height":"40px","margin":"4","width":"120px"}, {"onclick":"summaryLayer"}],
picture7: ["wm.Picture", {"aspect":"h","height":"438px","source":"resources/images/wavemaker-oceana-lg.jpg","width":"432px"}, {}]
}]
}],
startButton: ["wm.Button", {"caption":"Start","desktopHeight":"55px","height":"55px","margin":"4","width":"91px"}, {"onclick":"startButtonClick"}]
}],
summaryLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"vCO Partner Services","horizontalAlign":"right","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel7: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"20,20,10,40","verticalAlign":"top","width":"100%"}, {}, {
panel10: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel12: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"353px"}, {}, {
label24: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Evergreen"]},"caption":"What's been done?","height":"76px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}],
picture4: ["wm.Picture", {"aspect":"h","height":"222px","source":"resources/images/DeathStarII_egvv.jpg","width":"348px"}, {}]
}],
panel11: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"100%"}, {}, {
fancyPanel1: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"80px","title":"Common Setup"}, {}, {
label4: ["wm.Label", {"caption":"Partner Service Project","padding":"4","width":"207px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}],
label14: ["wm.Label", {"caption":"Migration of Partner Service to 6.5.0","padding":"4","width":"207px"}, {}, {
format: ["wm.DataFormatter", {}, {}]
}]
}],
fancyPanel2: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"128px","title":"Services"}, {}, {
label7: ["wm.Label", {"caption":"Category Service","padding":"4","width":"179px"}, {}],
label8: ["wm.Label", {"caption":"Presentation Service","padding":"4","width":"195px"}, {}],
label6: ["wm.Label", {"caption":"Workflow Service","padding":"4","width":"103px"}, {}],
label5: ["wm.Label", {"caption":"Catalog Service","padding":"4","width":"148px"}, {}]
}],
fancyPanel3: ["wm.FancyPanel", {"height":"326px","title":"Components"}, {"onEnterKeyPress":"navigationCallUserInteractions"}, {
panel1: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label44: ["wm.Label", {"align":"right","caption":"1.","padding":"4","width":"26px"}, {}],
picture8: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label10: ["wm.Label", {"caption":"Workflow Tree Widget","padding":"4"}, {"onclick":"navigationCallWorkflowTree"}],
button1: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallWorkflowTree"}]
}],
panel2: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label45: ["wm.Label", {"align":"right","caption":"2.","padding":"4","width":"26px"}, {}],
picture9: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label13: ["wm.Label", {"caption":"Workflow Presentation Widget","padding":"4","width":"173px"}, {}]
}],
panel23: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label46: ["wm.Label", {"align":"right","caption":"3.","padding":"4","width":"26px"}, {}],
label35: ["wm.Label", {"caption":"","padding":"4","width":"30px"}, {}],
picture14: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label36: ["wm.Label", {"caption":"Input Tree Chooser Widget","padding":"4","width":"199px"}, {}]
}],
panel28: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label47: ["wm.Label", {"align":"right","caption":"4.","padding":"4","width":"26px"}, {}],
label42: ["wm.Label", {"caption":"","padding":"4","width":"30px"}, {}],
picture19: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label43: ["wm.Label", {"caption":"Input List Chooser Widget","padding":"4","width":"199px"}, {}]
}],
panel22: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label48: ["wm.Label", {"align":"right","caption":"5.","padding":"4","width":"26px"}, {}],
picture13: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label34: ["wm.Label", {"caption":"Plugin Inventory Widget","padding":"4","width":"148px"}, {}]
}],
panel18: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label49: ["wm.Label", {"align":"right","caption":"6.","padding":"4","width":"26px"}, {}],
picture11: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label31: ["wm.Label", {"caption":"Workflow Info Widget","padding":"4"}, {"onclick":"navigationCallWorkflowTree"}],
button2: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallWorkflowTree"}]
}],
panel6: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label50: ["wm.Label", {"align":"right","caption":"7.","padding":"4","width":"26px"}, {}],
picture10: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label30: ["wm.Label", {"caption":"Workflow Runs Widget","padding":"4"}, {"onclick":"navigationCallWorkflowRuns"}],
button3: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallWorkflowRuns"}]
}],
panel21: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label51: ["wm.Label", {"align":"right","caption":"8.","padding":"4","width":"26px"}, {}],
picture12: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label32: ["wm.Label", {"caption":"User Interactions Widget","padding":"4"}, {"onclick":"navigationCallUserInteractions"}],
button4: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallUserInteractions"}]
}],
panel24: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label52: ["wm.Label", {"align":"right","caption":"9.","padding":"4","width":"26px"}, {}],
picture15: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label37: ["wm.Label", {"caption":"Home Info Widget","padding":"4"}, {"onclick":"navigationCallHomeInfo"}],
button5: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallHomeInfo"}]
}],
panel26: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label53: ["wm.Label", {"align":"right","caption":"10.","padding":"4","width":"26px"}, {}],
picture17: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label40: ["wm.Label", {"caption":"Workflow List Widget","padding":"4"}, {"onclick":"navigationCallWorkflowList"}],
button7: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallWorkflowList"}]
}],
panel25: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label54: ["wm.Label", {"align":"right","caption":"11.","padding":"4","width":"26px"}, {}],
picture16: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label39: ["wm.Label", {"caption":"Recent Runs Widget","padding":"4"}, {"onclick":"navigationCallRecentActivities"}],
button6: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallRecentActivities"}]
}],
panel27: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label55: ["wm.Label", {"align":"right","caption":"12.","padding":"4","width":"26px"}, {}],
picture18: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/root-category_16x16.png","width":"20px"}, {}],
label41: ["wm.Label", {"caption":"Workflow Catalog Widget","padding":"4"}, {"onclick":"navigationCallWorkflowCatalog"}],
button8: ["wm.Button", {"caption":"Go","desktopHeight":"25px","height":"25px","imageList":undefined,"margin":"4","width":"40px"}, {"onclick":"navigationCallWorkflowCatalog"}]
}]
}],
Next1: ["wm.Button", {"caption":"Next ","desktopHeight":"40px","height":"40px","margin":"4","width":"120px"}, {"onclick":"workflowLayer"}]
}]
}]
}]
}],
workflowLayer: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#999999","caption":"Sample Application","horizontalAlign":"left","layoutKind":"left-to-right","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
workflowBrowsingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"400px"}, {}, {
label3: ["wm.Label", {"_classes":{"domNode":["wm_FontColor_SteelBlue","wm_FontSizePx_12px"]},"caption":"Inventory","padding":"4","width":"306px"}, {}],
o11nWorkflowTreeInfo: ["o11n.WorkflowTree", {"height":"100%","width":"100%"}, {"onSelect":"o11nWorkflowTreeInfoSelect"}]
}],
splitter1: ["wm.Splitter", {"_classes":{"domNode":["wm_BackgroundColor_Graphite"]},"height":"100%","width":"4px"}, {}],
workflowDetailsLayers: ["wm.TabLayers", {"defaultLayer":0,"margin":"0,5,0,5","showing":false,"transition":"fade"}, {}, {
summaryTab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Summary","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"summaryTabShow"}, {
workflowInfoPanel: ["wm.Panel", {"autoScroll":true,"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}],
presentationParentPanel: ["wm.Panel", {"height":"100px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}]
}],
monitorTab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Monitor","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"monitorTabShow"}, {
runsPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}]
}]
}]
}],
whatIsNextLayer: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#999999","caption":"What's next?","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel8: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"20,20,10,40","verticalAlign":"top","width":"100%"}, {}, {
panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"353px"}, {}, {
label25: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Evergreen"]},"caption":"What 's coming next?","height":"76px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}],
picture5: ["wm.Picture", {"aspect":"h","height":"222px","source":"resources/images/crossroads_detail.jpg","width":"348px"}, {}]
}],
panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
fancyPanel4: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"56px","title":"Common Work"}, {}, {
label23: ["wm.Label", {"caption":"Polishing","padding":"4"}, {}]
}],
fancyPanel5: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"130px","title":"Components"}, {}, {
label15: ["wm.Label", {"caption":"Complete the set of basic fields","height":"26px","padding":"4","width":"181px"}, {}],
label16: ["wm.Label", {"caption":"Object chooser (with search field)","padding":"4","width":"195px"}, {}],
label17: ["wm.Label", {"caption":"Array choosers","padding":"4","width":"91px"}, {}],
label18: ["wm.Label", {"caption":"Decorators and validators","padding":"4","width":"148px"}, {}]
}],
fancyPanel6: ["wm.FancyPanel", {"fitToContentHeight":true,"height":"104px","title":"Features"}, {}, {
label19: ["wm.Label", {"caption":"Landing Portal Page","padding":"4","width":"206px"}, {}],
label22: ["wm.Label", {"caption":"Page level permissions and Administratition","padding":"4","width":"251px"}, {}],
label38: ["wm.Label", {"caption":"Workflow Permissions/Approvals","padding":"4","width":"251px"}, {}]
}]
}]
}]
}]
}],
qaLayer: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#999999","caption":"Q&A!","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"20,20,10,40","verticalAlign":"top","width":"100%"}, {}, {
panel16: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"353px"}, {}, {
label26: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_36px","wm_FontFamily_Times","wm_FontColor_Evergreen"]},"caption":"Q & A","height":"76px","padding":"20,0,0,0","singleLine":false,"width":"344px"}, {}],
picture6: ["wm.Picture", {"aspect":"h","height":"300px","source":"resources/images/engine-300x296.jpg","width":"350px"}, {}]
}],
panel17: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
fancyPanel7: ["wm.FancyPanel", {"title":"Notes"}, {}, {
richText1: ["wm.RichText", {"height":"100%"}, {}]
}]
}]
}]
}],
widgetsLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Widgets","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
pageContainer1: ["wm.PageContainer", {"deferLoad":true,"pageName":"Widgets","subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}]
}],
panel4: ["wm.Panel", {"_classes":{"domNode":["wm_BorderBottomStyle_Curved8px"]},"border":"0,0,2,0","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
picture2: ["wm.Picture", {"source":"resources/images/o11n/vco_powered.gif","width":"248px"}, {}],
panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"right","verticalAlign":"middle","width":"100%"}, {}, {
picture3: ["wm.Picture", {"source":"resources/images/o11n/logo_vmware.gif"}, {}]
}]
}]
}]
};

Main.prototype._cssText = '';
Main.prototype._htmlText = '';