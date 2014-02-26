dojo.declare("HomeInfo", wm.Page, {
    "preferredDevice": "desktop",
    deferDataLoad: false,

    start: function() {
        this.aboutInfoService.update();
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[HomeInfo]: data load deferred...");
        }
        this.subscribe("RunningCountChangeEvent", this, "handleRunningCountChangeEvent");
    },

    load: function() {
        console.log("[HomeInfo]: data loading started...");
        this.refreshTotalsImgClick();
    },

    handleRunningCountChangeEvent: function(inEvent) {
        this.runningCount.setCaption(inEvent.count);
    },

    taskCountServiceResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.taskLoading, this.taskCount);
    },
    taskCountServiceError: function(inSender, inError) {
        this.errorOnCountUpdate(this.taskLoading, this.taskCount);
    },
    userInteractionsCountResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.interactionLoading, this.interactionCount);
    },
    userInteractionsCountError: function(inSender, inError) {
        this.errorOnCountUpdate(this.interactionLoading, this.interactionCount);
    },
    runningCountServiceResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.runningLoading, this.runningCount);
    },
    runningCountServiceError: function(inSender, inError) {
        this.errorOnCountUpdate(this.runningLoading, this.runningCount);
    },
    resultOnCountUpdate: function(loading, count) {
        loading.hide();
        count.show();
    },
    errorOnCountUpdate: function(loading, count) {
        this.resultOnCountUpdate(loading, count);
        count.setCaption("-");
    },

    refreshTotalsImgClick: function(inSender) {
        this.startLoad(this.taskLoading, this.taskCount);
        this.startLoad(this.interactionLoading, this.interactionCount);
        this.startLoad(this.runningLoading, this.runningCount);
        this.runningCountService.update();
        this.taskCountService.update();
        this.userInteractionsCount.update();
    },

    startLoad: function(loading, count) {
        count.hide();
        loading.show();
    },

    /* navigate to running executions */
    label10Click: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    runningCountClick: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    label11Click: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    runningLoadingClick: function(inSender) {
        this.onRunningExecutionsClick();
    },
    onRunningExecutionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[HomeInfo]: Running Executions Panel click...");
    },

    /* navigate to user interactions */
    label8Click: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    interactionCountClick: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    interactionLoadingClick: function(inSender) {
        this.onUserInteractionsClick();
    },
    label9Click: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    onUserInteractionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[HomeInfo]: User Interactions Panel click...");
    },
    _end: 0
});