/*
	GLOBAL VARIABLES
*/
var CANVAS,
	CONTEXT,
	_BRUSH = {
		x : 0,
		y : 0,
		size: 10,
		color: '#202020',
		paint: false,
	},
	STROKES = [],
	_CURRENT_STROKE = null,
	_TAB;
	
/*
	MAIN
*/
$(function(){
	init("#awesome-canvas");
	toggleTab("#tab-btn", "#panel01");
	$("#input-button").click(function(){
		toXMLFile();
	});
	toggleToolBar();
	
});
/*
	My FUNCTIONS
*/
/**/
function init(canvas){
	CANVAS = $(canvas);
	CANVAS.attr({
		width: window.innerWidth*0.8,
		height: window.innerHeight*0.9,
	});
	CONTEXT = CANVAS[0].getContext('2d');
	
	// handle mouse event and push the mouse's coordinate;
	function mouseEvent(e){
		_BRUSH.x = e.pageX - CANVAS[0].offsetLeft;
		_BRUSH.y = e.pageY - CANVAS[0].offsetTop;
		_CURRENT_STROKE.points.push({
			x : _BRUSH.x,
			y : _BRUSH.y,
		});
		
		redraw();
	}

	// clear and draw everytime have new point
	function redraw(){
		CONTEXT.clearRect(0, 0, CANVAS.width(), CANVAS.height());
		CONTEXT.lineCap = "round";
		for(var i = 0; i < STROKES.length; i++){
			var stroke_temp = STROKES[i];
			CONTEXT.strokeStyle = stroke_temp.color;
			CONTEXT.lineWidth = stroke_temp.size;
			CONTEXT.beginPath();
			CONTEXT.moveTo(stroke_temp.points[0].x, stroke_temp.points[0].y);
			for( var j = 0; j < stroke_temp.points.length; j++){
				var point_temp = stroke_temp.points[j];
				CONTEXT.lineTo(point_temp.x, point_temp.y);
			}
			CONTEXT.stroke();
		}
	}
	
	CANVAS.mousedown(function(e){
		_BRUSH.paint = true;
		_CURRENT_STROKE = {
			color: _BRUSH.color,
			size: _BRUSH.size,
			points : [],
		}
		STROKES.push(_CURRENT_STROKE);
		mouseEvent(e);
		
	}).mousemove(function(e){
		if(_BRUSH.paint){
			mouseEvent(e);
			console.log("here");
		}
	}).mouseup(function(e){
		_BRUSH.paint = false;
		_CURRENT_STROKE = null;
	}).mouseleave(function(){
		_BRUSH.paint = false;
		_CURRENT_STROKE = null;
	});

	$("#clear-btn").on("click", function(){
		STROKES = [];
		redraw();
	});
}

/*
	Toggle tab
*/
function toggleTab(tab, panel){
	var mouse_in=false;
	_TAB = $(tab);
	var _PANEL = $(panel);
	_TAB.on("click", function(){
		_PANEL.animate({width: "toggle"}, 200, function(){
			_TAB.toggleClass("active");
			mouse_in = true;
		});
	});
	
	$(document).on("click", function(){
		$(".tab").mouseover(function(){
			mouse_in = true;
		}).mouseout(function(){
			mouse_in = false;
		});
		if(!mouse_in && _TAB.hasClass("active")){
			_PANEL.animate({width: "toggle"}, 200, function(){
				_TAB.toggleClass("active");
			});
		}
	});
}
/*
	save XML
*/
 var _ROOT, _MATERIAL, _PAINT, _PROCEED;
 var material_value, paint_value, proceed_value;
function createXMLDocument(){
	var begin = document.createElement("ignore");
	_ROOT = document.createElement("draw");
	_MATERIAL = document.createElement("material");
	_PAINT = document.createElement("paint");
	_PROCEED = document.createElement("proceed");
	
	_MATERIAL.appendChild(material_value);
	_PAINT.appendChild(paint_value);
	_PROCEED.appendChild(proceed_value);
	
	_ROOT.appendChild(_MATERIAL);
	_ROOT.appendChild(_PAINT);
	_ROOT.appendChild(_PROCEED);
	begin.appendChild(_ROOT);
	return begin.innerHTML;
}
function setXMLNodesValues(){
	material_value = document.createTextNode($('#input-01').val());
	paint_value = document.createTextNode($('#input-02').val());
	proceed_value = document.createTextNode($('#input-03').val());
	
}
function toXMLFile(){
	setXMLNodesValues();
	var prolog = '<?xml version="1.0" encoding="UTF-8"?>';
	var body = createXMLDocument();
	download(prolog + body, "test.xml", {type: "text/xml"});
}
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
/* Toggle Tool Bar */
function toggleToolBar(){
	var toolbar = $(".custom-navbar");
	var mouseY;
	var touchY;
	var mouse_in = false;
	$(document).on('mousedown', function(e){
		mouseY = e.pageY;
		console.log("mouse at: mouse event " + mouseY);
		if(mouseY <= 30){
			$(document).on('mousemove', function(e){
				toolbar.animate({height: "27px"}, 200).addClass("open");;
				$(document).off('mousemove');
				console.log("still mouse event");
			});
		}
	});
	toolbar.mouseenter(function(){
		mouse_in = true;
	}).mouseleave(function(){
		mouse_in = false;
	});
	$(document).on("mousedown", function(){
		if(!mouse_in && toolbar.hasClass('open')){
			toolbar.animate({height: "0px"}, 200).removeClass('open');
		}
	});
	
	document.addEventListener('touchstart', function(e){
		touch = e.touches[0];
		mouseY = touch.pageY;
		console.log("touch at: " + mouseY);
		if(mouseY <= 30){
			document.addEventListener('touchmove', function(e){
				toolbar.animate({height: "27px"}, 200).addClass("open");
			});
		}
		
	});

	document.addEventListener('touchstart', function(e){
		touch = e.target;
		if(touch !== document.getElementById('custom-navbar-01')){
			mouse_in = false;
			console.log('i was here');
		}else {
			mouse_in = true;
		}
		
		if(!mouse_in && toolbar.hasClass('open')){
			toolbar.animate({height: "0px"}, 200).removeClass('open');
			console.log("let remove tool bar");
		}
	});
	
}






















