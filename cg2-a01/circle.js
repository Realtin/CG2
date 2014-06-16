/*
 *
 * Module: circle
 * Julia Krüger
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], (function(Util, vec2, Scene, PointDragger) {

    "use strict";

    /**
     *  A circle that can be dragged
     *  around by its endpoints.
     *  Parameters:
     *  - centerpoint
     *  - radius
     *  - lineStyle: object defining width and color attributes for line drawing,
     *       begin of the form { width: 2, color: "#00FF00" }
     */

    var Circle = function(centerpoint, radius, lineStyle) {

        console.log("creating circle at" +
            centerpoint[0] + ", " + centerpoint[1] + " and a radius of: " + radius + ".");

        // draw style for drawing the line
        this.lineStyle = lineStyle || {
            width: "2",
            color: "#0000AA"
        };

        // initial values in case either point is undefined
        this.centerpoint = centerpoint || [10, 10];
        this.radius = radius || 10;

    };

    // draw this circle into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

        // draw actual line
        context.beginPath();

        // set centerpoint(x,y), radius, start angle, end angle, counterclockwise
        context.arc(this.centerpoint[0], this.centerpoint[1], this.radius, 0.0, Math.PI * 2, true);

        // set drawing style
        context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;

        // actually start drawing
        context.stroke();

    };

    // test whether the mouse position is on this circle segment
    Circle.prototype.isHit = function(context, mousepos) {

        // check whether distance between mouse and dragger's center
        var dist = vec2.length(vec2.sub(mousepos, this.centerpoint));
        
        // 2 px tollarance
        return dist >= this.radius -2 && dist <= this.radius + 2;


    };

    // return list of draggers to manipulate this circle
    Circle.prototype.createDraggers = function() {

        var draggerStyle = {
            radius: 4,
            color: this.lineStyle.color,
            width: 0,
            fill: true
        };
        var draggers = [];

        // create closure and callbacks for dragger
        var _circle = this;
        var getCenterpoint = function() {
            return _circle.centerpoint;
        };
        // var getRadius = function() {
        //     return _circle.radius;
        // };

        //var getRadius = function() { return [_circle.centerpoint[0] + _circle.radius, _circle.centerpoint[1]]  };
        var setCenterpoint = function(dragEvent) {
            _circle.centerpoint = dragEvent.position;
        };
        draggers.push(new PointDragger(getCenterpoint, setCenterpoint, draggerStyle));
        return draggers;

    };

    // this module only exports the constructor for Circle objects
    return Circle;

})); // define