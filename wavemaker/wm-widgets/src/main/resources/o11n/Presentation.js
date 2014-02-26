dojo.provide("common.packages.o11n.Presentation");
 
dojo.declare("o11n.Presentation", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
	deferDataLoad: false,
	
    start: function() {
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[Presentation]: data load deferred...");
        }
    },

    load: function() {
        this.components.pagePresentationDialog.show();
        this.components.noPresentationPanel.hide();
    },

    pagePresentationDialogShow: function(inSender) {
        try {
            this.setProperties();
            if (this.components.userInteractionIdVar.getValue("dataValue")) {
                this.userInteraction = true;
                this.callUserInteractionService();
                return;
            }

            if (!this.components.workflowIdVar.getValue("dataValue")) {
                console.error("[Presentation][Error]: Can't initialize component without workflowId.");
                this.components.pagePresentationDialog.hide();
                return;
            }

            this.userInteraction = this.components.executionIdVar.getValue("dataValue");
            if (this.userInteraction) {
                this.callCreateUserInteractionServ();
            } else {
                this.callCreatePresentationService();
            }
        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onError(e);
            console.error(this.name + ".initComp() Failed: " + e.toString());
        }
    },

    setProperties: function() {
        if (this.workflowId) {
            this.components.workflowIdVar.setValue("dataValue", this.workflowId);
        }
        if (this.executionId) {
            this.components.executionIdVar.setValue("dataValue", this.executionId);
        }
        if (this.userInteractionId) {
            this.components.userInteractionIdVar.setValue("dataValue", this.userInteractionId);
        }
    },

    pagePresentationDialogClose: function(inSender, inWhy) {
        this.clearLayers();
    },

    createPresentationServicesSuccess: function(inSender, inDeprecated) {
        var presentationModel = inSender.getData();
        this.createPresentation(presentationModel);
    },

    createUserInteractionServSuccess: function(inSender, inDeprecated) {
        var presentationModel = inSender.getData();
        this.createPresentation(presentationModel);
    },

    userInteractionServiceSuccess: function(inSender, inDeprecated) {
        try {
            var userInteraction = inSender.getData();
            this.components.workflowIdVar.setValue("dataValue", userInteraction.workflowId);
            this.components.executionIdVar.setValue("dataValue", userInteraction.executionId);
            this.callCreateUserInteractionServ();
        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onError(e);
            console.error(this.name + ".initComp() Failed: " + e.toString());
        }
    },

    createPresentation: function(presentationModel) {
        try {
            this.presentationIdVar.setValue("dataValue", presentationModel.id);
            this.clearLayers();
            this.components.pagePresentationDialog.setTitle(presentationModel.name);
            var steps = presentationModel.steps;
            if (!steps) {
                this.components.noPresentationPanel.show();
                this.components.loadingPanel.hide();
                return;
            }
            if (steps.length === 0) {
                this.presWizard.addLayer("Step 1");
            } else {
                for (var i = 0; i < steps.length; i++) {
                    var name = steps[i].displayName ? steps[i].displayName : "Step " + (i + 1);
                    var layer = this.presWizard.addLayer(name);
                    layer.setWidth("100%");
                    layer.setHeight("100%");
                    layer.fitToContentHeight = true;
                    layer.setPadding("15,5");
                    this.parseGroups(steps[i].groups, layer);
                }
            }

            this.presWizard.client.setFitToContentHeight(true);
            this.presWizard.setLayerIndex(0);
            this.presWizard.getLayer(0).domNode.style.display = "block";
            this.components.scrollingPanel.reflow();
            this.components.scrollingPanel.show();
            this.components.loadingPanel.hide();
        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onError(e);
            console.error('ERROR IN presentationVariableResult: ' + e);
        }
    },

    parseGroups: function(groups, layer) {
        if (!groups) {
            return;
        }
        layer.groups = [];
        for (var i = 0; i < groups.length; i++) {
            var name = groups[i].displayName ? groups[i].displayName : "Group " + (i + 1);
            var groupPanel = layer.createComponent("groupPanel" + i, "wm.Panel", {
                showing: true,
                layoutKind: "top-to-bottom",
                width: "100%",
                height: "100%",
                margin: "3, 0",
                padding: "2, 2, 5, 2",
                fitToContentHeight: true,
                border: "1"
            });
            var groupLabel = groupPanel.createComponent("groupLabel" + i, "wm.Label");
            groupLabel.setCaption(name);
            layer.groups.push(groupPanel);
            this.parseFields(groups[i].fields, groupPanel);
        }
    },

    parseFields: function(fields, panel) {
        if (!fields) {
            return;
        }
        panel.fields = [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var name = field.displayName ? field.displayName : "Field " + (i + 1);
            var wmField;
            if (field.type.indexOf("Array/") != -1) {
                var arrType = field.type.split("Array/")[1];
                wmField = panel.createComponent(field.id, "o11n.ArrayChooser", {
                        showing: true,
                        width: "100%",
                        fitToContentHeight: true,
                        minHeight: "120px",
                        height: "100%",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        arrayType: arrType,
                        fieldType: field.fieldType
                });
                wmField.presentationId = field.id;
                wmField.paramType = field.type;

            } else {
                if (field.fieldType == "SIMPLE") {
                    var componentType;
                    if (field.type == "string") {
                        componentType = "wm.Text";
                    } else if (field.type == "number") {
                        componentType = "wm.Number";
                    } else if (field.type == "boolean") {
                        componentType = "wm.Checkbox";
                    } else if (field.type == "Date") {
                        componentType = "wm.Date";
                    }
                    wmField = panel.createComponent(field.id, componentType, {
                        showing: true,
                        width: "100px",
                        height: "36px",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        captionPosition: "top",
                        captionAlign: "left"
                    });
                    wmField.presentationId = field.id;
                    wmField.paramType = field.type;
                } else if (field.fieldType == "SDK_OBJECT") {
                    //todo keep and use the type too
                    wmField = panel.createComponent(field.id, "o11n.ObjectChooser", {
                        showing: true,
                        width: "100%",
                        height: "60px",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        sdkType: field.type
                    });
                    wmField.presentationId = field.id;
                    wmField.paramType = field.type;
                } else {
                    //todo keep and use the type too
                    wmField = panel.createComponent(field.id, "o11n.ObjectChooser", {
                        showing: true,
                        width: "100%",
                        height: "60px",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        isTree: false,
                        sdkType: field.type
                    });
                    wmField.presentationId = field.id;
                    wmField.paramType = field.type;
                }
            }
            panel.fields.push(wmField);
        }
    },

    clearLayers: function() {
        for (var i = this.presWizard.getCount(); i > 0; i--) {
            this.presWizard.getLayer(i - 1).destroy();
        }
    },

    submitButtonClick: function(inSender) {
        try {
            this.components.scrollingPanel.hide();
            this.components.noPresentationPanel.hide();
            this.components.loadingPanel.show();
            var params = [];
            var layersCount = this.presWizard.getCount();
            for (var i = 0; i < layersCount; i++) {
                var layer = this.presWizard.getLayer(i);
                for (var j = 0; layer.groups && j < layer.groups.length; j++) {
                    var group = layer.groups[j];
                    for (var k = 0; group.fields && k < group.fields.length; k++) {
                        var field = group.fields[k];
                        var paramObj = {
                            name: field.presentationId,
                            type: field.paramType
                        };

                        if (field.type == "o11n.ArrayChooser") {
                            // todo: fix selection property and go on
                            continue;
                        } else if (field.type == "Date") {
                            // todo: problems parsing the numeric value
                            continue;
                        } else if (field.type == "number") {
                            paramObj.value = field.dataValue;
                        } else if (field.type == "o11n.ObjectChooser" && field.selection.data) {
                            paramObj.type = "sdkobject";
                            paramObj.value = {
                                type: field.paramType,
                                id: field.selection.data
                            };

                        } else /* string */
                        {
                            paramObj.value = field.dataValue;
                        }

                        params.push(paramObj);
                    }
                }
            }
            this.components.paramsVar.setData(params);

            if (this.userInteraction) {
                this.callAnswerUserInteractionServ();
            } else {
                this.callRunPresentationService();
            }

        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onError(e);
            console.error('[Presentation][Error][presWizardDoneClick]: ' + e);
        }
    },

    runPresentationServiceSuccess: function(inSender, inDeprecated) {
        this.components.pagePresentationDialog.hide();
        this.onSubmit();
        app.toastSuccess(this.components.i18nWorkflowStartedMsg.caption);

        var presentationModel = inSender.getData();
        dojo.publish("ExecutionStateChangeEvent", [{
            status: "RUNNING",
            executionId: presentationModel.associatedExecutionId,
            workflowId: this.components.workflowIdVar.data.dataValue,
            workflowName: this.components.pagePresentationDialog.title
        }]);
    },

    answerUserInteractionServSuccess: function(inSender, inDeprecated) {
        this.components.pagePresentationDialog.hide();
        this.onSubmit();
        app.toastSuccess(this.components.i18nUserInteractionAnsweredMsg.caption);

        dojo.publish("ExecutionStateChangeEvent", [{
            status: "ANSWERED",
            executionId: this.components.executionIdVar.data.dataValue,
            workflowId: this.components.workflowIdVar.data.dataValue,
            workflowName: this.components.pagePresentationDialog.title,
            userInteractionId: this.components.userInteractionIdVar.data.dataValue
        }]);
    },

    cancelButtonClick: function(inSender) {
        try {
            this.components.scrollingPanel.hide();
            this.components.noPresentationPanel.hide();
            this.components.loadingPanel.show();
            if (this.userInteraction) {
                this.callDeleteUserInteractionServ();
            } else {
                this.callDeletePresentationService();
            }
        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onCancel();
            console.error('ERROR IN presWizardCancelClick: ' + e);
        }
    },

    updatePresentationServiceError: function(inSender, inError) {
        this.onError(inError);
    },
    updateUserInteractionServError: function(inSender, inError) {
        this.onError(inError);
    },
    answerUserInteractionServError: function(inSender, inError) {
        this.onError(inError);
    },
    runPresentationServiceError: function(inSender, inError) {
        this.onError(inError);
    },
    createPresentationServicesError: function(inSender, inError) {
        this.onError(inError);
    },
    createUserInteractionServError: function(inSender, inError) {
        this.onError(inError);
    },

    onError: function(inError) {
        app.toastError(inError);
        console.error("[Presentation][Error]: " + inError);
    },

    deleteUserInteractionServResult: function(inSender, inDeprecated) {
        this.components.pagePresentationDialog.hide();
        this.onCancel();
    },

    deletePresentationServiceResult: function(inSender, inDeprecated) {
        this.components.pagePresentationDialog.hide();
        this.onCancel();
    },

    userInteractionServiceError: function(inSender, inError) {
        this.onError(inError);
        this.components.pagePresentationDialog.hide();
        this.onCancel();
    },

    //The methods below are needed since the binding stop working after the second componsite component nesting. 
    callCreatePresentationService: function() {
        this.bindAndCallService(this.createPresentationServices, ['workflowId']);
    },

    callCreateUserInteractionServ: function() {
        this.bindAndCallService(this.components.createUserInteractionServ, ['workflowId', 'executionId']);
    },

    callAnswerUserInteractionServ: function() {
        this.bindAndCallService(this.components.answerUserInteractionServ, ['workflowId', 'executionId', 'presentationExecutionId', 'params']);
    },

    callRunPresentationService: function() {
        this.bindAndCallService(this.components.runPresentationService, ['workflowId', 'presentationId', 'params']);
    },

    callDeleteUserInteractionServ: function() {
        this.bindAndCallService(this.components.deleteUserInteractionServ, ['workflowId', 'executionId', 'presentationExecutionId']);
    },

    callDeletePresentationService: function() {
        this.bindAndCallService(this.components.deletePresentationService, ['workflowId', 'presentationId']);
    },

    callUserInteractionService: function() {
        this.components.userInteractionService.input.setValue('userInteractionId', this.components.userInteractionIdVar.data.dataValue);
        this.components.userInteractionService.update();
    },

    bindAndCallService: function(service, inputs) {
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                if (input === "workflowId") {
                    service.input.setValue('workflowId', this.components.workflowIdVar.data.dataValue);
                } else if (input === "executionId") {
                    service.input.setValue('executionId', this.components.executionIdVar.data.dataValue);
                } else if (input === "presentationId") {
                    service.input.setValue('presentationId', this.presentationIdVar.data.dataValue);
                } else if (input === "presentationExecutionId") {
                    service.input.setValue('presentationExecutionId', this.presentationIdVar.data.dataValue);
                } else if (input === "params") {
                    service.input.setValue('params', this.components.paramsVar);
                }
            }
        }
        service.update();
    },

    onSubmit: function() {
        console.log("[Presentation][Event]: onSubmit event fired....");
    },

    onCancel: function() {
        console.log("[Presentation][Event]: onCancel event fired....");
    },
    _end: 0
});
 
o11n.Presentation.components = {
	workflowIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	userInteractionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	paramsVar: ["wm.Variable", {"isList":true,"type":"com.vmware.o11n.wm.common.PresentationParameter"}, {}],
	updatePresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"updatePresentationInstance","service":"PresentationService"}, {"onError":"updatePresentationServiceError"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"presWizard","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updatePresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	presentationIdVar: ["wm.Variable", {"type":"StringData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"createPresentationServices.id","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	createPresentationServices: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"createPresentationInstance","service":"PresentationService"}, {"onError":"createPresentationServicesError","onSuccess":"createPresentationServicesSuccess"}, {
		input: ["wm.ServiceInput", {"type":"createPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	deletePresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"deletePresentationInstance","service":"PresentationService"}, {"onResult":"deletePresentationServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"deletePresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}]
			}]
		}]
	}],
	createUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"createUserInteractionPresentationInstance","service":"PresentationService"}, {"onError":"createUserInteractionServError","onSuccess":"createUserInteractionServSuccess"}, {
		input: ["wm.ServiceInput", {"type":"createUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	updateUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"updateUserInteractionPresentationInstance","service":"PresentationService"}, {"onError":"updateUserInteractionServError"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"presWizard","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updateUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire3: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	deleteUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"deleteUserInteractionPresentationInstance","service":"PresentationService"}, {"onResult":"deleteUserInteractionServResult"}, {
		input: ["wm.ServiceInput", {"type":"deleteUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	runPresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"runWorkflowPresentation","service":"PresentationService"}, {"onError":"runPresentationServiceError","onSuccess":"runPresentationServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"runWorkflowPresentationInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	answerUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"answerUserInteractionPresentation","service":"PresentationService"}, {"onError":"answerUserInteractionServError","onResult":"answerUserInteractionServResult","onSuccess":"answerUserInteractionServSuccess"}, {
		input: ["wm.ServiceInput", {"type":"answerUserInteractionPresentationInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire3: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	userInteractionService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteraction","service":"WorkflowService"}, {"onError":"userInteractionServiceError","onSuccess":"userInteractionServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getUserInteractionInputs"}, {}]
	}],
	pagePresentationDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"presentationLayout","desktopHeight":"700px","height":"700px","title":" ","width":"800px"}, {"onClose":"pagePresentationDialogClose","onShow":"pagePresentationDialogShow"}, {
		presentationLayout: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","minDesktopHeight":200,"minHeight":200,"minWidth":400,"padding":"5,0,5,0","verticalAlign":"top","width":"100%"}, {}, {
			noPresentationPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
				label1: ["wm.Label", {"caption":"No Inputs","padding":"4","styles":{"fontSize":"13px","fontFamily":"arial-narrow","fontWeight":"bold"},"width":"68px"}, {}]
			}],
			loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				picture1: ["wm.Picture", {"height":"16px","source":"resources/images/o11n/workingBar.gif","width":"55px"}, {}]
			}],
			scrollingPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
				presWizard: ["wm.Layers", {"defaultLayer":0,"minDesktopHeight":200,"minHeight":200,"minWidth":400,"transition":"fade"}, {}]
			}],
			i18nWorkflowStartedMsg: ["wm.Label", {"caption":"Workflow started.","padding":"4","showing":false}, {}],
			i18nUserInteractionAnsweredMsg: ["wm.Label", {"caption":"Pending Workflow Answered.","padding":"4","showing":false}, {}],
			buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","desktopHeight":"32px","enableTouchHeight":true,"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","mobileHeight":"40px","verticalAlign":"top","width":"100%"}, {}, {
				cancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"cancelButtonClick"}],
				submitButton: ["wm.Button", {"caption":"Submit","margin":"4"}, {"onclick":"submitButtonClick"}]
			}]
		}]
	}],
	emptyPanel: ["wm.Panel", {"borderColor":"","height":"2px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"30px"}, {}, {
		emptyLabel: ["wm.Label", {"borderColor":"","caption":"  ","height":"2px","padding":"0","showing":false,"width":"2px"}, {}]
	}]}
 
wm.publish(o11n.Presentation, [
	["workflowId", "workflowIdVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["executionId", "executionIdVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["userInteractionId", "userInteractionIdVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "Presentation", "o11n.Presentation", "common.packages.o11n.Presentation", "images/wm/widget.png", "vCO Workflow Presentation", {width: "100%", height: "100%"},false]);