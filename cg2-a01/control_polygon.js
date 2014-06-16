define(["util", "scene"], (function(Util, Scene) {

	"use strict";

	var ControlPolygon = function(getP0, getP1, getP2, getP3, setPos, drawStyle) {

		// remember the callbacks
		this.getP0 = getP0;
		this.getP1 = getP1;
		this.getP2 = getP2;
		this.getP3 = getP3;
		this.setPos = setPos;

		// default draw style
		this.drawStyle = {
			radius: 5,
			width: 2,
			color: "#ff0000",
			fill: false
		};

		// attribute queried by SceneController to recognize draggers
		this.isDragger = true;
	};

	
	 // draw 3 lines
	ControlPolygon.prototype.draw = function(context) {
		var p0 = this.getP0();
		var p1 = this.getP1();
		var p2 = this.getP2();
		var p3 = this.getP3();

		context.beginPath();
		context.lineTo(p0[0], p0[1]);
		context.lineTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);

		// draw style
		context.lineWidth = this.drawStyle.width;
		context.strokeStyle = this.drawStyle.color;

		// actually start drawing
		context.stroke();
	};

	
	// do not hit the polygon!
	ControlPolygon.prototype.isHit = function(context, mousePos) {
		return false;
	};
	
	 // Event handler triggered by a SceneController when mouse is being dragged
	ControlPolygon.prototype.mouseDrag = function(dragEvent) {
		// change position of the associated original (!) object
		this.setPos(dragEvent);
	};

	// this module exposes only the constructor for Dragger objects
	return ControlPolygon;

}));