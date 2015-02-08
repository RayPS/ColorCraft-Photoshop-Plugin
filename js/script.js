////////////////////////////////////////////
////                                    ////
////        ColorShading			    ////
////        www.RayPS.com               ////
////		2015-02-07      			////
////                                    ////
////////////////////////////////////////////

(function () {
	'use strict';
}());


var csInterface = new CSInterface();
var myExtensionId = "colorshading"

function init() {
	themeManager.init();
	Persistent(false)

	spectrum(false)

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

function spectrum(isBackground) {
	var script
	if (isBackground) {
		script = "app.backgroundColor.rgb.hexValue"
	} else{
		script = "app.foregroundColor.rgb.hexValue"
	}

	csInterface.evalScript(script ,function(callback){
		$("#spectrum").spectrum({
		    color: callback,
		    flat: true,
		    clickoutFiresChange: true
		})
	})
}

$("main").on('mousewheel', function(event){
    return false;
}).onepage_scroll({
	animationTime: 500,
	direction: "horizontal"
})


$("#colorpicker").mouseup(function(event) {
	var color = $("#spectrum").spectrum("get").toHex()
	if (event.altKey) {
		csInterface.evalScript("app.backgroundColor.rgb.hexValue = '" + color + "'")
	} else {
		csInterface.evalScript("app.foregroundColor.rgb.hexValue = '" + color + "'")
	}
})