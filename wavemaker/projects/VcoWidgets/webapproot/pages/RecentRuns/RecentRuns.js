dojo.declare("RecentRuns", wm.Page, {
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
        this.specVar.setData({
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
        if (this.barModeVar.data.dataValue) {
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
                this.startTimer(this.runningTotalTimer);
            } else {
                this.reloadBarTotalsData();
            }
        } else {
            if (inEvent.status === "RUNNING") {
                if (this.recentRunsTabLayers.getActiveLayer().name !== "failedTab") {
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
                    this.startTimer(this.executionStatusTimer);
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
            this.specVar.setValue("conditions", "state!=waiting");
            this.listAll.setParent(this.allTab);
            break;
        case 1:
            //running
            this.specVar.setValue("conditions", "state=running");
            this.listAll.setParent(this.runningTab);
            break;
        case 2:
            //failed
            this.specVar.setValue("conditions", "state=failed");
            this.listAll.setParent(this.failedTab);
            break;
        }
        this.executionListService.update();
    },

    listAllSelect: function(inSender, inItem) {
        var workflowExecutionModel = inSender.selectedItem.getData();
        this.executionIdVar.setValue("dataValue", workflowExecutionModel.id);
        this.setCurrentExecutionDetals(workflowExecutionModel);
        this.currentWorkflowIdService.update();
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

        this.widgets.executionDetailsDialog.setTitle(this.i18WorkflowTitleLblMsg.caption + ": " + workflowExecutionModel.name);
        this.executionStatusLabel.setCaption(workflowExecutionModel.state);
        this.executionStartedLabel.setCaption(workflowExecutionModel.startDate);
        this.executionEndedLabel.setCaption(workflowExecutionModel.endDate);
        this.executionBusinessStatus.setCaption(workflowExecutionModel.businessState);
        if (workflowExecutionModel.businessState) {
            this.businessStatusSeparator.show();
            this.businessStatusLabel.show();
        } else {
            this.businessStatusLabel.hide();
            this.businessStatusSeparator.hide();
        }
    },

    closeButtonClick: function(inSender) {
        this.widgets.executionDetailsDialog.hide();
    },

    currentWorkflowIdServiceSuccess: function(inSender, inDeprecated) {
        this.executionService.update();
        this.runEventsServices.update();
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

    rerunWorkflowServiceSuccess: function(inSender, inDeprecated) {
        this.widgets.executionDetailsDialog.hide();
        this.executionListService.update();
        this.stopTimer(this.executionStatusTimer);
    },

    restartButtonClick: function(inSender) {
        var parent = this;
        app.confirm(this.i18nRerunWorkflwMsg.caption, false, function() {
            parent.rerunExecution();
        }, function() {});
    },

    rerunExecution: function() {
        this.widgets.executionDetailsDialog.hide();
        this.rerunWorkflowService.update();
    },

    cancelButtonClick: function(inSender) {
        var parent = this;
        app.confirm(this.i18CancelWorkflowMsg.caption, false, function() {
            parent.cancelExecution();
        }, function() {});
    },

    cancelExecution: function(inSender) {
        this.widgets.executionDetailsDialog.hide();
        this.cancelExecutionService.update();
    },

    cancelExecutionServiceSuccess: function(inSender, inDeprecated) {
        this.executionListService.update();
        this.stopTimer(this.executionStatusTimer);
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
        this.startTimer(this.executionStatusTimer);
    },

    pollRunningExecutionStates: function() {
        var tokens = this.config.runningTokens;
        for (var executionId in tokens) {
            if (tokens.hasOwnProperty(executionId)) {
                console.log("[RecentRuns][pollRunningExecutionStates]  executionId: " + executionId + ", workflowId: " + tokens[executionId].workflowId);
                this.executionStateService.input.setValue('executionId', executionId);
                this.executionStateService.input.setValue('workflowId', tokens[executionId].workflowId);
                this.executionStateService.update();
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
                this.updateExecutionService.input.setValue('executionId', executionStateModel.executionId);
                this.updateExecutionService.input.setValue('workflowId', token.workflowId);
                this.updateExecutionService.update();
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
            this.stopTimer(this.executionStatusTimer);
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
            this.widgets.presentation = this.rootAnswerPresentation.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                userInteractionId: userInteractionId
            });
            this.rootAnswerPresentation.reflow();
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
        this.countResult(this.taskLoading, this.taskCount);
    },
    taskCountServiceError: function(inSender, inError) {
        this.countError(this.taskLoading, this.taskCount);
    },
    userInteractionsCountResult: function(inSender, inDeprecated) {
        this.countResult(this.interactionLoading, this.interactionCount);
    },
    userInteractionsCountError: function(inSender, inError) {
        this.countError(this.interactionLoading, this.interactionCount);
    },
    runningCountServiceResult: function(inSender, inDeprecated) {
        console.log("RecentRuns: component");
        this.countResult(this.runningLoading, this.runningCount);
        var runCount = inSender.data.dataValue;
        if (runCount > 0) {
            this.startTimer(this.runningTotalTimer);
        } else {
            this.stopTimer(this.runningTotalTimer);
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
        this.stopTimer(this.runningTotalTimer);
        this.countError(this.runningLoading, this.runningCount);
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
        var activeLayer = this.recentRunsTabLayers.getActiveLayer();
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
        this.stopTimer(this.runningTotalTimer);
        this.stopTimer(this.executionStatusTimer);
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
        this.userInterLoading.hide();
        this.userIntrCountLbl.show();
    },

    /**************** toggle off/on and refresh panel/bar *******************/
    refreshTotalsImgClick: function(inSender) {
        this.reloadBarTotalsData();
    },

    reloadBarTotalsData: function() {
        this.stopTimer(this.runningTotalTimer);
        this.stopTimer(this.executionStatusTimer);
        this.barLoading(this.taskLoading, this.taskCount);
        this.barLoading(this.interactionLoading, this.interactionCount);
        this.barLoading(this.runningLoading, this.runningCount);
        this.runningCountService.update();
        this.taskCountService.update();
        this.userInteractionsCount.update();
    },

    refreshImgClick: function(inSender) {
        this.reloadPanelExecutionData();
    },

    reloadPanelExecutionData: function() {
        this.stopTimer(this.runningTotalTimer);
        this.stopTimer(this.executionStatusTimer);
        this.config.runningTokens = [];
        this.executionListService.update();
        this.userInteractionsService.update();
        this.userInterLoading.show();
        this.userIntrCountLbl.hide();
    },

    toggleOnPanelImgClick: function(inSender) {
        this.barPanel.hide();
        this.tabsPanel.show();
        var width = this.tabsPanel.width;
        this.onRecentRunsPanelSwitch(width);
        this.reloadPanelExecutionData();
        this.isBarPanel = false;

    },

    toggleOffPanelImgClick: function(inSender) {
        this.isBarPanel = true;
        this.tabsPanel.hide();
        this.barPanel.show();
        var width = this.barPanel.width;
        this.onRecentRunsPanelSwitch(width);
        this.reloadBarTotalsData();
    },

    onRecentRunsPanelSwitch: function(width) {
        console.log("[RecentRuns][Event]: Recent Runs Panel Switch with current width:  " + width);
    },

    /************************** Timers:Start *************************************/
    executionStatusTimerTimerFire: function(inSender) {
        var stillRunning = this.checkTimerStatus(this.executionStatusTimer);
        if (stillRunning) {
            this.pollRunningExecutionStates();
        }
    },

    runningTotalTimerTimerFire: function(inSender) {
        var stillRunning = this.checkTimerStatus(this.runningTotalTimer);
        if (stillRunning) {
            this.runningCountService.update();
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