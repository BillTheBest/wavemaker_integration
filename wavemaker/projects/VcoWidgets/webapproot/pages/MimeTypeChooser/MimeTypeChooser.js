dojo.declare("MimeTypeChooser", wm.Page, {
	start: function() {
		
	},
    
	"preferredDevice": "desktop",
    
    uploadedFile: null,

	dojoFileUploadSuccess: function(inSender, fileList) {
		this.uploadedFile = this.dojoFileUpload.getDataValue()[0];
        this.fileNameField.setDataValue(this.uploadedFile.name);
	},
    
	_end: 0
});