dojo.provide("common.packages.o11n.MimeTypeChooser");
 
dojo.declare("o11n.MimeTypeChooser", wm.Composite, {
  horizontalAlign: "left",
  verticalAlign: "top",
  layoutKind: "left-to-right",
	start: function() {
		
	},
    
	"preferredDevice": "desktop",
    
    uploadedFile: null,

	dojoFileUploadSuccess: function(inSender, fileList) {
		this.uploadedFile = this.components.dojoFileUpload.getDataValue()[0];
        this.components.fileNameField.setDataValue(this.uploadedFile.name);
	},
    
	_end: 0
});
 
o11n.MimeTypeChooser.components = {
	fileNameField: ["wm.Text", {"caption":undefined,"dataValue":undefined,"disabled":true,"displayValue":""}, {}],
	dojoFileUpload: ["wm.DojoFileUpload", {"height":"26px","service":"PresentationService","useList":false,"width":"115px"}, {"onSuccess":"dojoFileUploadSuccess"}, {
		input: ["wm.ServiceInput", {"type":"uploadFileInputs"}, {}]
	}]}
 
wm.registerPackage(["vCO Widgets", "MimeTypeChooser", "o11n.MimeTypeChooser", "common.packages.o11n.MimeTypeChooser", "images/wm/widget.png", "Mime Type Chooser", {width: "250px", height: "150px"},false]);