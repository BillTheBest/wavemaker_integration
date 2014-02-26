Presentation.widgets = {
	presentationPublisher: ["wm.CompositePublisher", {"description":"vCO Workflow Presentation","displayName":"Presentation","group":"vCO Widgets","height":"100%","namespace":"o11n","publishName":"Presentation","width":"100%"}, {}],
	workflowIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	workflowId: ["wm.Property", {"property":"workflowIdVar.dataValue"}, {}],
	executionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	executionId: ["wm.Property", {"property":"executionIdVar.dataValue"}, {}],
	userInteractionIdVar: ["wm.Variable", {"type":"StringData"}, {}],
	userInteractionId: ["wm.Property", {"property":"userInteractionIdVar.dataValue"}, {}],
	paramsVar: ["wm.Variable", {"isList":true,"type":"com.vmware.o11n.wm.common.PresentationParameter"}, {}],
	updatePresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"updatePresentationInstance","service":"PresentationService"}, {"onError":"updatePresentationServiceError","onSuccess":"updatePresentationServiceSuccess"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"presWizard","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updatePresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	presentationIdVar: ["wm.Variable", {"type":"StringData"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"createPresentationServices.id","targetProperty":"dataSet.dataValue"}, {}]
		}]
	}],
	createPresentationServices: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"createPresentationInstance","service":"PresentationService"}, {"onError":"createPresentationServicesError","onSuccess":"createPresentationServicesSuccess"}, {
		input: ["wm.ServiceInput", {"type":"createPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	deletePresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"deletePresentationInstance","service":"PresentationService"}, {"onResult":"deletePresentationServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"deletePresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}]
			}]
		}]
	}],
	createUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","loadingDialog":"","operation":"createUserInteractionPresentationInstance","service":"PresentationService"}, {"onError":"createUserInteractionServError","onSuccess":"createUserInteractionServSuccess"}, {
		input: ["wm.ServiceInput", {"type":"createUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	updateUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"dontExecute","operation":"updateUserInteractionPresentationInstance","service":"PresentationService"}, {"onError":"updateUserInteractionServError"}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"presWizard","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"updateUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire3: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	deleteUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"deleteUserInteractionPresentationInstance","service":"PresentationService"}, {"onResult":"deleteUserInteractionServResult"}, {
		input: ["wm.ServiceInput", {"type":"deleteUserInteractionPresentationInstanceInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}]
			}]
		}]
	}],
	runPresentationService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"runWorkflowPresentation","service":"PresentationService"}, {"onError":"runPresentationServiceError","onSuccess":"runPresentationServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"runWorkflowPresentationInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	answerUserInteractionServ: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","loadingDialog":"","operation":"answerUserInteractionPresentation","service":"PresentationService"}, {"onError":"answerUserInteractionServError","onResult":"answerUserInteractionServResult","onSuccess":"answerUserInteractionServSuccess"}, {
		input: ["wm.ServiceInput", {"type":"answerUserInteractionPresentationInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"workflowIdVar.dataValue","targetProperty":"workflowId"}, {}],
				wire1: ["wm.Wire", {"expression":undefined,"source":"executionIdVar.dataValue","targetProperty":"executionId"}, {}],
				wire2: ["wm.Wire", {"expression":undefined,"source":"presentationIdVar.dataValue","targetProperty":"presentationExecutionId"}, {}],
				wire3: ["wm.Wire", {"expression":undefined,"source":"paramsVar","targetProperty":"params"}, {}]
			}]
		}]
	}],
	userInteractionService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteraction","service":"WorkflowService"}, {"onError":"userInteractionServiceError","onSuccess":"userInteractionServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getUserInteractionInputs"}, {}]
	}],
	navArrayVar: ["wm.Variable", {"isList":true,"type":"EntryData"}, {}],
	pagePresentationDialog: ["wm.DesignableDialog", {"buttonBarId":"","containerWidgetId":"presentationLayout","desktopHeight":"700px","height":"700px","title":" ","width":"800px"}, {"onClose":"pagePresentationDialogClose","onShow":"pagePresentationDialogShow"}, {
		presentationLayout: ["wm.Container", {"_classes":{"domNode":["wmdialogcontainer","MainContent"]},"height":"100%","horizontalAlign":"left","minDesktopHeight":200,"minHeight":200,"minWidth":400,"verticalAlign":"top","width":"100%"}, {}, {
			noPresentationPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","showing":false,"verticalAlign":"middle","width":"100%"}, {}, {
				label1: ["wm.Label", {"caption":"No Inputs","padding":"4","styles":{"fontSize":"13px","fontFamily":"arial-narrow","fontWeight":"bold"},"width":"68px"}, {}]
			}],
			loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				picture1: ["wm.Picture", {"height":"16px","source":"resources/images/o11n/workingBar.gif","width":"55px"}, {}]
			}],
			scrollingPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","padding":"0,10,0,0","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
				presNavPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
					presNavList: ["wm.List", {"_classes":{"domNode":["GridListStyle"]},"border":"0","borderColor":"","columns":[{"show":true,"field":"name","title":"Name","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","displayType":"Any","align":"left","formatFunc":""}],"dataSet":"","headerVisible":false,"height":"100%","margin":"0","minDesktopHeight":60,"padding":"4,0,4,16","scrollToSelection":true,"selectFirstRow":true,"styles":{"backgroundColor":"#dddddd"}}, {"onSelect":"presNavListSelect","onStyleRow":"presNavListStyleRow"}]
				}],
				presWizard: ["wm.Layers", {"defaultLayer":0,"minDesktopHeight":200,"minHeight":200,"minWidth":400}, {}]
			}],
			i18nWorkflowStartedMsg: ["wm.Label", {"caption":"Workflow started.","padding":"4","showing":false}, {}],
			i18nUserInteractionAnsweredMsg: ["wm.Label", {"caption":"Pending Workflow Answered.","padding":"4","showing":false}, {}],
			buttonBar: ["wm.Panel", {"_classes":{"domNode":["dialogfooter"]},"border":"1,0,0,0","desktopHeight":"32px","enableTouchHeight":true,"height":"32px","horizontalAlign":"right","layoutKind":"left-to-right","mobileHeight":"40px","verticalAlign":"top","width":"100%"}, {}, {
				backButton: ["wm.Button", {"caption":"Back","margin":"4"}, {"onclick":"backButtonClick"}],
				nextButton: ["wm.Button", {"caption":"Next","margin":"4"}, {"onclick":"nextButtonClick"}],
				submitButton: ["wm.Button", {"caption":"Finish","margin":"4"}, {"onclick":"submitButtonClick"}],
				cancelButton: ["wm.Button", {"caption":"Cancel","margin":"4"}, {"onclick":"cancelButtonClick"}]
			}]
		}]
	}],
	layoutEmpty: ["wm.Layout", {"autoScroll":false,"borderColor":"","horizontalAlign":"left","showing":false,"verticalAlign":"top"}, {}, {
		emptyPanel: ["wm.Panel", {"borderColor":"","height":"2px","horizontalAlign":"left","layoutKind":"left-to-right","showing":false,"verticalAlign":"top","width":"30px"}, {}, {
			emptyLabel: ["wm.Label", {"borderColor":"","caption":"  ","height":"2px","padding":"0","showing":false,"width":"2px"}, {}]
		}]
	}]
}