dojo.declare("UserInteractions", wm.Page, {
    "preferredDevice": "desktop",
    sortOrders: [],
    presentation: null,
    deferDataLoad: false,

    start: function() {
        this.currentPagination.setValue("dataValue", 1);
        this.specVar.setData({
            startIndex: 0,
            maxResult: 20,
            sortOrders: "-createDate"
        });
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[UserInteractions]: data load deferred...");
        }
        this.subscribe("ExecutionStateChangeEvent", this, "handleExecutionStateChangeEvent");
    },

    load: function() {
        this.userInteractionsService.update();
        console.log("[UserInteractions]: initial update...");
    },

    handleExecutionStateChangeEvent: function(inEvent) {
        this.userInteractionsService.update();
        console.log("[UserInteractions]: Reloading data on ExecutionStateChangeEvent...");
    },

    userInteractionsServiceSuccess: function(inSender, inDeprecated) {
        this.setMaxPagination(inSender.getData().total);
        this.user_interactions_grid.show();
    },

    user_interactions_gridRenderData: function(inSender) {
        this.disableDefaultSortingIfPagination();
    },

    disableDefaultSortingIfPagination: function() {
        if (this.maxPaginationVar.data.dataValue > 1) {
            this.user_interactions_grid.dojoObj.canSort = function() {
                return false;
            };
        }
    },

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
        this.userInteractionsService.update();
        console.log("[UserInteractions]: Paginate Update...");
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

    user_interactions_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
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
        this.userInteractionsService.update();
        console.log("[UserInteractions]: On sort update... ");
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

    userInteractionsServiceError: function(inSender, inError) {
        app.toastError("Error: " + inError);
    },

    answer: function(userInteractionId) {
        if (!this.presentation) {
            this.presentation = this.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                userInteractionId: userInteractionId
            });
            this.presentationRootPanel.reflow();
            this.connect(this.presentation, "onSubmit", this, "handleOnSubmitPresentation");
        } else {
            this.presentation.userInteractionId = userInteractionId;
            this.presentation.start();
        }
    },

    handleOnSubmitPresentation: function() {
        this.specVar.setValue("startIndex", 0);
        this.currentPagination.setValue("dataValue", 1);
        this.userInteractionsService.update();
        this.user_interactions_grid.updateSelectedItem(-1);
    },

    user_interactions_gridClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if ("id" === fieldId) {
            this.answer(selectedItem.getData().id);
        }
    },

    _end: 0
});