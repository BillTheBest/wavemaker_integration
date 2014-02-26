WorkflowCatalog.widgets = {
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
	WorkflowCatalogPublisher: ["wm.CompositePublisher", {"description":"List of workflows grouped by categories and dispayed in form of a catalog.","displayName":"WorkflowCatalog","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"WorkflowCatalog","width":"100%"}, {}],
	editModeVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	editMode: ["wm.Property", {"property":"editModeVar.dataValue"}, {}],
	hideWorkflowRunsVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	hideWorkflowRuns: ["wm.Property", {"property":"hideWorkflowRunsVar.dataValue"}, {}],
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
	workflowCatalogLayoutBox: ["wm.Layout", {"horizontalAlign":"center","styles":{"backgroundColor":"#ffffff"},"verticalAlign":"top"}, {}, {
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
		}]
	}]
}