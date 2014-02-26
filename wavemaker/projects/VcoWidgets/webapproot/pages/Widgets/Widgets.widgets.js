Widgets.widgets = {
	widgetsLayoutBox: ["wm.Layout", {"border":"0","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		tabLayers2: ["wm.TabLayers", {"headerWidth":"200px","layoutKind":"left-to-right","transition":"slide","verticalButtons":true}, {"onShow":"tabLayers2Show"}, {
			homeInfoLayer: ["wm.Layer", {"border":"1","caption":"Home Info","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"homeInfoLayerShow"}, {
				o11nHomeInfo1: ["o11n.HomeInfo", {"deferDataLoad":true,"height":"100%","width":"100%"}, {"onRunningExecutionsClick":"o11nHomeInfo1RunningExecutionsClick","onUserInteractionsClick":"o11nHomeInfo1UserInteractionsClick"}]
			}],
			workflowList: ["wm.Layer", {"border":"1","caption":"Workflow List","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowListShow"}, {
				o11nWorkflowList1: ["o11n.WorkflowList", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
			}],
			workflowTreeLayer: ["wm.Layer", {"border":"1","caption":"Workflow Tree","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowTreeLayerShow"}, {
				o11nWorkflowTree1: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"100%"}, {}]
			}],
			recentRunsLayer: ["wm.Layer", {"border":"1","caption":"Recent Runs","horizontalAlign":"right","layoutKind":"left-to-right","themeStyleType":"ContentPanel","verticalAlign":"bottom"}, {"onShow":"recentRunsLayerShow"}, {
				fireEventButton: ["wm.Button", {"caption":"Fire Workfow Start Event","margin":"4","width":"230px"}, {"onclick":"fireEventButtonClick"}],
				o11nRecentRuns1: ["o11n.RecentRuns", {"currentRunningCount":0,"height":"100%","timerInitialDelay":3000,"timerMaxCount":40,"width":"245px"}, {"onAllExecutionsClick":"o11nRecentRuns1AllExecutionsClick","onFailedExecutionsClick":"o11nRecentRuns1FailedExecutionsClick","onRunningCountChange":"o11nRecentRuns1RunningCountChange","onRunningExecutionsClick":"o11nRecentRuns1RunningExecutionsClick","onUserInteractionsClick":"o11nRecentRuns1UserInteractionsClick"}]
			}],
			workflowRunsLayer: ["wm.Layer", {"autoScroll":true,"border":"1","caption":"Workflow Runs","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowRunsLayerShow"}, {
				o11nWorkflowRuns1: ["o11n.WorkflowRuns", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
			}],
			userInteractionsLayer: ["wm.Layer", {"autoScroll":true,"border":"1","caption":"User Interactions","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"userInteractionsLayerShow"}, {
				o11nUserInteractions1: ["o11n.UserInteractions", {"deferDataLoad":true,"height":"100%","width":"100%"}, {}]
			}],
			workflowInfoLayer: ["wm.Layer", {"border":"1","caption":"Workflow Info","horizontalAlign":"left","layoutKind":"left-to-right","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowInfoLayerShow"}, {
				o11nWorkflowTreeInfo: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"240px"}, {"onSelect":"o11nWorkflowTreeInfoSelect"}],
				splitter2: ["wm.Splitter", {"height":"100%","styles":{"backgroundColor":"#ffffff"},"width":"4px"}, {}],
				o11nWorkflowInfo1: ["o11n.WorkflowInfo", {"height":"100%","width":"100%"}, {}]
			}],
			presentationLayer: ["wm.Layer", {"border":"1","caption":"Presentation","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"presentationLayerShow"}, {
				o11nWorklowTreePresentation: ["o11n.WorkflowTree", {"deferDataLoad":true,"height":"100%","showing":false,"width":"100%"}, {"onSelect":"o11WorklowTreePresentationSelect"}],
				o11nPresentation1: ["o11n.Presentation", {"deferDataLoad":"true","height":"1%","width":"1%"}, {}]
			}],
			inventoryTreeLayer: ["wm.Layer", {"border":"1","caption":"Plugin Inventory Tree","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"inventoryTreeLayerShow"}, {
				o11nInventoryTree1: ["o11n.InventoryTree", {"deferDataLoad":true,"height":"100%","sdkType":"VC","showing":false,"width":"100%"}, {}]
			}],
			workflowCatalogLayer: ["wm.Layer", {"border":"1","caption":"Workflow Catalog","horizontalAlign":"left","themeStyleType":"ContentPanel","verticalAlign":"top"}, {"onShow":"workflowCatalogLayerShow"}, {
				o11nWorkflowCatalog1: ["o11n.WorkflowCatalog", {"deferDataLoad":true,"height":"100%","infoImgPrefixId":"wf-info:","runImgPrefixId":"wf-run:","width":"100%"}, {}]
			}]
		}]
	}]
}