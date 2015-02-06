////////////////////////////////////////////
////                                    ////
////        ColorShading			    ////
////        www.RayPS.com               ////
////		2015-02-07      			////
////                                    ////
////////////////////////////////////////////


(function () {
	'use strict';

	var csInterface = new CSInterface();
	var myExtensionId = "colorshading"

	function init() {
		themeManager.init();
		Persistent(false)
	}
	init();


	function Persistent(inOn) {
	
	    if (inOn){
	        var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
	    } else {
	        var event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
	    }
	    event.extensionId = myExtensionId;
	    csInterface.dispatchEvent(event);
	}


}());

//EOF




