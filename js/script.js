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

	getPSColor(false, function(callback){
		$("#spectrum").spectrum({
		    color: callback,
		    flat: true,
		    clickoutFiresChange: true,
		    showButtons: false
		})

		pick(callback,true)
	})

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


function Persistent(inOn) {

    if (inOn){
        var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
    } else {
        var event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
    }
    event.extensionId = myExtensionId;
    csInterface.dispatchEvent(event);
}

function getPSColor(isBackground, doSomething){
	var script
	if (isBackground) {
		script = "app.backgroundColor.rgb.hexValue"
	} else{
		script = "app.foregroundColor.rgb.hexValue"
	}

	csInterface.evalScript(script ,function(callback){
		doSomething(callback)
	})
}

function setPSColor(color, isBackground) {
	var script
	if (isBackground) {
		script = "app.backgroundColor.rgb.hexValue = '" + color + "'"
	} else{
		script = "app.foregroundColor.rgb.hexValue = '" + color + "'"
	}
	csInterface.evalScript(script)
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
	setPSColor(tinycolor(color).toHex(), isBackground)
	$("#spectrum").spectrum("set", color)
	
	regen && generate(color)

	var style = 'style="background-color: ' + tinycolor(color).toRgbString() + ';"'
	$("li[" + style + "]").addClass('selected')
}


$("main").on('mousewheel', function(event){
    return false;
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
	pick(color, isRightClick)

}).dblclick(function(event) {

	var color = $(this).css("background-color")
	pick(color,true)

})













