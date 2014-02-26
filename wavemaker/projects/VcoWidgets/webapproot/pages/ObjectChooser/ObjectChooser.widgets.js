ObjectChooser.widgets = {
	componentPublisher: ["wm.CompositePublisher", {"description":"vCO Presentation Object Chooser","displayName":"ObjectChooser","group":"vCO Widgets","namespace":"o11n","publishName":"ObjectChooser"}, {}],
	caption: ["wm.Property", {"bindSource":undefined,"property":"selectField.caption","type":"string"}, {}],
	typeVar: ["wm.Variable", {"type":"StringData"}, {}],
	sdkType: ["wm.Property", {"bindSource":undefined,"property":"typeVar.dataValue"}, {}],
	selectionVar: ["wm.Variable", {"type":"AnyData"}, {}],
	selection: ["wm.Property", {"bindSource":undefined,"property":"selectionVar.dataValue"}, {}],
	layoutBox1: ["wm.Layout", {"height":"50px","horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"bottom"}, {}, {
		selectField: ["wm.Text", {"caption":"vCO Object","captionAlign":"left","captionPosition":"top","captionSize":"28px","dataValue":undefined,"desktopHeight":"48px","displayValue":"","height":"48px","width":"100%"}, {}],
		selectButton: ["wm.Button", {"caption":"Select","margin":"4"}, {"onclick":"selectButtonClick"}]
	}]
}