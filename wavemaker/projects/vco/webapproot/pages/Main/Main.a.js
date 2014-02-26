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

Main.widgets = {
adminService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"isCurrentUserInAdminRole","service":"vCOGeneralService"}, {"onError":"adminServiceError","onSuccess":"adminServiceSuccess"}, {
input: ["wm.ServiceInput", {"type":"isCurrentUserInAdminRoleInputs"}, {}]
}],
pageConfigVar: ["wm.Variable", {"type":"AnyData"}, {}],
storePageConfigService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"storeAppConfig","service":"vCOGeneralService"}, {"onError":"storePageConfigServiceError","onSuccess":"storePageConfigServiceSuccess"}, {
input: ["wm.ServiceInput", {"type":"storeAppConfigInputs"}, {}],
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"adminLayer","targetProperty":"loadingDialog"}, {}]
}]
}],
loadPageConfigService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"loadAppConfig","service":"vCOGeneralService"}, {"onError":"loadPageConfigServiceError","onSuccess":"loadPageConfigServiceSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"panelnternalBorder","targetProperty":"loadingDialog"}, {}]
}],
input: ["wm.ServiceInput", {"type":"loadAppConfigInputs"}, {}]
}],
connConfigVar: ["wm.Variable", {"type":"AnyData"}, {}],
storeConnConfigService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"storeConnConfigJson","service":"vCOGeneralService"}, {"onError":"storeConnConfigServiceError","onSuccess":"storeConnConfigServiceSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"connInfoPanel","targetProperty":"loadingDialog"}, {}]
}],
input: ["wm.ServiceInput", {"type":"storeConnConfigJsonInputs"}, {}]
}],
loadConnConfigService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getConnConfigJson","service":"vCOGeneralService"}, {"onError":"loadConnConfigServiceError","onSuccess":"loadConnConfigServiceSuccess"}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"connInfoPanel","targetProperty":"loadingDialog"}, {}]
}],
input: ["wm.ServiceInput", {"type":"getConnConfigJsonInputs"}, {}]
}],
userServerData: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getRootTreeData","service":"CategoryService","startUpdate":true}, {}, {
input: ["wm.ServiceInput", {"type":"getRootTreeDataInputs"}, {}]
}],
mainLayoutBox: ["wm.Layout", {"borderColor":"","horizontalAlign":"center","styles":{"backgroundColor":""},"verticalAlign":"top"}, {}, {
i18nConfigSessionMsg: ["wm.Label", {"caption":"There are two authentication modes:<br><br> <b>1. Session per User</b> - In this authentication mode, the username/password of the user currently logged in the web application will be passed directly to the vCenter Orchestrator Server. All vCO sessions are unique per user. The user should be part of the vCenter Orchestration user groups.<br><br> <b>2. Shared session</b> - In this authentication mode, the username/password should be entered in this configuration form and will be used for all users to connect to the vCenter Orchestrator Server. The vCO session will be shared for all web applications users. The current web user is not mandatory to be part of the vCO user groups in this mode.","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nStorePageConfigSuccessMsg: ["wm.Label", {"caption":"The configuration of view settings saved succesful!","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nStoreConnConfigSuccessMsg: ["wm.Label", {"caption":"Connection settings saved successfully!","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nServerHostRequiredMsg: ["wm.Label", {"caption":"Server host is required.","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nPortInfoRequiredMsg: ["wm.Label", {"caption":"Port is required.","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nUsernameRequiredMsg: ["wm.Label", {"caption":"Username is required.","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
i18nPasswordRequriedMsg: ["wm.Label", {"caption":"Password is required.","height":"0px","padding":"4","showing":false,"width":"0px"}, {}],
panelCenter: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"center","margin":"6,6,0,6","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
panelHeader: ["wm.Panel", {"height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
picture4: ["wm.Picture", {"aspect":"h","height":"20px","source":"resources/images/logos/vmware_logo.png","width":"89px"}, {}],
label4: ["wm.Label", {"autoSizeWidth":true,"borderColor":"","caption":"vCenter Orchestrator","margin":"0,0,6,0","padding":"0","styles":{"color":"#ffffff","fontSize":"18px","fontFamily":"helvetica"},"width":"170px"}, {}],
picture1: ["wm.Picture", {"aspect":"h","height":"18px","padding":"-3,0,0,0","source":"resources/images/logos/vco.png","width":"28px"}, {}],
homeIcon: ["wm.Picture", {"height":"22px","margin":"0,0,2,0","source":"resources/images/icons/home_white.png","width":"41px"}, {"onclick":"homeIconClick"}],
panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"middle","width":"100%"}, {}, {
panel15: ["wm.Panel", {"borderColor":"","height":"24px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
user_panel: ["wm.Label", {"align":"right","padding":"0,0,14,2","styles":{"color":"#ffffff","fontSize":"12px"},"width":"100%"}, {}, {
binding: ["wm.Binding", {}, {}, {
wire: ["wm.Wire", {"expression":undefined,"source":"userServerData.dataValue","targetProperty":"caption"}, {}]
}]
}],
picture6: ["wm.Picture", {"height":"29px","margin":"-2,0,4,0","source":"resources/images/icons/white_dropdown_arrow.png","width":"18px"}, {}]
}]
}]
}],
panelBorder: ["wm.MainContentPanel", {"_classes":{"domNode":["panelBorder"]},"border":"0","borderColor":"","height":"100%","horizontalAlign":"center","styles":{"backgroundColor":"#A0C0E0"},"verticalAlign":"top","width":"100%"}, {}, {
panelnternalBorder: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"center","margin":"6,6,0,6","padding":"2,2,0,2","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
panelContent: ["wm.MainContentPanel", {"border":"0","borderColor":"#DADADA","height":"100%","horizontalAlign":"left","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
answerUserInteractionPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
answerPageContainer: ["wm.PageContainer", {"deferLoad":true,"pageName":"Answer","showing":false,"subpageEventlist":{},"subpageMethodlist":{},"subpageProplist":{}}, {}]
}],
TwoColumns: ["wm.Panel", {"autoScroll":true,"borderColor":"#dadada","height":"100%","horizontalAlign":"left","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
toolbarPanel: ["wm.Panel", {"_classes":{"domNode":["toolbar"]},"borderColor":"#DADADA","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":"#e8e8e8"},"verticalAlign":"top","width":"100%"}, {}, {
home_menu: ["wm.Label", {"_classes":{"domNode":["menu_label"]},"align":"center","borderColor":"","caption":"Home","padding":"0","styles":{"fontSize":""},"width":"96px"}, {"onclick":"home_buttonClick"}],
operation_menu: ["wm.Label", {"_classes":{"domNode":["menu_label"]},"align":"center","borderColor":"","caption":"Workflows","padding":"0","styles":{"fontSize":""},"width":"96px"}, {"onclick":"workflows_buttonClick"}],
task_menu: ["wm.Label", {"_classes":{"domNode":["menu_label"]},"align":"center","borderColor":"","caption":"Inbox","height":"26px","padding":"0","styles":{"color":"","fontSize":"","fontFamily":""},"width":"96px"}, {"onclick":"tasks_buttonClick"}],
adminHeaderPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
adminSettingsImg: ["wm.Picture", {"aspect":"v","height":"19px","hint":"admin settings","source":"resources/images/o11n/settings.png","width":"19px"}, {"onclick":"adminLayer"}],
spacer1: ["wm.Spacer", {"height":"22px","width":"4px"}, {}]
}]
}],
mainBodyPanel: ["wm.Panel", {"autoScroll":true,"border":"1","borderColor":"#999999","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"color":""},"verticalAlign":"top","width":"100%"}, {}, {
leftSidePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"250px"}, {}, {
workflowTreePanel: ["wm.Panel", {"height":"300%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
workflowTreeHeader: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,0,5,0","verticalAlign":"top","width":"100%"}, {}, {
picture10: ["wm.Picture", {"aspect":"h","height":"20px","margin":"3,0,0,0","source":"resources/images/o11n/prefsInventory_32x32.png","width":"20px"}, {}],
label2: ["wm.Label", {"caption":"Workflow Library","height":"100%","padding":"4,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {}]
}],
o11nWorkflowTreePanelRoot: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}]
}],
menuPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
navigationHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
picture9: ["wm.Picture", {"height":"22px","margin":"5,0,0,0","source":"resources/images/o11n/workflow-palette-16x16.png","width":"22px"}, {}],
label3: ["wm.Label", {"caption":"Navigation","height":"100%","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {}]
}],
navigationSideMenuPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
homeMenu: ["wm.Label", {"_classes":{"domNode":["sideMenu"]},"caption":"Home","height":"26px","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"homeLayer"}],
workflowTreeMenu: ["wm.Label", {"_classes":{"domNode":["sideMenu"]},"caption":"Workflow Tree","height":"26px","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"workflowTreeLayer"}],
workflowListMenu: ["wm.Label", {"_classes":{"domNode":["sideMenu"]},"caption":"Workflow List","height":"26px","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"workflowListLayer"}],
workflowCatalogMenu: ["wm.Label", {"_classes":{"domNode":["sideMenu"]},"caption":"Workflow Catalog","height":"26px","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"workflowCatalogLayer"}],
userInteractionsMenu: ["wm.Label", {"_classes":{"domNode":["sideMenu"]},"caption":"User Interactions","height":"26px","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {"onclick":"userInteractionsLayer"}]
}]
}]
}],
menuSplitter: ["wm.Splitter", {"height":"100%","styles":{"backgroundColor":"#c0c0c0","color":"#c0c0c0"},"width":"4px"}, {}],
mainLayersPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
mainLayers: ["wm.Layers", {"borderColor":"#fbfbfb","defaultLayer":6,"transition":"fade"}, {"onchange":"mainLayersChange"}, {
homeLayer: ["wm.Layer", {"autoScroll":true,"borderColor":"","caption":" ","horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
homeLayers: ["wm.TabLayers", {"defaultLayer":0}, {}, {
homeSummaryLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Summary","horizontalAlign":"center","themeStyleType":"ContentPanel","verticalAlign":"middle"}, {"onShow":"homeSummaryLayerShow"}, {
homeRootPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingHomeImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}],
homeMonitorLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Runs","horizontalAlign":"center","themeStyleType":"ContentPanel","verticalAlign":"middle"}, {"onShow":"homeMonitorLayerShow"}, {
runsWidgetPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingRunsImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}]
}]
}],
workflowListLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"center","themeStyleType":"","verticalAlign":"middle"}, {"onShow":"workflowListLayerShow"}, {
workflowsListRootPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingWorkflowsImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}],
workflowTreeLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
workflowDetailsLayers: ["wm.TabLayers", {"defaultLayer":0,"headerHeight":"31px","margin":"0","styles":{"textAlign":"left"},"transition":"fade"}, {}, {
workflow_info_tab: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Summary","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflow_info_tabShow"}],
runsPanel: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Runs","horizontalAlign":"center","showing":false,"themeStyleType":"ContentPanel","verticalAlign":"middle"}, {"onShow":"runsPanelShow"}, {
runsPerWfRootPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingRunsPerWfImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"100%"}, {}]
}]
}]
}],
userInteractionsLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"center","themeStyleType":"","verticalAlign":"middle"}, {"onShow":"userInteractionsLayerShow"}, {
userInteractionPanelRoot: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingInteractionsImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}],
workflowCatalogLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"center","themeStyleType":"","verticalAlign":"middle"}, {"onShow":"workflowCatalogLayerShow"}, {
workflowCatalogPanelRoot: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"100%"}, {}],
loadingCatalogImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}],
adminLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}, {
navigationHeaderPanel1: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"26px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
picture11: ["wm.Picture", {"height":"22px","margin":"5,0,0,0","source":"resources/images/icons/properties_16.png","width":"22px"}, {}],
label5: ["wm.Label", {"caption":"Administration Configuration","height":"100%","padding":"0,0,0,4","styles":{"fontWeight":"bold"},"width":"100%"}, {}]
}],
adminTabLayers: ["wm.TabLayers", {"transition":"fade"}, {}, {
connLayer: ["wm.Layer", {"border":"1","borderColor":"#999999","caption":"Connection","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"connLayerShow"}, {
connInfoPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","fitToContentHeight":true,"height":"131px","horizontalAlign":"left","margin":"15,4,0,8","verticalAlign":"top","width":"550px"}, {}, {
panel11: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"fontFamily":"","fontSize":"","backgroundColor":"#eeeeee"},"verticalAlign":"top","width":"100%"}, {}, {
label11: ["wm.Label", {"borderColor":"#fbfbfb","caption":"vCenter Orchestrator Connection Information","height":"100%","padding":"8","styles":{"fontSize":"13px","fontFamily":"arial-narrow","fontWeight":"bold"},"width":"100%"}, {}]
}],
panel19: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label18: ["wm.Label", {"align":"right","border":"1","borderColor":"#eeeeee","caption":"Server","height":"100%","padding":"4,4,4,17","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"99px"}, {}],
serverInput: ["wm.Text", {"caption":"  ","captionSize":"5px","dataValue":undefined,"displayValue":"","maxChars":"100","required":true,"width":"180px"}, {}],
spacer3: ["wm.Spacer", {"height":"22px","width":"20px"}, {}],
label26: ["wm.Label", {"align":"left","border":"1","borderColor":"#eeeeee","caption":"Port","height":"100%","padding":"4,4,4,14","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"65px"}, {}],
portInput: ["wm.Text", {"caption":" ","captionSize":"5px","dataValue":undefined,"displayValue":"","formatter":undefined,"required":true,"width":"70px"}, {}]
}],
panel8: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
label22: ["wm.Label", {"align":"right","border":"1","borderColor":"#eeeeee","caption":"Session Mode","height":"100%","padding":"4,4,4,14","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"100px"}, {}],
sessionPerUserRadio: ["wm.RadioButton", {"caption":"Session Per User","captionSize":"120px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"sessionMode","startChecked":true,"width":"135px"}, {"onchange":"sessionPerUserRadioChange"}],
sharedSessionRadio: ["wm.RadioButton", {"caption":"Shared Session","captionSize":"120px","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"helpText":undefined,"radioGroup":"sessionMode","width":"140px"}, {"onchange":"sharedSessionRadioChange"}],
panel1: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","padding":"0,10,0,0","verticalAlign":"middle","width":"100%"}, {}, {
sessionModeHelpImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/grayhelp.png","width":"20px"}, {"onclick":"sessionModeHelpImgClick"}]
}]
}],
usernamePasswordPanel: ["wm.Panel", {"height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
label24: ["wm.Label", {"align":"right","border":"1","borderColor":"#eeeeee","caption":"Username","height":"100%","padding":"4,4,4,17","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"100px"}, {}],
usernameInput: ["wm.Text", {"caption":"  ","captionSize":"5px","dataValue":undefined,"displayValue":"","maxChars":"100","required":true,"width":"180px"}, {}],
spacer2: ["wm.Spacer", {"height":"22px","width":"20px"}, {}],
label28: ["wm.Label", {"align":"center","border":"1","borderColor":"#eeeeee","caption":"Password","height":"100%","padding":"0","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"65px"}, {}],
passwordInput: ["wm.Text", {"caption":" ","captionSize":"5px","dataValue":undefined,"displayValue":"","password":true,"required":true,"width":"160px"}, {}]
}],
panel2: ["wm.Panel", {"border":"1","borderColor":"#dddddd","height":"33px","horizontalAlign":"right","layoutKind":"left-to-right","padding":"0,4,0,0","verticalAlign":"middle","width":"100%"}, {}, {
resetConfBtn: ["wm.Button", {"caption":"Reset","margin":"4"}, {"onclick":"resetConfBtnClick"}],
saveConfigurationBtn: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"saveConfigurationBtnClick"}]
}]
}]
}],
adminPagePermissionLayer: ["wm.Layer", {"autoScroll":true,"border":"1","borderColor":"#999999","caption":"Pages","horizontalAlign":"center","padding":"4","themeStyleType":"ContentPanel","verticalAlign":"top"}, {}, {
dividerPanel2: ["wm.Panel", {"borderColor":"","height":"10px","horizontalAlign":"center","minWidth":500,"padding":"0,4,0,4","verticalAlign":"bottom","width":"100%"}, {}, {
bevel3: ["wm.Bevel", {"bevelSize":1,"height":"1px","styles":{"color":"","backgroundColor":""},"width":"100%"}, {}]
}],
defaultPageConfigPanel: ["wm.Panel", {"height":"143px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
label17: ["wm.Label", {"caption":"Default Landing View:","height":"20px","padding":"4","width":"132px"}, {}],
defaultLandingRadioPanel: ["wm.Panel", {"height":"123px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
defaultHomeRadio: ["wm.RadioButton", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","caption":"Home","captionAlign":"left","captionPosition":"right","captionSize":"100%","dataType":"boolean","displayValue":true,"emptyValue":"false","groupValue":true,"radioGroup":"defaultLandingPageRadio","startChecked":true,"width":"100%"}, {"onchange":"defaultHomeRadioChange"}],
defaultWorkflowTreeRadio: ["wm.RadioButton", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","caption":"Workflow Tree","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"radioGroup":"defaultLandingPageRadio","width":"100%"}, {"onchange":"defaultWorkflowTreeRadioChange"}],
defaultWorkflowListRadio: ["wm.RadioButton", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","caption":"Workflow List","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"radioGroup":"defaultLandingPageRadio","width":"100%"}, {"onchange":"defaultWorkflowListRadioChange"}],
defaultWorkflowCatalogRadio: ["wm.RadioButton", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","caption":"Workflow Catalog","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"radioGroup":"defaultLandingPageRadio","width":"100%"}, {"onchange":"defaultWorkflowCatalogRadioChange"}],
defaultUserInteractionsRadio: ["wm.RadioButton", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","caption":"User Interactions","captionAlign":"left","captionPosition":"right","captionSize":"100%","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"radioGroup":"defaultLandingPageRadio","width":"100%"}, {"onchange":"defaultUserInteractionsRadioChange"}]
}]
}],
dividerPanel1: ["wm.Panel", {"borderColor":"","height":"20px","horizontalAlign":"center","padding":"0,4,0,4","verticalAlign":"bottom","width":"100%"}, {}, {
bevel2: ["wm.Bevel", {"bevelSize":1,"height":"1px","styles":{"color":"","backgroundColor":""},"width":"100%"}, {}]
}],
adminPagePermissionsPanel: ["wm.Panel", {"height":"213px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
label10: ["wm.Label", {"caption":"Views Accessible By:","height":"20px","padding":"4"}, {}],
homeRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
homeRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"homeRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
homeRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"homeRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label19: ["wm.Label", {"align":"left","caption":"-  Home View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
workflowTreeRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
workflowTreeRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowTreeRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
workflowTreeRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":"boolean","desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowTreeRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label7: ["wm.Label", {"align":"left","caption":"-  Workflow Tree View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
workflowListRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
workflowListRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowListRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
workflowListRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowListRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label12: ["wm.Label", {"align":"left","caption":"-  Workflow List View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
workflowCatalogRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
workflowCatalogRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowCatalogRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
workflowCatalogRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowCatalogRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label13: ["wm.Label", {"align":"left","caption":"-  Workflow Catalog View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
userInteractionsRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
userInteractionsRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"userInteractionsRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
userInteractionsRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"userInteractionsRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label14: ["wm.Label", {"align":"left","caption":"-  User Interactions View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
workflowRunsRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
workflowRunsRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowRunsRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
workflowRunsRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"workflowRunsRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label15: ["wm.Label", {"align":"left","caption":"-  Workflow Runs View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}]
}],
recentRunsRadioPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
recentRunsRadioAll: ["wm.RadioButton", {"caption":"All","captionSize":"30px","dataType":"boolean","desktopHeight":"22px","displayValue":true,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"recentRunsRadioGroup","startChecked":true,"width":"45px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
recentRunsRadioAdmin: ["wm.RadioButton", {"caption":"Admin","captionSize":"60px","checkedValue":false,"dataType":undefined,"desktopHeight":"22px","displayValue":false,"emptyValue":"false","groupValue":true,"height":"22px","radioGroup":"recentRunsRadioGroup","width":"70px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
label16: ["wm.Label", {"align":"left","caption":"-  Recent Runs View","height":"20px","padding":"4","styles":{"fontWeight":"bold"}}, {}],
label20: ["wm.Label", {"align":"left","caption":"|  Start in: ","height":"20px","padding":"4","styles":{"fontWeight":""},"width":"60px"}, {}],
recentRunsPanelRadio: ["wm.RadioButton", {"caption":"Panel","captionSize":"45px","dataType":"boolean","displayValue":true,"emptyValue":"false","groupValue":true,"radioGroup":"recentRunsStartRadio","startChecked":true,"width":"65px"}, {"onchange":"pagePermissionsRadioBtnChange"}],
recentRunsBarRadio: ["wm.RadioButton", {"caption":"Bar","captionSize":"40px","checkedValue":false,"dataType":"boolean","displayValue":false,"emptyValue":"false","groupValue":true,"radioGroup":"recentRunsStartRadio","width":"60px"}, {"onchange":"pagePermissionsRadioBtnChange"}]
}],
testAsUserPanel: ["wm.Panel", {"_classes":{"domNode":["adminConfigList"]},"border":"1","borderColor":"","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
testAsUserCheckBox: ["wm.Checkbox", {"caption":"Test as User:","captionSize":"88px","displayValue":false,"emptyValue":"false","width":"120px"}, {"onchange":"testAsUserCheckBoxChange"}]
}]
}],
dividerPanel: ["wm.Panel", {"height":"20px","horizontalAlign":"center","verticalAlign":"bottom","width":"98%"}, {}, {
bevel1: ["wm.Bevel", {"bevelSize":1,"height":"1px","styles":{"color":"","backgroundColor":""},"width":"100%"}, {}]
}],
buttonConfigPanel: ["wm.Panel", {"height":"48px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
pageConfigResetBtn: ["wm.Button", {"caption":"Reset","margin":"4"}, {"onclick":"pageConfigResetBtnClick"}],
pageConfigSaveBtn: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"pageConfigSaveBtnClick"}]
}]
}]
}]
}],
defaultEmptyLayer: ["wm.Layer", {"borderColor":"","caption":undefined,"horizontalAlign":"left","themeStyleType":"","verticalAlign":"top"}, {}]
}]
}],
rightSidePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","showing":false,"verticalAlign":"middle","width":"231px"}, {}, {
loadingRecentRunsImg: ["wm.Picture", {"height":"20px","source":"resources/images/o11n/workingBar.gif","width":"60px"}, {}]
}]
}]
}]
}],
panelFooter: ["wm.HeaderContentPanel", {"height":"22px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"fontFamily":"Arial,Helvetica,sans-serif"},"verticalAlign":"top","width":"100%"}, {}, {
picture2: ["wm.Picture", {"height":"100%","source":"lib/wm/base/widget/themes/default/images/wmSmallLogo.png","width":"24px"}, {}],
label1: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"caption":"Powered by WaveMaker","height":"100%","padding":"4"}, {}],
edFooterLabel: ["wm.Label", {"_classes":{"domNode":["wm_FontSizePx_10px"]},"align":"right","caption":"Copyright &#169; 2012 VMware, Inc. All rights reserved.","height":"100%","padding":"4","width":"100%"}, {}]
}]
}]
}]
}]
}]
};

Main.prototype._cssText = 'span.wmtree-content > span {\
height:20px;\
padding-left:20px;\
background-repeat:no-repeat;\
background-position:left center;\
color: #000;\
}\
span.wmtree-content > span.catRoot {\
background-color:#fff;\
background-image:url("resources/images/o11n/root-category_16x16.png");\
}\
span.wmtree-content > span.category {\
background-image:url("resources/images/o11n/workflow-category_16x16.png");\
}\
span.wmtree-content > span.workflow {\
background-image:url("resources/images/o11n/workflow-item_16x16.png");\
}\
/*\
.dijitMenuItemLabel{\
font-size: 15px !important;\
font-weight: normal !important;\
color: #333333 !important;\
font-family: arial-narrow !important;\
border-bottom-style:solid;\
border-bottom-width:1px;\
border-bottom-color: #eeeeee;\
}\
*/\
';
Main.prototype._htmlText = '';