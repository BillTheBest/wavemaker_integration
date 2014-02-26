VcoImporter.widgets = {
	importerService: ["wm.JsonRpcService", {service: "pwsImportService", sync: false}, {}],

	layoutBox: ["wm.Layout", {"_classes":{"domNode":["wm_BackgroundColor_SteelBlue"]},"height":"460px","horizontalAlign":"left","verticalAlign":"top","width":"963px"}, {}, {
		authPanel: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_VeryLightGray"]},"border":"1","borderColor":"#aaaaaa","height":"278px","horizontalAlign":"left","margin":"2","verticalAlign":"top","width":"100%"}, {}, {
			serverLabel: ["wm.Label", {"border":"0","caption":"Server","padding":"2"}, {}],
			server: ["wm.Text", {"border":"0","caption":"Server","captionSize":"100px","displayValue":"","width":"295px", "helpText": "The domain name/ip for vCO server."}, {}],
			port: ["wm.Text", {"caption":"Port","captionSize":"100px","displayValue":"","width":"170px", "helpText": "The port number for vCO REST API services."}, {}],
			authLabel: ["wm.Label", {"border":"0","caption":"Authentication","padding":"4"}, {}],
			ldapPanel: ["wm.Panel", {"height":"142px","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				ldapUser: ["wm.Text", {"caption":"Username","captionSize":"100px","displayValue":"", "helpText": "Username used only when 'Shared Session' is selected"}, {}],
				ldapPass: ["wm.Text", {"caption":"Password","captionSize":"100px","displayValue":"","password":true, "helpText": "User password used only when 'Shared Session' is selected"}, {}],
				sharedSessionRadio: ["wm.RadioButton", {"caption":"Shared Session","horizontalAlign":"left","captionPosition":"left", "captionSize":"100px","checkedValue":"sharedSession","displayValue":"","radioGroup":"authenticationType", "helpText": "The username/password entered here would be shared for all the connection to vCO. The user authentication should be handled by wavemaker in this case."}, {}],
				sessionPerUserRadio: ["wm.RadioButton", {"caption":"Session Per User","horizontalAlign":"left","captionPosition":"left","captionSize":"100px","checkedValue":"sessionPerUser","displayValue":"","radioGroup":"authenticationType","helpText": "The the currently logged in user credentials would be used to connect to vCO. In this case, vCO is used as the only Authentication provider."}, {}],
			}],
			buttonPanel: ["wm.MainContentPanel", {"height":"38px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				saveBtn: ["wm.Button", {"caption":"Save","margin":"4"}, {"onclick":"saveBtnClick"}]
			}]
		}],
		servicesPanel: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_VeryLightGray"]},"borderColor":"#aaaaaa","height":"85px","horizontalAlign":"left","margin":"3","verticalAlign":"top","width":"100%"}, {}, {
			servicesLabel: ["wm.Label", {"border":"0","caption":"Import Services to project"}, {}],
			servicesStatus: ["wm.Text", {"caption":"Services","displayValue":"","readonly":true}, {}],
			buttonPanel2: ["wm.MainContentPanel", {"height":"45px", "style": "top=38", "horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle","width":"100%"}, {}, {
				instSrvcBtn: ["wm.Button", {"caption":"Install Services","margin":"4","width":"122px"}, {"onclick":"instSrvcBtnClick"}]
			}]
		}],
		widgetsPanel: ["wm.MainContentPanel", {"_classes":{"domNode":["wm_BackgroundColor_VeryLightGray"]},"borderColor":"#aaaaaa","height":"85px","horizontalAlign":"left","margin":"3","verticalAlign":"top","width":"100%"}, {}, {
			widgetsLabel: ["wm.Label", {"border":"0","caption":"Import Widgets to workspace","padding":"4"}, {}],
			widgetsStatus: ["wm.Text", {"caption":"Widgets","displayValue":"","readonly":true}, {}],
			buttonPanel3: ["wm.MainContentPanel", {"height":"45px","horizontalAlign":"right","layoutKind":"left-to-right","verticalAlign":"middle", "width":"100%"}, {}, {
				instWidgBtn: ["wm.Button", {"caption":"Install Widgets","margin":"4","width":"122px"}, {"onclick":"instWidgBtnClick"}]
			}]
		}],
		buttonPanel1: ["wm.MainContentPanel", {"height":"45px","horizontalAlign":"right","layoutKind":"left-to-right","margin":"3","verticalAlign":"middle","width":"100%"}, {}, {
			closelBtn: ["wm.Button", {"caption":"Close","margin":"4"}, {"onclick":"closeBtnClick"}]
		}]
	}]
}
