dojo.provide("common.packages.o11n.WorkflowInfo");
 
dojo.declare("o11n.WorkflowInfo", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
    presentation: null,
    deferDataLoad: false,
    
    start: function() {
        if (!this.deferDataLoad) {
            this.load(this.components.varWorkflowId.data.dataValue, this.components.varWorkflowName.data.dataValue, this.components.varWorkflowType.data.dataValue);
        } else {
            console.log("[WorkflowInfo]: data load deferred...");
        }
    },

    load: function(workflowId, workflowName, workflowType) {
        try {
            console.log("Workflow Id: " + workflowId + " - type: " + workflowType + " - Workflow Name: " + workflowName);
            this.components.wf_name.setCaption(workflowName);

            if (!workflowId) {
                this.components.wf_description_panel.hide();
                this.components.runWorkflowImg.hide();
                this.components.name_icon.setValue("source", "");
                return;
            }

            if (workflowType == "WorkflowCategory") {
                this.components.name_icon.setValue("source", "resources/images/o11n/workflow-category_16x16.png");
                this.components.wf_description_panel.hide();
                this.components.wf_input_param_grid.hide();
                this.components.input_parameters_label.hide();
                this.components.wf_output_param_grid.hide();
                this.components.output_parameters_label.hide();
                this.components.runWorkflowImg.hide();
            } else {
                //invoke getWorkflow via binding this.components.workflowServiceVariable
                this.components.varWorkflowId.setValue("dataValue", workflowId);
                this.components.name_icon.setValue("source", "resources/images/o11n/workflow-item_16x16.png");
                this.components.wf_description_panel.show();
                this.components.runWorkflowImg.show();
            }
        } catch (e) {
            console.error('"[WorkflowInfo][ERROR]: in the initialization of the component: ' + e);
        }
    },
    
     workflowServiceVariableSuccess: function(inSender, inDeprecated) {
        var workflowModel = inSender.getData();
        this.wf_description.setValue("showing", workflowModel.description);

        this.components.input_parameters_label.setValue("showing", workflowModel.inputParameters);
        this.components.wf_input_param_grid.setValue("showing", workflowModel.inputParameters);

        this.components.output_parameters_label.setValue("showing", workflowModel.outputParameters);
        this.components.wf_output_param_grid.setValue("showing", workflowModel.outputParameters);
    },
    
    workflowServiceVariableError: function(inSender, inError) {
        var errMsg = "[WorkflowInfo][Error]: " + inError;
        app.toastError(errMsg);
        console.error(errMsg);
    },

    runWorkflowImgClick: function(inSender) {
        if (!this.presentation) {
            this.presentation = this.components.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: this.components.varWorkflowId.data.dataValue
            });
            this.components.presentationRootPanel.reflow();
        }else{
            this.presentation.workflowId = this.components.varWorkflowId.data.dataValue;
            this.presentation.start();
        }
    },
   
    _end: 0
});
 
o11n.WorkflowInfo.components = {
	varWorkflowId: ["wm.Variable", {"type":"StringData"}, {}],
	varWorkflowType: ["wm.Variable", {"type":"StringData"}, {}],
	varWorkflowName: ["wm.Variable", {"type":"StringData"}, {}],
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
	}]}
 
wm.publish(o11n.WorkflowInfo, [
	["workflowId", "varWorkflowId.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["workflowType", "varWorkflowType.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["workflowName", "varWorkflowName.dataValue", {group: "Published", bindSource: true, bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "WorkflowInfo", "o11n.WorkflowInfo", "common.packages.o11n.WorkflowInfo", "images/wm/widget.png", "vCO Workflow Information", {width: "100%", height: "100%"},false]);