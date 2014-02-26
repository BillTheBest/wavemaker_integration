WorkflowRuns.widgets = {
	workflowIdVar: ["wm.Variable", {"dataSet":"","type":"java.lang.String"}, {}],
	workflowId: ["wm.Property", {"property":"workflowIdVar.dataValue"}, {}],
	executionsPerWorkflow: ["wm.Property", {"property":"executionsPerWorkflowVar.dataValue"}, {}],
	executionsPerWorkflowVar: ["wm.Variable", {"type":"BooleanData"}, {}],
	executionStateFilterVar: ["wm.Variable", {"dataSet":"","type":"java.lang.String"}, {}],
	executionStateFilter: ["wm.Property", {"property":"executionStateFilterVar.dataValue"}, {}],
	workflowExecutionsService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowExecutions","service":"WorkflowService"}, {"onError":"workflowExecutionsServiceError","onSuccess":"workflowExecutionsServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"executions_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
			}]
		}]
	}],
	executionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getWorkflowExecution","service":"WorkflowService"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"executionParameters_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	runEventsServices: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"getRunEvents","service":"WorkflowService"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panel3","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getRunEventsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	workflowRunsPublisher: ["wm.CompositePublisher", {"description":"vCO Workflow Runs Information and Logs","displayName":"WorkflowRuns","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"WorkflowRuns","width":"100%"}, {}],
	specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"wf_executions_grid.selectedItem.id","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	currentPagination: ["wm.Variable", {"type":"NumberData"}, {}],
	maxPaginationVar: ["wm.Variable", {"type":"NumberData"}, {}],
	currentWorkflowId: ["wm.Variable", {"dataSet":""}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowIdService.dataValue","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	currentWorkflowIdService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflowIdForExecutionId","service":"WorkflowService"}, {"onSuccess":"currentWorkflowIdServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"execution_details_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowIdForExecutionIdInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	stateFilterVar: ["wm.Variable", {"isList":true,"type":"com.vmware.o11n.wm.common.FilterType"}, {}],
	rerunWorkflowService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"rerunWorklfowExecution","service":"WorkflowService"}, {"onError":"rerunWorkflowServiceError","onError1":"errorDialog.show","onSuccess":"workflowExecutionsService","onSuccess1":"rerunWorkflowServiceSuccess1"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"wf_executions_grid","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"rerunWorklfowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	cancelExecutionService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"cancelWorkflowExecution","service":"WorkflowService"}, {"onError":"cancelExecutionServiceError","onError1":"errorDialog.show","onSuccess":"workflowExecutionsService","onSuccess1":"cancelExecutionServiceSuccess1"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"scrollingPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"cancelWorkflowExecutionInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"currentWorkflowId.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}]
			}]
		}]
	}],
	currentWorkflowName: ["wm.Variable", {"type":"StringData"}, {}],
	cancelWorkflowDialog: ["wm.GenericDialog", {"button1Caption":"Ok","button1Close":true,"button2Caption":"Cancel","button2Close":true,"desktopHeight":"93px","height":"102px","positionNear":"cancelButton","styles":{"fontWeight":"","color":"","textAlign":""},"title":"  ","userPrompt":"Cancel this workflow run?","width":"260px"}, {"onButton1Click":"cancelExecutionService","onButton2Click":"cancelWorkflowDialog.hide"}],
	startWorkflowRun: ["wm.GenericDialog", {"button1Caption":"Ok","button1Close":true,"button2Caption":"Cancel","button2Close":true,"desktopHeight":"93px","height":"102px","positionNear":"restartButton","title":"Start Workflow","userPrompt":"Start the selected workflow run again?","width":"263px"}, {"onButton1Click":"rerunWorkflowService","onButton2Click":"startWorkflowRun.hide"}],
	wf_runs_page_panel: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		scrollingPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","minDesktopHeight":350,"minHeight":350,"minWidth":600,"styles":{"backgroundGradient":"","backgroundColor":"#ffffff"},"verticalAlign":"top","width":"100%"}, {}, {
			executions_panel: ["wm.Panel", {"borderColor":"#999999","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				panel5: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
					label1: ["wm.Label", {"borderColor":"","caption":"Workflow Runs","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"116px"}, {}],
					panel6: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
							restartButton: ["wm.Picture", {"aspect":"h","disabled":true,"height":"16px","hint":"restart workflow run","margin":"1,1,1,1","source":"resources/images/o11n/restart_disabled_16x16.png","width":"16px"}, {"onclick":"startWorkflowRun.show"}],
							cancelButton: ["wm.Picture", {"aspect":"h","disabled":true,"height":"18px","hint":"cancel workflow run","source":"resources/images/o11n/no_16x16-disabled.png","width":"18px"}, {"onclick":"cancelWorkflowDialog.show"}],
							answerButton: ["wm.Picture", {"disabled":true,"height":"16px","hint":"answer user interaction","source":"resources/images/o11n/Answer_16.png","width":"16px"}, {"onclick":"answerButtonClick"}],
							presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
						}],
						stateLookup: ["wm.Lookup", {"caption":"Status:","captionSize":"50px","dataType":"com.vmware.o11n.wm.common.FilterType","dataValue":undefined,"displayField":"displayValue","displayValue":"","height":"100%","padding":"4","width":"220px"}, {"onchange":"stateLookupChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"stateFilterVar","targetProperty":"dataSet"}, {}]
							}]
						}],
						picture3: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"workflowExecutionsService"}],
						separator6: ["wm.Label", {"caption":"","height":"100%","padding":"4","width":"10px"}, {}]
					}]
				}],
				wf_executions_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Status: \" + ${state} + \"</div>\"\n+ \"<div class='MobileRow'>Start Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm a\"}, null,null,null,${startDate}) + \"</div>\"\n+ \"<div class='MobileRow'>End Date: \" + wm.List.prototype.dateFormatter({\"useLocalTime\":false,\"datePattern\":\"MM/dd/yyyy h:mm a\"}, null,null,null,${endDate}) + \"</div>\"\n+ \"<div class='MobileRow'>Started By: \" + ${startedBy} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"id","title":"Id","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"name","title":"Workflow Name","width":"250px","align":"left","formatFunc":"","editorProps":null,"mobileColumn":false},{"show":true,"field":"state","title":"Status","width":"85px","align":"left","formatFunc":"wf_executions_gridStateFormat","formatProps":null,"editorProps":{"restrictValues":true},"expression":"","mobileColumn":false},{"show":true,"field":"startDate","title":"Start Date","width":"125px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"endDate","title":"End Date","width":"125px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"useLocalTime":false,"datePattern":"MM/dd/yyyy h:mm a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"startedBy","title":"Started By","width":"50%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"contentException","title":"ContentException","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"businessState","title":"BusinessState","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"type","title":"Type","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":600,"padding":"0,0,2,0","primaryKeyFields":["id"],"selectFirstRow":true,"showing":false,"styles":{"color":"#000000"}}, {"onHeaderClick":"wf_executions_gridHeaderClick","onRenderData":"wf_executions_gridRenderData","onSelect":"wf_executions_gridSelect","onSort":"wf_executions_gridSort"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"workflowExecutionsService.list","targetProperty":"dataSet"}, {}]
					}]
				}],
				panel1: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					paginigPanel: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"170px"}, {}, {
						first_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"first page","margin":"8,0,0,0","width":"13px"}, {"onclick":"first_page_imgClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"${currentPagination.dataValue} <=1 ? \"resources/images/o11n/first_page_disabled.gif\" : \"resources/images/o11n/first_page.gif\";","targetProperty":"source"}, {}]
							}]
						}],
						prev_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"previous page","margin":"8,0,0,0","width":"13px"}, {"onclick":"prev_page_imgClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"${currentPagination.dataValue} > 1 ? \"resources/images/o11n/prev_page.gif\" : \"resources/images/o11n/prev_page_disabled.gif\";","targetProperty":"source"}, {}]
							}]
						}],
						separator2: ["wm.Label", {"align":"left","caption":"|","height":"100%","padding":"0,4,0,0","width":"5px"}, {}],
						paginationPageNumber: ["wm.Number", {"borderColor":"","caption":"Page:","captionSize":"39px","displayValue":"1","height":"100%","helpText":undefined,"margin":"1,0,0,0","minimum":1,"padding":"5,0,5,0","placeHolder":undefined,"places":0,"selectOnClick":true,"width":"65px"}, {"onEnterKeyPress":"paginationPageNumberEnterKeyPress","onchange":"paginationPageNumberChange"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"currentPagination.dataValue","targetProperty":"dataValue"}, {}],
								wire1: ["wm.Wire", {"expression":undefined,"source":"maxPaginationVar.dataValue","targetProperty":"maximum"}, {}],
								wire2: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} <= 1","targetProperty":"disabled"}, {}]
							}]
						}],
						separator5: ["wm.Label", {"align":"center","borderColor":"","caption":"/","height":"25px","padding":"0","width":"10px"}, {}],
						pageCount: ["wm.Label", {"align":"center","autoSizeWidth":true,"height":"100%","hint":"number of pages","padding":"0","width":"2px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"maxPaginationVar.dataValue","targetProperty":"caption"}, {}]
							}]
						}],
						separator3: ["wm.Label", {"align":"center","caption":"|","height":"100%","padding":"4","width":"8px"}, {}],
						next_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"next page","margin":"8,0,0,0","width":"13px"}, {"onclick":"next_page_imgClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} > ${currentPagination.dataValue} ? \"resources/images/o11n/next_page.gif\" : \"resources/images/o11n/next_page_disabled.gif\";\n\n\n","targetProperty":"source"}, {}]
							}]
						}],
						last_page_img: ["wm.Picture", {"aspect":"h","borderColor":"","height":"19px","hint":"last page","margin":"8,0,0,0","width":"13px"}, {"onclick":"last_page_imgClick"}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":"${maxPaginationVar.dataValue} != ${currentPagination.dataValue} ? \"resources/images/o11n/last_page.gif\" : \"resources/images/o11n/last_page_disabled.gif\";\n\n\n","targetProperty":"source"}, {}]
							}]
						}],
						separator7: ["wm.Label", {"align":"center","caption":"","height":"100%","padding":"4","width":"12px"}, {}]
					}]
				}]
			}],
			execution_details_panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				panel11: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					info_panel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						label5: ["wm.Label", {"align":"center","caption":"Status:","height":"100%","padding":"4,0,4,0","styles":{"fontWeight":"bolder"},"width":"48px"}, {}],
						executionStatusLabel: ["wm.Label", {"align":"left","autoSizeWidth":true,"display":"executionStatusLabelReadOnlyNodeFormat","height":"100%","minWidth":70,"padding":"4,10,4,2","width":"14px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.state","targetProperty":"caption"}, {}]
							}]
						}],
						label12: ["wm.Label", {"caption":"Started:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"54px"}, {}],
						executionStartedLabel: ["wm.Label", {"align":"left","display":"Date","height":"100%","padding":"4","width":"142px"}, {}, {
							format: ["wm.DateFormatter", {"datePattern":"MM/dd/yyyy h:mm:ss a","formatLength":undefined}, {}],
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"caption"}, {}],
								wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.startDate","targetProperty":"showing"}, {}]
							}]
						}],
						label14: ["wm.Label", {"align":"right","caption":"Ended:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"70px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"showing"}, {}]
							}]
						}],
						executionEndedLabel: ["wm.Label", {"align":"left","display":"Date","height":"100%","padding":"4","width":"142px"}, {}, {
							format: ["wm.DateFormatter", {"datePattern":"MM/dd/yyyy h:mm:ss a","formatLength":undefined}, {}],
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"caption"}, {}],
								wire1: ["wm.Wire", {"expression":undefined,"source":"executionService.endDate","targetProperty":"showing"}, {}]
							}]
						}],
						businessStatusLabel: ["wm.Label", {"align":"right","caption":"Business Status:","height":"100%","padding":"4","styles":{"fontWeight":"bolder"},"width":"125px"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"showing"}, {}]
							}]
						}],
						executionBusinessStatus: ["wm.Label", {"align":"left","height":"100%","padding":"4","width":"100%"}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.businessState","targetProperty":"caption"}, {}]
							}]
						}]
					}]
				}],
				panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","margin":"4,0,4,0","verticalAlign":"top","width":"100%"}, {}, {
					panel3: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"60%"}, {}, {
						panel7: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							execution_state_label: ["wm.Label", {"caption":"Run Events:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}],
							panel8: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								picture1: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"runEventsServices"}],
								label2: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"0","width":"10px"}, {}]
							}]
						}],
						execution_state_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Event: \" + ${displayName} + \"</div>\"\n+ \"<div class='MobileRow'>Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm:ss a\"}, null,null,null,${date}) + \"</div>\"\n+ \"<div class='MobileRow'>User: \" + ${user} + \"</div>\"\n+ \"<div class='MobileRow'>Log: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"displayName","title":"Event","width":"50%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"severity","title":"Type","width":"36px","align":"center","formatFunc":"wm_image_formatter","formatProps":{"width":20,"height":20},"editorProps":{"restrictValues":true},"expression":"if (${severity} == 'INFO'){\n   \"resources/images/o11n/info_24x.png\";\n}else if (${severity} == 'ERROR'){\n   \"resources/images/o11n/error_24x.png\";\n}else if (${severity} == 'DEBUG'){\n   \"resources/images/o11n/bug_24x.png\";\n}else {\n   \"resources/images/o11n/warning_24x.png\";\n}","mobileColumn":false},{"show":true,"field":"date","title":"Date","width":"135px","align":"left","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm:ss a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"user","title":"User","width":"90px","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Log","width":"100%","align":"left","editorProps":{"restrictValues":true},"mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":500}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"runEventsServices","targetProperty":"dataSet"}, {}]
							}]
						}]
					}],
					executionParameters_panel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"40%"}, {}, {
						panel9: ["wm.Panel", {"height":"18px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
							execution_state_label1: ["wm.Label", {"caption":"Parameters:","height":"16px","padding":"0,0,0,4","styles":{"color":"#999999","fontWeight":"bold","fontSize":"12px"},"width":"150px"}, {}],
							panel10: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"bottom","width":"100%"}, {}, {
								picture4: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"executionService"}],
								label8: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"0","width":"10px"}, {}]
							}]
						}],
						execution_inparam_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","columns":[{"show":true,"field":"paramType","width":"26px","align":"left","formatFunc":"wm_image_formatter","formatProps":null,"editorProps":null,"expression":"${paramType}=='Input'? \"resources/images/o11n/in_24x12.png\":\"resources/images/o11n/out_24x12.png\";","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"80%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"type","title":"Type","width":"60%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"displayValue","title":"Value","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Type: \" + ${type} + \"</div>\"\n+ \"<div class='MobileRow'>Value: \" + ${displayValue} + \"</div>\"\n","mobileColumn":true},{"show":false,"field":"value","title":"Value","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"dsType":"com.vmware.o11n.wm.common.BaseParameter","height":"100%","margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":300,"singleClickEdit":true}, {}, {
							binding: ["wm.Binding", {}, {}, {
								wire: ["wm.Wire", {"expression":undefined,"source":"executionService.parameters","targetProperty":"dataSet"}, {}]
							}]
						}]
					}]
				}]
			}]
		}]
	}]
}