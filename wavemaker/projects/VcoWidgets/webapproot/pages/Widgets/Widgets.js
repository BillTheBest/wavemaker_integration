dojo.declare("Widgets", wm.Page, {
    "preferredDevice": "desktop",
    start: function() {},

    userInteractionsLayerShow: function(inSender) {
        this.o11nUserInteractions1.load();
    },
    recentRunsLayerShow: function(inSender) {
        this.o11nRecentRuns1.load();
    },

    o11nHomeInfo1RunningExecutionsClick: function(inSender) {
        app.toastInfo("[Home Info]: Running Workflows Count clicked for navigation ...");
    },
    o11nRecentRuns1RunningExecutionsClick: function(inSender) {
        app.toastInfo("[Recent Runs]: 'More Runs' link clicked for Running tab executions...");
    },
    o11nRecentRuns1AllExecutionsClick: function(inSender) {
        app.toastInfo("[Recent Runs]: 'More Runs' link clicked for All tab executions...");
    },
    o11nRecentRuns1FailedExecutionsClick: function(inSender) {
        app.toastInfo("[Recent Runs]: 'More Runs' link clicked for Failed tab executions...");
    },

    o11nRecentRuns1UserInteractionsClick: function(inSender) {
        app.toastInfo("[Recent Runs]: 'More Runs' link clicked for User Interactions tab executions...");
    },

    o11nRecentRuns1RunningCountChange: function(inSender, newCount) {
        app.toastInfo("[Recent Runs]: Workflow Running Count changed to: " + newCount);
    },

    workflowRunsLayerShow: function(inSender) {
        this.o11nWorkflowRuns1.load();
    },
    workflowListShow: function(inSender) {
        this.o11nWorkflowList1.load();
        //demonstration of how to bind a handler to a component event from a script with passing the parameters.
        this.connect(this.o11nWorkflowList1, "onWorkflowInfoClick", dojo.hitch(this, "o11nWorkflowList1WorkflowInfoClick", this.o11nWorkflowList1));
    },

    o11nHomeInfo1UserInteractionsClick: function(inSender) {
        app.toastInfo("[Home Info]: User Interactions Count clicked for navigation ...");
    },
    tabLayers2Show: function(inSender) {
        this.o11nHomeInfo1.load();
        //demonstration of how to bind a handler to a component event from a script. 
        this.connect(this.o11nHomeInfo1, "onRunningExecutionsClick", this, "o11nRecentRuns1RunningExecutionsClick");
    },

    o11nWorkflowList1WorkflowInfoClick: function(inSender, workflowId) {
        app.toastInfo("[Workflow List]: Workflow with id: " + workflowId + " was clicked...");
    },
    fireEventButtonClick: function(inSender) {
        dojo.publish("ExecutionStateChangeEvent", [{
            status: "RUNNING",
            executionId: "invalid executionId (mandatory)",
            workflowId: "invalidWorkflowId (optional)",
            workflowName: "Test Name For Demo"
        }]);
    },

    o11WorklowTreePresentationSelect: function(inSender, inData) {
        this.o11nPresentation1.workflowId = inData.data.data;
        this.o11nPresentation1.load();
    },
    o11nWorkflowTreeInfoSelect: function(inSender, inData) {
        this.o11nWorkflowInfo1.load(inData.data.data, inData.data.content, inData.data.type);
    },

    inventoryTreeLayerShow: function(inSender) {
        if (!this.o11nInventoryTree1.showing) {
            this.o11nInventoryTree1.show();
            this.o11nInventoryTree1.load();
        }
    },

    workflowTreeLayerShow: function(inSender) {
        if (!this.o11nWorkflowTree1.showing) {
            this.o11nWorkflowTree1.show();
            this.o11nWorkflowTree1.load();
        }
    },
    workflowInfoLayerShow: function(inSender) {
        if (!this.o11nWorkflowTreeInfo.showing) {
            this.o11nWorkflowTreeInfo.show();
            this.o11nWorkflowTreeInfo.load();
        }
    },
    presentationLayerShow: function(inSender) {
        if (!this.o11nWorklowTreePresentation.showing) {
            this.o11nWorklowTreePresentation.show();
            this.o11nWorklowTreePresentation.load();
        }
    },
    workflowCatalogLayerShow: function(inSender) {
		this.o11nWorkflowCatalog1.load();
	},
	_end: 0
});