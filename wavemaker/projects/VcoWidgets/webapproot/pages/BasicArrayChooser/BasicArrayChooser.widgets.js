BasicArrayChooser.widgets = {
	componentPublisher: ["wm.CompositePublisher", {"description":"Basic Array Chooser","group":"vCO Widgets","namespace":"o11n","publishName":"BasicArrayChooser"}, {}],
	selectionVar: ["wm.Variable", {"isList":true,"json":"[]","type":"AnyData"}, {}],
	selectedItems: ["wm.Property", {"bindTarget":undefined,"property":"selectionVar.queriedItems","type":"AnyData"}, {}],
	onSetData: ["wm.Property", {"isEvent":true,"property":"selectionVar.onSetData","type":"string"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		label1: ["wm.Label", {"caption":"Array","padding":"4"}, {}],
		itemPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}],
		insertBtn: ["wm.Button", {"caption":"Insert","margin":"4"}, {"onclick":"insertBtnClick"}],
		itemListPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			itemScrollerPanel: ["wm.Panel", {"height":"100%","horizontalAlign":"left","verticalAlign":"top","width":"100%"}, {}, {
				itemList: ["wm.List", {"_classes":{"domNode":["GridListStyle"]},"border":"1","columns":[{"show":true,"field":"dataValue.name","title":"Name","width":"100%","align":"left","editorProps":{"restrictValues":true},"isCustomField":true,"mobileColumn":true},{"show":false,"field":"dataValue","title":"DataValue","width":"100%","displayType":"Any","align":"left","formatFunc":""}],"headerVisible":false,"height":"100%","minDesktopHeight":60,"scrollToSelection":true}, {}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":undefined,"source":"selectionVar","targetProperty":"dataSet"}, {}]
					}]
				}]
			}],
			panel3: ["wm.Panel", {"height":"100%","horizontalAlign":"center","verticalAlign":"top","width":"24px"}, {}, {
				deletePic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/deleteIconEnabled.png","width":"18px"}, {"onclick":"deletePicClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"${itemList.emptySelection}","targetProperty":"disabled"}, {}]
					}]
				}],
				upPic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/moveUp.png","width":"18px"}, {"onclick":"upPicClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"${itemList.emptySelection} || ${itemList.selectedIndex} == 0","targetProperty":"disabled"}, {}]
					}]
				}],
				downPic: ["wm.Picture", {"height":"18px","source":"resources/images/o11n/moveDown.png","width":"18px"}, {"onclick":"downPicClick"}, {
					binding: ["wm.Binding", {}, {}, {
						wire: ["wm.Wire", {"expression":"${itemList.emptySelection} || ${itemList.selectedIndex} == ${itemList.count} - 1","targetProperty":"disabled"}, {}]
					}]
				}]
			}]
		}]
	}]
}