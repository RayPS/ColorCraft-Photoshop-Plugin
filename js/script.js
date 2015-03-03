////////////////////////////////////
////							////
////        ColorCraft			////
////        www.RayPS.com		////
////		2015-02-07			////
////							////
////////////////////////////////////

(function () {
	'use strict';
	// Codes goes here
}());


var csInterface = new CSInterface();
var myExtensionId = "colorcraft";
var application = csInterface.getApplicationID();
var MouseIsDown;

function init() {

	themeManager.init();
	persistent(true)
	register(true)
	spectrumInit()

	document.oncontextmenu = function() {return false;};
}
init();


var palette = {
	t: function(color){
		var C = new Array()

		for (var i = 0; i < 7; i++) {
		    if (i < 4) {
		        C[i] = tinycolor.mix(color, tinycolor("Blue") , ~(i - 4) * 20)
		        				.darken(~(i - 4) * 5)
		        				.desaturate(~(i - 4) * 3)
		                		.toHexString()
		    } else{
		        C[i] = tinycolor.mix(color, tinycolor("Yellow") , i * 6)
		        				.brighten(i * 3)
		            		    .toHexString()
		    }
		}

		return C;
	},

	b: function(color){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(color).brighten((i - 3) * gap)
		}
		return C 
	},

	l: function(color){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(color).lighten((i - 3) * gap)
		}
		return C 
	},

	s: function(color){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(color).saturate((i - 3) * gap)
		}
		return C 
	},

	h: function(color){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(color).spin((i - 3) * gap)
		}
		return C  
	}
}


function persistent(inOn) {

    if (inOn){
        var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
    } else {
        var event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
    }
    event.extensionId = myExtensionId;
    csInterface.dispatchEvent(event);
}

function register(inOn){

	if (inOn) {
        var event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
    } else {
        var event = new CSEvent("com.adobe.PhotoshopUnRegisterEvent", "APPLICATION");
    }

	event.extensionId = myExtensionId
	event.data = "1936028772"
	// 1936028772 = charIDToTypeID( "setd" ) = set
	// 1181902659 = charIDToTypeID( "FrgC" ) = foregroundColor
	// 1113811779 = charIDToTypeID( "BckC" ) = backgroundColor
	csInterface.dispatchEvent(event)
	csInterface.addEventListener("PhotoshopCallback", PSCallback)
}

function spectrumInit(){
	getAppColor(false, function(callback){
		$("#spectrum").spectrum({
		    color: callback,
		    flat: true,
		    clickoutFiresChange: true,
		    showButtons: false
		})

		pick(callback,true)
	})
}

function getAppColor(isSecendColor, doSomething){
	if (application == "ILST") {
		// AI
		csInterface.evalScript("aiGetColor" ,function(callback){

			if (callback) {
				doSomething(callback)
			}
		})

	} else {
		var script
		if (isSecendColor) {
			script = "app.backgroundColor.rgb.hexValue"
		} else{
			script = "app.foregroundColor.rgb.hexValue"
		}

		csInterface.evalScript(script ,function(callback){
			doSomething(callback)
		})
	}
}

function setAppColor(color, isSecendColor){
	if (application == "ILST") {
		// AI
		var rgb = tinycolor(color).toRgb()
		csInterface.evalScript("aiSetColor(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + isSecendColor + ")",function(callback){
			if(!callback){
				alert("no document found.")
			}
		})

	} else {
		// PS

		var script
		var hex = tinycolor(color).toHex()
		if (isSecendColor) {
			script = "app.backgroundColor.rgb.hexValue = '" + hex + "'"
		} else{
			script = "app.foregroundColor.rgb.hexValue = '" + hex + "'"
		}
		csInterface.evalScript(script)
	}
}

function getSpectrum(){
	return $("#spectrum").spectrum("get")
}

function generate (color) {

	for (var i = 0; i < 7; i++) {
		$(".T li")[i].style.backgroundColor = palette.t(color)[i]
		$(".B li")[i].style.backgroundColor = palette.b(color)[i]
		$(".L li")[i].style.backgroundColor = palette.l(color)[i]
		$(".S li")[i].style.backgroundColor = palette.s(color)[i]
		$(".H li")[i].style.backgroundColor = palette.h(color)[i]
	}
}

function pick(color, regen, isBackground){
	
	$(".selected").removeClass('selected')
	setAppColor(color, isBackground)
	$("#spectrum").spectrum("set", color)
	
	regen && generate(color)

	var style = 'style="background-color: ' + tinycolor(color).toRgbString() + ';"'
	$("li[" + style + "]").addClass('selected')
}


$("main").on('mousewheel', function(event){
    return false;
}).mouseup(function(event) {
	MouseIsDown = false
}).onepage_scroll({
	animationTime: 250,
	direction: "horizontal"
})

$("#colorpicker").on('mouseup mouseleave', function(event) {

	pick(getSpectrum().toHex(), true, event.altKey)

}).on("move.spectrum", function(event){
	generate(getSpectrum().toHex())
})

$("#shading li").mousedown(function(event) {

	var isRightClick = event.button == 2
	var color = $(this).css("background-color")
	pick(color, isRightClick, event.altKey)

	MouseIsDown = true

}).mouseup(function(event) {

	var isRightClick = event.button == 2
	var color = $(this).css("background-color")
	pick(color, isRightClick, event.altKey)

}).mouseenter(function(event) {

	if (MouseIsDown) {
		var color = $(this).css("background-color")
		pick(color, false, event.altKey)
	}

}).dblclick(function(event) {

	var color = $(this).css("background-color")
	pick(color, true, event.altKey)

})





$("#colorpalette .color-set > a").click(function(event) {
	$(this).find('span').toggleClass('collapse')
	$(this).next().toggleClass('collapse')
})

$(".color-set .container > a").mousedown(function(event) {
	var color = $(this).css("background-color")
	pick(color, true, event.altKey)
});













function PSCallback(csEvent) {
	getAppColor(false, function(callback){
		pick(callback,true)
	})
}


