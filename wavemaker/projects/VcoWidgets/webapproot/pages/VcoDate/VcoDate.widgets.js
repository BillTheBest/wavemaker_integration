VcoDate.widgets = {
	compositePublisher1: ["wm.CompositePublisher", {"description":"vCO Date","displayName":"VcoDate","group":"vCO Widgets","namespace":"o11n","publishName":"VcoDate"}, {}],
	caption1: ["wm.Property", {"bindSource":undefined,"property":"dateField.caption","type":"string"}, {}],
	onChange: ["wm.Property", {"isEvent":true,"property":"dateField.onchange","type":"string"}, {}],
	onEnterKeyPress: ["wm.Property", {"isEvent":true,"property":"dateField.onEnterKeyPress","type":"string"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","verticalAlign":"top"}, {}, {
		dateField: ["wm.DateTime", {"caption":"date:","captionAlign":"left","captionPosition":"top","captionSize":"22px","datePattern":"MMM dd, yy","desktopHeight":"48px","displayValue":"","height":"48px"}, {"onchange":"dateFieldChange"}]
	}]
}