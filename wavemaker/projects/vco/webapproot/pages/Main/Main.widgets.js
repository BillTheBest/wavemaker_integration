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
}