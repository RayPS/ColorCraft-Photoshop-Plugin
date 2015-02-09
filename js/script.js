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

	document.oncontextmenu = function() {return false;};
}
init();


var palette = {
	t: function(baseColor){
		var C = new Array()

		for (var i = 0; i < 7; i++) {
		    if (i < 4) {
		        C[i] = tinycolor.mix(baseColor, tinycolor("Blue") , ~(i - 4) * 20)
		        				.darken(~(i - 4) * 5)
		        				.desaturate(~(i - 4) * 3)
		                		.toHexString()
		    } else{
		        C[i] = tinycolor.mix(baseColor, tinycolor("Yellow") , i * 6)
		        				.brighten(i * 3)
		            		    .toHexString()
		    }
		}

		return C;
	},

	b: function(baseColor){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(baseColor).brighten((i - 3) * gap)
		}
		return C 
	},

	l: function(baseColor){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(baseColor).lighten((i - 3) * gap)
		}
		return C 
	},

	s: function(baseColor){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(baseColor).saturate((i - 3) * gap)
		}
		return C 
	},

	h: function(baseColor){
		var C = new Array()
		var gap = 10

		for (var i = 0; i < 7; i++) {
			C[i] = tinycolor(baseColor).spin((i - 3) * gap)
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

		generate(callback)
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

function hexColor(){
	return $("#spectrum").spectrum("get").toHex()
}


function generate (c) {

	for (var i = 0; i < 7; i++) {
		$(".T li")[i].style.backgroundColor = palette.t(c)[i]
		$(".B li")[i].style.backgroundColor = palette.b(c)[i]
		$(".L li")[i].style.backgroundColor = palette.l(c)[i]
		$(".S li")[i].style.backgroundColor = palette.s(c)[i]
		$(".H li")[i].style.backgroundColor = palette.h(c)[i]
	}
}


$("main").on('mousewheel', function(event){
    return false;
}).onepage_scroll({
	animationTime: 250,
	direction: "horizontal"
})

$("#colorpicker").on('mouseup mouseleave', function(event) {
	setPSColor(hexColor(), event.altKey)
}).on("move.spectrum", function(event){
	generate(hexColor())
})


$("#shading li").mousedown(function(event) {

	var isRightClick = event.button == 2

	pick(this, isRightClick)

}).dblclick(function(event) {

	pick(this,true)

})


function pick(ele, select){

	var bgc = $(ele).css("background-color")
	var style = 'style="background-color: ' + bgc + ';"'
	
	$(".selected").removeClass('selected')
	setPSColor(tinycolor(bgc).toHex())
	$("#spectrum").spectrum("set", bgc)
	
	if (select) {
		generate(bgc)
	}
	
	$("li[" + style + "]").addClass('selected')
}


var r = function(){location.reload()}














