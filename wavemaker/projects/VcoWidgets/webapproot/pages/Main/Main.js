dojo.declare("Main", wm.Page, {
    "preferredDevice": "desktop",
    workflowInfo: null,
    workflowRuns: null,
    currentWorkflowId: null,
    currentWorkflowName: null,
    currentWorkflowType: null,

    start: function() {},

    o11nWorkflowTreeInfoSelect: function(inSender, inData) {
        try {
            this.workflowDetailsLayers.show();
            this.currentWorkflowId = inData.data.data;
            this.currentWorkflowName = inData.data.content;
            this.currentWorkflowType = inData.data.type;
            if (this.currentWorkflowType == "Workflow") {
                this.monitorTab.show();
            } else {
                this.monitorTab.hide();
            }
            var activeLayer = this.workflowDetailsLayers.getActiveLayer();
            if (activeLayer.name === "summaryTab") {
                this.summaryTabShow();
            } else {
                this.monitorTabShow();
            }
        } catch (e) {
            console.error('ERROR IN o11nWorkflowTree1Select: ' + e);
        }
    },

    monitorTabShow: function(inSender) {
        this.createWorkflowMonitor();
    },

    summaryTabShow: function(inSender) {
        this.createWorkflowInfo();
    },

    createWorkflowInfo: function() {
        try {
            if (!this.workflowInfo) {
                this.workflowInfo = this.workflowInfoPanel.createComponent("o11nWorkflowInfo", "o11n.WorkflowInfo", {
                    width: "100%",
                    height: "100%",
                    deferDataLoad: true
                });
                this.workflowInfoPanel.reflow();
            }
            this.workflowInfo.load(this.currentWorkflowId, this.currentWorkflowName, this.currentWorkflowType);
        } catch (e) {
            console.error('ERROR IN workflowInfo: ' + e);
        }
    },

    createWorkflowMonitor: function() {
        if (!this.currentWorkflowId || this.currentWorkflowType != "Workflow") {
            return;
        }
        try {
            this.loadingDialogMonitorTab.show();
            console.log("Start WorkflowRuns Component - Workflow Id: " + this.currentWorkflowId + " - type: " + this.currentWorkflowType + " - Workflow Name: " + this.currentWorkflowName);
            if (!this.workflowRuns) {
                this.workflowRuns = this.runsPanel.createComponent("o11nWorkflowRuns", "o11n.WorkflowRuns", {
                    width: "100%",
                    height: "100%",
                    executionsPerWorkflow: true,
                    workflowId: this.currentWorkflowId,
                    deferDataLoad: true
                });
                this.runsPanel.reflow();
            }
            this.workflowRuns.load(this.currentWorkflowId);
            this.loadingDialogMonitorTab.hide();
        } catch (e) {
            this.loadingDialogMonitorTab.hide();
            console.error('ERROR IN createWorkflowMonitor: ' + e);
        }
    },

    startButtonClick: function(inSender) {
        try {
            this.startButton.hide();
            this.startPanel.show();
        } catch (e) {
            console.error('ERROR IN startButtonClick: ' + e);
        }
    },


    _end: 0
});