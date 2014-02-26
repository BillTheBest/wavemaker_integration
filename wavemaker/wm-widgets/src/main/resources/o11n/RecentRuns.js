dojo.provide("common.packages.o11n.RecentRuns");
 
dojo.declare("o11n.RecentRuns", wm.Composite, {
  horizontalAlign: "right",
  verticalAlign: "top",
  layoutKind: "left-to-right",
    "preferredDevice": "desktop",
    deferDataLoad: false,
    widgets: {
        presentation: null,
        executionDetailsDialog: null
    },
    config: {
        runningTokens: {}
    },

    start: function() {
        this.config.timerInitialDelay = 3000;
        this.config.timerMaxCount = 40;
        this.config.currentRunningCount = 0;
        var d = new Date();
        this.config.today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.components.specVar.setData({
            startIndex: 0,
            maxResult: 10,
            conditions: "state!=waiting",
            sortOrders: "-startDate"
        });
        this.specInterVar.setData({
            startIndex: 0,
            maxResult: 10,
            sortOrders: "-createDate"
        });

        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[RecentRuns]: data load deferred...");
        }

        this.subscribe("ExecutionStateChangeEvent", this, "handleExecutionStateChangeEvent");
    },

    load: function() {
        console.log("[RecentRuns]: data loading started...");
        if (this.components.barModeVar.data.dataValue) {
            this.toggleOffPanelImgClick();
        } else {
            this.toggleOnPanelImgClick();
        }
    },

    handleExecutionStateChangeEvent: function(inEvent) {
        if (this.isBarPanel) {
            if (inEvent.status === "RUNNING") {
                var count = Number(this.runningCount.caption);
                count = count + 1;
                this.runningCount.setCaption(count);
                this.config.currentRunningCount = count;
                this.startTimer(this.components.runningTotalTimer);
            } else {
                this.reloadBarTotalsData();
            }
        } else {
            if (inEvent.status === "RUNNING") {
                if (this.components.recentRunsTabLayers.getActiveLayer().name !== "failedTab") {
                    this.listAll.dataSet.addItem({
                        id: inEvent.executionId,
                        state: inEvent.status,
                        name: inEvent.workflowName,
                        endDate: null,
                        startDate: new Date()
                    }, 0);
                    this.config.runningTokens[inEvent.executionId] = {
                        workflowId: inEvent.workflowId
                    };
                    this.startTimer(this.components.executionStatusTimer);
                }
            } else {
                this.reloadPanelExecutionData();
            }
        }
    },

    recentRunsTabLayersChange: function(inSender, inIndex) {
        if (this.widgets.executionDetailsDialog) {
            this.widgets.executionDetailsDialog.hide();
        }
        switch (inIndex) {
        case 0:
            //all 
            this.components.specVar.setValue("conditions", "state!=waiting");
            this.listAll.setParent(this.components.allTab);
            break;
        case 1:
            //running
            this.components.specVar.setValue("conditions", "state=running");
            this.listAll.setParent(this.components.runningTab);
            break;
        case 2:
            //failed
            this.components.specVar.setValue("conditions", "state=failed");
            this.listAll.setParent(this.components.failedTab);
            break;
        }
        this.components.executionListService.update();
    },

    listAllSelect: function(inSender, inItem) {
        var workflowExecutionModel = inSender.selectedItem.getData();
        this.executionIdVar.setValue("dataValue", workflowExecutionModel.id);
        this.setCurrentExecutionDetals(workflowExecutionModel);
        this.components.currentWorkflowIdService.update();
        this.setActionButtonsState(workflowExecutionModel);
    },

    setCurrentExecutionDetals: function(workflowExecutionModel) {
        if (!this.widgets.executionDetailsDialog) {
            this.widgets.executionDetailsDialog = this.createComponent("dialog22", "wm.Dialog", {
                owner: this,
                corner: "cc",
                desktopHeight: "450px",
                height: "450px",
                width: "850px",
                modal: false,
                useContainerWidget: false,
                noLeftRightDocking: false,
                noTopBottomDocking: false,
                showTitleButtonsWhenDocked: true
            });

            this.executionDetails.setParent(this.widgets.executionDetailsDialog);
            this.executionDetails.show();
            this.widgets.executionDetailsDialog.reflow();
            this.widgets.executionDetailsDialog.apply = function() {};
        }
        this.widgets.executionDetailsDialog.show();

        this.widgets.executionDetailsDialog.setTitle(this.components.i18WorkflowTitleLblMsg.caption + ": " + workflowExecutionModel.name);
        this.components.executionStatusLabel.setCaption(workflowExecutionModel.state);
        this.components.executionStartedLabel.setCaption(workflowExecutionModel.startDate);
        this.components.executionEndedLabel.setCaption(workflowExecutionModel.endDate);
        this.components.executionBusinessStatus.setCaption(workflowExecutionModel.businessState);
        if (workflowExecutionModel.businessState) {
            this.components.businessStatusSeparator.show();
            this.components.businessStatusLabel.show();
        } else {
            this.components.businessStatusLabel.hide();
            this.components.businessStatusSeparator.hide();
        }
    },

    closeButtonClick: function(inSender) {
        this.widgets.executionDetailsDialog.hide();
    },

    currentWorkflowIdServiceSuccess: function(inSender, inDeprecated) {
        this.components.executionService.update();
        this.components.runEventsServices.update();
    },

    setActionButtonsState: function(workflowExecutionModel) {
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
            this.components.restartButton.setSource("resources/images/o11n/restart_disabled_16x16.png");
            this.components.restartButton.setValue("disabled", true);
        } else {
            this.components.restartButton.setSource("resources/images/o11n/restart_16x16.png");
            this.components.restartButton.setValue("disabled", false);
        }
    },

    disableCancelButton: function(disabled) {
        if (disabled) {
            this.components.cancelButton.setSource("resources/images/o11n/no_16x16-disabled.png");
            this.components.cancelButton.setValue("disabled", true);
        } else {
            this.components.cancelButton.setSource("resources/images/o11n/cancel_16x16.png");
            this.components.cancelButton.setValue("disabled", false);
        }
    },

    rerunWorkflowServiceSuccess: function(inSender, inDeprecated) {
        this.widgets.executionDetailsDialog.hide();
        this.components.executionListService.update();
        this.stopTimer(this.components.executionStatusTimer);
    },

    restartButtonClick: function(inSender) {
        var parent = this;
        app.confirm(this.components.i18nRerunWorkflwMsg.caption, false, function() {
            parent.rerunExecution();
        }, function() {});
    },

    rerunExecution: function() {
        this.widgets.executionDetailsDialog.hide();
        this.components.rerunWorkflowService.update();
    },

    cancelButtonClick: function(inSender) {
        var parent = this;
        app.confirm(this.components.i18CancelWorkflowMsg.caption, false, function() {
            parent.cancelExecution();
        }, function() {});
    },

    cancelExecution: function(inSender) {
        this.widgets.executionDetailsDialog.hide();
        this.components.cancelExecutionService.update();
    },

    cancelExecutionServiceSuccess: function(inSender, inDeprecated) {
        this.components.executionListService.update();
        this.stopTimer(this.components.executionStatusTimer);
    },

    /************* Grid Formaters: START ****************************************/
    listAllNameFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        try {
            var limit = 16;
            if (!inValue || inValue.length < limit) {
                return inValue;
            }
            var name = inValue.slice(0, limit - 3) + "...";
            return '<div title="' + inValue + '">' + name + '</div>';
        } catch (e) {
            console.error("[RecentRuns][NameFormatter][Error]: " + e);
        }
    },

    listAllStateFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        var img = "";
        var state = inValue;
        if (state === 'COMPLETED') {
            img = "resources/images/o11n/state_success.png";
        } else if (state === 'FAILED') {
            img = "resources/images/o11n/state_error.png";
        } else if (state === 'WAITING') {
            img = "resources/images/o11n/state_user_input.png";
        } else if (state === 'CANCELED') {
            img = "resources/images/o11n/state_cancel.png";
        } else if (state === 'RUNNING') {
            img = "resources/images/o11n/state_running.png";
        } else if (state === 'SUSPENDED') {
            img = "resources/images/o11n/state_suspended.png";
        } else {
            img = "resources/images/o11n/events.png";
        }
        return '<img src="' + img + '" style="vertical-align:bottom;" title="' + state + '">';
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

    dateOrTimeFormat: function(date) {
        try {
            if (!date) {
                return date;
            }
            date = new Date(date);
            date.setHours(date.getHours() + wm.timezoneOffset);
            var selector = 'date';
            if (date > this.config.today) {
                selector = 'time';
            }
            var constraints = {
                formatLength: 'short',
                selector: selector,
                timePattern: "hh:mm a",
                locale: dojo.locale
            };
            return dojo.date.locale.format(date, constraints);
        } catch (e) {
            console.error("[RecentRuns][DateFormatter][Error]: " + e);
        }
    },

    listAllStartDateFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        return this.dateOrTimeFormat(inValue);
    },

    listAllEndDateFormat: function(inValue, rowId, cellId, cellField, cellObj, rowObj) {
        var startDate = this.dateOrTimeFormat(rowObj.startDate);
        if (!inValue) {
            if (rowObj.state === "RUNNING") {
                this.setStatusPollingScheduler(rowId, cellField, rowObj);
                return '<img src="resources/images/o11n/workingBar.gif" title="running - started: ' + startDate + '">';
            } else if (rowObj.state === "WAITING") {
                return '<img src="resources/images/o11n/Answer_16.png" style="margin-left:17px;" title="pending user interaction - started: ' + startDate + '">';
            }
        }

        return this.dateOrTimeFormat(inValue);
    },

    /************* Grid Formaters: END ****************************************/

    /************* update Running execution status: START ****************************************/
    setStatusPollingScheduler: function(rowId, cellField, rowObj) {
        this.config.runningTokens[rowObj.id] = {};
        this.startTimer(this.components.executionStatusTimer);
    },

    pollRunningExecutionStates: function() {
        var tokens = this.config.runningTokens;
        for (var executionId in tokens) {
            if (tokens.hasOwnProperty(executionId)) {
                console.log("[RecentRuns][pollRunningExecutionStates]  executionId: " + executionId + ", workflowId: " + tokens[executionId].workflowId);
                this.components.executionStateService.input.setValue('executionId', executionId);
                this.components.executionStateService.input.setValue('workflowId', tokens[executionId].workflowId);
                this.components.executionStateService.update();
            }
        }
    },

    executionStateServiceSuccess: function(inSender, inDeprecated) {
        var tokens = this.config.runningTokens;
        var executionStateModel = inSender.getData();
        var state = executionStateModel.state;
        var token = tokens[executionStateModel.executionId];

        if (token) {
            token.workflowId = executionStateModel.workflowId;
            console.log("[RecentRuns][executionStateServiceSuccess}  state: " + state + ", executionId: " + executionStateModel.executionId + ", workflowId: " + token.workflowId);
            if (state !== "RUNNING") {
                delete tokens[executionStateModel.executionId];
                this.components.updateExecutionService.input.setValue('executionId', executionStateModel.executionId);
                this.components.updateExecutionService.input.setValue('workflowId', token.workflowId);
                this.components.updateExecutionService.update();
            }
        }

        var rowCount = this.listAll.getRowCount();
        var shouldStopTimer = true;
        for (var i = 0; i < rowCount; i++) {
            var rowData = this.listAll.getRow(i);
            if (rowData.state === "RUNNING") {
                shouldStopTimer = false;
                break;
            }
        }
        if (shouldStopTimer) {
            this.stopTimer(this.components.executionStatusTimer);
        }

    },

    updateExecutionServiceSuccess: function(inSender, inDeprecated) {
        var workflowExecutionModel = inSender.getData();
        var rowId = this.listAll.findRowIndexByFieldValue("id", workflowExecutionModel.id);
        console.log("[RecentRuns][updateExecutionServiceSuccess]  state: " + workflowExecutionModel.state + ", executionId: " + workflowExecutionModel.id + ", rowId: " + rowId);

        this.listAll.setCell(rowId, "state", workflowExecutionModel.state);
        this.listAll.setCell(rowId, "endDate", workflowExecutionModel.endDate);
    },

    /************* update Running execution status: END ****************************************/
    answer: function(userInteractionId) {
        if (!this.widgets.presentation) {
            this.widgets.presentation = this.components.rootAnswerPresentation.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                userInteractionId: userInteractionId
            });
            this.components.rootAnswerPresentation.reflow();
            this.connect(this.widgets.presentation, "onSubmit", this, "reloadPanelExecutionData");
        } else {
            this.widgets.presentation.userInteractionId = userInteractionId;
            this.widgets.presentation.start();
        }
    },

    listInteractionsSelect: function(inSender, inItem) {
        this.answer(inSender.selectedItem.getData().id);
    },

    /* bar count services */
    taskCountServiceResult: function(inSender, inDeprecated) {
        this.countResult(this.components.taskLoading, this.taskCount);
    },
    taskCountServiceError: function(inSender, inError) {
        this.countError(this.components.taskLoading, this.taskCount);
    },
    userInteractionsCountResult: function(inSender, inDeprecated) {
        this.countResult(this.components.interactionLoading, this.components.interactionCount);
    },
    userInteractionsCountError: function(inSender, inError) {
        this.countError(this.components.interactionLoading, this.components.interactionCount);
    },
    runningCountServiceResult: function(inSender, inDeprecated) {
        console.log("RecentRuns: component");
        this.countResult(this.components.runningLoading, this.runningCount);
        var runCount = inSender.data.dataValue;
        if (runCount > 0) {
            this.startTimer(this.components.runningTotalTimer);
        } else {
            this.stopTimer(this.components.runningTotalTimer);
        }

        if (runCount !== this.config.currentRunningCount) {
            this.config.currentRunningCount = runCount;
            this.onRunningCountChange(runCount);
        }
    },

    onRunningCountChange: function(newCount) {
        //fire an event method to be interecepted.
        console.log("[RecentRuns][Event]: Running count changed to: " + newCount);
        dojo.publish("RunningCountChangeEvent", [{
            count: newCount
        }]);
    },

    runningCountServiceError: function(inSender, inError) {
        this.stopTimer(this.components.runningTotalTimer);
        this.countError(this.components.runningLoading, this.runningCount);
    },
    countResult: function(loading, count) {
        loading.hide();
        count.show();
    },
    countError: function(loading, count) {
        this.countResult(loading, count);
        count.setCaption(" - ");
    },
    barLoading: function(loading, count) {
        count.hide();
        loading.show();
    },

    /************************ Fire Events:Start ********************/
    /* navigate to running executions */
    runningCountClick: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    runningLoadingClick: function(inSender) {
        this.onRunningExecutionsClick();
    },
    runningIconClick: function(inSender) {
        this.onRunningExecutionsClick();
    },

    naviateToExecutionsLabelClick: function(inSender, inEvent) {
        var status = null;
        var activeLayer = this.components.recentRunsTabLayers.getActiveLayer();
        if (activeLayer.name === "runningTab") {
            this.onRunningExecutionsClick();
        } else if (activeLayer.name === "failedTab") {
            this.onFailedExecutionsClick();
        } else {
            this.onAllExecutionsClick();
        }
    },

    onRunningExecutionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[RecentRuns][Event]: Running Executions Panel click...");
    },
    onFailedExecutionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[RecentRuns][Event]: Failed Executions Panel click...");
    },
    onAllExecutionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[RecentRuns][Event]: All Executions Panel click...");
    },

    /* navigate to user interactions */
    interactionIconClick: function(inSender) {
        this.onUserInteractionsClick();
    },
    interactionCountClick: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    interactionLoadingClick: function(inSender) {
        this.onUserInteractionsClick();
    },
    naviateToUserInterLabelClick: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    onUserInteractionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[RecentRuns][Event]: User Interactions Panel click...");
    },

    /************************ Fire Events:End ********************/

    /* error handling */
    error: function(inError) {
        if (this.widgets.executionDetailsDialog) {
            this.widgets.executionDetailsDialog.hide();
        }
        app.toastError("[RecentRuns][ExecutionService][Error]: " + inError);
        this.stopTimer(this.components.runningTotalTimer);
        this.stopTimer(this.components.executionStatusTimer);
    },
    executionListServiceError: function(inSender, inError) {
        this.error(inError);
    },
    executionDetailsServiceError: function(inSender, inError) {
        this.error(inError);
    },
    currentWorkflowIdServiceError: function(inSender, inError) {
        this.error(inError);
    },
    runEventsServicesError: function(inSender, inError) {
        this.error(inError);
    },
    rerunWorkflowServiceError: function(inSender, inError) {
        this.error(inError);
    },
    cancelExecutionServiceError: function(inSender, inError) {
        this.error(inError);
    },
    userInteractionsServiceError: function(inSender, inError) {
        this.error(inError);
    },
    executionStateServiceError: function(inSender, inError) {
        this.error(inError);
        this.reloadPanelExecutionData();
    },
    updateExecutionServiceError: function(inSender, inError) {
        this.error(inError);
    },

    userInteractionsServiceResult: function(inSender, inDeprecated) {
        this.components.userInterLoading.hide();
        this.components.userIntrCountLbl.show();
    },

    /**************** toggle off/on and refresh panel/bar *******************/
    refreshTotalsImgClick: function(inSender) {
        this.reloadBarTotalsData();
    },

    reloadBarTotalsData: function() {
        this.stopTimer(this.components.runningTotalTimer);
        this.stopTimer(this.components.executionStatusTimer);
        this.barLoading(this.components.taskLoading, this.taskCount);
        this.barLoading(this.components.interactionLoading, this.components.interactionCount);
        this.barLoading(this.components.runningLoading, this.runningCount);
        this.components.runningCountService.update();
        this.components.taskCountService.update();
        this.components.userInteractionsCount.update();
    },

    refreshImgClick: function(inSender) {
        this.reloadPanelExecutionData();
    },

    reloadPanelExecutionData: function() {
        this.stopTimer(this.components.runningTotalTimer);
        this.stopTimer(this.components.executionStatusTimer);
        this.config.runningTokens = [];
        this.components.executionListService.update();
        this.components.userInteractionsService.update();
        this.components.userInterLoading.show();
        this.components.userIntrCountLbl.hide();
    },

    toggleOnPanelImgClick: function(inSender) {
        this.components.barPanel.hide();
        this.components.tabsPanel.show();
        var width = this.components.tabsPanel.width;
        this.onRecentRunsPanelSwitch(width);
        this.reloadPanelExecutionData();
        this.isBarPanel = false;

    },

    toggleOffPanelImgClick: function(inSender) {
        this.isBarPanel = true;
        this.components.tabsPanel.hide();
        this.components.barPanel.show();
        var width = this.components.barPanel.width;
        this.onRecentRunsPanelSwitch(width);
        this.reloadBarTotalsData();
    },

    onRecentRunsPanelSwitch: function(width) {
        console.log("[RecentRuns][Event]: Recent Runs Panel Switch with current width:  " + width);
    },

    /************************** Timers:Start *************************************/
    executionStatusTimerTimerFire: function(inSender) {
        var stillRunning = this.checkTimerStatus(this.components.executionStatusTimer);
        if (stillRunning) {
            this.pollRunningExecutionStates();
        }
    },

    runningTotalTimerTimerFire: function(inSender) {
        var stillRunning = this.checkTimerStatus(this.components.runningTotalTimer);
        if (stillRunning) {
            this.components.runningCountService.update();
        }
    },

    setTimerDelay: function(t, newDelay) {
        var t_count = t.count;
        console.log("[RecentRuns]: current count: " + t_count + ", current delay: " + t.delay);
        t.setDelay(newDelay);
        t.count = t_count;
        console.log("[RecentRuns]: new delay: " + t.delay);
    },

    startTimer: function(t) {
        var isRunning = t._timeoutId || t._intervalId;
        if (!isRunning) {
            console.log("[RecentRuns]: timer not running. Starting it...");
            if (t.delay !== this.config.timerInitialDelay) {
                console.log("[RecentRuns]: reseting current delay: " + t.delay + " to: " + this.config.timerInitialDelay);
                t.setDelay(this.config.timerInitialDelay);
            }
            t.startTimer();
        }
    },

    stopTimer: function(t) {
        var isRunning = t._timeoutId || t._intervalId;
        if (isRunning) {
            console.log("[RecentRuns]: Stoping timer...");
            t.stopTimer();
        }
    },

    checkTimerStatus: function(t) {
        if (t.count % 3 === 0 && t.delay < 180000) { //180000 is 3 minuntes. Check every 3 min after that until max count reached.
            this.setTimerDelay(t, t.delay * 2);
        } else if (t.count > this.config.timerMaxCount) {
            console.log("[RecentRuns]: timer reached max number of times. Stopping...");
            t.stopTimer();
            return false;
        } else {
            console.log("[RecentRuns]: timer running, delay: " + t.delay + ", count: " + t.count);
        }

        return true;
    },
    /************************** Timers:End *************************************/

    _end: 0
});
 
o11n.RecentRuns.components = {
	specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	currentWorkflowIdService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowIdForExecutionId","service":"WorkflowService"}, {"onError":"currentWorkflowIdServiceError","onSuccess":"currentWorkflowIdServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"execution_details_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowIdForExecutionIdInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	executionListService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getWorkflowExecutions","service":"WorkflowService"}, {"onError":"executionListServiceError"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"listAll","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
			}]
		}]
	}],
	barModeVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	currentWorkflowId: ["wm.Variable", {"type":"StringData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowIdService.dataValue","targetProperty":"dataSet"}, {}],
			wire1: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowIdService.dataValue","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	runEventsServices: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getRunEvents","service":"WorkflowService"}, {"onError":"runEventsServicesError"}, {
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
	executionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getWorkflowExecution","service":"WorkflowService"}, {"onError":"executionDetailsServiceError"}, {
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
	rerunWorkflowService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"rerunWorklfowExecution","service":"WorkflowService"}, {"onError":"rerunWorkflowServiceError","onSuccess":"executionListService","onSuccess1":"executionDetailsDialog.hide"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"containerWidget","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"rerunWorklfowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	cancelExecutionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"cancelWorkflowExecution","service":"WorkflowService"}, {"onError":"cancelExecutionServiceError","onSuccess":"cancelExecutionServiceSuccess","onSuccess1":"executionDetailsDialog.hide"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"containerWidget","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"cancelWorkflowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	runningCountService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"getTotalRunningWorkflows","service":"vCOGeneralService"}, {"onError":"runningCountServiceError","onResult":"runningCountServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalRunningWorkflowsInputs"}, {}]
	}],
	taskCountService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getTotalScheduledTasks","service":"vCOGeneralService"}, {"onError":"taskCountServiceError","onResult":"taskCountServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalScheduledTasksInputs"}, {}]
	}],
	userInteractionsCount: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getTotalUserInteractions","service":"vCOGeneralService"}, {"onError":"userInteractionsCountError","onResult":"userInteractionsCountResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalUserInteractionsInputs"}, {}]
	}],
	interactionsListService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getWorkflowExecutions","service":"WorkflowService"}, {"onError":"interactionsListServiceError"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"listInteractions","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"specInterVar","targetProperty":"spec"}, {}]
			}]
		}]
	}],
	specInterVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	userInteractionsService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteractions","service":"WorkflowService"}, {"onError":"userInteractionsServiceError","onResult":"userInteractionsServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"getUserInteractionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"specInterVar","targetProperty":"spec"}, {}]
			}]
		}],
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"listInteractions","targetProperty":"loadingDialog"}, {}]
		}]
	}],
	executionStatusTimer: ["wm.Timer", {"delay":3000}, {"onTimerFire":"executionStatusTimerTimerFire"}],
	runningTotalTimer: ["wm.Timer", {"delay":3000}, {"onTimerFire":"runningTotalTimerTimerFire"}],
	executionStateService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"getExecutionState","service":"WorkflowService"}, {"onError":"executionStateServiceError","onSuccess":"executionStateServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getExecutionStateInputs"}, {}]
	}],
	updateExecutionService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"getWorkflowExecution","service":"WorkflowService"}, {"onError":"updateExecutionServiceError","onSuccess":"updateExecutionServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionInputs"}, {}]
	}],
	executionDetails: ["wm.Panel", {"height":"100%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
		execution_details_panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			info_panel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,4","verticalAlign":"middle","width":"38px"}, {}, {
					restartButton: ["wm.Picture", {"aspect":"h","disabled":true,"height":"16px","hint":"restart workflow run","margin":"1,1,1,1","source":"resources/images/o11n/restart_disabled_16x16.png","width":"16px"}, {"onclick":"restartButtonClick"}],
					cancelButton: ["wm.Picture", {"aspect":"h","borderColor":"","disabled":true,"height":"20px","hint":"cancel workflow run","source":"resources/images/o11n/no_16x16-disabled.png","width":"20px"}, {"onclick":"cancelButtonClick"}],
					answerButton: ["wm.Picture", {"disabled":true,"height":"16px","hint":"answer user interaction","showing":false,"source":"resources/images/o11n/Answer_16.png","width":"16px"}, {"onclick":"answerButtonClick","onclick1":"executionDetailsDialog.hide"}],
					presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
				}],
				label3: ["wm.Label", {"align":"right","caption":"|","height":"100%","padding":"4","width":"6px"}, {}],
				labelStatus: ["wm.Label", {"align":"center","caption":"Status:","height":"100%","padding":"4,0,4,0","styles":{"fontWeight":"bolder"},"width":"48px"}, {}],
				executionStatusLabel: ["wm.Label", {"align":"left","autoSizeWidth":true,"display":"executionStatusLabelReadOnlyNodeFormat","height":"100%","minWidth":70,"padding":"4,10,4,2","width":"12px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.state","targetProperty":"caption"}, {}]
					}]
				}],
				runningImg: ["wm.Picture", {"height":"14px","source":"resources/images/o11n/workingBar.gif","width":"50px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"${executionService.state} === 'RUNNING';","targetProperty":"showing"}, {}]
					}]
				}],
				label4: ["wm.Label", {"align":"right","caption":"|","height":"100%","padding":"4","width":"6px"}, {}],
				labelStart: ["wm.Label", {"caption":"Started:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"54px"}, {}],
				executionStartedLabel: ["wm.Label", {"align":"left","display":"Date","height":"100%","padding":"4","width":"142px"}, {}, {
					format: ["wm.DateFormatter", {"datePattern":"MM/dd/yyyy h:mm:ss a","formatLength":undefined}, {}],
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"caption"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"showing"}, {}]
					}]
				}],
				label6: ["wm.Label", {"align":"right","caption":"|","height":"100%","padding":"4","width":"6px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"showing"}, {}]
					}]
				}],
				labelEnd: ["wm.Label", {"align":"right","caption":"Ended:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"45px"}, {}, {
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
				businessStatusSeparator: ["wm.Label", {"align":"right","caption":"|","height":"100%","padding":"4","width":"6px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"showing"}, {}]
					}]
				}],
				businessStatusLabel: ["wm.Label", {"align":"right","caption":"Business Status:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"105px"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"showing"}, {}]
					}]
				}],
				executionBusinessStatus: ["wm.Label", {"align":"left","height":"100%","padding":"4","width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"caption"}, {}],
						wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"hint"}, {}]
					}]
				}],
				separator6: ["wm.Label", {"caption":"","height":"100%","padding":"4","width":"6px"}, {}],
				picture3: ["wm.Picture", {"aspect":"h","borderColor":"","height":"18px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"18px"}, {"onclick":"executionService","onclick1":"runEventsServices"}],
				separator7: ["wm.Label", {"caption":"","height":"100%","padding":"4","width":"10px"}, {}]
			}],
			panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"4,0,4,0","verticalAlign":"top","width":"100%"}, {}, {
				panel3: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"65%"}, {}, {
					panel7: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
						execution_state_label: ["wm.Label", {"caption":"Run Events:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}]
					}],
					execution_state_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Event: \" + ${displayName} + \"</div>\"\n+ \"<div class='MobileRow'>Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm:ss a\"}, null,null,null,${date}) + \"</div>\"\n+ \"<div class='MobileRow'>User: \" + ${user} + \"</div>\"\n+ \"<div class='MobileRow'>Log: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"displayName","title":"Event","width":"50%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"severity","title":"Type","width":"36px","align":"center","formatFunc":"wm_image_formatter","formatProps":{"width":20,"height":20},"editorProps":{"restrictValues":true},"expression":"if (${severity} == 'INFO'){\n   \"resources/images/o11n/info_24x.png\";\n}else if (${severity} == 'ERROR'){\n   \"resources/images/o11n/error_24x.png\";\n}else if (${severity} == 'DEBUG'){\n   \"resources/images/o11n/bug_24x.png\";\n}else {\n   \"resources/images/o11n/warning_24x.png\";\n}","mobileColumn":false},{"show":true,"field":"date","title":"Date","width":"135px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm:ss a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"user","title":"User","width":"90px","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Log","width":"100%","align":"left","editorProps":{"restrictValues":true},"mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":500}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"runEventsServices","targetProperty":"dataSet"}, {}]
						}]
					}]
				}],
				executionParameters_panel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"35%"}, {}, {
					panel9: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
						execution_state_label1: ["wm.Label", {"caption":"Parameters:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}]
					}],
					execution_inparam_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","columns":[{"show":true,"field":"paramType","title":" ","width":"26px","align":"left","formatFunc":"wm_image_formatter","formatProps":null,"editorProps":null,"expression":"${paramType}=='Input'? \"resources/images/o11n/in_24x12.png\":\"resources/images/o11n/out_24x12.png\";","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"80%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"type","title":"Type","width":"60%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"displayValue","title":"Value","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Type: \" + ${type} + \"</div>\"\n+ \"<div class='MobileRow'>Value: \" + ${displayValue} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"value","title":"Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":250,"singleClickEdit":true}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionService.parameters","targetProperty":"dataSet"}, {}]
						}]
					}]
				}]
			}]
		}],
		buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","desktopHeight":"32px","enableTouchHeight":true,"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","mobileHeight":"40px","verticalAlign":"top","width":"100%"}, {}, {
			closeButton: ["wm.Button", {"caption":"Ok","margin":"4","width":"60px"}, {"onclick":"closeButtonClick"}]
		}],
		i18nRerunWorkflwMsg: ["wm.Label", {"caption":"Re-run current workflow run?","height":"2px","padding":"4","showing":false,"width":"2px"}, {}],
		i18CancelWorkflowMsg: ["wm.Label", {"caption":"Cancel workflow run?","height":"2px","padding":"4","showing":false,"width":"2px"}, {}],
		i18WorkflowTitleLblMsg: ["wm.Label", {"caption":"Workflow Run Details","height":"2px","padding":"4","showing":false,"width":"2px"}, {}]
	}],
	tabsPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"230px"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":"!${barModeVar.dataValue}","targetProperty":"showing"}, {}]
		}],
		headePanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			toggleOffPanelImg: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"hide recent runs panel","margin":"2","source":"resources/images/o11n/last_page.gif","width":"16px"}, {"onclick":"toggleOffPanelImgClick"}],
			label1: ["wm.Label", {"borderColor":"","caption":"Recent Runs","padding":"2,0,0,0","styles":{"fontWeight":"bold"},"width":"100%"}, {}],
			refreshImg: ["wm.Picture", {"aspect":"h","borderColor":"","height":"18px","hint":"refresh","margin":"2,0,0,0","source":"resources/images/o11n/refresh_20x20.png","width":"18px"}, {"onclick":"refreshImgClick"}]
		}],
		recentRunsPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"65%","horizontalAlign":"left","minDesktopHeight":120,"minHeight":120,"verticalAlign":"top","width":"100%"}, {}, {
			recentRunsTabLayers: ["wm.TabLayers", {"defaultLayer":0,"margin":"-4,0,0,0","minDesktopHeight":120,"minHeight":120}, {"onchange":"recentRunsTabLayersChange"}, {
				allTab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"All","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
					listAll: ["wm.List", {"_classes":{"domNode":["GridListStyle","MobileListStyle"]},"border":"0","borderColor":"","columns":[{"show":false,"field":"id","title":"Id","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"state","title":" ","width":"16px","align":"left","formatFunc":"listAllStateFormat","formatProps":null,"editorProps":null,"expression":"","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"95px","align":"left","formatFunc":"listAllNameFormat","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"startDate","title":"Start","width":"60px","align":"left","formatFunc":"listAllStartDateFormat","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"endDate","title":"End","width":"100%","align":"left","formatFunc":"listAllEndDateFormat","formatProps":{"useLocalTime":false,"formatLength":"short","dateType":"date and time"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"startedBy","title":"StartedBy","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"contentException","title":"ContentException","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"businessState","title":"BusinessState","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"type","title":"Type","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'> : \" + ${state} + \"</div>\"\n+ \"<div class='MobileRow'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>End: \" + ${endDate} + \"</div>\"\n","mobileColumn":true}],"deleteConfirm":undefined,"headerVisible":false,"height":"100%","isNavigationMenu":false,"margin":"0","minDesktopHeight":60,"primaryKeyFields":["id"],"styleAsGrid":false,"toggleSelect":true}, {"onSelect":"listAllSelect"}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"executionListService.list","targetProperty":"dataSet"}, {}]
						}]
					}]
				}],
				runningTab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Running","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}],
				failedTab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Failed","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}]
			}],
			moreLinkPanel: ["wm.Panel", {"borderColor":"#999999","height":"16px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				naviateToExecutionsLabel: ["wm.Label", {"align":"right","caption":"More Runs ...","height":"100%","margin":"0,8,0,0","padding":"0","styles":{"fontSize":"9px"},"width":"100%"}, {"onclick":"naviateToExecutionsLabelClick"}]
			}]
		}],
		userInterPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"35%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			answerHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				titleAnswLabl: ["wm.Label", {"align":"left","caption":"Answers (","height":"100%","padding":"4,0,4,4","styles":{"fontWeight":"bold"},"width":"65px"}, {"onclick":"titleAnswLablClick"}],
				userIntrCountLbl: ["wm.Label", {"align":"left","autoSizeWidth":true,"height":"100%","padding":"4,0,4,0","showing":false,"styles":{"fontWeight":"bold"},"width":"0px"}, {"onclick":"titleAnswLablClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire1: ["wm.Wire", {"expression":undefined,"source":"userInteractionsService.total","targetProperty":"caption"}, {}]
					}]
				}],
				userInterLoading: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"Waiting for interaction","source":"resources/images/o11n/progress_16x16.gif","width":"16px"}, {}],
				titleAnswLabl1: ["wm.Label", {"align":"left","caption":")","height":"100%","padding":"4,0,4,0","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"titleAnswLabl1Click"}],
				rootAnswerPresentation: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
			}],
			interactionsPanel: ["wm.Panel", {"borderColor":"#999999","height":"100%","horizontalAlign":"left","minDesktopHeight":80,"minHeight":80,"verticalAlign":"top","width":"100%"}, {}, {
				listInteractions: ["wm.List", {"_classes":{"domNode":["GridListStyle","MobileListStyle"]},"border":"0","borderColor":"","columns":[{"show":true,"field":"id","title":" ","width":"16px","align":"left","formatFunc":"wm_image_formatter","editorProps":{"restrictValues":true},"expression":"\"resources/images/o11n/state_user_input.png\"","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"95px","align":"left","formatFunc":"listAllNameFormat","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"createDate","title":"Date","width":"100%","align":"left","formatFunc":"listAllStartDateFormat","formatProps":null,"editorProps":null,"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Date: \" + ${createDate} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"workflowId","title":"WorkflowId","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"executionId","title":"ExecutionId","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"headerVisible":false,"height":"100%","isNavigationMenu":false,"margin":"0","minDesktopHeight":60,"minWidth":50,"primaryKeyFields":["id"],"styleAsGrid":false,"toggleSelect":true}, {"onSelect":"listInteractionsSelect"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionsService.list","targetProperty":"dataSet"}, {}]
					}]
				}]
			}],
			moreInterLinkPanel: ["wm.Panel", {"borderColor":"","height":"16px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
				naviateToUserInterLabel: ["wm.Label", {"align":"right","caption":"More Answers ...","height":"100%","margin":"0,4,0,0","padding":"0","styles":{"fontSize":"9px"},"width":"100%"}, {"onclick":"naviateToUserInterLabelClick"}]
			}]
		}]
	}],
	barPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"30px"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"barModeVar.dataValue","targetProperty":"showing"}, {}]
		}],
		toggleImagePanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"26px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			toggleOnPanelImg: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"show recent runs panel","margin":"2","source":"resources/images/o11n/first_page.gif","width":"16px"}, {"onclick":"toggleOnPanelImgClick"}]
		}],
		refreshTotalsPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"22px","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
			refreshTotalsImg: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"refresh","margin":"1,0,1,0","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"refreshTotalsImgClick"}]
		}],
		interactionPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"55px","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
			interactionIcon: ["wm.Picture", {"aspect":"h","height":"20px","hint":"Waiting for interaction","source":"resources/images/o11n/state_user_input.png","width":"20px"}, {"onclick":"interactionIconClick"}],
			interactionCount: ["wm.Label", {"align":"center","height":"20px","hint":"Waiting for interaction","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {"onclick":"interactionCountClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionsCount.dataValue","targetProperty":"caption"}, {}]
				}]
			}],
			interactionLoading: ["wm.Picture", {"borderColor":"","height":"20px","hint":"Waiting for interaction","source":"resources/images/o11n/progress_16x16.gif","width":"20px"}, {"onclick":"interactionLoadingClick"}]
		}],
		runningPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"55px","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
			runningIcon: ["wm.Picture", {"aspect":"h","borderColor":"","height":"20px","hint":"Running","source":"resources/images/o11n/poweron_20x.gif","width":"20px"}, {"onclick":"runningIconClick"}],
			runningCount: ["wm.Label", {"align":"center","height":"20px","hint":"Running","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {"onclick":"runningCountClick"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"runningCountService.dataValue","targetProperty":"caption"}, {}]
				}]
			}],
			runningLoading: ["wm.Picture", {"borderColor":"","height":"20px","hint":"Running","source":"resources/images/o11n/progress_16x16.gif","width":"20px"}, {"onclick":"runningLoadingClick"}]
		}],
		taskPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"55px","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
			taskIcon: ["wm.Picture", {"aspect":"h","height":"20px","hint":"Scheduled in the system","source":"resources/images/o11n/workflow_schedule48x.png","width":"20px"}, {}],
			taskCount: ["wm.Label", {"align":"center","height":"20px","hint":"Scheduled in the system","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"taskCountService.dataValue","targetProperty":"caption"}, {}]
				}]
			}],
			taskLoading: ["wm.Picture", {"borderColor":"","height":"20px","hint":"Scheduled in the system","source":"resources/images/o11n/progress_16x16.gif","width":"20px"}, {}]
		}]
	}]}
 
wm.publish(o11n.RecentRuns, [
	["barMode", "barModeVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "RecentRuns", "o11n.RecentRuns", "common.packages.o11n.RecentRuns", "images/wm/widget.png", "", {width: "100%", height: "100%"},false]);