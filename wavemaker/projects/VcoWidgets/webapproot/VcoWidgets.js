dojo.declare("VcoWidgets", wm.Application, {
	"dialogAnimationTime": 350, 
	"disableDirtyEditorTracking": false, 
	"eventDelay": 0, 
	"i18n": false, 
	"isSecurityEnabled": false, 
	"main": "Main", 
	"manageHistory": true, 
	"manageURL": true, 
	"name": "", 
	"phoneGapLoginPage": "Login", 
	"phoneMain": "", 
	"projectSubVersion": 4, 
	"projectVersion": 1, 
	"showIOSPhoneGapBackButton": false, 
	"studioVersion": "6.5.3.Release", 
	"tabletMain": "", 
	"theme": "wm_default", 
	"toastPosition": "br", 
	"touchToClickDelay": 500, 
	"touchToRightClickDelay": 1500,
	"widgets": {
		silkIconList: ["wm.ImageList", {"colCount":39,"height":16,"iconCount":90,"url":"lib/images/silkIcons/silk.png","width":16}, {}]
	},
	_end: 0
});

VcoWidgets.extend({

    printObjectProps: function(h, allInheritedProps) {
         console.log("[App:] Printing properties for object: ");
        for (var k in h) {
            // use hasOwnProperty to filter out keys from the Object.prototype
            if(allInheritedProps || h.hasOwnProperty(k)) {
                console.log('key is: ' + k + ', value is: ' + h[k]);
            }
        }
    },
    _end: 0
});