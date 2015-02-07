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
		$("#colorpicker").spectrum({
		    color: callback,
		    flat: true
		})
	})
}

$("main").on('mousewheel', function(event){
    return false;
}).onepage_scroll({
	animationTime: 500,
	keyboard: false,
	direction: "horizontal"
})

$("#colorpicker").on('dragstop.spectrum', function(e, color) {
	csInterface.evalScript("app.foregroundColor.rgb.hexValue = '" + color.toHex() + "'")
})