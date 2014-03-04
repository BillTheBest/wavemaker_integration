dojo.provide("common.packages.o11n.Presentation");
 
dojo.declare("o11n.Presentation", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
	deferDataLoad: false,
    currentLayer: 0,
    navBuilt: false,
	
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
        this.subscribe("RefreshEvent", this, this.onRefreshEvent);
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
        this.currentLayer = 0;
        this.navBuilt = false;
    },

    createPresentationServicesSuccess: function(inSender, inDeprecated) {
        var presentationModel = inSender.getData();
        this.createPresentation(presentationModel);
    },

    updatePresentationServiceSuccess: function(inSender, inDeprecated) {
        var presentationModel = inSender.getData();
        this.currentLayer = this.presWizard.indexOfLayer(this.presWizard.getActiveLayer());
        this.buildLayers(presentationModel);
        this.presWizard.setLayerIndex(this.currentLayer);
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
            this.buildLayers(presentationModel);
            this.components.pagePresentationDialog.setTitle(presentationModel.name);

            this.components.scrollingPanel.show();
            this.components.loadingPanel.hide();
        } catch (e) {
            this.components.pagePresentationDialog.hide();
            this.onError(e);
            console.error('ERROR IN presentationVariableResult: ' + e);
        }
    },
    
    buildLayers: function(presentationModel) {
            this.clearLayers();
            var steps = presentationModel.steps;
            if (!steps) {
                this.components.noPresentationPanel.show();
                this.components.loadingPanel.hide();
                return;
            }

            var navBlock = [];
            if (steps.length === 0) {
                this.presWizard.addLayer("Common parameters");
                this.components.navArrayVar.setData([{name: "Common parameters", dataValue: {index: 0, type: "step"}}]);
            } else {
                var compositeIndex = -1;
                for (var i = 0; i < steps.length; i++) {
                    compositeIndex++;
                    var name = steps[i].displayName ? steps[i].displayName : "Step " + (i + 1);
                    navBlock.push({name: name, dataValue: {index: compositeIndex, type: "step"}});
                    var layer = this.presWizard.addLayer(name);
                    layer.setWidth("100%");
                    layer.setHeight("100%");
                    layer.fitToContentHeight = true;
                    layer.setPadding("15,5");
                    var groups = steps[i].groups;
                    for (var j = 0; j < groups.length; j++) {
                        compositeIndex++;
                        var gName = groups[j].displayName ? groups[j].displayName : "Common parameters";
                        navBlock.push({name: gName, dataValue: {index: compositeIndex, type: "group"}});
                        var gLayer = this.presWizard.addLayer(gName);
                        gLayer.setWidth("100%");
                        gLayer.setHeight("100%");
                        gLayer.fitToContentHeight = true;
                        gLayer.setPadding("15,5");
                        this.createLayerHeader(gName, gLayer);
                        var scrollPanel = gLayer.createComponent("group_panel", "wm.Panel", {
                            showing: true,
                            width: "100%",
                            height: "100%",
                            autoScroll: true
                        });

                        this.parseFields(groups[j].fields, scrollPanel);
                    }
                }
            }

            if (!this.navBuilt) {
                this.components.navArrayVar.setData(navBlock);
                this.components.presNavList.setDataSet(this.components.navArrayVar);
                dojo.connect(this.components.presNavList, "onSelect", this, function(inSender) {
                    var index = inSender.getData().dataValue.index;
                    if (inSender.getData().dataValue.type == "step") {
                        if (index < this.components.presNavList.getCount()) {
                            this.components.presNavList.selectByIndex(index + 1);
                        }
                    } else {
                        this.presWizard.setLayerIndex(index);
                    }
                });
                this.navBuilt = true;
            }
            
            this.presWizard.setLayerIndex(this.currentLayer);
            this.presWizard.getLayer(0).domNode.style.display = "block";
            this.components.scrollingPanel.reflow();
    },
    
    createLayerHeader: function(name, layer) {
        var ll = layer.createComponent("group_label", "wm.Label", {
                        showing: true,
                        width: "100%",
                        height: "30px",
                        padding: "2, 5, 5, 40",
                        caption: name
        });
        
        ll.domNode.style.fontWeight = "bold";
        ll.domNode.style.fontSize = "14px";

    },

    parseFields: function(fields, panel) {
        if (!fields) {
            return;
        }
        panel.parent.fields = [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var name = field.displayName ? field.displayName : "Field " + (i + 1);
            var wmField;
            if (field.type.indexOf("Array/") != -1) {
                var arrType = field.type.split("Array/")[1];
                wmField = panel.createComponent(field.id, "o11n.ArrayChooser", {
                        showing: true,
                        width: "100%",
                        height: "50px",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        arrayType: arrType,
                        fieldType: field.fieldType,
                        constraints: field.constraints,
                        decorators: field.decorators
                });
                if (arrType == "Date" && field.value) {
                    var dates = [];
                    for (var k=0; k<field.value.length; k++) {
                        dates.push(new Date(field.value[k]));
                    }
                    wmField.setData(dates);
                } else {
                    wmField.setData(field.value);
                }
                wmField.presentationId = field.id;
                wmField.paramType = field.type;

            } else {
                if (field.fieldType == "SIMPLE") {
                    var componentType;
                    if (field.type == "string") {
                        componentType = "o11n.VcoText";
                    } else if (field.type == "number") {
                        componentType = "o11n.VcoNumber";
                    } else if (field.type == "boolean") {
                        componentType = "wm.Checkbox";
                    } else if (field.type == "Date") {
                        componentType = "o11n.VcoDate";
                    } else if (field.type == "MimeAttachment") {
                        componentType = "o11n.MimeTypeChooser";
                    }
                    wmField = panel.createComponent(field.id, componentType, {
                        showing: !field.hidden,
                        width: "100%",
                        height: (field.type == "string" && field.decorators.multiline) ?
                                        "80px": "50px",
                        padding: "2, 5, 5, 40",
                        caption: field.displayName + ":",
                        captionPosition: "top",
                        captionAlign: "left",
                        constraints: field.constraints,
                        decorators: field.decorators,
                        dataValue: field.value
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
            panel.parent.fields.push(wmField);
        }
    },
    
    clearLayers: function() {
        for (var i = this.presWizard.getCount(); i > 0; i--) {
            this.presWizard.getLayer(i - 1).destroy();
        }
    },

    submitButtonClick: function(inSender) {
        if (!this.isPresentationValid()) {
            app.toastError("Presentation validation failed!");
            return;
        }

        try {
            this.components.scrollingPanel.hide();
            this.components.noPresentationPanel.hide();
            this.components.loadingPanel.show();

            this.updateParams();

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

    isPresentationValid: function() {
        var layersCount = this.presWizard.getCount();
        for (var i = 0; i < layersCount; i++) {
            var layer = this.presWizard.getLayer(i);
            for (var k = 0; layer.fields && k < layer.fields.length; k++) {
                var field = layer.fields[k];
                //checks if the isValid() function exists before calling it
                if(field.isValid && !field.isValid()) {
                    return false;
                }
            }
        }
        return true;
    },

    updateParams: function() {
        var params = [];
        var layersCount = this.presWizard.getCount();
        for (var i = 0; i < layersCount; i++) {
            var layer = this.presWizard.getLayer(i);
            for (var k = 0; layer.fields && k < layer.fields.length; k++) {
                var field = layer.fields[k];
                var paramObj = {
                    name: field.presentationId,
                    type: field.paramType
                };

                if (field.type == "o11n.ArrayChooser") {
                    paramObj.value = [];
                    var itemCount = field.dataValue ? field.dataValue.length : 0;
                    for (var x = 0; x < itemCount; x++) {
                        var item = field.dataValue[x].dataValue;
                        paramObj.value.push(this.processArrayItem(item, field.arrayType));
                    }
                } else if (field.type == "o11n.ObjectChooser" && field.selection) {
                    paramObj.type = "sdkobject";
                    paramObj.value = {
                        type: field.paramType,
                        id: field.selection.data
                    };
                
                } else if (field.type == "o11n.MimeTypeChooser") {
                    paramObj.value = {
                        name: field.uploadedFile.name,
                        path: field.uploadedFile.path,
                        uploaded: field.uploadedFile.uploaded
                    };
                } else /* simple */ {
                    paramObj.value = field.dataValue;
                }
                params.push(paramObj);
            }
        }
        this.components.paramsVar.setData(params);
    },
    
    processArrayItem: function(item, type) {
        var paramObj = {
            name: item.name,
            type: type
        };

        if (type == "number" || type == "string" || type == "Date") {
            paramObj.value = item.value;
        } else {
            paramObj.value = {
                id: item.value.data,
                type: type
            };
        }
        return paramObj;
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

    callUpdatePresentationService: function() {
        this.bindAndCallService(this.components.updatePresentationService, ['workflowId', 'presentationId', 'params']);
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
    presNavListStyleRow: function(inSender, inRow, rowData) {
		if (rowData.dataValue.type == "step") {
            inRow.customStyles += "; background-color:#dddddd; font-weight:bold; font-size:14px; font-family:sans-serif";
        } else if (rowData.dataValue.type == "group") {
            inRow.customStyles += "; background-color:#dddddd; margin-left:20px; font-size:12px; font-family:sans-serif";
        }
	},
	backButtonClick: function(inSender) {
        var selIndex = this.components.presNavList.getSelectedIndex();
        if (selIndex - 1 >= 0) {
            if (this.components.presNavList.getItem(selIndex - 1).getData().dataValue.type == "step" &&
                                                                    selIndex - 2 >= 0) {
                this.components.presNavList.selectByIndex(selIndex - 2);
            } else {
                this.components.presNavList.selectByIndex(selIndex - 1);
            }
        }
	},
	nextButtonClick: function(inSender) {
        var selIndex = this.components.presNavList.getSelectedIndex();
        if (selIndex + 1 < this.components.presNavList.getCount()) {
            this.components.presNavList.selectByIndex(selIndex + 1);
        }
	},
	presNavListSelect: function(inSender, inItem) {
        var selIndex = this.components.presNavList.getSelectedIndex();
        var backEnabled = false;
        var nextEnabled = false;
        for (var i=selIndex; i>0; i--) {
            if (this.components.presNavList.getItem(i-1).getData().dataValue.type == "group") {
                backEnabled = true;
                break;
            }
        }
        var itemCount = this.components.presNavList.getCount();
        for (var i=selIndex; i<itemCount-1; i++) {
            if (this.components.presNavList.getItem(i+1).getData().dataValue.type == "group") {
                nextEnabled = true;
                break;
            }
        }
        this.components.backButton.setDisabled(!backEnabled);
        this.components.nextButton.setDisabled(!nextEnabled);
	},

    onRefreshEvent: function (par1, par2, par3) {
        console.log("REFRESH requested!");
        this.updateParams();
        this.callUpdatePresentationService();
    },

	_end: 0
});
 
o11n.Presentation.components = {
	workflowIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	userInteractionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	paramsVar: ["wm.Variable", {"isList":true,"type":"com.vmware.o11n.wm.common.PresentationParameter"}, {}],
	updatePresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"updatePresentationInstance","service":"PresentationService"}, {"onError":"updatePresentationServiceError","onSuccess":"updatePresentationServiceSuccess"}, {
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
	navArrayVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	pagePresentationDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"presentationLayout","desktopHeight":"700px","height":"700px","title":" ","width":"800px"}, {"onClose":"pagePresentationDialogClose","onShow":"pagePresentationDialogShow"}, {
		presentationLayout: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","minDesktopHeight":200,"minHeight":200,"minWidth":400,"verticalAlign":"top","width":"100%"}, {}, {
			noPresentationPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
				label1: ["wm.Label", {"caption":"No Inputs","padding":"4","styles":{"fontSize":"13px","fontFamily":"arial-narrow","fontWeight":"bold"},"width":"68px"}, {}]
			}],
			loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				picture1: ["wm.Picture", {"height":"16px","source":"resources/images/o11n/workingBar.gif","width":"55px"}, {}]
			}],
			scrollingPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,0","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
				presNavPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
					presNavList: ["wm.List", {"_classes":{"domNode":["GridListStyle"]},"border":"0","borderColor":"","columns":[{"show":true,"field":"name","title":"Name","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","displayType":"Any","align":"left","formatFunc":""}],"dataSet":"","headerVisible":false,"height":"100%","margin":"0","minDesktopHeight":60,"padding":"4,0,4,16","scrollToSelection":true,"selectFirstRow":true,"styles":{"backgroundColor":"#dddddd"}}, {"onSelect":"presNavListSelect","onStyleRow":"presNavListStyleRow"}]
				}],
				presWizard: ["wm.Layers", {"defaultLayer":0,"minDesktopHeight":200,"minHeight":200,"minWidth":400}, {}]
			}],
			i18nWorkflowStartedMsg: ["wm.Label", {"caption":"Workflow started.","padding":"4","showing":false}, {}],
			i18nUserInteractionAnsweredMsg: ["wm.Label", {"caption":"Pending Workflow Answered.","padding":"4","showing":false}, {}],
			buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","desktopHeight":"32px","enableTouchHeight":true,"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","mobileHeight":"40px","verticalAlign":"top","width":"100%"}, {}, {
				backButton: ["wm.Button", {"caption":"Back","margin":"4"}, {"onclick":"backButtonClick"}],
				nextButton: ["wm.Button", {"caption":"Next","margin":"4"}, {"onclick":"nextButtonClick"}],
				submitButton: ["wm.Button", {"caption":"Finish","margin":"4"}, {"onclick":"submitButtonClick"}],
				cancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"cancelButtonClick"}]
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