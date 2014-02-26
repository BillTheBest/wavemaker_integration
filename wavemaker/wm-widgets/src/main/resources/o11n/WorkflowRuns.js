dojo.provide("common.packages.o11n.WorkflowRuns");
 
dojo.declare("o11n.WorkflowRuns", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
    deferDataLoad: false,
    presentation: null,
    sortOrders: [],
    stateFilter: [{
        displayValue: "COMPLETED",
        value: "completed"
    },
    {
        displayValue: "RUNNING",
        value: "running"
    },
    {
        displayValue: "FAILED",
        value: "failed"
    },
    {
        displayValue: "CANCELED",
        value: "canceled"
    },
    {
        displayValue: "WAITING",
        value: "waiting"
    },
    {
        displayValue: "ALL",
        value: "ALL"
    }],

    start: function() {
        if (!this.deferDataLoad) {
            this.load(this.components.workflowIdVar.data.dataValue);
        } else {
            console.log("[WorkflowRuns]: data load deferred...");
        }
        this.subscribe("ExecutionStateChangeEvent", this, "handleExecutionStateChangeEvent");
    },

    load: function(workflowId) {
        if (this.components.executionsPerWorkflowVar.data.dataValue) {
            if (workflowId) {
                this.components.workflowIdVar.setValue("dataValue", workflowId);
                this.wf_executions_grid.hide();
            } else {
                console.error("[WorkflowRuns][Error]: missing workflowId when execution per workflow property set.");
                return;
            }
        }

        this.disableButtons();
        this.components.currentPagination.setValue("dataValue", 1);
        this.addIfNoWorkflowIdWorkflowNameColumn();
        this.specVar.setData({
            startIndex: 0,
            maxResult: 10,
            sortOrders: "-startDate"
        });
        if (this.components.executionsPerWorkflowVar.data.dataValue) {
            this.specVar.setValue("maxResult", 0);
        }
        this.components.stateFilterVar.setData(this.stateFilter);
        if (!this.setStateFilterValue()) {
            this.components.workflowExecutionsService.update();
        }
        console.log("[WorkflowRuns]: initial data load starting...");
    },
    
    handleExecutionStateChangeEvent: function(inEvent){
    	this.components.workflowExecutionsService.update();
    	console.log("[WorkflowRuns]: Reloading data on ExecutionStateChangeEvent...");
    },

    setStateFilterValue: function() {
        var state = this.components.executionStateFilterVar.data.dataValue;
        if (state) {
            this.specVar.setValue("conditions", "state=" + state.toLowerCase());
            this.components.stateLookup.setDisplayValue(state.toUpperCase());
            return true;
        }
        return false;
    },

    disableButtons: function() {
        this.disableCancelButton(true);
        this.disableRestartButton(true);
        this.disableAnswerButton(true);
    },

    addIfNoWorkflowIdWorkflowNameColumn: function() {
        if (this.components.executionsPerWorkflowVar.data.dataValue) {
            this.currentWorkflowId.setValue("dataValue", this.components.workflowIdVar.data.dataValue);
        } else {
            this.wf_executions_grid.columns[2].show = true; //add workflowName column
        }
    },

    wf_executions_gridSelect: function(inSender) {
        console.log("[WorkflowRuns]: Current Selection: " + inSender.selectedItem.getData().id);
        this.setActionButtonsState(inSender);
        this.setCurrentExecutionDetals(inSender);

        if (this.components.executionsPerWorkflowVar.data.dataValue) {
            this.components.executionService.update();
            this.components.runEventsServices.update();
        } else {
            this.currentWorkflowIdService.update();
        }
    },

    setCurrentExecutionDetals: function(inSender) {
        var workflowExecutionModel = inSender.selectedItem.getData();
        this.components.executionStatusLabel.setCaption(workflowExecutionModel.state);
        this.components.executionStartedLabel.setCaption(workflowExecutionModel.startDate);
        this.components.executionEndedLabel.setCaption(workflowExecutionModel.endDate);
        this.components.executionBusinessStatus.setCaption(workflowExecutionModel.businessState);
        if (workflowExecutionModel.businessState) {
            this.components.businessStatusLabel.show();
        } else {
            this.components.businessStatusLabel.hide();
        }
        this.components.currentWorkflowName.setValue("dataValue", workflowExecutionModel.name);
    },

    currentWorkflowIdServiceSuccess: function(inSender, inDeprecated) {
        this.components.executionService.update();
        this.components.runEventsServices.update();
    },

    workflowExecutionsServiceSuccess: function(inSender, inDeprecated) {
        this.setMaxPagination(inSender.getData().total);
        this.wf_executions_grid.show();
        console.log("[WorkflowRuns]: Workflow executions updated");

        var paginatedWorkflowExecution = inSender.getData();
        if (!paginatedWorkflowExecution.list) {
            this.execution_details_panel.hide();
        } else {
            this.execution_details_panel.show();
        }
    },

    workflowExecutionsServiceError: function(inSender, inError) {
        app.toastError("[WorkflowRuns][Error]: " + inError);
    },

    wf_executions_gridRenderData: function(inSender) {
        this.disableDefaultSortingIfPagination();
    },

    disableDefaultSortingIfPagination: function() {
        if (this.components.maxPaginationVar.data.dataValue > 1) {
            this.wf_executions_grid.dojoObj.canSort = function() {
                return false;
            };
        }
    },

    setMaxPagination: function(total) {
        total = total > 1 ? total : 1;
        var maxResult = this.specVar.getValue("maxResult");
        var value = Math.ceil(total / (maxResult? maxResult: 1));
        value = value === 0 ? 1 : value;
        this.components.maxPaginationVar.setValue("dataValue", value);
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
        if (this.components.currentPagination.data.dataValue == paginationPageNum) {
            return;
        }
        this.components.currentPagination.setValue("dataValue", paginationPageNum);
        this.specVar.setValue("startIndex", (paginationPageNum - 1) * this.specVar.getValue("maxResult"));
        this.components.workflowExecutionsService.update();
        console.log("[WorkflowRuns]: Paginate Update...");
    },

    isPaginationNumValid: function(paginationPageNum) {
        return paginationPageNum >= 1 && this.components.maxPaginationVar.data.dataValue >= paginationPageNum;
    },

    next_page_imgClick: function(inSender) {
        this.paginate(this.components.currentPagination.data.dataValue + 1);
    },

    prev_page_imgClick: function(inSender) {
        this.paginate(this.components.currentPagination.data.dataValue - 1);
    },

    last_page_imgClick: function(inSender) {
        this.paginate(this.components.maxPaginationVar.data.dataValue);
    },

    first_page_imgClick: function(inSender) {
        this.paginate(1);
    },

    wf_executions_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if (this.components.maxPaginationVar.data.dataValue <= 1) {
            return;
        }
        this.set_selected_field_sorted_order(fieldId);
        var sortOrdersReverse = this.sortOrders.concat([]).reverse();
        this.specVar.setValue("sortOrders", sortOrdersReverse.toString());
        this.components.workflowExecutionsService.update();
        console.log("[WorkflowRuns]: On sort update... ");
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

    stateLookupChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSetByCode) {
            return;
        }
        if (!inDisplayValue) {
            return;
        }
        if (!inDataValue) {
            return;
        }
        if (inDataValue.value == "ALL") {
            this.specVar.setValue("conditions", null);
        } else {
            this.specVar.setValue("conditions", "state=" + inDataValue.value);
        }
        this.specVar.setValue("startIndex", 0);
        this.components.currentPagination.setValue("dataValue", 1);
        this.components.workflowExecutionsService.update();
        console.log("[WorkflowRuns]: State lookup change update... ");
    },

    executionStatusLabelReadOnlyNodeFormat: function(inSender, inValue) {
        if (inValue == 'FAILED') {
            return "<font color='red'>" + inValue + "</font>";
        } else if (inValue == 'COMPLETED') {
            return "<font color='green'>" + inValue + "</font>";
        } else if (inValue == 'WAITING') {
            return "<font color='yellow'>" + inValue + "</font>";
        } else {
            return inValue;
        }
    },

    wf_executions_gridStateFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        var img = "";
        var state = inValue;
        if (state == 'COMPLETED') {
            img = "resources/images/o11n/state_success.png";
        } else if (state == 'FAILED') {
            img = "resources/images/o11n/state_error.png";
        } else if (state == 'WAITING') {
            img = "resources/images/o11n/state_user_input.png";
        } else if (state == 'CANCELED') {
            img = "resources/images/o11n/state_cancel.png";
        } else if (state == 'RUNNING') {
            img = "resources/images/o11n/state_running.png";
        } else if (state == 'SUSPENDED') {
            img = "resources/images/o11n/state_suspended.png";
        } else {
            img = "resources/images/o11n/events.png";
        }

        return '<img src="' + img + '" style="vertical-align:bottom;">&nbsp;' + state.charAt(0) + state.slice(1).toLowerCase();
    },

    setActionButtonsState: function(inSender) {
        var workflowExecutionModel = inSender.selectedItem.getData();
        var isWaiting = workflowExecutionModel.state === "WAITING";
        var isNotFinished = isWaiting || workflowExecutionModel.state === "RUNNING";
        this.disableCancelButton(!isNotFinished);
        this.disableRestartButton(isNotFinished);
        this.disableAnswerButton(!isWaiting);
    },

    disableAnswerButton: function(disabled) {
        if (disabled) {
            this.components.answerButton.setValue("disabled", true);
            this.components.answerButton.setSource("resources/images/o11n/Answer_16.png");
        } else {
            this.components.answerButton.setSource("resources/images/o11n/Answer_active_16.png");
            this.components.answerButton.setValue("disabled", false);
        }
    },

    disableRestartButton: function(disabled) {
        if (disabled) {
            this.restartButton.setSource("resources/images/o11n/restart_disabled_16x16.png");
            this.restartButton.setValue("disabled", true);
        } else {
            this.restartButton.setSource("resources/images/o11n/restart_16x16.png");
            this.restartButton.setValue("disabled", false);
        }
    },

    disableCancelButton: function(disabled) {
        if (disabled) {
            this.cancelButton.setSource("resources/images/o11n/no_16x16-disabled.png");
            this.cancelButton.setValue("disabled", true);
        } else {
            this.cancelButton.setSource("resources/images/o11n/cancel_16x16.png");
            this.cancelButton.setValue("disabled", false);
        }
    },

    answerButtonClick: function(inSender) {
        if (!this.presentation) {
            this.presentation = this.components.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: this.currentWorkflowId.data.dataValue,
                executionId: this.executionIdVar.data.dataValue
            });
            this.components.presentationRootPanel.reflow();
            this.connect(this.presentation, "onSubmit", this, "handleOnSubmitPresentation");
        } else {
            this.presentation.workflowId = this.currentWorkflowId.data.dataValue;
            this.presentation.executionId = this.executionIdVar.data.dataValue;
            this.presentation.start();
        }
    },

    handleOnSubmitPresentation: function() {
        this.components.workflowExecutionsService.update();
        this.wf_executions_grid.updateSelectedItem(-1);
    },

    cancelExecutionServiceSuccess1: function(inSender, inDeprecated) {
        dojo.publish("ExecutionStateChangeEvent", [{
            status: "CANCELED",
            executionId: this.executionIdVar.data.dataValue,
            workflowId: this.currentWorkflowId.data.dataValue,
            workflowName: this.components.currentWorkflowName.data.dataValue
        }]);
        this.wf_executions_grid.updateSelectedItem(-1);
    },

    rerunWorkflowServiceSuccess1: function(inSender, inDeprecated) {
        this.wf_executions_grid.updateSelectedItem(-1);

        var workflowExecutionModel = inSender.getData();
        dojo.publish("ExecutionStateChangeEvent", [{
            status: "RUNNING",
            executionId: workflowExecutionModel.id,
            workflowId: this.currentWorkflowId.data.dataValue,
            workflowName: this.components.currentWorkflowName.data.dataValue
        }]);
    },

    cancelExecutionServiceError: function(inSender, inError) {
        this.onError(inError);
    },

    rerunWorkflowServiceError: function(inSender, inError) {
        this.onError(inError);
    },

    onError: function(inError) {
        var errorMsg = "[WorkflowRuns][Error]: " + inError;
        app.toastError(errorMsg);
        console.error(errorMsg);
    },

    _end: 0
});
 
o11n.WorkflowRuns.components = {
	workflowIdVar: ["wm.Variable", {"dataSet":"","type":"java.lang.String"}, {}],
	executionsPerWorkflowVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	executionStateFilterVar: ["wm.Variable", {"dataSet":"","type":"java.lang.String"}, {}],
	workflowExecutionsService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowExecutions","service":"WorkflowService"}, {"onError":"workflowExecutionsServiceError","onSuccess":"workflowExecutionsServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"executions_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
			}]
		}]
	}],
	executionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getWorkflowExecution","service":"WorkflowService"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"executionParameters_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	runEventsServices: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getRunEvents","service":"WorkflowService"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panel3","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getRunEventsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"wf_executions_grid.selectedItem.id","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	currentPagination: ["wm.Variable", {"type":"NumberData"}, {}],
	maxPaginationVar: ["wm.Variable", {"type":"NumberData"}, {}],
	currentWorkflowId: ["wm.Variable", {"dataSet":""}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowIdService.dataValue","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	currentWorkflowIdService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowIdForExecutionId","service":"WorkflowService"}, {"onSuccess":"currentWorkflowIdServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"execution_details_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowIdForExecutionIdInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	stateFilterVar: ["wm.Variable", {"isList":true,"type":"com.vmware.o11n.wm.common.FilterType"}, {}],
	rerunWorkflowService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"rerunWorklfowExecution","service":"WorkflowService"}, {"onError":"rerunWorkflowServiceError","onError1":"errorDialog.show","onSuccess":"workflowExecutionsService","onSuccess1":"rerunWorkflowServiceSuccess1"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"wf_executions_grid","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"rerunWorklfowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	cancelExecutionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"cancelWorkflowExecution","service":"WorkflowService"}, {"onError":"cancelExecutionServiceError","onError1":"errorDialog.show","onSuccess":"workflowExecutionsService","onSuccess1":"cancelExecutionServiceSuccess1"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"scrollingPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"cancelWorkflowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	currentWorkflowName: ["wm.Variable", {"type":"StringData"}, {}],
	cancelWorkflowDialog: ["wm.GenericDialog", {"button1Caption":"Ok","button1Close":true,"button2Caption":"Cancel","button2Close":true,"desktopHeight":"93px","height":"103px","positionNear":"cancelButton","styles":{"fontWeight":"","color":"","textAlign":""},"title":"  ","userPrompt":"Cancel this workflow run?","width":"260px"}, {"onButton1Click":"cancelExecutionService","onButton2Click":"cancelWorkflowDialog.hide"}],
	startWorkflowRun: ["wm.GenericDialog", {"button1Caption":"Ok","button1Close":true,"button2Caption":"Cancel","button2Close":true,"desktopHeight":"93px","height":"103px","positionNear":"restartButton","title":"Start Workflow","userPrompt":"Start the selected workflow run again?","width":"263px"}, {"onButton1Click":"rerunWorkflowService","onButton2Click":"startWorkflowRun.hide"}],
	scrollingPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","minDesktopHeight":350,"minHeight":350,"minWidth":600,"styles":{"backgroundGradient":"","backgroundColor":"#ffffff"},"verticalAlign":"top","width":"100%"}, {}, {
		executions_panel: ["wm.Panel", {"borderColor":"#999999","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel5: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
				label1: ["wm.Label", {"borderColor":"","caption":"Workflow Runs","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"116px"}, {}],
				panel6: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						restartButton: ["wm.Picture", {"aspect":"h","disabled":true,"height":"16px","hint":"restart workflow run","margin":"1,1,1,1","source":"resources/images/o11n/restart_disabled_16x16.png","width":"16px"}, {"onclick":"startWorkflowRun.show"}],
						cancelButton: ["wm.Picture", {"aspect":"h","disabled":true,"height":"18px","hint":"cancel workflow run","source":"resources/images/o11n/no_16x16-disabled.png","width":"18px"}, {"onclick":"cancelWorkflowDialog.show"}],
						answerButton: ["wm.Picture", {"disabled":true,"height":"16px","hint":"answer user interaction","source":"resources/images/o11n/Answer_16.png","width":"16px"}, {"onclick":"answerButtonClick"}],
						presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
					}],
					stateLookup: ["wm.Lookup", {"caption":"Status:","captionSize":"50px","dataType":"com.vmware.o11n.wm.common.FilterType","dataValue":undefined,"displayField":"displayValue","displayValue":"","height":"100%","padding":"4","width":"220px"}, {"onchange":"stateLookupChange"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"stateFilterVar","targetProperty":"dataSet"}, {}]
						}]
					}],
					picture3: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"workflowExecutionsService"}],
					separator6: ["wm.Label", {"caption":"","height":"100%","padding":"4","width":"10px"}, {}]
				}]
			}],
			wf_executions_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Status: \" + ${state} + \"</div>\"\n+ \"<div class='MobileRow'>Start Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm a\"}, null,null,null,${startDate}) + \"</div>\"\n+ \"<div class='MobileRow'>End Date: \" + wm.List.prototype.dateFormatter({\"useLocalTime\":false,\"datePattern\":\"MM/dd/yyyy h:mm a\"}, null,null,null,${endDate}) + \"</div>\"\n+ \"<div class='MobileRow'>Started By: \" + ${startedBy} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"id","title":"Id","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"name","title":"Workflow Name","width":"250px","align":"left","formatFunc":"","editorProps":null,"mobileColumn":false},{"show":true,"field":"state","title":"Status","width":"85px","align":"left","formatFunc":"wf_executions_gridStateFormat","formatProps":null,"editorProps":{"restrictValues":true},"expression":"","mobileColumn":false},{"show":true,"field":"startDate","title":"Start Date","width":"125px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"endDate","title":"End Date","width":"125px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"useLocalTime":false,"datePattern":"MM/dd/yyyy h:mm a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"startedBy","title":"Started By","width":"50%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"contentException","title":"ContentException","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"businessState","title":"BusinessState","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"type","title":"Type","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":600,"padding":"0,0,2,0","primaryKeyFields":["id"],"selectFirstRow":true,"showing":false,"styles":{"color":"#000000"}}, {"onHeaderClick":"wf_executions_gridHeaderClick","onRenderData":"wf_executions_gridRenderData","onSelect":"wf_executions_gridSelect","onSort":"wf_executions_gridSort"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"workflowExecutionsService.list","targetProperty":"dataSet"}, {}]
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
		}],
		execution_details_panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel11: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				info_panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					label5: ["wm.Label", {"align":"center","caption":"Status:","height":"100%","padding":"4,0,4,0","styles":{"fontWeight":"bolder"},"width":"48px"}, {}],
					executionStatusLabel: ["wm.Label", {"align":"left","autoSizeWidth":true,"display":"executionStatusLabelReadOnlyNodeFormat","height":"100%","minWidth":70,"padding":"4,10,4,2","width":"14px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.state","targetProperty":"caption"}, {}]
						}]
					}],
					label12: ["wm.Label", {"caption":"Started:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"54px"}, {}],
					executionStartedLabel: ["wm.Label", {"align":"left","display":"Date","height":"100%","padding":"4","width":"142px"}, {}, {
						format: ["wm.DateFormatter", {"datePattern":"MM/dd/yyyy h:mm:ss a","formatLength":undefined}, {}],
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"caption"}, {}],
							wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"showing"}, {}]
						}]
					}],
					label14: ["wm.Label", {"align":"right","caption":"Ended:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"70px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"showing"}, {}]
						}]
					}],
					executionEndedLabel: ["wm.Label", {"align":"left","display":"Date","height":"100%","padding":"4","width":"142px"}, {}, {
						format: ["wm.DateFormatter", {"datePattern":"MM/dd/yyyy h:mm:ss a","formatLength":undefined}, {}],
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"caption"}, {}],
							wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"showing"}, {}]
						}]
					}],
					businessStatusLabel: ["wm.Label", {"align":"right","caption":"Business Status:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"125px"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"showing"}, {}]
						}]
					}],
					executionBusinessStatus: ["wm.Label", {"align":"left","height":"100%","padding":"4","width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"caption"}, {}]
						}]
					}]
				}]
			}],
			panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"4,0,4,0","verticalAlign":"top","width":"100%"}, {}, {
				panel3: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"60%"}, {}, {
					panel7: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
						execution_state_label: ["wm.Label", {"caption":"Run Events:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}],
						panel8: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							picture1: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"runEventsServices"}],
							label2: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"0","width":"10px"}, {}]
						}]
					}],
					execution_state_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Event: \" + ${displayName} + \"</div>\"\n+ \"<div class='MobileRow'>Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm:ss a\"}, null,null,null,${date}) + \"</div>\"\n+ \"<div class='MobileRow'>User: \" + ${user} + \"</div>\"\n+ \"<div class='MobileRow'>Log: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"displayName","title":"Event","width":"50%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"severity","title":"Type","width":"36px","align":"center","formatFunc":"wm_image_formatter","formatProps":{"width":20,"height":20},"editorProps":{"restrictValues":true},"expression":"if (${severity} == 'INFO'){\n   \"resources/images/o11n/info_24x.png\";\n}else if (${severity} == 'ERROR'){\n   \"resources/images/o11n/error_24x.png\";\n}else if (${severity} == 'DEBUG'){\n   \"resources/images/o11n/bug_24x.png\";\n}else {\n   \"resources/images/o11n/warning_24x.png\";\n}","mobileColumn":false},{"show":true,"field":"date","title":"Date","width":"135px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm:ss a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"user","title":"User","width":"90px","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Log","width":"100%","align":"left","editorProps":{"restrictValues":true},"mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":500}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"runEventsServices","targetProperty":"dataSet"}, {}]
						}]
					}]
				}],
				executionParameters_panel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"40%"}, {}, {
					panel9: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
						execution_state_label1: ["wm.Label", {"caption":"Parameters:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}],
						panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							picture4: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"executionService"}],
							label8: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"0","width":"10px"}, {}]
						}]
					}],
					execution_inparam_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","columns":[{"show":true,"field":"paramType","width":"26px","align":"left","formatFunc":"wm_image_formatter","formatProps":null,"editorProps":null,"expression":"${paramType}=='Input'? \"resources/images/o11n/in_24x12.png\":\"resources/images/o11n/out_24x12.png\";","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"80%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"type","title":"Type","width":"60%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"displayValue","title":"Value","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Type: \" + ${type} + \"</div>\"\n+ \"<div class='MobileRow'>Value: \" + ${displayValue} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"value","title":"Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"dsType":"com.vmware.o11n.wm.common.BaseParameter","height":"100%","margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":300,"singleClickEdit":true}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.parameters","targetProperty":"dataSet"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]}
 
wm.publish(o11n.WorkflowRuns, [
	["workflowId", "workflowIdVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["executionsPerWorkflow", "executionsPerWorkflowVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["executionStateFilter", "executionStateFilterVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "WorkflowRuns", "o11n.WorkflowRuns", "common.packages.o11n.WorkflowRuns", "images/wm/widget.png", "vCO Workflow Runs Information and Logs", {width: "100%", height: "100%"},false]);