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
	Persistent(true)

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
		    clickoutFiresChange: true,
		    showButtons: false
		})
	})
}

$("main").on('mousewheel', function(event){
    return false;
}).onepage_scroll({
	animationTime: 250,
	direction: "horizontal"
})

$("#colorpicker").on('mouseup mouseleave', function(event) {
	var color = $("#spectrum").spectrum("get").toHex()
	generate(color)

	if (event.altKey) {
		csInterface.evalScript("app.backgroundColor.rgb.hexValue = '" + color + "'")
	} else {
		csInterface.evalScript("app.foregroundColor.rgb.hexValue = '" + color + "'")
	}	
})


function generate (c) {

	for (var i = 0; i < 7; i++) {
		$(".T li")[i].style.backgroundColor = palette.t(c)[i]
		$(".H li")[i].style.backgroundColor = palette.h(c)[i]
	}
}

var palette = {
	t: function(baseColor){
		var palette = new Array()
		var gap = 20

		for (var i = 0; i < 7; i++) {
		    if (i < 4) {
		        palette[i] = tinycolor.mix(baseColor, tinycolor("Blue") , ~(i - 4) * 0.15)
		                .darken(~(i - 4) * 0.15)
		                .saturate(~(i - 4) * 0.3)
		                .toHexString()
		    } else{
		        palette[i] = tinycolor.mix(baseColor, tinycolor("Gold") , i * 0.06)
		                .lighten(i * 0.075)
		                .saturate(i * 0.01)
		                .toHexString()
		    }
		}

		return palette;
	},
	
	h: function(baseColor){
		var palette = new Array()
		var gap = 20

		for (var i = 0; i < 7; i++) {
			palette[i] = tinycolor(baseColor).spin((i - 3) * gap)
		}
		return palette  
	}
}


























