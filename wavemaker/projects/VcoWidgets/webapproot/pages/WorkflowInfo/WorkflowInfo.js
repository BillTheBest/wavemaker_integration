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