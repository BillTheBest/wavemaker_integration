dojo.declare("WorkflowList", wm.Page, {
    "preferredDevice": "desktop",
    sortOrders: [],
    presentation: null,
    deferDataLoad: false,

    start: function() {
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[WorkflowList]: data load deferred...");
        }
    },

    load: function() {
        this.currentPagination.setValue("dataValue", 1);
        this.specVar.setData({
            startIndex: 0,
            maxResult: 20
        });
        this.workflowService.update();
        console.log("[WorkflowList]: initial data load...");
    },

    /**************************** Service event handlers:Start **********************/
    workflowServiceSuccess: function(inSender, inDeprecated) {
        this.setMaxPagination(inSender.getData().total);
        this.workflows_grid.show();
    },

    workflowServiceError: function(inSender, inError) {
        app.toastError("Error: " + inError);
    },
    /**************************** Service event handlers:End **********************/

    /**************************** Grid event handlers:Start **********************/
    workflows_gridRenderData: function(inSender) {
        this.disableDefaultSortingIfPagination();
    },

    disableDefaultSortingIfPagination: function() {
        if (this.maxPaginationVar.data.dataValue > 1) {
            this.workflows_grid.dojoObj.canSort = function() {
                return false;
            };
        }
    },

    workflows_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if (this.maxPaginationVar.data.dataValue <= 1) {
            return;
        }
        if (fieldId === "description") {
            //the vco server throws null pointer exception when description.
            return;
        }
        this.set_selected_field_sorted_order(fieldId);
        var sortOrdersReverse = this.sortOrders.concat([]).reverse();
        this.specVar.setValue("sortOrders", sortOrdersReverse.toString());
        this.workflowService.update();
        console.log("[WorkflowList]: On sort update... ");
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


    workflows_gridClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if ("id" === fieldId) {
            this.onWorkflowInfoClick(selectedItem.getData().id);
        }
    },
    /**************************** Grid event handlers:End **********************/

    /****************************Pagination: Start **********************/
    setMaxPagination: function(total) {
        total = total > 1 ? total : 1;
        var value = Math.ceil(total / this.specVar.getValue("maxResult"));
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
        this.workflowService.update();
        console.log("[WorkflowList]: Paginate Update...");
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
    /****************************Pagination: End **********************/

    runPresentation: function(workflowId) {
        if (!this.presentation) {
            this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: workflowId
            });
            this.presentationRootPanel.reflow();
        } else {
            this.presentation.workflowId = workflowId;
            this.presentation.start();
        }
    },

    runButtonClick: function(inSender) {
        var workflowId = this.workflows_grid.selectedItem.getData().id;
        this.runPresentation(workflowId);
    },

    infoButtonClick: function(inSender) {
        var workflowId = this.workflows_grid.selectedItem.getData().id;
        this.onWorkflowInfoClick(workflowId);
    },

    onWorkflowInfoClick: function(workflowId) {
        console.log("[WorkflowList]: wf id: " + workflowId);
    },

    searchChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        console.log("[WorkflowList]: search for:  " + inDataValue);
        if (inDataValue) {
            this.specVar.setValue("conditions", "name~" + inDataValue);
        } else {
            this.specVar.setValue("conditions", null);
        }
        this.specVar.setValue("startIndex", 0);
        this.currentPagination.setValue("dataValue", 1);
        this.workflowService.update();
    },

    _end: 0
});