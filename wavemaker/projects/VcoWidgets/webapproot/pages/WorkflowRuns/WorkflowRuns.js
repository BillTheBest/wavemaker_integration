dojo.declare("WorkflowRuns", wm.Page, {
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
            this.load(this.workflowIdVar.data.dataValue);
        } else {
            console.log("[WorkflowRuns]: data load deferred...");
        }
        this.subscribe("ExecutionStateChangeEvent", this, "handleExecutionStateChangeEvent");
    },

    load: function(workflowId) {
        if (this.executionsPerWorkflowVar.data.dataValue) {
            if (workflowId) {
                this.workflowIdVar.setValue("dataValue", workflowId);
                this.wf_executions_grid.hide();
            } else {
                console.error("[WorkflowRuns][Error]: missing workflowId when execution per workflow property set.");
                return;
            }
        }

        this.disableButtons();
        this.currentPagination.setValue("dataValue", 1);
        this.addIfNoWorkflowIdWorkflowNameColumn();
        this.specVar.setData({
            startIndex: 0,
            maxResult: 10,
            sortOrders: "-startDate"
        });
        if (this.executionsPerWorkflowVar.data.dataValue) {
            this.specVar.setValue("maxResult", 0);
        }
        this.stateFilterVar.setData(this.stateFilter);
        if (!this.setStateFilterValue()) {
            this.workflowExecutionsService.update();
        }
        console.log("[WorkflowRuns]: initial data load starting...");
    },
    
    handleExecutionStateChangeEvent: function(inEvent){
    	this.workflowExecutionsService.update();
    	console.log("[WorkflowRuns]: Reloading data on ExecutionStateChangeEvent...");
    },

    setStateFilterValue: function() {
        var state = this.executionStateFilterVar.data.dataValue;
        if (state) {
            this.specVar.setValue("conditions", "state=" + state.toLowerCase());
            this.stateLookup.setDisplayValue(state.toUpperCase());
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
        if (this.executionsPerWorkflowVar.data.dataValue) {
            this.currentWorkflowId.setValue("dataValue", this.workflowIdVar.data.dataValue);
        } else {
            this.wf_executions_grid.columns[2].show = true; //add workflowName column
        }
    },

    wf_executions_gridSelect: function(inSender) {
        console.log("[WorkflowRuns]: Current Selection: " + inSender.selectedItem.getData().id);
        this.setActionButtonsState(inSender);
        this.setCurrentExecutionDetals(inSender);

        if (this.executionsPerWorkflowVar.data.dataValue) {
            this.executionService.update();
            this.runEventsServices.update();
        } else {
            this.currentWorkflowIdService.update();
        }
    },

    setCurrentExecutionDetals: function(inSender) {
        var workflowExecutionModel = inSender.selectedItem.getData();
        this.executionStatusLabel.setCaption(workflowExecutionModel.state);
        this.executionStartedLabel.setCaption(workflowExecutionModel.startDate);
        this.executionEndedLabel.setCaption(workflowExecutionModel.endDate);
        this.executionBusinessStatus.setCaption(workflowExecutionModel.businessState);
        if (workflowExecutionModel.businessState) {
            this.businessStatusLabel.show();
        } else {
            this.businessStatusLabel.hide();
        }
        this.currentWorkflowName.setValue("dataValue", workflowExecutionModel.name);
    },

    currentWorkflowIdServiceSuccess: function(inSender, inDeprecated) {
        this.executionService.update();
        this.runEventsServices.update();
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
        if (this.maxPaginationVar.data.dataValue > 1) {
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
        this.workflowExecutionsService.update();
        console.log("[WorkflowRuns]: Paginate Update...");
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

    wf_executions_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if (this.maxPaginationVar.data.dataValue <= 1) {
            return;
        }
        this.set_selected_field_sorted_order(fieldId);
        var sortOrdersReverse = this.sortOrders.concat([]).reverse();
        this.specVar.setValue("sortOrders", sortOrdersReverse.toString());
        this.workflowExecutionsService.update();
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
        this.currentPagination.setValue("dataValue", 1);
        this.workflowExecutionsService.update();
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
            this.answerButton.setValue("disabled", true);
            this.answerButton.setSource("resources/images/o11n/Answer_16.png");
        } else {
            this.answerButton.setSource("resources/images/o11n/Answer_active_16.png");
            this.answerButton.setValue("disabled", false);
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
            this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: this.currentWorkflowId.data.dataValue,
                executionId: this.executionIdVar.data.dataValue
            });
            this.presentationRootPanel.reflow();
            this.connect(this.presentation, "onSubmit", this, "handleOnSubmitPresentation");
        } else {
            this.presentation.workflowId = this.currentWorkflowId.data.dataValue;
            this.presentation.executionId = this.executionIdVar.data.dataValue;
            this.presentation.start();
        }
    },

    handleOnSubmitPresentation: function() {
        this.workflowExecutionsService.update();
        this.wf_executions_grid.updateSelectedItem(-1);
    },

    cancelExecutionServiceSuccess1: function(inSender, inDeprecated) {
        dojo.publish("ExecutionStateChangeEvent", [{
            status: "CANCELED",
            executionId: this.executionIdVar.data.dataValue,
            workflowId: this.currentWorkflowId.data.dataValue,
            workflowName: this.currentWorkflowName.data.dataValue
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
            workflowName: this.currentWorkflowName.data.dataValue
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