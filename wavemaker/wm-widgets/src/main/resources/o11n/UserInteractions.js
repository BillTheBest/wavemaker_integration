dojo.provide("common.packages.o11n.UserInteractions");
 
dojo.declare("o11n.UserInteractions", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "top-to-bottom",
    "preferredDevice": "desktop",
    sortOrders: [],
    presentation: null,
    deferDataLoad: false,

    start: function() {
        this.components.currentPagination.setValue("dataValue", 1);
        this.specVar.setData({
            startIndex: 0,
            maxResult: 20,
            sortOrders: "-createDate"
        });
        if (!this.deferDataLoad) {
            this.load();
        } else {
            console.log("[UserInteractions]: data load deferred...");
        }
        this.subscribe("ExecutionStateChangeEvent", this, "handleExecutionStateChangeEvent");
    },

    load: function() {
        this.components.userInteractionsService.update();
        console.log("[UserInteractions]: initial update...");
    },

    handleExecutionStateChangeEvent: function(inEvent) {
        this.components.userInteractionsService.update();
        console.log("[UserInteractions]: Reloading data on ExecutionStateChangeEvent...");
    },

    userInteractionsServiceSuccess: function(inSender, inDeprecated) {
        this.setMaxPagination(inSender.getData().total);
        this.components.user_interactions_grid.show();
    },

    user_interactions_gridRenderData: function(inSender) {
        this.disableDefaultSortingIfPagination();
    },

    disableDefaultSortingIfPagination: function() {
        if (this.components.maxPaginationVar.data.dataValue > 1) {
            this.components.user_interactions_grid.dojoObj.canSort = function() {
                return false;
            };
        }
    },

    setMaxPagination: function(total) {
        total = total > 1 ? total : 1;
        var value = Math.ceil(total / this.specVar.getValue("maxResult"));
        value = value === 0 ? 1 : value;
        this.components.maxPaginationVar.setValue("dataValue", value);
    },

    paginationPageNumberChange: function(inSender, inDisplayValue, inDataValue, inSetByCode) {
        if (inSetByCode) {
            return;
        }
        this.paginate(inDataValue);
    },

    paginate: function(paginationPageNum) {
        if (!this.isPaginationNumValid(paginationPageNum)) {
            return;
        }
        if (this.components.currentPagination.data.dataValue == paginationPageNum) {
            return;
        }
        this.components.currentPagination.setValue("dataValue", paginationPageNum);
        this.specVar.setValue("startIndex", (paginationPageNum - 1) * this.specVar.getValue("maxResult"));
        this.components.userInteractionsService.update();
        console.log("[UserInteractions]: Paginate Update...");
    },

    isPaginationNumValid: function(paginationPageNum) {
        return paginationPageNum >= 1 && this.components.maxPaginationVar.data.dataValue >= paginationPageNum;
    },

    next_page_imgClick: function(inSender) {
        this.paginate(this.components.currentPagination.data.dataValue + 1);
    },

    prev_page_imgClick: function(inSender) {
        this.paginate(this.components.currentPagination.data.dataValue - 1);
    },

    last_page_imgClick: function(inSender) {
        this.paginate(this.components.maxPaginationVar.data.dataValue);
    },

    first_page_imgClick: function(inSender) {
        this.paginate(1);
    },

    user_interactions_gridHeaderClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if (this.components.maxPaginationVar.data.dataValue <= 1) {
            return;
        }
        if (fieldId === "description") {
            //the vco server throws null pointer exception when description.
            return;
        }
        this.set_selected_field_sorted_order(fieldId);
        var sortOrdersReverse = this.sortOrders.concat([]).reverse();
        this.specVar.setValue("sortOrders", sortOrdersReverse.toString());
        this.components.userInteractionsService.update();
        console.log("[UserInteractions]: On sort update... ");
    },

    set_selected_field_sorted_order: function(fieldId) {
        var asending = "+";
        var desending = "-";
        var i = this.sortOrders.indexOf(asending + fieldId);
        if (i != -1) {
            this.sortOrders.splice(i, 1);
            this.sortOrders.push(desending + fieldId);
            return;
        }

        i = this.sortOrders.indexOf(desending + fieldId);
        if (i != -1) {
            this.sortOrders.splice(i, 1);
            this.sortOrders.push(asending + fieldId);
            return;
        }

        this.sortOrders.push(asending + fieldId);
    },

    userInteractionsServiceError: function(inSender, inError) {
        app.toastError("Error: " + inError);
    },

    answer: function(userInteractionId) {
        if (!this.presentation) {
            this.presentation = this.components.presentationRootPanel.createComponent("o11nPresentation", "o11n.Presentation", {
                width: "100%",
                height: "100%",
                userInteractionId: userInteractionId
            });
            this.components.presentationRootPanel.reflow();
            this.connect(this.presentation, "onSubmit", this, "handleOnSubmitPresentation");
        } else {
            this.presentation.userInteractionId = userInteractionId;
            this.presentation.start();
        }
    },

    handleOnSubmitPresentation: function() {
        this.specVar.setValue("startIndex", 0);
        this.components.currentPagination.setValue("dataValue", 1);
        this.components.userInteractionsService.update();
        this.components.user_interactions_grid.updateSelectedItem(-1);
    },

    user_interactions_gridClick: function(inSender, evt, selectedItem, rowId, fieldId, rowNode, cellNode) {
        if ("id" === fieldId) {
            this.answer(selectedItem.getData().id);
        }
    },

    _end: 0
});
 
o11n.UserInteractions.components = {
	userInteractionsService: ["wm.ServiceVariable", {"inFlightBehavior":"executeLast","operation":"getUserInteractions","service":"WorkflowService"}, {"onError":"userInteractionsServiceError","onSuccess":"userInteractionsServiceSuccess"}, {
		input: ["wm.ServiceInput", {"type":"getUserInteractionsInputs"}, {}, {
			binding: ["wm.Binding", {}, {}, {
				wire: ["wm.Wire", {"expression":undefined,"source":"specVar","targetProperty":"spec"}, {}]
			}]
		}],
		binding: ["wm.Binding", {}, {}, {
			wire: ["wm.Wire", {"expression":undefined,"source":"panel2","targetProperty":"loadingDialog"}, {}]
		}]
	}],
	specVar: ["wm.Variable", {"type":"com.vmware.o11n.wm.common.QuerySpec"}, {}],
	currentPagination: ["wm.Variable", {"type":"NumberData"}, {}],
	maxPaginationVar: ["wm.Variable", {"type":"NumberData"}, {}],
	executions_panel: ["wm.Panel", {"autoScroll":true,"borderColor":"#999999","height":"100%","horizontalAlign":"left","margin":"0,0,5,0","verticalAlign":"top","width":"100%"}, {}, {
		panel2: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
			panel5: ["wm.Panel", {"border":"1","borderColor":"#999999","height":"28px","horizontalAlign":"left","layoutKind":"left-to-right","minDesktopHeight":200,"styles":{"backgroundColor":""},"verticalAlign":"top","width":"100%"}, {}, {
				image1: ["wm.Picture", {"disabled":true,"height":"18px","hint":"user interactions","padding":"5","source":"resources/images/o11n/state_user_input.png","width":"18px"}, {}],
				label1: ["wm.Label", {"borderColor":"","caption":"User Interactions","padding":"0,0,0,4","styles":{"fontWeight":"bold","fontSize":"12px","textDecoration":""},"width":"131px"}, {}],
				panel6: ["wm.Panel", {"height":"100%","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
					panel4: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
						presentationRootPanel: ["wm.Panel", {"height":"2px","horizontalAlign":"left","showing":false,"verticalAlign":"top","width":"2px"}, {}]
					}],
					picture3: ["wm.Picture", {"aspect":"v","borderColor":"","height":"16px","hint":"refresh","source":"resources/images/o11n/refresh_20x20.png","width":"16px"}, {"onclick":"userInteractionsService"}],
					separator6: ["wm.Label", {"caption":"","height":"100%","padding":"4","width":"10px"}, {}]
				}]
			}],
			user_interactions_grid: ["wm.DojoGrid", {"border":"0","borderColor":"","caseSensitiveSort":false,"columns":[{"show":false,"field":"PHONE COLUMN","title":"-","width":"100%","align":"left","editorProps":{"restrictValues":true},"expression":"\"<div class='MobileRowTitle'>Date: \" + wm.List.prototype.dateFormatter({\"datePattern\":\"MM/dd/yyyy h:mm a\"}, null,null,null,${createDate}) + \"</div>\"\n+ \"<div class='MobileRow'>Name: \" + ${name} + \"</div>\"\n+ \"<div class='MobileRow'>Description: \" + ${description} + \"</div>\"\n","mobileColumn":true},{"show":true,"field":"id","title":"Answer","width":"60px","align":"center","formatFunc":"wm_image_formatter","editorProps":{"restrictValues":true},"expression":"\"resources/images/o11n/Answer_active_16.png\"","mobileColumn":false},{"show":true,"field":"createDate","title":"Date","width":"130px","align":"center","formatFunc":"wm_date_formatter","formatProps":{"datePattern":"MM/dd/yyyy h:mm a"},"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"name","title":"Name","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":true,"field":"description","title":"Description","width":"100%","align":"left","formatFunc":"","formatProps":null,"editorProps":{"restrictValues":true},"mobileColumn":false},{"show":false,"field":"workflowId","title":"WorkflowId","width":"100%","align":"left","formatFunc":"","mobileColumn":false},{"show":false,"field":"executionId","title":"ExecutionId","width":"100%","align":"left","formatFunc":"","mobileColumn":false}],"deleteConfirm":undefined,"height":"100%","localizationStructure":{},"margin":"4","minDesktopHeight":200,"minHeight":200,"minWidth":500,"padding":"0,0,5,0","primaryKeyFields":["id"],"selectFirstRow":true,"showing":false,"styles":{"color":"#000000"}}, {"onClick":"user_interactions_gridClick","onHeaderClick":"user_interactions_gridHeaderClick","onRenderData":"user_interactions_gridRenderData","onSort":"user_interactions_gridSort"}, {
				binding: ["wm.Binding", {}, {}, {
					wire: ["wm.Wire", {"expression":undefined,"source":"userInteractionsService.list","targetProperty":"dataSet"}, {}]
				}]
			}]
		}],
		panel1: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			paginigPanel: ["wm.Panel", {"height":"25px","horizontalAlign":"right","layoutKind":"left-to-right","styles":{"backgroundColor":""},"verticalAlign":"top","width":"190px"}, {}, {
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
	}]}
 
wm.registerPackage(["vCO Widgets", "UserInteractions", "o11n.UserInteractions", "common.packages.o11n.UserInteractions", "images/wm/widget.png", "List of all pending User Interactions", {width: "100%", height: "100%"},false]);