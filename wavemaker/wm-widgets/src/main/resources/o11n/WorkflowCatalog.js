dojo.provide("common.packages.o11n.WorkflowCatalog");
 
dojo.declare("o11n.WorkflowCatalog", wm.Composite, {
  horizontalAlign: "center",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
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
        this.components.catalogModelService.update();
        if (!this.components.editModeVar.data.dataValue) {
            this.components.userAdminService.update();
        }
    },

    resetToCatalogLayer: function() {
        var activeLayer = this.components.catalogLayers.getActiveLayer();
        if (activeLayer && activeLayer.name !== this.catalogLayer.name) {
            this.components.catalogLayers.setLayer(this.catalogLayer);
        }
    },

    catalogModelServiceSuccess: function(inSender, inDeprecated) {
        this.components.loadingPanel.hide();
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
        this.components.refreshCatalogService.update();
        this._refreshWorkflowTreeSelection();
    },

    searchChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        console.log("[WorkflowCatalog]: search for:  " + inDataValue);
        if (inDataValue) {
            this.components.searchCatalogService.input.setValue('searchTerm', inDataValue);
            this.components.searchCatalogService.update();
        } else {
            this.buildCatalog(this.catalogModel);
        }
    },

    searchCatalogServiceSuccess: function(inSender, inDeprecated) {
        this.clearLayers();
        var resultPage = inSender.getData();
        var category = resultPage.category;
        if (resultPage.catalogItems && resultPage.catalogItems.length > 0) {
            category.name = this.components.i18nSearchResultCategoryMsg.caption;
        } else {
            category.name = this.components.i18nNoSearchResultCategoryMsg.caption;
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
        this.components.htmlCategories.setHtml(buf.join(''));

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
            this.components.catalogLayers.setLayer(this.components.workflowDetailsLayer);
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
        buf[buf.length] = this.components.i18nRunWorkflowMsg.caption;
        buf[buf.length] = '"/><img id="';
        buf[buf.length] = this.infoImgPrefixId;
        buf[buf.length] = item.id;
        buf[buf.length] = '" style="margin-bottom: 2px;" width="16px" height="16px" src="resources/images/o11n/info_24x.png" title="';
        buf[buf.length] = this.components.i18nGetWorkflowInfoMsg.caption;
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
        this.components.loadingPanel.hide();
        this.catalogPanel.show();
    },

    createWorkflowInfo: function() {
        try {
            if (!this.workflowInfo) {
                this.workflowInfo = this.components.summaryTab.createComponent("o11nWorkflowInfoCatalog", "o11n.WorkflowInfo", {
                    width: "100%",
                    height: "100%",
                    deferDataLoad: true
                });
                this.components.summaryTabLoadingImg.hide();
                this.components.summaryTab.reflow();
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
                this.workflowRuns = this.components.monitorTab.createComponent("o11nWorkflowRunsCatalog", "o11n.WorkflowRuns", {
                    width: "100%",
                    height: "100%",
                    executionsPerWorkflow: true,
                    workflowId: this.currentWorkflowId,
                    deferDataLoad: true
                });
                this.components.monitorTabLoadingImg.hide();
                this.components.monitorTab.reflow();
            }
            this.workflowRuns.load(this.currentWorkflowId);
        } catch (e) {
            this.serviceError(e);
        }
    },

    createWorkflowPresentation: function() {
        if (!this.presentation) {
            this.presentation = this.components.presentationRootPanel.createComponent("o11nPresentationCatalog", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                workflowId: this.currentWorkflowId
            });
            this.components.presentationRootPanel.reflow();
        } else {
            this.presentation.workflowId = this.currentWorkflowId;
            this.presentation.start();
        }
    },

    monitorOffLblClick: function(inSender, inEvent) {
        this.showMontiorTab();
    },

    showMontiorTab: function() {
        this.components.summaryOnLbl.hide();
        this.monitorOnLbl.show();
        var activeLayer = this.components.workflowDetailLayers.getActiveLayer();
        if (activeLayer.name !== this.components.monitorTab.name) {
            this.components.workflowDetailLayers.setLayer(this.components.monitorTab);
        }
    },

    summaryOffLblClick: function(inSender, inEvent) {
        this.showSummaryTab();
    },

    showSummaryTab: function() {
        this.monitorOnLbl.hide();
        this.components.summaryOnLbl.show();
        var activeLayer = this.components.workflowDetailLayers.getActiveLayer();
        if (activeLayer.name !== this.components.summaryTab.name) {
            this.components.workflowDetailLayers.setLayer(this.components.summaryTab);
        }
    },

    catalogBackBtnClick: function(inSender) {
        this.components.catalogLayers.setLayer(this.catalogLayer);
    },

    summaryTabShow: function(inSender) {
        this.createWorkflowInfo();
    },
    monitorTabShow: function(inSender) {
        this.createWorkflowMonitor();
    },

    enableMonitorTab: function() {
        this.components.monitorTab.show();
        this.components.monitorLblsPanel.show();
    },

    disableMonitorTab: function() {
        this.components.monitorTab.hide();
        this.components.monitorLblsPanel.hide();
    },

    /****************************** Edit Mode **********************/
    isEditMode: function() {
        return this.components.editModeVar.data.dataValue ? true : false;
    },

    deleteSelectedCategoriesImgClick: function(inSender) {
        var parent = this;
        app.confirm(this.components.i18nDeleteSelectedCategoriesMsg.caption, false, function() {
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
            this.components.deleteCategoriesService.input.setValue('categoryIds', deletedCategoryIds);
            this.components.deleteCategoriesService.update();
        }
    },

    deleteAllCategoriesImgClick: function(inSender) {
        var parent = this;
        app.confirm(this.components.i18nDeleteAllSelectedCategoriesMsg.caption, false, function() {
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
            this.components.deleteCategoriesService.input.setValue('categoryIds', deletedCategoryIds);
            this.components.deleteCategoriesService.update();
        }
    },

    createNewCategoryImgClick: function(inSender) {
        this.components.categoryNameTxt.clear();
        this.components.categoryOrderTxt.setValue("dataValue", 0);
        this.currentCategoryId = null;
        this._createAddOrEditCategoryDialog(this.components.i18nCreateNewCategoryTitleMsg.caption);
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

            this.components.editOrAddCategoryPanel.setParent(this.editOrAddCategoryDialog);
            this.components.editOrAddCategoryPanel.show();
            this.editOrAddCategoryDialog.reflow();
            this.editOrAddCategoryDialog.apply = function() {};
        }

        this.editOrAddCategoryDialog.setTitle(title);
        this.editOrAddCategoryDialog.show();
    },

    submitCategoryEditBtnClick: function(inSender) {
        var categoryName = this.components.categoryNameTxt.dataValue;
        if (categoryName) {
            var isNameValid = this.validateCategoryName(categoryName, this.editOrAddCategoryDialog);
            if (isNameValid) {
                this.editOrAddCategoryDialog.hide();
                var order = this.components.categoryOrderTxt.dataValue;
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
        this.components.addCategoryService.input.setValue('name', name);
        this.components.addCategoryService.input.setValue('order', order);
        this.components.addCategoryService.update();
    },

    validateCategoryName: function(categoryName, dialog) {
        if (!categoryName) {
            app.toastError(this.components.i18nCategoryNameRequiredMsg.caption);
            dialog.show();
            return false;
        }

        var categories = this.catalogModel.categories;
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.id != this.currentCategoryId && category.name === categoryName) {
                app.toastError(this.components.i18nCategoryNameUniqueMsg.caption);
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
                this.components.categoryNameTxt.setValue("dataValue", category.name);
                this.components.categoryOrderTxt.setValue("dataValue", category.order);
                this._createAddOrEditCategoryDialog(this.components.i18nEditCategoryTitleMsg.caption);
                break;
            }
        }
    },

    editCategory: function(newName, newOrder) {
        this.components.updateCategoryService.input.setValue('id', this.currentCategoryId);
        this.currentCategoryId = null;
        this.components.updateCategoryService.input.setValue('name', newName);
        this.categoryNameSelected = newName;
        this.components.updateCategoryService.input.setValue('order', newOrder);
        this.components.updateCategoryService.update();
    },

    editHelpImgClick: function(inSender) {
        app.alert(this.components.i18nEditHelpMsg.caption);
    },

    settingsImgClick: function(inSender) {
        this.components.editModeVar.setValue("dataValue", !this.components.editModeVar.data.dataValue);
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
            this.components.workflowSelectionPanel.setParent(this.workflowItemSelectionDialog);
            this.components.workflowSelectionPanel.show();
            this.workflowItemSelectionDialog.reflow();
            this.workflowItemSelectionDialog.apply = function() {};
        }
        var page = this._getCurrentPage(this.catalogTabLayers.getActiveLayer());
        this.workflowItemSelectionDialog.setTitle(this.components.i18nItemsSelectionDialogTitleMsg.caption + (page ? page.category.name : " "));

        if (this.configureItemsSelectionHtml) {
            this.configureItemsSelectionHtml.destroy();
        }

        if (this.editSelectionConnections) {
            dojo.forEach(this.editSelectionConnections, dojo.disconnect);
        }

        this.configureItemsSelectionHtml = this.buildCatalogPageHtml(page.catalogItems, page.category.id, this.components.itemsSelectionPanel);
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
            this.workflowTree = this.components.workflowTreePanel.createComponent("o11nCatalogWorkflowTree", "o11n.WorkflowTree", {
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
                app.toastWarning(this.selectedWorkflowName + this.components.i18nWorkflowItemAlreadyExistsMsg.caption, 2000);
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

            this.components.worklfowPlacementPanel.setParent(this.workflowPlacementDialog);
            this.components.worklfowPlacementPanel.show();
            this.workflowPlacementDialog.reflow();
            this.workflowPlacementDialog.apply = function() {};
        }
        this.components.defaultRadioBtn.setChecked(true);
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

            this.components.updatePageService.input.setValue('categoryId', page.category.id);
            this.components.updatePageService.input.setValue('catalogItemIds', catalogItemIds);
            this.components.updatePageService.update();
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
            app.toastWarning(this.components.i18nNothingSelectedMsg.caption, 2500);
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
            app.toastWarning(this.components.i18nNothingSelectedMsg.caption, 2500);
        }
    },

    editCatalogHelpImgClick: function(inSender) {
        app.alert(this.components.i18nEditItemsHelpMsg.caption);
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
                app.toastWarning(this.components.i18nReplaceNotValidMsg.caption, 2500);
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
        var parentId = "workflow-catalog-ul-" + this.components.itemsSelectionPanel.id;
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
 
o11n.WorkflowCatalog.components = {
	catalogModelService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowCatalog","service":"CatalogService"}, {"onError":"catalogModelServiceError","onSuccess":"catalogModelServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getWorkflowCatalogInputs"}, {}],
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}]
	}],
	searchCatalogService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"searchCatalog","service":"CatalogService"}, {"onError":"searchCatalogServiceError","onSuccess":"searchCatalogServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"searchCatalogInputs"}, {}]
	}],
	editModeVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	hideWorkflowRunsVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	userAdminService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"isCurrentUserInAdminRole","service":"vCOGeneralService"}, {"onError":"userAdminServiceError"}, {
		input: ["wm.ServiceInput", {"type":"isCurrentUserInAdminRoleInputs"}, {}]
	}],
	addCategoryService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"addCategory","service":"CatalogService"}, {"onError":"addCategoryServiceError","onSuccess":"addCategoryServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"addCategoryInputs"}, {}]
	}],
	updateCategoryService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"updateCategory","service":"CatalogService"}, {"onError":"updateCategoryServiceError","onSuccess":"updateCategoryServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updateCategoryInputs"}, {}]
	}],
	deleteCategoriesService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"deleteCategories","service":"CatalogService"}, {"onError":"deleteCategoriesServiceError","onSuccess":"deleteCategoriesServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"deleteCategoriesInputs"}, {}]
	}],
	updatePageService: ["wm.ServiceVariable", {"inFlightBehavior":"executeAll","operation":"updatePage","service":"CatalogService"}, {"onError":"updatePageServiceError","onSuccess":"updatePageServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updatePageInputs"}, {}]
	}],
	refreshCatalogService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"refreshCatalog","service":"CatalogService"}, {"onError":"refreshCatalogServiceError","onSuccess":"refreshCatalogServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"catalogPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"refreshCatalogInputs"}, {}]
	}],
	i18nMsgPanel: ["wm.Panel", {"height":"1px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"30px"}, {}, {
		i18nCategoryNameUniqueMsg: ["wm.Label", {"caption":"Category name should be unique.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nCategoryNameRequiredMsg: ["wm.Label", {"caption":"Category name should not be empty.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nDeleteAllSelectedCategoriesMsg: ["wm.Label", {"caption":"Are you sure you want to delete ALL categories and All catalog pages?","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nDeleteSelectedCategoriesMsg: ["wm.Label", {"caption":"Are you sure you want to delete all selected categories?","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nRunWorkflowMsg: ["wm.Label", {"caption":"Run a workflow","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nGetWorkflowInfoMsg: ["wm.Label", {"caption":"workflow info","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nSearchResultCategoryMsg: ["wm.Label", {"caption":"Search Results","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nNoSearchResultCategoryMsg: ["wm.Label", {"caption":"No Search Results","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nEditHelpMsg: ["wm.Label", {"caption":"<b>Edit Categories Operations:</b> <br> - <b>Press '+'</b> to add new Category. <br> - <b>Press red 'x'</b> to delete all selected categories. <br>   (<b>note:</b> to select multiple categories use 'SHIFT' or 'CTRL' and click on multiple category elements.)<br> - <b>Press gray 'x'</b> to delete ALL categories. <br> (<b>note:</b> deleting a category also deletes all category items on the right side configured for that category. Basically, confirming delete all categories clears the whole catalog.)<br> - <b>'Double Click'</b> on a category in order to edit the name of the category.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nItemsSelectionDialogTitleMsg: ["wm.Label", {"caption":"Configure workflow items for category:   ","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nNothingSelectedMsg: ["wm.Label", {"caption":"Nothing selected. At least one item should be selected first.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nWorkflowItemAlreadyExistsMsg: ["wm.Label", {"caption":" workflow already presented.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nReplaceNotValidMsg: ["wm.Label", {"caption":"Can't replace the same selected item.","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nEditItemsHelpMsg: ["wm.Label", {"caption":"<b>Edit Workflow Items:</b> <br> - <b>Select a workflow item</b> (from the workflow tree navigation on the right) to add a new workflow item.  <br>   (<b>note:</b> a popup window with placement choices will show after the selection. Refer to the help there for more information about the placement options.)<br> - <b>Click on the 'Edit' icon</b> (a workflow item should be selected firs) <b>or 'Double Click'</b> on a workflow item to edit the order of the workflow item in the page. <br>   (<b>note:</b> a popup window with placement choices will show. Refer to the help there for more information about the placement options.) <br> - <b>Click on the red 'x' icon</b> to delete the selected categories. <br>   (<b>note:</b> to select multiple categories use 'SHIFT' or 'CTRL' and click on multiple category elements.)<br> - <b>Note:</b> All changes can be reverted by pressing the 'Cancel' button since nothing is persisted until the 'Ok' button is pressed. ","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nCreateNewCategoryTitleMsg: ["wm.Label", {"caption":"Create New Category","height":"1px","padding":"4","showing":false,"width":"1px"}, {}],
		i18nEditCategoryTitleMsg: ["wm.Label", {"caption":"Edit Category","height":"1px","padding":"4","showing":false,"width":"1px"}, {}]
	}],
	workflowSelectionPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
		workflowTreePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"250px"}, {}],
		splitter1: ["wm.Splitter", {"height":"100%","styles":{"backgroundColor":"#999999","color":"#ff"},"width":"4px"}, {}],
		pageItemSelectionPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			selectionHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#eeeeee","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
				editCatalogPagePanel1: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","verticalAlign":"middle","width":"100%"}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"${editModeVar.dataValue}?true:false;","targetProperty":"showing"}, {}]
					}],
					editSelectedItemImg: ["wm.Picture", {"aspect":"h","height":"15px","hint":"edit placement of selected workflow item","source":"resources/images/o11n/edit.png","width":"15px"}, {"onclick":"editSelectedItemImgClick"}],
					separator13: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}],
					deleteSelectedItemsImg: ["wm.Picture", {"aspect":"h","height":"18px","hint":"delete selected workflow items","source":"resources/images/o11n/delete_24.png","width":"18px"}, {"onclick":"deleteSelectedItemsImgClick"}],
					separator14: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}],
					editCatalogHelpImg: ["wm.Picture", {"aspect":"h","height":"16px","hint":undefined,"source":"resources/images/o11n/grayhelp.png","width":"16px"}, {"onclick":"editCatalogHelpImgClick"}],
					separator15: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}]
				}]
			}],
			itemsSelectionPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}],
			selectionBtnsPanel: ["wm.Panel", {"border":"1","borderColor":"#dddddd","height":"34px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				cancelItemsSelectionBtn: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"cancelItemsSelectionBtnClick"}],
				submitItemsSelectionBtn: ["wm.Button", {"caption":"Submit","margin":"4"}, {"onclick":"submitItemsSelectionBtnClick"}]
			}]
		}]
	}],
	worklfowPlacementPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
		selectionPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
			label3: ["wm.Label", {"align":"right","caption":"Choose Placement Position:","padding":"4","styles":{"fontWeight":"bold"},"width":"180px"}, {}],
			firstRadioBtn: ["wm.RadioButton", {"caption":"First","captionSize":"120px","dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will be placed before all other workflow items.","radioGroup":"workflowSelection"}, {"onchange":"firstRadioBtnChange"}],
			beforeRadioBtn: ["wm.RadioButton", {"caption":"Before Selected","captionSize":"120px","dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will be placed before the first selected item.","radioGroup":"workflowSelection","width":"178px"}, {"onchange":"beforeRadioBtnChange"}],
			replaceRadioBtn: ["wm.RadioButton", {"caption":"Replace Selected","captionSize":"120px","dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will replace the currently selected items.","radioGroup":"workflowSelection","width":"178px"}, {"onchange":"replaceRadioBtnChange"}],
			afterRadioBtn: ["wm.RadioButton", {"caption":"After Selected","captionSize":"120px","dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will be placed after the last selected item.","radioGroup":"workflowSelection","width":"178px"}, {"onchange":"afterRadioBtnChange"}],
			lastRadioBtn: ["wm.RadioButton", {"caption":"Last","captionSize":"120px","dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will be placed at the end.","radioGroup":"workflowSelection","width":"178px"}, {"onchange":"lastRadioBtnChange"}],
			defaultRadioBtn: ["wm.RadioButton", {"caption":"Last","captionSize":"120px","dataType":"boolean","displayValue":true,"emptyValue":"false","groupValue":true,"helpText":"The workflow item will be placed at the end.","radioGroup":"workflowSelection","showing":false,"startChecked":true,"width":"178px"}, {}]
		}]
	}],
	editOrAddCategoryPanel: ["wm.Panel", {"height":"66px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"410px"}, {}, {
		panel3: ["wm.Panel", {"height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			categoryNameTxt: ["wm.Text", {"caption":"Name:","captionSize":"58px","dataValue":undefined,"displayValue":"","helpText":"The name of the category. It should be unique among the other categories.","maxChars":"144","placeHolder":"category name ...","required":true}, {}],
			categoryOrderTxt: ["wm.Number", {"caption":"Order: ","captionAlign":"left","captionSize":"44px","dataValue":0,"displayValue":"0","emptyValue":"zero","helpText":"The order for the category placement. Default value of '0' will allow for alphabetical order by category name. Order '1' will be the first position. Negative numbers are also allowed.","maximum":10000,"minimum":-10000,"required":true,"width":"105px"}, {}]
		}],
		panel7: ["wm.Panel", {"borderColor":"","height":"40px","horizontalAlign":"right","layoutKind":"left-to-right","margin":"3,5,0,0","verticalAlign":"bottom","width":"100%"}, {}, {
			cancelCategoryEditBtn: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"cancelCategoryEditBtnClick"}],
			submitCategoryEditBtn: ["wm.Button", {"caption":"Submit","margin":"4"}, {"onclick":"submitCategoryEditBtnClick"}]
		}]
	}],
	loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
		loadingCatalogImg: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
	}],
	catalogPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
		catalogCategoriesPanel: ["wm.Panel", {"border":"1","borderColor":"#eeeeee","fitToContentWidth":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"202px"}, {}, {
			editCategoryPanel: ["wm.Panel", {"border":"1","borderColor":"#eeeeee","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,4,0","minWidth":200,"styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":"${editModeVar.dataValue}?true:false;","targetProperty":"showing"}, {}]
				}],
				panel8: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","verticalAlign":"middle","width":"100%"}, {}, {
					createNewCategoryImg: ["wm.Picture", {"aspect":"h","height":"18px","hint":"add new category","source":"resources/images/o11n/add_24.png","width":"18px"}, {"onclick":"createNewCategoryImgClick"}],
					separator9: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}],
					deleteSelectedCategoriesImg: ["wm.Picture", {"aspect":"h","height":"18px","hint":"delete selected categories","source":"resources/images/o11n/delete_24.png","width":"18px"}, {"onclick":"deleteSelectedCategoriesImgClick"}],
					separator10: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}],
					panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						deleteAllCategoriesImg: ["wm.Picture", {"aspect":"h","height":"16px","hint":"clear all categories and catalog pages","source":"resources/images/o11n/state_error.png","width":"16px"}, {"onclick":"deleteAllCategoriesImgClick"}],
						separator11: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"3px"}, {}],
						editHelpImg: ["wm.Picture", {"aspect":"h","height":"16px","hint":undefined,"source":"resources/images/o11n/grayhelp.png","width":"16px"}, {"onclick":"editHelpImgClick"}]
					}]
				}]
			}],
			htmlCategories: ["wm.Html", {"autoSizeWidth":true,"borderColor":"","height":"100%","minDesktopHeight":150,"minHeight":150,"width":"2px"}, {}]
		}],
		catalogLayers: ["wm.Layers", {"transition":"slide"}, {}, {
			catalogLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				catalogTabLayersPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					panel5: ["wm.Panel", {"border":"1","borderColor":"#eeeeee","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
						label1: ["wm.Label", {"borderColor":"","caption":"Workflow Catalog","margin":"0,0,0,22","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"157px"}, {}],
						panel6: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
							panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
								presentationRootPanel: ["wm.Panel", {"height":"1px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"1px"}, {}],
								workflowSelectionRootPanel: ["wm.Panel", {"height":"1px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"1px"}, {}],
								editCatalogPagePanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","verticalAlign":"middle","width":"100%"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":"${editModeVar.dataValue}?true:false;","targetProperty":"showing"}, {}]
									}],
									separator16: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"9px"}, {}],
									addItemsImg: ["wm.Picture", {"aspect":"h","height":"18px","hint":"configure workflow items for current category","source":"resources/images/o11n/serviceVar_16.png","width":"18px"}, {"onclick":"addItemsImgClick"}],
									separator12: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"0","styles":{"color":"#dddddd"},"width":"5px"}, {}],
									panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}]
								}]
							}],
							search: ["wm.Text", {"borderColor":"","caption":"Search:","captionSize":"52px","desktopHeight":"23px","displayValue":"","emptyValue":"null","height":"23px","helpText":undefined,"maxHeight":0,"mobileHeight":"20%","placeHolder":"by name, category or desc...","resetButton":true,"selectOnClick":true,"width":"250px"}, {"onchange":"searchChange"}],
							separator6: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"4","styles":{"color":"#eeeeee"},"width":"10px"}, {}],
							refreshImg: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"refreshImgClick"}],
							separator7: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"4","styles":{"color":"#eeeeee"},"width":"10px"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"userAdminService.dataValue","targetProperty":"showing"}, {}]
								}]
							}],
							settingsImg: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"configure catalog","source":"resources/images/o11n/settings.png","width":"16px"}, {"onclick":"settingsImgClick"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"userAdminService.dataValue","targetProperty":"showing"}, {}]
								}]
							}],
							separator8: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"4","width":"10px"}, {}]
						}]
					}],
					catalogTabLayers: ["wm.Layers", {"_classes":{"domNode":["catalog-tabs"]},"border":"1","borderColor":"#eeeeee","margin":"0,4,0,4","styles":{"backgroundColor":""},"transition":"fade"}, {}]
				}]
			}],
			workflowDetailsLayer: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
				workflowDetailsPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","margin":"0,4,0,4","verticalAlign":"top","width":"100%"}, {}, {
					workflowDetailsHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#eeeeee","height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						catalogBackBtn: ["wm.MobileIconButton", {"_classes":{"domNode":["back-button"]},"border":"0","borderColor":"","desktopHeight":"28px","direction":"back","height":"28px","hint":undefined,"iconMargin":"0","margin":"-3,0,0,-7","width":"62px"}, {"onclick":"catalogBackBtnClick"}],
						summaryOnLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#D2D2D2","caption":"Summary","height":"30px","padding":"4","styles":{"fontWeight":"bold","backgroundGradient":""},"width":"82px"}, {}],
						summaryOffLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#D2D2D2","height":"30px","padding":"4","styles":{"fontWeight":"bold","backgroundGradient":{"direction":"horizontal","startColor":"#FDFDFD","endColor":"#EDEDED","colorStop":86}},"width":"82px"}, {"onclick":"summaryOffLblClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"summaryOnLbl.caption","targetProperty":"caption"}, {}],
								wire1: ["wm.Wire", {"expression":"!${summaryOnLbl.showing}","targetProperty":"showing"}, {}]
							}]
						}],
						spacer1: ["wm.Spacer", {"height":"100%","width":"1px"}, {}],
						monitorLblsPanel: ["wm.Panel", {"height":"32px","horizontalAlign":"left","verticalAlign":"top","width":"82px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"!${hideWorkflowRunsVar.dataValue}","targetProperty":"showing"}, {}]
							}],
							monitorOffLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#D2D2D2","height":"30px","padding":"4","styles":{"fontWeight":"bold","backgroundGradient":{"direction":"horizontal","startColor":"#FDFDFD","endColor":"#EDEDED","colorStop":86}},"width":"100%"}, {"onclick":"monitorOffLblClick"}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"monitorOnLbl.caption","targetProperty":"caption"}, {}],
									wire1: ["wm.Wire", {"expression":"!${monitorOnLbl.showing}","targetProperty":"showing"}, {}]
								}]
							}],
							monitorOnLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#D2D2D2","caption":"Runs","height":"30px","padding":"4","showing":false,"styles":{"fontWeight":"bold","backgroundGradient":""},"width":"82px"}, {}]
						}]
					}],
					workflowDetailLayers: ["wm.Layers", {"margin":"3,0,0,0","transition":"fade"}, {}, {
						summaryTab: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","themeStyleType":"","verticalAlign":"middle"}, {"onShow":"summaryTabShow"}, {
							summaryTabLoadingImg: ["wm.Picture", {"height":"30px","source":"resources/images/o11n/workingBar.gif"}, {}]
						}],
						monitorTab: ["wm.Layer", {"borderColor":"","caption":"layer1","horizontalAlign":"center","themeStyleType":"","verticalAlign":"middle"}, {"onShow":"monitorTabShow"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"!${hideWorkflowRunsVar.dataValue}","targetProperty":"showing"}, {}]
							}],
							monitorTabLoadingImg: ["wm.Picture", {"height":"30px","source":"resources/images/o11n/workingBar.gif"}, {}]
						}]
					}]
				}]
			}]
		}]
	}]}
 
wm.publish(o11n.WorkflowCatalog, [
	["editMode", "editModeVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}],
	["hideWorkflowRuns", "hideWorkflowRunsVar.dataValue", {group: "Published", bindSource: true, bindTarget: true}]
]);
 
wm.registerPackage(["vCO Widgets", "WorkflowCatalog", "o11n.WorkflowCatalog", "common.packages.o11n.WorkflowCatalog", "images/wm/widget.png", "List of workflows grouped by categories and dispayed in form of a catalog.", {width: "100%", height: "100%"},false]);