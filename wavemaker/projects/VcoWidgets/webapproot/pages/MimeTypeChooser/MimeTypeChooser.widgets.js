MimeTypeChooser.widgets = {
	compositePublisher1: ["wm.CompositePublisher", {"description":"Mime Type Chooser","displayName":"MimeTypeChooser","group":"vCO Widgets","namespace":"o11n","publishName":"MimeTypeChooser"}, {}],
	layoutBox1: ["wm.Layout", {"horizontalAlign":"left","layoutKind":"left-to-right","verticalAlign":"top"}, {}, {
		fileNameField: ["wm.Text", {"caption":undefined,"dataValue":undefined,"disabled":true,"displayValue":""}, {}],
		dojoFileUpload: ["wm.DojoFileUpload", {"height":"26px","service":"PresentationService","useList":false,"width":"115px"}, {"onSuccess":"dojoFileUploadSuccess"}, {
			input: ["wm.ServiceInput", {"type":"uploadFileInputs"}, {}]
		}]
	}]
}