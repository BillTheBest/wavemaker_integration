WorkflowList.widgets = {
	workflowService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getWorkflows","service":"WorkflowService"}, {"onError":"workflowServiceError","onSuccess":"workflowServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"workflows_panel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getWorkflowsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
			}]
		}]
	}],
	specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	currentPagination: ["wm.Variable", {"type":"NumberData"}, {}],
	maxPaginationVar: ["wm.Variable", {}, {}],
	workflowListPublisher: ["wm.CompositePublisher", {"description":"List of all workflows.","displayName":"WorkflowList","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"WorkflowList","width":"100%"}, {}],
	workflowListLayout: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		workflows_panel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel5: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
				label1: ["wm.Label", {"borderColor":"","caption":"Workflows","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"80px"}, {}],
				panel6: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						runButton: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"run workflow","margin":"1,1,1,1","source":"resources/images/o11n/run.png","width":"16px"}, {"onclick":"runButtonClick"}],
						infoButton: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","hint":"go to workflow","margin":"1,1,1,1","showing":false,"source":"resources/images/o11n/info_24x.png","width":"16px"}, {"onclick":"infoButtonClick"}],
						presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
					}],
					search: ["wm.Text", {"caption":"Search:","captionSize":"52px","desktopHeight":"23px","displayValue":"","emptyValue":"null","height":"23px","helpText":undefined,"maxHeight":0,"mobileHeight":"20%","placeHolder":"by workflow name...","resetButton":true,"selectOnClick":true,"width":"250px"}, {"onchange":"searchChange"}],
					separator6: ["wm.Label", {"align":"center","borderColor":"","caption":"|","height":"100%","padding":"4","width":"10px"}, {}],
					refreshImg: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"workflowService"}],
					separator8: ["wm.Label", {"borderColor":"","caption":"","height":"100%","padding":"4","width":"10px"}, {}]
				}]
			}],
			workflows_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Category: \" + ${categoryName} + \"</div>\"\n+ \"<div class='MobileRow'>Description: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"id","title":" ","width":"18px","align":"center","formatFunc":"wm_image_formatter","formatProps":{"width":16,"height":16},"editorProps":{"restrictValues":true},"expression":"\"resources/images/o11n/info_24x.png\"","mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"320px","align":"left","formatFunc":"","editorProps":null,"mobileColumn":false},{"show":true,"field":"categoryName","title":"Category","width":"250px","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"canExecute","title":"CanExecute","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"canEdit","title":"CanEdit","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"iconHref","title":"IconHref","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"customizedIconExists","title":"CustomizedIconExists","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":50,"minHeight":50,"minWidth":600,"primaryKeyFields":["id"],"selectFirstRow":true,"showing":false,"styles":{"color":"#000000"}}, {"onClick":"workflows_gridClick","onHeaderClick":"workflows_gridHeaderClick","onRenderData":"workflows_gridRenderData"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"workflowService.list","targetProperty":"dataSet"}, {}]
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
		}]
	}]
}