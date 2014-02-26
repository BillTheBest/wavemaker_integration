dojo.provide("wm.studio.pages.VcoImporter.VcoImporter");

dojo.declare("VcoImporter", wm.Page, {

	AUTH_SHARED_SESSION: "sharedSession",
    AUTH_SESSION_PER_USER: "sessionPerUser",

    start: function() {
    },

    reset: function() {
        try {
            var loginInfo = {partnerName:"vco"};
            var d = this.importerService.requestAsync("listAllOperations", [loginInfo],
                dojo.hitch(this, "statusInfoSuccess"),
                dojo.hitch(this, "statusInfoError"));
        } catch(e) {
            console.error('ERROR IN reset: ' + e);
        }
    },

    closeBtnClick: function(inSender) {
        try {
            this.owner.owner.hide();
        } catch(e) {
            console.error('ERROR IN cancelBtnClick: ' + e); 
        } 
    },

    saveBtnClick: function(inSender) {
        try {

            var loginInfo = {};
            loginInfo.host = this.server.getDataValue();
            loginInfo.port = this.port.getDataValue();
            loginInfo.userName = this.ldapUser.getDataValue();
            loginInfo.password = this.ldapPass.getDataValue();

			var groupvalue = this.sharedSessionRadio.getGroupValue();
			switch(groupvalue) {
			case this.AUTH_SESSION_PER_USER:
			    loginInfo.miscInfo =  this.AUTH_SESSION_PER_USER;
			    break;
			default:
				loginInfo.miscInfo = this.AUTH_SHARED_SESSION;
			}

            loginInfo.partnerName = "vco";
            /* Call the import service; onSuccess calls importOperationsSuccess; onError calls importOperationsError */
            var d = this.importerService.requestAsync("importOperations", [loginInfo, "SAVEAUTH"],
               dojo.hitch(this, "importOperationsSuccess"),
               dojo.hitch(this, "importOperationsError"));
        } catch(e) {
            console.error('ERROR IN saveBtnClick: ' + e); 
        }
    },

    statusInfoSuccess: function(data) {
        var result = JSON.parse(data);
        this.server.setDataValue(result.auth.host);
        this.port.setDataValue(result.auth.port);
        this.ldapUser.setDataValue(result.auth.username);
		
		var groupvalue = result.auth.miscInfo;
		switch(groupvalue) {
		case this.AUTH_SESSION_PER_USER:
			this.sessionPerUserRadio.setChecked(true);
			break;
		default:
			this.sharedSessionRadio.setChecked(true);
		}
	
        this.servicesStatus.setDataValue(result.servicesState);
        this.widgetsStatus.setDataValue(result.widgetsState);
    },

    statusInfoError: function(inError) {
        console.error(inError.message);
        app.toastError(inError.message)
    },

    importOperationsSuccess: function() {
        app.toastSuccess("Server settings saved.");
    },

    /* After successfully saving data, update studio's services tree */
    importServicesSuccess: function() {
        app.toastSuccess("Services import successful.");
        this.reset();
    },

    /* After successfully saving data, update studio's services tree */
    importWidgetsSuccess: function() {
        app.toastSuccess("Widgets import successful.");
        this.reset();
    },

    importOperationsError: function(inError) {
        console.error(inError.message);
        app.toastError(inError.message);
    },

    instSrvcBtnClick: function() {
        try {
            var loginInfo = {};
            loginInfo.partnerName = "vco";
            var d = this.importerService.requestAsync("importOperations", [loginInfo, "INSTSERV"],
               dojo.hitch(this, "importServicesSuccess"),
               dojo.hitch(this, "importOperationsError"));
        } catch(e) {
            console.error('ERROR IN instSrvcBtnClick: ' + e);
        }
    },

    instWidgBtnClick: function() {
        try {
            var loginInfo = {};
            loginInfo.partnerName = "vco";
            var d = this.importerService.requestAsync("importOperations", [loginInfo, "INSTWIDG"],
               dojo.hitch(this, "importWidgetsSuccess"),
               dojo.hitch(this, "importOperationsError"));
        } catch(e) {
            console.error('ERROR IN instWidgBtnClick: ' + e);
        }
    },

    _end: 0
});



