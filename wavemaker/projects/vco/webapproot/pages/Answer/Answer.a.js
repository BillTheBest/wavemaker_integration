//This page could be called directly by providing the userInteractionId
//as query param in the url.
//Ex: http://localhost:8094/vco/?userInteractionId=ff80808139fb3080013b03c290240496#{"pageName":"Answer"}
dojo.declare("Answer", wm.Page, {
"preferredDevice": "desktop",
deferDataLoad: false,
start: function() {
var userInteractionId = this.getParam("userInteractionId");
if(userInteractionId){
this.userInteractionId.setValue("dataValue", userInteractionId);
}
if (!this.deferDataLoad) {
this.load();
}
},
load: function() {
this.userInteractionService.input.setValue('userInteractionId', this.userInteractionId.data.dataValue);
this.userInteractionService.update();
},
answerBtnClick: function(inSender) {
if (!this.presentation) {
this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
width: "100%",
height: "100%",
userInteractionId: this.userInteractionId.data.dataValue
});
this.presentationRootPanel.reflow();
this.connect(this.presentation, "onSubmit", this, "handleOnSubmitPresentation");
} else {
this.presentation.userInteractionId = this.userInteractionId.data.dataValue;
this.presentation.start();
}
},
handleOnSubmitPresentation: function() {
console.log("[Answer Page]: User interaction answered.");
this.answerBtn.setValue("disabled", true);
this.userInteractionInfoPanel.hide();
this.loadingBarImg.hide();
this.loadingPanel.show();
this.submitAnswerMsgLbl.show();
},
userInteractionServiceSuccess: function(inSender, inDeprecated) {
this.loadingPanel.hide();
this.userInteractionInfoPanel.show();
},
userInteractionServiceError: function(inSender, inError) {
this.loadingBarImg.hide();
var interactionNotFoundError = "400 Cannot find object with uri:dunes://service.dunes.ch/WorkflowInput?id=";
if (inError.toString().indexOf(interactionNotFoundError) != -1) {
this.errMsgLbl.show();
} else {
this.serviceError(inError);
}
},
serviceError: function(inError) {
var errMsg = "[Answer Page][Error]: " + inError;
console.error(errMsg);
app.toastError(errMsg);
},
getParam: function(param) {
name = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
var regexS = "[\\?&]" + name + "=([^&#]*)";
var regex = new RegExp(regexS);
var results = regex.exec(window.location.href);
if (results === null) return "";
else return results[1];
},
_end: 0
});

Answer.widgets = {
userInteractionService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteraction","service":"WorkflowService"}, {"onError":"userInteractionServiceError","onSuccess":"userInteractionServiceSuccess"}, {
input: ["wm.ServiceInput", {"type":"getUserInteractionInputs"}, {}]
}],
userInteractionId: ["wm.Variable", {"type":"StringData"}, {}],
layoutBox1: ["wm.Layout", {"_classes":{"domNode":["answer"]},"horizontalAlign":"left","styles":{"backgroundGradient":"","backgroundImage":"","backgroundColor":""},"verticalAlign":"top"}, {}, {
answerHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","verticalAlign":"middle","width":"100%"}, {}, {
picture1: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/state_user_input.png","width":"18px"}, {}],
label7: ["wm.Label", {"caption":"Answer User Interaction","padding":"4,0,4,0","styles":{"fontWeight":"bold","fontSize":"13px"},"width":"185px"}, {}],
presentationRootPanel: ["wm.Panel", {"height":"1px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"1px"}, {}]
}],
loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
loadingBarImg: ["wm.Picture", {"height":"16px","source":"resources/images/o11n/workingBar.gif","width":"55px"}, {}],
errMsgLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#999999","caption":"User Interaction has been answered already.","height":"40px","padding":"4","showing":false,"styles":{"fontWeight":"bold","fontSize":"13px"},"width":"350px"}, {}],
submitAnswerMsgLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#999999","caption":"User interaction answered. Thank you!","height":"40px","padding":"4","showing":false,"styles":{"fontWeight":"bold","fontSize":"13px"},"width":"350px"}, {}]
}],
userInteractionInfoPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
panel2: ["wm.Panel", {"autoScroll":true,"border":"1","borderColor":"#eeeeee","fitToContentHeight":true,"height":"90px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","minDesktopHeight":90,"minHeight":90,"verticalAlign":"top","width":"100%"}, {}, {
panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","margin":"0,4,0,0","styles":{"fontSize":"13px","fontWeight":"bold"},"verticalAlign":"top","width":"132px"}, {}, {
label1: ["wm.Label", {"align":"right","caption":"Name:","padding":"4","width":"100%"}, {}],
label5: ["wm.Label", {"align":"right","caption":"Requested Date:","padding":"4","width":"100%"}, {}],
label3: ["wm.Label", {"align":"right","caption":"Description:","padding":"4","width":"100%"}, {}]
}],
panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","styles":{"fontSize":"13px"},"verticalAlign":"top","width":"100%"}, {}, {
label2: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.name","targetProperty":"caption"}, {}]
}]
}],
label6: ["wm.Label", {"display":"DateTime","padding":"4","width":"100%"}, {}, {
format: ["wm.DateTimeFormatter", {}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.createDate","targetProperty":"caption"}, {}]
}]
}],
label4: ["wm.Label", {"align":"left","autoSizeHeight":true,"height":"10px","padding":"4","singleLine":false,"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.description","targetProperty":"caption"}, {}]
}]
}]
}]
}],
panel5: ["wm.Panel", {"height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,52","verticalAlign":"top","width":"100%"}, {}, {
answerBtn: ["wm.Button", {"caption":"Answer","margin":"4"}, {"onclick":"answerBtnClick"}]
}]
}]
}]
};

Answer.prototype._cssText = '';
Answer.prototype._htmlText = '';