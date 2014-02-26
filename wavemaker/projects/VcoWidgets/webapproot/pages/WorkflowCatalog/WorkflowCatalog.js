dojo.declare("WorkflowCatalog", wm.Page, {
    "preferredDevice": "desktop",
    deferDataLoad: false,

    start: function() {
        this.runImgPrefixId = "wf-run:";
        this.infoImgPrefixId = "wf-info:";
        this.iconImgPrefixId = "wf-icon-";

        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[WorkflowCatalog]: data load deferred...");
        }
    },

    load: function() {
        console.log("[WorkflowCatalog]: data loading started ...");
        this.resetToCatalogLayer();
        this.catalogModelService.update();
        if (!this.editModeVar.data.dataValue) {
            this.userAdminService.update();
        }
    },

    resetToCatalogLayer: function() {
        var activeLayer = this.catalogLayers.getActiveLayer();
        if (activeLayer && activeLayer.name !== this.catalogLayer.name) {
            this.catalogLayers.setLayer(this.catalogLayer);
        }
    },

    catalogModelServiceSuccess: function(inSender, inDeprecated) {
        this.loadingPanel.hide();
        this.catalogPanel.show();
        this.serviceSuccess(inSender, "Catalog data recieved...");
    },

    addCategoryServiceSuccess: function(inSender, inDeprecated) {
        this.serviceSuccess(inSender, "Add category completed.");
    },

    updateCategoryServiceSuccess: function(inSender, inDeprecated) {
        this.serviceSuccess(inSender, "Update category completed.");
    },

    deleteCategoriesServiceSuccess: function(inSender, inDeprecated) {
        this.serviceSuccess(inSender, "Delete categories completed.");
    },

    updatePageServiceSuccess: function(inSender, inDeprecated) {
        this.serviceSuccess(inSender, "Update Catalog Page completed.");
    },

    refreshCatalogServiceSuccess: function(inSender, inDeprecated) {
        this.serviceSuccess(inSender, "Refresh Catalog Page completed.");
    },

    serviceSuccess: function(inSender, logMsg) {
        console.log("[WorkflowCatalog]: " + logMsg);
        this.catalogModel = inSender.getData();
        this.buildCatalog(this.catalogModel);
    },

    refreshImgClick: function(inSender) {
        this.search.clear();
        this.refreshCatalogService.update();
        this._refreshWorkflowTreeSelection();
    },

    searchChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        console.log("[WorkflowCatalog]: search for:  " + inDataValue);
        if (inDataValue) {
            this.searchCatalogService.input.setValue('searchTerm', inDataValue);
            this.searchCatalogService.update();
        } else {
            this.buildCatalog(this.catalogModel);
        }
    },

    searchCatalogServiceSuccess: function(inSender, inDeprecated) {
        this.clearLayers();
        var resultPage = inSender.getData();
        var category = resultPage.category;
        if (resultPage.catalogItems && resultPage.catalogItems.length > 0) {
            category.name = this.i18nSearchResultCategoryMsg.caption;
        } else {
            category.name = this.i18nNoSearchResultCategoryMsg.caption;
        }
        this.buildCategories([category]);
        dojo.addClass(dojo.byId(category.id), "selection");
        this.switchPanel(category.id, [resultPage]);
    },

    buildCatalog: function(catalogModel) {
        this.clearLayers();
        var categories = catalogModel.categories;
        this.buildCategories(categories);

        var category = categories[0];
        if (this.categoryNameSelected) {
            for (i = 0; i < categories.length; i++) {
                var cat = categories[i];
                if (cat.name === this.categoryNameSelected) {
                    category = cat;
                    break;
                }
            }
            this.categoryNameSelected = null;
        }
        if (category) {
            dojo.addClass(dojo.byId(category.id), "selection");
            this.switchPanel(category.id, this.catalogModel.catalogPages);
        }
    },

    buildCategories: function(categories) {
        this.unwireCategories();
        var buf = ['<ul id="catalog-categories" class="catalog-category clearfix">'];
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            buf[buf.length] = '<li class="catalog-category" id="';
            buf[buf.length] = category.id;
            buf[buf.length] = '"><label><span>';
            buf[buf.length] = category.name;
            buf[buf.length] = '</span></label></li>';
        }
        buf[buf.length] = '</ul>';
        this.htmlCategories.setHtml(buf.join(''));

        if (!this.connectionsByCategory) {
            this.connectionsByCategory = {};
        }

        for (i = 0; i < categories.length; i++) {
            var cat = categories[i];
            if (!this.connectionsByCategory[cat.id]) {
                this.connectionsByCategory[cat.id] = [];
            }
            var connections = this.connectionsByCategory[cat.id];
            var element = dojo.byId(cat.id);
            connections.push(dojo.connect(element, "onclick", this, "categorySelection"));
            connections.push(dojo.connect(element, "ondblclick", this, "categoryDblClick"));
        }
    },

    buildCatalogPage: function(items, categoryId) {
        var layer = this.catalogTabLayers.addLayer(categoryId);
        layer.setWidth("100%");
        this.buildCatalogPageHtml(items, categoryId, layer);
        this.wireCatalogEntries(items, layer.name);
        return layer;
    },

    buildCatalogPageHtml: function(items, categoryId, parent) {
        var html = parent.createComponent("catalog-" + parent.id, "wm.Html", {
            showing: true,
            width: "100%",
            height: "100%",
            styles: {
                "min-height": "300px"
            }
        });

        var catalog = ['<ul  dojotype="dojo.dnd.Source" id="workflow-catalog-ul-' + parent.id + '" class="workflow-catalog clearfix container">'];
        if (items) {
            for (var i = 0; i < items.length; i++) {
                catalog[i + 1] = this.buildCatalogBox(items[i]);
            }
        }

        catalog[catalog.length] = '</ul>';
        html.setHtml(catalog.join(''));
        parent.reflow();

        if (items) {
            var workflowIds = [];
            for (var j = 0; j < items.length; j++) {
                workflowIds.push(items[j].id);
            }
            this.loadItemIcons(workflowIds, parent.domNode.id);
        }

        return html;
    },


    loadItemIcons: function(workflowIds, parentId) {
        var xhrArgs = {
            url: "icons/",
            content: {
                workflowIds: workflowIds.toString()
            },
            sync: false,
            handleAs: "json",
            load: this._createLoadItemsIconFunction(parentId)
        };
        dojo.xhrPost(xhrArgs);
    },

    _createLoadItemsIconFunction: function(parentId) {
        if (!this.loadFunctions) {
            this.loadFunctions = {};
        }
        var loadItemFunction = this.loadFunctions[parentId];
        if (!loadItemFunction) {

            var wfIconIdPrefix = this.iconImgPrefixId;
            loadItemFunction = function(data) {
                var elements = {};
                dojo.query("span.wf-icon > img", dojo.byId(parentId)).forEach(function(item) {
                    elements[item.id] = item;
                });

                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var currentId = wfIconIdPrefix + item.id;
                    elements[currentId].src = item.url;
                }
            };

            this.loadFunctions[parentId] = loadItemFunction;
        }
        return loadItemFunction;
    },

    wireCatalogEntries: function(items, layerName) {
        if (!items) {
            return;
        }
        if (!this.connectionsByLayer) {
            this.connectionsByLayer = {};
        }
        if (!this.connectionsByLayer[layerName]) {
            this.connectionsByLayer[layerName] = [];
        }
        var connections = this.connectionsByLayer[layerName];

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            connections.push(dojo.connect(dojo.byId(item.id), "onclick", this, "catalogSelection"));
            connections.push(dojo.connect(dojo.byId(this.runImgPrefixId + item.id), "onclick", this, "runWorkflow"));
            connections.push(dojo.connect(dojo.byId(this.infoImgPrefixId + item.id), "onclick", this, "navigateToWorkflowInfo"));
        }
    },

    clearLayers: function() {
        for (var i = this.catalogTabLayers.getCount(); i > 0; i--) {
            var layer = this.catalogTabLayers.getLayer(i - 1);
            if (layer && this.connectionsByLayer && this.connectionsByLayer[layer.name]) {
                var connections = this.connectionsByLayer[layer.name];
                if (connections) {
                    dojo.forEach(connections, dojo.disconnect);
                }
            }
            layer.destroy();
        }
    },

    unwireCategories: function() {
        var categElements = dojo.query("li.catalog-category");
        for (var i = 0; i < categElements.length; i++) {
            var categElement = categElements[i];
            var connections = this.connectionsByCategory[categElement.id];
            if (connections) {
                dojo.forEach(connections, dojo.disconnect);
            }
            dojo.destroy(categElement);
        }
    },

    catalogSelection: function(inEvent) {
        this.setSelection(inEvent, "li.workflow-catalog");
    },

    categorySelection: function(inEvent) {
        var parent = this.findParentElementLiType(inEvent.target);
        var isSwitch = parent && parent.className.indexOf("selection") === -1;
        this.setSelection(inEvent, "li.catalog-category");
        if (isSwitch) {
            this.switchPanel(parent.id, this.catalogModel.catalogPages);
            this.resetToCatalogLayer();
        }
    },

    categoryDblClick: function(inEvent) {
        if (this.isEditMode()) {
            this.setSelection(inEvent, "li.catalog-category");
            this._prepareEditCategory(inEvent.target);
        }
    },

    switchPanel: function(categoryId, pages) {
        var layer = this.catalogTabLayers.getLayerByCaption(categoryId);
        if (!layer) {
            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                if (categoryId === page.category.id) {
                    layer = this.buildCatalogPage(page.catalogItems, categoryId);
                    break;
                }
            }
            if (!layer) {
                this.buildCatalogPage([], categoryId);
            }
        }
        this.catalogTabLayers.setLayer(layer);
    },

    setSelection: function(inEvent, type) {
        var element = inEvent.target;
        var parent = this.findParentElementLiType(element);
        if (parent) {
            var elements = dojo.query(type);
            var isCtrlKey = inEvent.ctrlKey || inEvent.metaKey;
            if (this.isEditMode() && (isCtrlKey || inEvent.shiftKey)) {
                var isSelected = parent.className.indexOf("selection") !== -1;
                var numOfSelected = 0;
                var firstSelectedIndex = -1;
                var lastSelectedIndex = -1;
                var currentIndex = -1;
                for (var i = 0; i < elements.length; i++) {
                    var item = elements[i];
                    if (item == parent) {
                        currentIndex = i;
                    }
                    if (item.className.indexOf("selection") !== -1) {
                        numOfSelected++;
                        lastSelectedIndex = i;
                        if (firstSelectedIndex === -1) {
                            firstSelectedIndex = i;
                        }
                    }
                }
                if (isCtrlKey) {
                    if (isSelected && numOfSelected > 1) {
                        dojo.removeClass(parent, "selection");
                    } else if (!isSelected) {
                        dojo.addClass(parent, "selection");
                    }
                } else if (inEvent.shiftKey && !isSelected) {
                    if (firstSelectedIndex > currentIndex) {
                        firstSelectedIndex = currentIndex;
                    }
                    if (lastSelectedIndex < currentIndex) {
                        lastSelectedIndex = currentIndex;
                    }
                    for (i = 0; i < elements.length; i++) {
                        var curr = elements[i];
                        if (i >= firstSelectedIndex && i <= lastSelectedIndex) {
                            if (curr.className.indexOf("selection") === -1) {
                                dojo.addClass(curr, "selection");
                            }
                        }
                    }
                }
            } else {
                for (var j = 0; j < elements.length; j++) {
                    dojo.removeClass(elements[j], "selection");
                }
                dojo.addClass(parent, "selection");
            }
        }
    },

    runWorkflow: function(inEvent) {
        var parent = this.findParentElementLiType(inEvent.target);
        if (parent) {
            console.log("run workflow with id: " + parent.id);
            this.currentWorkflowId = parent.id;
            this.createWorkflowPresentation();
        }
    },

    navigateToWorkflowInfo: function(inEvent) {
        var parent = this.findParentElementLiType(inEvent.target);
        if (parent) {
            console.log("navigate to workfow with id: " + parent.id);
            this.currentWorkflowId = parent.id;
            this.showSummaryTab();
            this.catalogLayers.setLayer(this.workflowDetailsLayer);
        }
    },

    findParentElementLiType: function(childNode) {
        var parent = childNode;
        var elementType = "li";
        while (parent && parent.nodeName.toLowerCase() !== elementType) {
            parent = parent.parentNode;
        }

        return parent;
    },

    buildCatalogBox: function(item) {
        var title_limit = 23;
        var desc_limit = 58;

        if (!item.iconHref) {
            item.iconHref = "resources/images/test_catalog_icon.png";
        }
        var title = item.name;
        var desc = item.description;

        var buf = [];
        buf[buf.length] = '<li class="workflow-catalog dojoDndItem" id="';
        buf[buf.length] = item.id;
        buf[buf.length] = '"><label><span class="wf-specs">';
        //header part with buttons
        buf[buf.length] = '<span class="header"><img id="';
        buf[buf.length] = this.runImgPrefixId;
        buf[buf.length] = item.id;
        buf[buf.length] = '" src="resources/images/o11n/poweron_20x.gif" title="';
        buf[buf.length] = this.i18nRunWorkflowMsg.caption;
        buf[buf.length] = '"/><img id="';
        buf[buf.length] = this.infoImgPrefixId;
        buf[buf.length] = item.id;
        buf[buf.length] = '" style="margin-bottom: 2px;" width="16px" height="16px" src="resources/images/o11n/info_24x.png" title="';
        buf[buf.length] = this.i18nGetWorkflowInfoMsg.caption;
        buf[buf.length] = '"/>';
        buf[buf.length] = '<span class="title"';
        if (title && title.length > title_limit) {
            buf[buf.length] = ' title="';
            buf[buf.length] = title;
            buf[buf.length] = '"';
            title = title.substring(0, title_limit - 3) + "...";
        }
        buf[buf.length] = '>';
        buf[buf.length] = title;
        buf[buf.length] = '</span></span>';
        //workflow icon
        buf[buf.length] = '<span class="wf-icon"><img id="';
        buf[buf.length] = this.iconImgPrefixId;
        buf[buf.length] = item.id;
        buf[buf.length] = '" src="';
        buf[buf.length] = item.iconHref;
        buf[buf.length] = '" /></span>';
        //workflow desc
        buf[buf.length] = '<span class="wf-desc"';
        if (desc && desc.length > desc_limit) {
            buf[buf.length] = ' title="';
            buf[buf.length] = desc;
            buf[buf.length] = '"';
            desc = desc.substring(0, desc_limit - 3) + "...";
        }
        buf[buf.length] = '>';
        buf[buf.length] = desc;
        buf[buf.length] = '</span>';
        buf[buf.length] = '</span></label></li>';
        return buf.join('');
    },

    catalogModelServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    searchCatalogServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    userAdminServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    addCategoryServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    updateCategoryServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    deleteCategoriesServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    updatePageServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    refreshCatalogServiceError: function(inSender, inError) {
        this.serviceError(inError);
    },

    serviceError: function(inError) {
        var errMsg = "[WorkflowCatalog][Error]: " + inError;
        console.error(errMsg);
        app.toastError(errMsg);
        this.loadingPanel.hide();
        this.catalogPanel.show();
    },

    createWorkflowInfo: function() {
        try {
            if (!this.workflowInfo) {
                this.workflowInfo = this.summaryTab.createComponent("o11nWorkflowInfoCatalog", "o11n.WorkflowInfo", {
                    width: "100%",
                    height: "100%",
                    deferDataLoad: true
                });
                this.summaryTabLoadingImg.hide();
                this.summaryTab.reflow();
            } else {
                this.workflowInfo.load(this.currentWorkflowId, null, "Workflow");
            }
        } catch (e) {
            this.serviceError(e);
        }
    },

    createWorkflowMonitor: function() {
        try {
            if (!this.workflowRuns) {
                this.workflowRuns = this.monitorTab.createComponent("o11nWorkflowRunsCatalog", "o11n.WorkflowRuns", {
                    width: "100%",
                    height: "100%",
                    executionsPerWorkflow: true,
                    workflowId: this.currentWorkflowId,
                    deferDataLoad: true
                });
                this.monitorTabLoadingImg.hide();
                this.monitorTab.reflow();
            }
            this.workflowRuns.load(this.currentWorkflowId);
        } catch (e) {
            this.serviceError(e);
        }
    },

    createWorkflowPresentation: function() {
        if (!this.presentation) {
            this.presentation = this.presentationRootPanel.createComponent("o11nPresentationCatalog", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: this.currentWorkflowId
            });
            this.presentationRootPanel.reflow();
        } else {
            this.presentation.workflowId = this.currentWorkflowId;
            this.presentation.start();
        }
    },

    monitorOffLblClick: function(inSender, inEvent) {
        this.showMontiorTab();
    },

    showMontiorTab: function() {
        this.summaryOnLbl.hide();
        this.monitorOnLbl.show();
        var activeLayer = this.workflowDetailLayers.getActiveLayer();
        if (activeLayer.name !== this.monitorTab.name) {
            this.workflowDetailLayers.setLayer(this.monitorTab);
        }
    },

    summaryOffLblClick: function(inSender, inEvent) {
        this.showSummaryTab();
    },

    showSummaryTab: function() {
        this.monitorOnLbl.hide();
        this.summaryOnLbl.show();
        var activeLayer = this.workflowDetailLayers.getActiveLayer();
        if (activeLayer.name !== this.summaryTab.name) {
            this.workflowDetailLayers.setLayer(this.summaryTab);
        }
    },

    catalogBackBtnClick: function(inSender) {
        this.catalogLayers.setLayer(this.catalogLayer);
    },

    summaryTabShow: function(inSender) {
        this.createWorkflowInfo();
    },
    monitorTabShow: function(inSender) {
        this.createWorkflowMonitor();
    },

    enableMonitorTab: function() {
        this.monitorTab.show();
        this.monitorLblsPanel.show();
    },

    disableMonitorTab: function() {
        this.monitorTab.hide();
        this.monitorLblsPanel.hide();
    },

    /****************************** Edit Mode **********************/
    isEditMode: function() {
        return this.editModeVar.data.dataValue ? true : false;
    },

    deleteSelectedCategoriesImgClick: function(inSender) {
        var parent = this;
        app.confirm(this.i18nDeleteSelectedCategoriesMsg.caption, false, function() {
            parent.deleteSelectedCategories();
        }, function() {});
    },

    deleteSelectedCategories: function() {
        var categElements = dojo.query("li.catalog-category");
        var deletedCategoryIds = [];
        for (var i = 0; i < categElements.length; i++) {
            var categElement = categElements[i];
            if (categElement.className.indexOf("selection") !== -1) {
                deletedCategoryIds.push(categElement.id);
            }
        }

        if (deletedCategoryIds.length > 0) {
            this.deleteCategoriesService.input.setValue('categoryIds', deletedCategoryIds);
            this.deleteCategoriesService.update();
        }
    },

    deleteAllCategoriesImgClick: function(inSender) {
        var parent = this;
        app.confirm(this.i18nDeleteAllSelectedCategoriesMsg.caption, false, function() {
            parent.deleteAllCategories();
        }, function() {});
    },

    deleteAllCategories: function() {
        var categories = this.catalogModel.categories;
        var deletedCategoryIds = [];
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            deletedCategoryIds.push(category.id);
        }

        if (deletedCategoryIds.length > 0) {
            this.deleteCategoriesService.input.setValue('categoryIds', deletedCategoryIds);
            this.deleteCategoriesService.update();
        }
    },

    createNewCategoryImgClick: function(inSender) {
        this.categoryNameTxt.clear();
        this.categoryOrderTxt.setValue("dataValue", 0);
        this.currentCategoryId = null;
        this._createAddOrEditCategoryDialog(this.i18nCreateNewCategoryTitleMsg.caption);
    },

    _createAddOrEditCategoryDialog: function(title) {
        if (!this.editOrAddCategoryDialog) {
            this.editOrAddCategoryDialog = this.createComponent("editOrAddCategoryDialog", "wm.Dialog", {
                owner: this,
                corner: "tl",
                desktopHeight: "95px",
                height: "95px",
                width: "415px",
                modal: true,
                useContainerWidget: false
            });

            this.editOrAddCategoryPanel.setParent(this.editOrAddCategoryDialog);
            this.editOrAddCategoryPanel.show();
            this.editOrAddCategoryDialog.reflow();
            this.editOrAddCategoryDialog.apply = function() {};
        }

        this.editOrAddCategoryDialog.setTitle(title);
        this.editOrAddCategoryDialog.show();
    },

    submitCategoryEditBtnClick: function(inSender) {
        var categoryName = this.categoryNameTxt.dataValue;
        if (categoryName) {
            var isNameValid = this.validateCategoryName(categoryName, this.editOrAddCategoryDialog);
            if (isNameValid) {
                this.editOrAddCategoryDialog.hide();
                var order = this.categoryOrderTxt.dataValue;
                if (this.currentCategoryId) {
                    this.editCategory(categoryName, order);
                } else {
                    this.createNewCategory(categoryName, order);
                }
            }
        }
    },

    cancelCategoryEditBtnClick: function(inSender) {
        this.editOrAddCategoryDialog.hide();
        this.currentCategoryId = null;
    },

    createNewCategory: function(name, order) {
        this.categoryNameSelected = name;
        this.addCategoryService.input.setValue('name', name);
        this.addCategoryService.input.setValue('order', order);
        this.addCategoryService.update();
    },

    validateCategoryName: function(categoryName, dialog) {
        if (!categoryName) {
            app.toastError(this.i18nCategoryNameRequiredMsg.caption);
            dialog.show();
            return false;
        }

        var categories = this.catalogModel.categories;
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.id != this.currentCategoryId && category.name === categoryName) {
                app.toastError(this.i18nCategoryNameUniqueMsg.caption);
                dialog.show();
                return false;
            }
        }

        return true;
    },

    _prepareEditCategory: function(element) {
        var categoryElement = this.findParentElementLiType(element);
        var categories = this.catalogModel.categories;
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.id === categoryElement.id) {
                this.currentCategoryId = category.id;
                this.categoryNameTxt.setValue("dataValue", category.name);
                this.categoryOrderTxt.setValue("dataValue", category.order);
                this._createAddOrEditCategoryDialog(this.i18nEditCategoryTitleMsg.caption);
                break;
            }
        }
    },

    editCategory: function(newName, newOrder) {
        this.updateCategoryService.input.setValue('id', this.currentCategoryId);
        this.currentCategoryId = null;
        this.updateCategoryService.input.setValue('name', newName);
        this.categoryNameSelected = newName;
        this.updateCategoryService.input.setValue('order', newOrder);
        this.updateCategoryService.update();
    },

    editHelpImgClick: function(inSender) {
        app.alert(this.i18nEditHelpMsg.caption);
    },

    settingsImgClick: function(inSender) {
        this.editModeVar.setValue("dataValue", !this.editModeVar.data.dataValue);
    },

    addItemsImgClick: function(inSender) {
        this.createCatalogItemSelectionDialog();
    },

    createCatalogItemSelectionDialog: function() {
        if (!this.workflowItemSelectionDialog) {
            this.workflowItemSelectionDialog = this.createComponent("catalogSelectionDialog87654", "wm.Dialog", {
                owner: this,
                corner: "cc",
                desktopHeight: "90%",
                height: "90%",
                width: "95%",
                modal: true,
                useContainerWidget: false
            });

            this._createWorkflowTreeSelection();
            this.workflowSelectionPanel.setParent(this.workflowItemSelectionDialog);
            this.workflowSelectionPanel.show();
            this.workflowItemSelectionDialog.reflow();
            this.workflowItemSelectionDialog.apply = function() {};
        }
        var page = this._getCurrentPage(this.catalogTabLayers.getActiveLayer());
        this.workflowItemSelectionDialog.setTitle(this.i18nItemsSelectionDialogTitleMsg.caption + (page ? page.category.name : " "));

        if (this.configureItemsSelectionHtml) {
            this.configureItemsSelectionHtml.destroy();
        }

        if (this.editSelectionConnections) {
            dojo.forEach(this.editSelectionConnections, dojo.disconnect);
        }

        this.configureItemsSelectionHtml = this.buildCatalogPageHtml(page.catalogItems, page.category.id, this.itemsSelectionPanel);
        this.workflowItemSelectionDialog.show();

        this.editSelectionConnections = [];
        var items = dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode);
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            this.editSelectionConnections.push(dojo.connect(item, "onclick", this, "catalogSelection"));
            this.editSelectionConnections.push(dojo.connect(item, "ondblclick", this, "editSelectedItemOnDblClick"));
        }
    },

    _createWorkflowTreeSelection: function() {
        if (!this.workflowTree) {
            this.workflowTree = this.workflowTreePanel.createComponent("o11nCatalogWorkflowTree", "o11n.WorkflowTree", {
                width: "100%",
                height: "100%"
            });
            this.workflowTreeConnectLink = this.connect(this.workflowTree, "onSelect", dojo.hitch(this, "workflowSelection", this.workflowTree));
        }
    },

    _refreshWorkflowTreeSelection: function() {
        if (this.workflowTree) {
            dojo.disconnect(this.workflowTreeConnectLink);
            this.workflowTree.destroy();
            this.workflowTree = null;
            this._createWorkflowTreeSelection();
        }
    },

    workflowSelection: function(inSender, inData) {
        this.selectedWorkflowId = inData.data.data;
        this.selectedWorkflowName = inData.data.content;
        this.selectedWorkflowType = inData.data.type;
        if ("Workflow" === this.selectedWorkflowType) {
            var alreadyExists = dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).some(function(item) {
                return item.id === inData.data.data;
            });
            if (alreadyExists) {
                if (this.workflowPlacementDialog) {
                    this.workflowPlacementDialog.hide();
                }
                app.toastWarning(this.selectedWorkflowName + this.i18nWorkflowItemAlreadyExistsMsg.caption, 2000);
                return;
            }

            this._createWorkflowPlacementDialog(this.selectedWorkflowName);
        }
    },

    _createWorkflowPlacementDialog: function(title) {
        if (!this.workflowPlacementDialog) {
            this.workflowPlacementDialog = this.createComponent("catalogWorkflowPlacementDialog987654", "wm.Dialog", {
                owner: this,
                corner: "cc",
                desktopHeight: "200px",
                height: "200px",
                width: "300px",
                modal: false,
                noMinify: true,
                noMaxify: true,
                useContainerWidget: false
            });

            this.worklfowPlacementPanel.setParent(this.workflowPlacementDialog);
            this.worklfowPlacementPanel.show();
            this.workflowPlacementDialog.reflow();
            this.workflowPlacementDialog.apply = function() {};
        }
        this.defaultRadioBtn.setChecked(true);
        this.workflowPlacementDialog.setTitle(title);
        this.workflowPlacementDialog.show();
    },

    cancelItemsSelectionBtnClick: function(inSender) {
        if (this.workflowPlacementDialog) {
            this.workflowPlacementDialog.hide();
        }
        this.workflowItemSelectionDialog.hide();
        this.selectedWorkflowId = null;
        this.selectedWorkflowName = null;
    },

    submitItemsSelectionBtnClick: function(inSender) {
        if (this.workflowPlacementDialog) {
            this.workflowPlacementDialog.hide();
        }
        this.workflowItemSelectionDialog.hide();
        var activeLayer = this.catalogTabLayers.getActiveLayer();
        var page = this._getCurrentPage(activeLayer);

        if (page) {
            var catalogItemIds = dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).map(function(item) {
                return item.id;
            });

            this.updatePageService.input.setValue('categoryId', page.category.id);
            this.updatePageService.input.setValue('catalogItemIds', catalogItemIds);
            this.updatePageService.update();
        } else {
            console.log("[WorkflowCatalog][Error]: Current Catalog Page not found.");
        }
    },

    _getCurrentPage: function(layer) {
        var pages = this.catalogModel.catalogPages;
        var page = null;
        for (var i = 0; i < pages.length; i++) {
            var currPage = pages[i];
            if (layer.name === currPage.category.id) {
                page = currPage;
                break;
            }
        }

        return page;
    },

    deleteSelectedItemsImgClick: function(inSender) {
        var selectedExists = false;
        dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).forEach(function(item) {
            if (item.className.indexOf("selection") !== -1) {
                dojo.destroy(item);
                selectedExists = true;
            }
        });
        if (!selectedExists) {
            app.toastWarning(this.i18nNothingSelectedMsg.caption, 2500);
        }
    },

    editSelectedItemOnDblClick: function(inEvent) {
        var element = inEvent.target;
        var parent = this.findParentElementLiType(element);
        if (parent) {
            this._editSelectedItem(parent);
        }
    },

    editSelectedItemImgClick: function(inSender) {
        var selectedItem = null;
        dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).some(function(item) {
            if (item.className.indexOf("selection") !== -1) {
                selectedItem = item;
                return true;
            }
        });
        this._editSelectedItem(selectedItem);
    },

    _editSelectedItem: function(selectedItem) {
        if (selectedItem) {
            dojo.removeClass(selectedItem, "selection");
            this.selectedWorkflowId = selectedItem.id;
            this.selectedWorkflowName = dojo.query("span.title", selectedItem)[0].innerHTML;
            this._createWorkflowPlacementDialog(this.selectedWorkflowName);
        } else {
            app.toastWarning(this.i18nNothingSelectedMsg.caption, 2500);
        }
    },

    editCatalogHelpImgClick: function(inSender) {
        app.alert(this.i18nEditItemsHelpMsg.caption);
    },

    firstRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (!inSetByCode && inDataValue) {
            this.placeSelectedItem("first");
        }
    },

    lastRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (!inSetByCode && inDataValue) {
            this.placeSelectedItem("last");
        }
    },

    beforeRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (!inSetByCode && inDataValue) {
            var items = dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode);
            var firstSelected = 0;
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if (item.className.indexOf("selection") !== -1) {
                    firstSelected = j;
                    break;
                }
            }

            this.placeSelectedItem(firstSelected);
        }
    },

    afterRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (!inSetByCode && inDataValue) {
            var items = dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode);
            var lastSelected = items.length - 1;
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                if (item.className.indexOf("selection") !== -1) {
                    lastSelected = j;
                }
            }

            this.placeSelectedItem(lastSelected + 1);
        }
    },

    replaceRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (!inSetByCode && inDataValue) {
            var sameItem = false;
            var selectedId = this.selectedWorkflowId;
            dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).some(function(item) {
                if (item.id === selectedId && item.className.indexOf("selection") !== -1) {
                    sameItem = true;
                    return true;
                }
            });
            if (!sameItem) {
                this.beforeRadioBtnChange(inSender, inDisplayValue, inDataValue, inSetByCode);
                this.deleteSelectedItemsImgClick();
            } else {
                app.toastWarning(this.i18nReplaceNotValidMsg.caption, 2500);
            }
        }
    },

    placeSelectedItem: function(pos) {
        var selectedItem = null;
        var selectedId = this.selectedWorkflowId;
        dojo.query("li.workflow-catalog", this.configureItemsSelectionHtml.domNode).some(function(item) {
            if (item.id === selectedId) {
                selectedItem = item;
                return true;
            }
        });
        var toBeWired = false;
        if (!selectedItem) {
            var newItem = {
                id: this.selectedWorkflowId,
                name: this.selectedWorkflowName
            };
            selectedItem = this.buildCatalogBox(newItem);
            toBeWired = true;
        }
        var parentId = "workflow-catalog-ul-" + this.itemsSelectionPanel.id;
        selectedItem = dojo.place(selectedItem, parentId, pos);

        this.loadItemIcons([selectedItem.id], selectedItem.id);
        this.workflowPlacementDialog.hide();

        if (toBeWired) {
            this.editSelectionConnections.push(dojo.connect(selectedItem, "onclick", this, "catalogSelection"));
            this.editSelectionConnections.push(dojo.connect(selectedItem, "ondblclick", this, "editSelectedItemOnDblClick"));
        }
    },

    _end: 0
});