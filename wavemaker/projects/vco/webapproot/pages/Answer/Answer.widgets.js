Answer.widgets = {
	userInteractionService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteraction","service":"WorkflowService"}, {"onError":"userInteractionServiceError","onSuccess":"userInteractionServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getUserInteractionInputs"}, {}]
	}],
	userInteractionId: ["wm.Variable", {"type":"StringData"}, {}],
	layoutBox1: ["wm.Layout", {"_classes":{"domNode":["answer"]},"horizontalAlign":"left","styles":{"backgroundGradient":"","backgroundImage":"","backgroundColor":""},"verticalAlign":"top"}, {}, {
		answerHeaderPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"24px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","verticalAlign":"middle","width":"100%"}, {}, {
			picture1: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/state_user_input.png","width":"18px"}, {}],
			label7: ["wm.Label", {"caption":"Answer User Interaction","padding":"4,0,4,0","styles":{"fontWeight":"bold","fontSize":"13px"},"width":"185px"}, {}],
			presentationRootPanel: ["wm.Panel", {"height":"1px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"1px"}, {}]
		}],
		loadingPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"middle","width":"100%"}, {}, {
			loadingBarImg: ["wm.Picture", {"height":"16px","source":"resources/images/o11n/workingBar.gif","width":"55px"}, {}],
			errMsgLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#999999","caption":"User Interaction has been answered already.","height":"40px","padding":"4","showing":false,"styles":{"fontWeight":"bold","fontSize":"13px"},"width":"350px"}, {}],
			submitAnswerMsgLbl: ["wm.Label", {"align":"center","border":"1","borderColor":"#999999","caption":"User interaction answered. Thank you!","height":"40px","padding":"4","showing":false,"styles":{"fontWeight":"bold","fontSize":"13px"},"width":"350px"}, {}]
		}],
		userInteractionInfoPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"100%"}, {}, {
			panel2: ["wm.Panel", {"autoScroll":true,"border":"1","borderColor":"#eeeeee","fitToContentHeight":true,"height":"90px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,4,0,4","minDesktopHeight":90,"minHeight":90,"verticalAlign":"top","width":"100%"}, {}, {
				panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","margin":"0,4,0,0","styles":{"fontSize":"13px","fontWeight":"bold"},"verticalAlign":"top","width":"132px"}, {}, {
					label1: ["wm.Label", {"align":"right","caption":"Name:","padding":"4","width":"100%"}, {}],
					label5: ["wm.Label", {"align":"right","caption":"Requested Date:","padding":"4","width":"100%"}, {}],
					label3: ["wm.Label", {"align":"right","caption":"Description:","padding":"4","width":"100%"}, {}]
				}],
				panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","styles":{"fontSize":"13px"},"verticalAlign":"top","width":"100%"}, {}, {
					label2: ["wm.Label", {"padding":"4","width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.name","targetProperty":"caption"}, {}]
						}]
					}],
					label6: ["wm.Label", {"display":"DateTime","padding":"4","width":"100%"}, {}, {
						format: ["wm.DateTimeFormatter", {}, {}],
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.createDate","targetProperty":"caption"}, {}]
						}]
					}],
					label4: ["wm.Label", {"align":"left","autoSizeHeight":true,"height":"10px","padding":"4","singleLine":false,"width":"100%"}, {}, {
						binding: ["wm.Binding", {}, {}, {
							wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionService.description","targetProperty":"caption"}, {}]
						}]
					}]
				}]
			}],
			panel5: ["wm.Panel", {"height":"36px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"0,0,0,52","verticalAlign":"top","width":"100%"}, {}, {
				answerBtn: ["wm.Button", {"caption":"Answer","margin":"4"}, {"onclick":"answerBtnClick"}]
			}]
		}]
	}]
}