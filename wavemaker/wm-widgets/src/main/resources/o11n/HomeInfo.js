dojo.provide("common.packages.o11n.HomeInfo");
 
dojo.declare("o11n.HomeInfo", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "left-to-right",
    "preferredDevice": "desktop",
    deferDataLoad: false,

    start: function() {
        this.components.aboutInfoService.update();
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[HomeInfo]: data load deferred...");
        }
        this.subscribe("RunningCountChangeEvent", this, "handleRunningCountChangeEvent");
    },

    load: function() {
        console.log("[HomeInfo]: data loading started...");
        this.refreshTotalsImgClick();
    },

    handleRunningCountChangeEvent: function(inEvent) {
        this.runningCount.setCaption(inEvent.count);
    },

    taskCountServiceResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.components.taskLoading, this.taskCount);
    },
    taskCountServiceError: function(inSender, inError) {
        this.errorOnCountUpdate(this.components.taskLoading, this.taskCount);
    },
    userInteractionsCountResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.components.interactionLoading, this.components.interactionCount);
    },
    userInteractionsCountError: function(inSender, inError) {
        this.errorOnCountUpdate(this.components.interactionLoading, this.components.interactionCount);
    },
    runningCountServiceResult: function(inSender, inDeprecated) {
        this.resultOnCountUpdate(this.components.runningLoading, this.runningCount);
    },
    runningCountServiceError: function(inSender, inError) {
        this.errorOnCountUpdate(this.components.runningLoading, this.runningCount);
    },
    resultOnCountUpdate: function(loading, count) {
        loading.hide();
        count.show();
    },
    errorOnCountUpdate: function(loading, count) {
        this.resultOnCountUpdate(loading, count);
        count.setCaption("-");
    },

    refreshTotalsImgClick: function(inSender) {
        this.startLoad(this.components.taskLoading, this.taskCount);
        this.startLoad(this.components.interactionLoading, this.components.interactionCount);
        this.startLoad(this.components.runningLoading, this.runningCount);
        this.components.runningCountService.update();
        this.components.taskCountService.update();
        this.components.userInteractionsCount.update();
    },

    startLoad: function(loading, count) {
        count.hide();
        loading.show();
    },

    /* navigate to running executions */
    label10Click: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    runningCountClick: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    label11Click: function(inSender, inEvent) {
        this.onRunningExecutionsClick();
    },
    runningLoadingClick: function(inSender) {
        this.onRunningExecutionsClick();
    },
    onRunningExecutionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[HomeInfo]: Running Executions Panel click...");
    },

    /* navigate to user interactions */
    label8Click: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    interactionCountClick: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    interactionLoadingClick: function(inSender) {
        this.onUserInteractionsClick();
    },
    label9Click: function(inSender, inEvent) {
        this.onUserInteractionsClick();
    },
    onUserInteractionsClick: function() {
        //fire an event method to be interecepted.
        console.log("[HomeInfo]: User Interactions Panel click...");
    },
    _end: 0
});
 
o11n.HomeInfo.components = {
	aboutInfoService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getAboutInfo","service":"vCOGeneralService"}, {}, {
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"versionInfoPanel","targetProperty":"loadingDialog"}, {}]
		}],
		input: ["wm.ServiceInput", {"type":"getAboutInfoInputs"}, {}]
	}],
	taskCountService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getTotalScheduledTasks","service":"vCOGeneralService"}, {"onError":"taskCountServiceError","onResult":"taskCountServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalScheduledTasksInputs"}, {}]
	}],
	userInteractionsCount: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getTotalUserInteractions","service":"vCOGeneralService"}, {"onError":"userInteractionsCountError","onResult":"userInteractionsCountResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalUserInteractionsInputs"}, {}]
	}],
	runningCountService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getTotalRunningWorkflows","service":"vCOGeneralService"}, {"onError":"runningCountServiceError","onResult":"runningCountServiceResult"}, {
		input: ["wm.ServiceInput", {"type":"getTotalRunningWorkflowsInputs"}, {}]
	}],
	scrollPanel: ["wm.Panel", {"autoScroll":true,"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
		rightSpacePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"45px"}, {}],
		centralPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","minDesktopHeight":300,"minHeight":300,"minWidth":300,"verticalAlign":"top","width":"100%"}, {}, {
			topPanel: ["wm.Panel", {"borderColor":"","height":"250px","horizontalAlign":"left","layoutKind":"left-to-right","margin":"7,0,0,0","minDesktopHeight":250,"minWidth":200,"verticalAlign":"top","width":"100%"}, {}, {
				leftTopPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","minWidth":350,"verticalAlign":"middle","width":"100%"}, {}, {
					picture1: ["wm.Picture", {"aspect":"h","height":"80px","source":"resources/images/o11n/vco.png","width":"80px"}, {}],
					brandName: ["wm.Label", {"autoSizeWidth":true,"caption":"vCenter Orchestrator","height":"36px","margin":"0,10,0,10","padding":"4","styles":{"fontFamily":"helvetica","fontSize":"22px","fontWeight":"bold"},"width":"251px"}, {}]
				}],
				rightTopPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"200px"}, {}, {
					refreshTotalsPanel: ["wm.Panel", {"borderColor":"","height":"16px","horizontalAlign":"right","layoutKind":"left-to-right","margin":"0,20,0,0","verticalAlign":"top","width":"100%"}, {}, {
						refreshTotalsImg: ["wm.Picture", {"aspect":"h","borderColor":"","height":"16px","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"refreshTotalsImgClick"}]
					}],
					interactionPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						panel9: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"25px"}, {}, {
							picture3: ["wm.Picture", {"aspect":"h","height":"20px","source":"resources/images/o11n/state_user_input.png","width":"20px"}, {}]
						}],
						panel12: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"0,4,0,4","verticalAlign":"top","width":"100%"}, {}, {
							panel13: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"bottom","width":"100%"}, {}, {
								label8: ["wm.Label", {"caption":"Waiting for interaction","padding":"4","styles":{"fontFamily":"arial-narrow","fontSize":"14px","fontWeight":""},"width":"100%"}, {"onclick":"label8Click"}]
							}],
							panel14: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								interactionCount: ["wm.Label", {"align":"center","height":"26px","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {"onclick":"interactionCountClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionsCount.dataValue","targetProperty":"caption"}, {}]
									}]
								}],
								interactionLoading: ["wm.Picture", {"height":"26px","margin":"8,0,0,0","source":"resources/images/o11n/workingBar.gif","width":"40px"}, {"onclick":"interactionLoadingClick"}],
								label9: ["wm.Label", {"caption":"workflows","height":"26px","padding":"0,4,4,4","styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"100%"}, {"onclick":"label9Click"}]
							}]
						}]
					}],
					runningPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						panel15: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"25px"}, {}, {
							picture4: ["wm.Picture", {"aspect":"h","height":"20px","source":"resources/images/o11n/poweron_20x.gif","width":"20px"}, {}]
						}],
						panel16: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"0,4,0,4","verticalAlign":"top","width":"100%"}, {}, {
							panel17: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"bottom","width":"100%"}, {}, {
								label10: ["wm.Label", {"caption":"Running","padding":"4","styles":{"fontFamily":"arial-narrow","fontSize":"14px","fontWeight":""},"width":"100%"}, {"onclick":"label10Click"}]
							}],
							panel18: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								runningCount: ["wm.Label", {"align":"center","height":"26px","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {"onclick":"runningCountClick"}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"runningCountService.dataValue","targetProperty":"caption"}, {}]
									}]
								}],
								runningLoading: ["wm.Picture", {"height":"26px","margin":"8,0,0,0","source":"resources/images/o11n/workingBar.gif","width":"40px"}, {"onclick":"runningLoadingClick"}],
								label11: ["wm.Label", {"caption":"workflows","height":"26px","padding":"0,4,4,4","styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"100%"}, {"onclick":"label11Click"}]
							}]
						}]
					}],
					taskPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
						panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"25px"}, {}, {
							picture2: ["wm.Picture", {"aspect":"h","height":"20px","source":"resources/images/o11n/workflow_schedule48x.png","width":"20px"}, {}]
						}],
						panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"left","padding":"0,4,0,4","verticalAlign":"top","width":"100%"}, {}, {
							panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"bottom","width":"100%"}, {}, {
								label3: ["wm.Label", {"caption":"Scheduled in the system","padding":"4","styles":{"fontFamily":"arial-narrow","fontSize":"14px","fontWeight":""},"width":"100%"}, {}]
							}],
							panel5: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
								taskCount: ["wm.Label", {"align":"center","height":"26px","padding":"0,4,4,4","showing":false,"styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"20px"}, {}, {
									binding: ["wm.Binding", {}, {}, {
										wire: ["wm.Wire", {"expression":undefined,"source":"taskCountService.dataValue","targetProperty":"caption"}, {}]
									}]
								}],
								taskLoading: ["wm.Picture", {"height":"26px","margin":"8,0,0,0","source":"resources/images/o11n/workingBar.gif","width":"40px"}, {}],
								label2: ["wm.Label", {"caption":"workflows","height":"26px","padding":"0,4,4,4","styles":{"fontSize":"16px","fontWeight":"","backgroundColor":"","color":"#666666"},"width":"100%"}, {}]
							}]
						}]
					}]
				}]
			}],
			bottomPanel: ["wm.Panel", {"borderColor":"","height":"100%","horizontalAlign":"center","minDesktopHeight":200,"minHeight":200,"minWidth":250,"verticalAlign":"top","width":"100%"}, {}, {
				panel6: ["wm.Panel", {"height":"32px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
					bevel1: ["wm.Bevel", {"bevelSize":1,"height":"1px","styles":{"color":"","backgroundColor":"#ffffff","backgroundGradient":""},"width":"100%"}, {}]
				}],
				panel7: ["wm.Panel", {"height":"232px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
					versionInfoPanel: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"138px","horizontalAlign":"left","verticalAlign":"top","width":"416px"}, {}, {
						panel10: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"25px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"fontFamily":"","fontSize":"","backgroundColor":"#eeeeee"},"verticalAlign":"top","width":"100%"}, {}, {
							label5: ["wm.Label", {"borderColor":"#fbfbfb","caption":"Version Information","height":"100%","padding":"8","styles":{"fontSize":"13px","fontFamily":"arial-narrow","fontWeight":"bold"},"width":"100%"}, {}]
						}],
						panel19: ["wm.Panel", {"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label12: ["wm.Label", {"align":"left","border":"1","borderColor":"#eeeeee","caption":"Server","height":"100%","padding":"4,4,4,17","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"80px"}, {}],
							label13: ["wm.Label", {"border":"1","borderColor":"#eeeeee","height":"100%","padding":"4","styles":{"fontSize":"14px","fontFamily":"arial-narrow"},"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"aboutInfoService.apiVersion","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						panel8: ["wm.Panel", {"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label1: ["wm.Label", {"align":"left","border":"1","borderColor":"#eeeeee","caption":"Version","height":"100%","padding":"4,4,4,14","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"80px"}, {}],
							label4: ["wm.Label", {"border":"1","borderColor":"#eeeeee","height":"100%","padding":"4","styles":{"fontSize":"14px","fontFamily":"arial-narrow"},"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"aboutInfoService.version","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						panel11: ["wm.Panel", {"height":"35px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
							label6: ["wm.Label", {"align":"left","border":"1","borderColor":"#eeeeee","caption":"Build","height":"100%","padding":"4,4,4,17","styles":{"backgroundColor":"#F1F5FA","backgroundGradient":"","fontSize":"14px","fontFamily":"arial-narrow"},"width":"80px"}, {}],
							label7: ["wm.Label", {"border":"1","borderColor":"#eeeeee","height":"100%","padding":"4","styles":{"fontSize":"14px","fontFamily":"arial-narrow"},"width":"100%"}, {}, {
								binding: ["wm.Binding", {}, {}, {
									wire: ["wm.Wire", {"expression":undefined,"source":"aboutInfoService.buildNumber","targetProperty":"caption"}, {}]
								}]
							}]
						}],
						panel20: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"7px","horizontalAlign":"left","layoutKind":"left-to-right","styles":{"backgroundColor":"#eeeeee"},"verticalAlign":"top","width":"100%"}, {}]
					}]
				}]
			}]
		}],
		leftSpacePanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"45px"}, {}]
	}]}
 
wm.registerPackage(["vCO Widgets", "HomeInfo", "o11n.HomeInfo", "common.packages.o11n.HomeInfo", "images/wm/widget.png", "Info page to be used as home/landing page.", {width: "100%", height: "100%"},false]);