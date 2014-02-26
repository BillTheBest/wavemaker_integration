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