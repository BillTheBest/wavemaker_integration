ArrayChooser.widgets = {
	componentPublisher: ["wm.CompositePublisher", {"description":"Array Chooser","displayName":"ArrayChooser","group":"vCO Widgets","namespace":"o11n","publishName":"ArrayChooser"}, {}],
	selectedItems: ["wm.Property", {"bindTarget":undefined,"property":"selectionVar.queriedItems"}, {}],
	layoutBox1: ["wm.Layout", {"height":"50px","horizontalAlign":"left","verticalAlign":"top"}, {}, {
		arrayLabel: ["wm.Label", {"caption":"Array Chooser","padding":"4","width":"478px"}, {}],
		panel1: ["wm.Panel", {"height":"30px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top","width":"100%"}, {}, {
			selectedList: ["wm.Text", {"captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"disabled":true,"displayValue":"","width":"400px"}, {}],
			selectBtn: ["wm.Button", {"caption":"Select...","desktopHeight":"24px","height":"24px","margin":"4"}, {"onclick":"selectBtnClick"}]
		}]
	}]
}