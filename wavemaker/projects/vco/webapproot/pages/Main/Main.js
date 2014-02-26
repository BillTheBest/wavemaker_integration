var menu_label_selected = "menu_label_selected";
var side_menu_label_selected = "sideMenuSelected";
dojo.declare("Main", wm.Page, {
    "preferredDevice": "desktop",
    comps: {},
    selectedWorkflow: {},
    currentWorkflowId: null,
    currentWorkflowName: null,
    currentWorkflowType: null,
    executionStateFilter: null,

    start: function() {
        var userInteractionId = this.getParam("userInteractionId");
        if (userInteractionId) {
            this.showOnlyAnswerPage(userInteractionId);
        } else {
            this.adminService.update();
            this.loadPageConfigService.update();
            var config = {
                home: {},
                tree: {},
                list: {},
                catalog: {},
                interactions: {},
                runs: {},
                recent: {}
            };
            this.pageConfigVar.setValue("dataValue", config);
        }
    },

    showOnlyAnswerPage: function(userInteractionId) {
        this.TwoColumns.hide();
        this.answerUserInteractionPanel.show();
        this.answerPageContainer.show();
       /// this.answerPageContainer.page.
    },

    handleWorkflowTreeSelect: function(inSender, inData) {
        this.storeWorkflowTreeState(inData);
        this.setStoredWorkflowTreeState();
        this.workflowPane();
    },

    storeWorkflowTreeState: function(inData) {
        this.selectedWorkflow.workflowId = inData.data.data;
        this.selectedWorkflow.workflowName = inData.data.content;
        this.selectedWorkflow.workflowType = inData.data.type;
    },

    setStoredWorkflowTreeState: function() {
        this.currentWorkflowId = this.selectedWorkflow.workflowId;
        this.currentWorkflowName = this.selectedWorkflow.workflowName;
        this.currentWorkflowType = this.selectedWorkflow.workflowType;
    },

    workflowPane: function() {
        this.workflowDetailsLayers.show();
        if (this.homeMonitorLayer.showing) {
            if (this.currentWorkflowType == "Workflow") {
                this.runsPanel.show();
            } else {
                this.runsPanel.hide();
            }
        }

        var activeLayer = this.workflowDetailsLayers.getActiveLayer();
        if (activeLayer.name === "workflow_info_tab") {
            this.createWorkflowInfo();
        } else {
            this.createWorkflowRuns();
        }
    },

    createWorkflowInfo: function() {
        if (!this.comps.workflowInfo) {
            this.comps.workflowInfo = this.workflow_info_tab.createComponent("o11nWorkflowInfo", "o11n.WorkflowInfo", {
                width: "100%",
                height: "100%",
                deferDataLoad: true
            });
            this.workflow_info_tab.reflow();
        }
        this.comps.workflowInfo.load(this.currentWorkflowId, this.currentWorkflowName, this.currentWorkflowType);
    },

    createWorkflowRuns: function() {
        if (!this.currentWorkflowId || this.currentWorkflowType != "Workflow") {
            return;
        }
        try {

            if (!this.comps.workflowRuns) {
                this.comps.workflowRuns = this.runsPerWfRootPanel.createComponent("o11nWorkflowRuns", "o11n.WorkflowRuns", {
                    width: "100%",
                    height: "100%",
                    executionsPerWorkflow: true,
                    workflowId: this.currentWorkflowId,
                    deferDataLoad: true
                });
                this.runsPerWfRootPanel.reflow();
                this.loadingRunsPerWfImg.hide();
                this.runsPerWfRootPanel.show();
            }
            this.comps.workflowRuns.load(this.currentWorkflowId);
        } catch (e) {
            console.error('ERROR IN createWorkflowRuns: ' + e);
        }
    },

    homeIconClick: function(inSender) {
        if (this._getConfig().initial) {
            this.mainLayers.setLayer(this._getConfig().initial + "Layer");
        } else {
            this.home_buttonClick();
        }
    },

    home_buttonClick: function(inSender) {
        if (this.homeMenu.showing) {
            this.mainLayers.setLayerIndex(0);
        }
    },

    workflows_buttonClick: function(inSender) {
        if (this.workflowCatalogMenu.showing) {
            this.mainLayers.setLayerIndex(4);
        } else if (this.workflowTreeMenu.showing) {
            this.mainLayers.setLayerIndex(2);
        } else if (this.workflowListMenu.showing) {
            this.mainLayers.setLayerIndex(1);
        }
    },

    tasks_buttonClick: function(inSender) {
        if (this.userInteractionsMenu.showing) {
            this.mainLayers.setLayerIndex(3);
        }
    },

    mainLayersChange: function(inSender, inIndex) {
        this.workflowTreePanel.hide();
        this.toggleLeftSide(true);
        this.resetTopMenuSelection();
        this.resetSideMenuSelection();
        switch (inIndex) {
        case 1:
            //workflows list layer
            this._selectMenuItem(this.workflowListMenu, side_menu_label_selected);
            this._selectMenuItem(this.operation_menu, menu_label_selected);
            break;
        case 2:
            //workflow tree layer
            this._selectMenuItem(this.workflowTreeMenu, side_menu_label_selected);
            this._selectMenuItem(this.operation_menu, menu_label_selected);
            this._createWorkflowTree();
            this.workflowTreePanel.show();
            break;
        case 3:
            //inbox layer
            this._selectMenuItem(this.userInteractionsMenu, side_menu_label_selected);
            this._selectMenuItem(this.task_menu, menu_label_selected);
            break;
        case 4:
            //workflow catalog layer
            this._selectMenuItem(this.workflowCatalogMenu, side_menu_label_selected);
            this._selectMenuItem(this.operation_menu, menu_label_selected);
            this.toggleLeftSide(false);
            break;
        case 5:
            //admin  layer
            //nothing selected
            break;
        default:
            this._selectMenuItem(this.homeMenu, side_menu_label_selected);
            this._selectMenuItem(this.home_menu, menu_label_selected);

        }
    },

    resetSideMenuSelection: function() {
        this._resetMenuSelection(this.homeMenu, side_menu_label_selected);
        this._resetMenuSelection(this.workflowTreeMenu, side_menu_label_selected);
        this._resetMenuSelection(this.workflowListMenu, side_menu_label_selected);
        this._resetMenuSelection(this.workflowCatalogMenu, side_menu_label_selected);
        this._resetMenuSelection(this.userInteractionsMenu, side_menu_label_selected);
    },

    resetTopMenuSelection: function() {
        this._resetMenuSelection(this.home_menu, menu_label_selected);
        this._resetMenuSelection(this.operation_menu, menu_label_selected);
        this._resetMenuSelection(this.task_menu, menu_label_selected);
    },

    _resetMenuSelection: function(menuItem, selectionClass) {
        dojo.removeClass(menuItem.domNode, selectionClass);
    },

    _selectMenuItem: function(menuItem, selectionClass) {
        dojo.addClass(menuItem.domNode, selectionClass);
    },

    toggleLeftSide: function(showing) {
        this.leftSidePanel.setValue("showing", showing);
        this.menuSplitter.setValue("showing", showing);
    },

    workflow_info_tabShow: function(inSender) {
        this.createWorkflowInfo();
    },

    runsPanelShow: function(inSender) {
        this.createWorkflowRuns();
    },

    userInteractionsLayerShow: function(inSender) {
        if (!this.comps.userInteractions) {
            this.comps.userInteractions = this.userInteractionPanelRoot.createComponent("o11nUserInteractionss", "o11n.UserInteractions", {
                width: "100%",
                height: "100%",
                deferDataLoad: true
            });
            this.userInteractionPanelRoot.reflow();
            this.loadingInteractionsImg.hide();
            this.userInteractionPanelRoot.show();
            this.comps.userInteractions.load();
        }
    },

    homeSummaryLayerShow: function(inSender) {
        if (!this.comps.homeInfo) {
            this.comps.homeInfo = this.homeRootPanel.createComponent("o11nHomeInfo", "o11n.HomeInfo", {
                width: "100%",
                height: "100%",
                deferDataLoad: true
            });
            this.homeRootPanel.reflow();
            this.connect(this.comps.homeInfo, "onRunningExecutionsClick", this, "navigateToRunningExecutions");
            this.connect(this.comps.homeInfo, "onUserInteractionsClick", this, "tasks_buttonClick");
            if (this.homeInfoLoaded) {
                this.comps.homeInfo.load();
            }
        } else {
            if (!this.homeInfoLoaded) {
                this.loadingHomeImg.hide();
                this.homeRootPanel.show();
                this.comps.homeInfo.load();
                this.homeInfoLoaded = true;
            }
        }
    },

    navigateToRunningExecutions: function() {
        this._navigateToExecutions("RUNNING");
    },

    navigateToFailedExecutions: function() {
        this._navigateToExecutions("FAILED");
    },

    navigateToAllExecutions: function() {
        this._navigateToExecutions("ALL");
    },

    _navigateToExecutions: function(filter) {
        if (this.homeMonitorLayer.showing) {
            console.log("filter: " + filter);
            this.mainLayers.setLayerIndex(0);
            this.homeLayers.setLayerIndex(0);
            this.executionStateFilter = filter;
            if (this.comps.allWorkflowRuns) {
                this.comps.allWorkflowRuns.destroy();
                this.comps.allWorkflowRuns = null;
            }
            this.homeLayers.setLayerByName("homeMonitorLayer");
        }
    },

    homeMonitorLayerShow: function(inSender) {
        console.log("homeMonitorLayerShow");
        if (this.comps.allWorkflowRuns && this.executionStateFilter) {
            //reset from the running state
            this.comps.allWorkflowRuns.destroy();
            delete this.comps.allWorkflowRuns;
            this.executionStateFilter = null;
        }

        if (!this.comps.allWorkflowRuns) {
            this.comps.allWorkflowRuns = this.runsWidgetPanel.createComponent("o11nWorkflowRuns", "o11n.WorkflowRuns", {
                width: "100%",
                height: "100%",
                executionStateFilter: this.executionStateFilter,
                deferDataLoad: true
            });
            this.runsWidgetPanel.reflow();
            this.loadingRunsImg.hide();
            this.runsWidgetPanel.show();
            this.comps.allWorkflowRuns.load();
        }
    },

    workflowListLayerShow: function(inSender) {
        if (!this.comps.allWorkflows) {
            this.comps.allWorkflows = this.workflowsListRootPanel.createComponent("o11nWorkflowList", "o11n.WorkflowList", {
                width: "100%",
                height: "100%",
                deferDataLoad: true
            });
            this.connect(this.comps.allWorkflows, "onWorkflowInfoClick", dojo.hitch(this, "handleOnWorkflowInfoListClick", this.comps.allWorkflows));
            this.workflowsListRootPanel.reflow();
            this.loadingWorkflowsImg.hide();
            this.workflowsListRootPanel.show();
            this.comps.allWorkflows.load();
        }
    },

    handleOnWorkflowInfoListClick: function(inEvent, workflowId) {
        console.log("navigate to WorklfowInfo for wf id: " + workflowId);
        this.selectedWorkflow.workflowId = workflowId;
        this.selectedWorkflow.workflowType = "Workflow";
        this.selectedWorkflow.workflowName = null;
        this.mainLayers.setLayerByName("workflowTreeLayer");
        this.workflowDetailsLayers.setLayerByName("workflow_info_tab");
        this.workflowTreePanel.hide();
        this.workflowPane();
    },

    _createWorkflowTree: function() {
        if (!this.comps.workflowTree) {
            this.comps.workflowTree = this.o11nWorkflowTreePanelRoot.createComponent("o11nWorkflowTree101", "o11n.WorkflowTree", {
                width: "100%",
                height: "100%",
                deferDataLoad: true
            });
            this.connect(this.comps.workflowTree, "onSelect", dojo.hitch(this, "handleWorkflowTreeSelect", this.comps.workflowTree));
            this.o11nWorkflowTreePanelRoot.reflow();
            this.o11nWorkflowTreePanelRoot.show();
            this.comps.workflowTree.load();
        }
        this.setStoredWorkflowTreeState();
        this.workflowTreePanel.show();
    },

    workflowCatalogLayerShow: function(inSender) {
        if (!this.comps.workflowCatalog) {
            this.comps.workflowCatalog = this.workflowCatalogPanelRoot.createComponent("o11nWorkflowCatalog45", "o11n.WorkflowCatalog", {
                width: "100%",
                height: "100%",
                hideWorkflowRuns: !this.homeMonitorLayer.showing,
                deferDataLoad: true
            });

            this.workflowCatalogPanelRoot.reflow();
            this.loadingCatalogImg.hide();
            this.workflowCatalogPanelRoot.show();
            this.comps.workflowCatalog.load();
        }
    },

    _displayRecentRuns: function() {
        if (!this.comps.recentRuns) {
            var config = this._getConfig();
            var barMode = config.recent && config.recent.bar;
            var width = "230px";
            if (barMode) {
                width = "30px";
                this.rightSidePanel.setWidth("60px");
            }
            this.rightSidePanel.show();
            this.comps.recentRuns = this.rightSidePanel.createComponent("o11nRecentRuns63", "o11n.RecentRuns", {
                width: width,
                height: "100%",
                barMode: barMode,
                deferDataLoad: true
            });

            if (!this.homeMonitorLayer.showing) {
                this.comps.recentRuns.naviateToExecutionsLabel.hide();
            }
            if (!this.userInteractionsMenu.showing) {
                this.comps.recentRuns.naviateToUserInterLabel.hide();
            }
            this.connect(this.comps.recentRuns, "onRunningExecutionsClick", this, "navigateToRunningExecutions");
            this.connect(this.comps.recentRuns, "onFailedExecutionsClick", this, "navigateToFailedExecutions");
            this.connect(this.comps.recentRuns, "onAllExecutionsClick", this, "navigateToAllExecutions");
            this.connect(this.comps.recentRuns, "onUserInteractionsClick", this, "tasks_buttonClick");
            this.connect(this.comps.recentRuns, "onRecentRunsPanelSwitch", dojo.hitch(this, "switchRecentRunsPanelAdjustment", this.comps.recentRuns));
            this.rightSidePanel.reflow();
            this.loadingRecentRunsImg.hide();
            this.rightSidePanel.setWidth(width);
            this.comps.recentRuns.load();
        }
    },

    switchRecentRunsPanelAdjustment: function(inData, width) {
        console.log("*** " + width);
        this.comps.recentRuns.setWidth(width);
        this.rightSidePanel.setWidth(width);
    },

    pageConfigResetBtnClick: function(inSender) {
        this.defaultHomeRadio.setChecked(true);
        this.homeRadioAll.setChecked(true);
        this.workflowTreeRadioAll.setChecked(true);
        this.workflowListRadioAll.setChecked(true);
        this.workflowRunsRadioAll.setChecked(true);
        this.workflowCatalogRadioAll.setChecked(true);
        this.userInteractionsRadioAll.setChecked(true);
        this.recentRunsRadioAll.setChecked(true);
        this.recentRunsPanelRadio.setChecked(true);
        this.testAsUserCheckBox.setChecked(false);

        var config = this._collectPagePermissionConfig();
        var isAdmin = !this._isTestAsUserSelected();
        this._configVisibleViews(config, isAdmin);
    },

    pageConfigSaveBtnClick: function(inSender) {
        if (this.adminService.data.dataValue) {
            var config = this._getConfig();

            if (this.defaultHomeRadio.getChecked()) {
                config.initial = "home";
                this.homeRadioAll.setChecked(true);
            } else if (this.defaultWorkflowCatalogRadio.getChecked()) {
                config.initial = "workflowCatalog";
                this.workflowCatalogRadioAll.setChecked(true);
            } else if (this.defaultWorkflowListRadio.getChecked()) {
                config.initial = "workflowList";
                this.workflowListRadioAll.setChecked(true);
            } else if (this.defaultWorkflowTreeRadio.getChecked()) {
                config.initial = "workflowTree";
                this.workflowTreeRadioAll.setChecked(true);
            } else if (this.defaultUserInteractionsRadio.getChecked()) {
                config.initial = "userInteractions";
                this.userInteractionsRadioAll.setChecked(true);
            }

            this._collectPagePermissionConfig();

            this.pageConfigVar.setValue("dataValue", config);
            console.log(this._getConfig());

            var isAdmin = !this._isTestAsUserSelected();
            this._configVisibleViews(config, isAdmin);

            //store configuration on the backend (on the server and as a resource file in vCO).
            this.storePageConfigService.input.setValue('config', dojo.toJson(this._getConfig()));
            this.storePageConfigService.update();
        }
    },

    _setPageConfigUI: function(config) {
        this.homeRadioAdmin.setChecked(config.home.notAccessible);
        this.workflowTreeRadioAdmin.setChecked(config.tree.notAccessible);
        this.workflowListRadioAdmin.setChecked(config.list.notAccessible);
        this.workflowCatalogRadioAdmin.setChecked(config.catalog.notAccessible);
        this.userInteractionsRadioAdmin.setChecked(config.interactions.notAccessible);
        this.workflowRunsRadioAdmin.setChecked(config.runs.notAccessible);
        this.recentRunsRadioAdmin.setChecked(config.recent.notAccessible);
        this.recentRunsBarRadio.setChecked(config.recent.bar);

        var initalPage = config.initial;
        if (initalPage) {
            this[initalPage + "RadioAll"].setChecked(true);
            initalPage = initalPage.charAt(0).toUpperCase() + initalPage.slice(1);
            this["default" + initalPage + "Radio"].setChecked(true);
        }
    },

    _collectPagePermissionConfig: function() {
        if (this.adminService.data.dataValue) {
            var config = this._getConfig();

            config.home.notAccessible = this.homeRadioAdmin.getChecked();
            config.tree.notAccessible = this.workflowTreeRadioAdmin.getChecked();
            config.list.notAccessible = this.workflowListRadioAdmin.getChecked();
            config.catalog.notAccessible = this.workflowCatalogRadioAdmin.getChecked();
            config.interactions.notAccessible = this.userInteractionsRadioAdmin.getChecked();
            config.runs.notAccessible = this.workflowRunsRadioAdmin.getChecked();
            config.recent.notAccessible = this.recentRunsRadioAdmin.getChecked();
            config.recent.bar = this.recentRunsBarRadio.getChecked();

            return config;
        }
    },

    _isTestAsUserSelected: function() {
        return this.testAsUserCheckBox.getChecked();
    },

    _configVisibleViews: function(config, isAdmin) {
        this.homeMenu.setShowing(!config.home.notAccessible || isAdmin);
        this.home_menu.setShowing(this.homeMenu.showing);

        this.workflowTreeMenu.setShowing(!config.tree.notAccessible || isAdmin);
        this.workflowListMenu.setShowing(!config.list.notAccessible || isAdmin);
        this.workflowCatalogMenu.setShowing(!config.catalog.notAccessible || isAdmin);
        var workflowTabMenuShowing = !isAdmin && config.tree.notAccessible && config.list.notAccessible && config.catalog.notAccessible;
        this.operation_menu.setShowing(!workflowTabMenuShowing);

        this.userInteractionsMenu.setShowing(!config.interactions.notAccessible || isAdmin);
        this.task_menu.setShowing(this.userInteractionsMenu.showing);
        if (this.userInteractionsMenu.showing && this.comps.recentRuns) {
            this.comps.recentRuns.naviateToUserInterLabel.show();
        } else if (!this.userInteractionsMenu.showing && this.comps.recentRuns) {
            this.comps.recentRuns.naviateToUserInterLabel.hide();
        }

        this.rightSidePanel.setShowing(!config.recent.notAccessible || isAdmin);
        if (this.rightSidePanel.showing) {
            this._displayRecentRuns();
            if (config.recent.bar && !this.comps.recentRuns.isBarPanel) {
                this.comps.recentRuns.toggleOffPanelImgClick();
            } else if (!config.recent.bar && this.comps.recentRuns.isBarPanel) {
                this.comps.recentRuns.toggleOnPanelImgClick();
            }
        }

        var workflowRunsShowing = !config.runs.notAccessible || isAdmin;
        if (workflowRunsShowing) {
            if (!this.homeMonitorLayer.showing) {
                this.homeMonitorLayer.show();
            }
            if (this.comps.recentRuns) {
                this.comps.recentRuns.naviateToExecutionsLabel.show();
            }

            if (this.comps.workflowCatalog) {
                this.comps.workflowCatalog.enableMonitorTab();
            }
        } else {
            if (this.homeMonitorLayer.showing) {
                this.homeMonitorLayer.hide();
            }
            if (this.runsPanel.showing) {
                this.runsPanel.hide();
            }
            if (this.comps.recentRuns) {
                this.comps.recentRuns.naviateToExecutionsLabel.hide();
            }
            if (this.comps.workflowCatalog) {
                this.comps.workflowCatalog.disableMonitorTab();
            }
        }
        this.mainLayers.setDefaultLayer(config.initial + "Layer");
    },

    defaultHomeRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked()) {
            this._resetDisabledRadioBtns();
            this.homeRadioAdmin.setDisabled(true);
            this.homeRadioAll.setChecked(true);
        }
    },
    defaultWorkflowCatalogRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked()) {
            this._resetDisabledRadioBtns();
            this.workflowCatalogRadioAdmin.setDisabled(true);
            this.workflowCatalogRadioAll.setChecked(true);
        }
    },
    defaultWorkflowListRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked()) {
            this._resetDisabledRadioBtns();
            this.workflowListRadioAdmin.setDisabled(true);
            this.workflowListRadioAll.setChecked(true);
        }
    },
    defaultWorkflowTreeRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked()) {
            this._resetDisabledRadioBtns();
            this.workflowTreeRadioAdmin.setDisabled(true);
            this.workflowTreeRadioAll.setChecked(true);
        }
    },
    defaultUserInteractionsRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked()) {
            this._resetDisabledRadioBtns();
            this.userInteractionsRadioAdmin.setDisabled(true);
            this.userInteractionsRadioAll.setChecked(true);
        }
    },

    _resetDisabledRadioBtns: function() {
        this.homeRadioAdmin.setDisabled(false);
        this.workflowTreeRadioAdmin.setDisabled(false);
        this.workflowListRadioAdmin.setDisabled(false);
        this.workflowRunsRadioAdmin.setDisabled(false);
        this.workflowCatalogRadioAdmin.setDisabled(false);
        this.userInteractionsRadioAdmin.setDisabled(false);
    },

    adminServiceSuccess: function(inSender, inDeprecated) {
        //need to cordinate adminService and loadPageConfigService
        //since the data depends on each other. 
        this.adminServiceDone = true;
        var isAdmin = inSender.data.dataValue;
        console.log("Is user in admin role: " + isAdmin);

        if (this.initialConfig) {
            //if the loadPageConfigService has recieved the data, continue with initialization
            //otherwise, the loadPageConfigService will perform it with the isAdmin value already available.
            this._initPageConfiguration(this.initialConfig, isAdmin);
        }
    },

    loadPageConfigServiceSuccess: function(inSender, inDeprecated) {
        console.log("Page config loaded.");
        this.initialConfig = dojo.fromJson(inSender.data.dataValue);
        console.log(this.initialConfig);

        if (this.adminServiceDone) {
            //if the adminService has recieved the data, continue with initialization
            //otherwise, the adminServiceSuccess will perform it with the page config data already available.
            var isAdmin = this.adminService.data.dataValue;
            this._initPageConfiguration(this.initialConfig, isAdmin);
        }
    },

    _initPageConfiguration: function(config, isAdmin) {
        this._setPageConfigUI(config);
        this._configVisibleViews(config, isAdmin);
        this.pageConfigVar.setValue("dataValue", config);
        this.homeIconClick();
    },

    storePageConfigServiceSuccess: function(inSender, inDeprecated) {
        console.log(this.i18nStorePageConfigSuccessMsg.caption);
        app.toastSuccess(this.i18nStorePageConfigSuccessMsg.caption, 3000);
    },

    loadConnConfigServiceSuccess: function(inSender, inDeprecated) {
        console.log("Connection config loaded.");
        var connConfig = dojo.fromJson(inSender.data.dataValue);
        console.log(connConfig);

        this.serverInput.setDataValue(connConfig.host);
        this.portInput.setDataValue(connConfig.port);
        if (connConfig.vcoAuthMode === "sharedSession") {
            this.sharedSessionRadio.setChecked(true);
        } else {
            this.sessionPerUserRadio.setChecked(true);
        }
        this.usernameInput.setDataValue(connConfig.username);
    },

    storeConnConfigServiceSuccess: function(inSender, inDeprecated) {
        console.log(this.i18nStoreConnConfigSuccessMsg.caption);
        app.toastSuccess(this.i18nStoreConnConfigSuccessMsg.caption, 3000);
    },

    loadPageConfigServiceError: function(inSender, inError) {
        this.homeIconClick();
        this._serviceError(inError, "Load Page Config Service");
    },
    storePageConfigServiceError: function(inSender, inError) {
        this._serviceError(inError, "Store Page Config Service");
    },
    adminServiceError: function(inSender, inError) {
        this._serviceError(inError, "Admin Service");
    },

    loadConnConfigServiceError: function(inSender, inError) {
        this._serviceError(inError, "Load Conn Config Service");
    },

    storeConnConfigServiceError: function(inSender, inError) {
        this._serviceError(inError, "Store Conn Config Service");
    },

    _serviceError: function(inError, serviceName) {
        var errMsg = "[" + serviceName + "][Error]: " + inError;
        console.error(errMsg);
        app.toastError(errMsg);
    },

    _getConfig: function() {
        return this.pageConfigVar.data.dataValue;
    },

    pagePermissionsRadioBtnChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked() && !inSetByCode) {
            var config = this._collectPagePermissionConfig();
            var isAdmin = !this._isTestAsUserSelected();
            this._configVisibleViews(config, isAdmin);
        }
    },

    testAsUserCheckBoxChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        console.log("setting user role for testing to: " + inDisplayValue);
        var config = this._collectPagePermissionConfig();
        var isAdmin = !this._isTestAsUserSelected();
        this._configVisibleViews(config, isAdmin);
    },

    sessionPerUserRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked() && !inSetByCode) {
            this.usernamePasswordPanel.hide();
        }
    },
    sharedSessionRadioChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSender.getChecked() && !inSetByCode) {
            this.usernamePasswordPanel.show();
        }
    },

    sessionModeHelpImgClick: function(inSender) {
        app.alert(this.i18nConfigSessionMsg.caption, true);
    },

    saveConfigurationBtnClick: function(inSender) {
        var connConfig = {};
        if (!this.serverInput.getDataValue()) {
            app.toastError(this.i18nServerHostRequiredMsg.caption, 3000);
            return;
        }
        connConfig.host = this.serverInput.getDataValue();
        if (!this.portInput.getDataValue()) {
            app.toastError(this.i18nPortInfoRequiredMsg.caption, 3000);
            return;
        }
        connConfig.port = this.portInput.getDataValue();
        if (this.sharedSessionRadio.getChecked()) {
            connConfig.vcoAuthMode = "sharedSession";
            if (!this.usernameInput.getDataValue()) {
                app.toastError(this.i18nUsernameRequiredMsg.caption, 3000);
                return;
            }
            connConfig.username = this.usernameInput.getDataValue();
            connConfig.vcoAuthMode = "sharedSession";
            if (!this.passwordInput.getDataValue()) {
                app.toastError(this.i18nPasswordRequriedMsg.caption, 3000);
                return;
            }
            connConfig.password = this.passwordInput.getDataValue();
        } else {
            connConfig.vcoAuthMode = "sessionPerUser";
        }


        console.log(connConfig);
        this.storeConnConfigService.input.setValue('connConfig', dojo.toJson(connConfig));
        this.storeConnConfigService.update();

        this._globalReload();
    },


    connLayerShow: function(inSender) {
        if (!this.connConfigLoaded) {
            this.loadConnConfigService.update();
            this.connConfigLoaded = true;
        }
    },

    resetConfBtnClick: function(inSender) {
        this.passwordInput.setDataValue(null);
        this.loadConnConfigService.update();
    },

    _globalReload: function() {
        var h = this.comps;
        for (var k in h) {
            if (h.hasOwnProperty(k)) {
                console.log('key is: ' + k + ', value is: ' + h[k]);
                h[k].destroy();
                delete h[k];
            }
        }
        var isAdmin = this.adminService.data.dataValue;
        this._configVisibleViews(this._getConfig(), isAdmin);
    },

    getParam: function(param) {
        name = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results === null) return "";
        else return results[1];
    },

    _end: 0
});