/*
 *
 * Module: ParametricCurve
 *
 */

/* requireJS module definition */
define(["util", "vec2", "scene", "straight_line"], (function(Util, vec2, Scene, StraightLine) {
    "use strict";

    /**
     *  A simple ParametricCurve
     */


    var ParametricCurve = function(xT, yT, tmin, tmax, segmentsN, lineStyle) {

        console.log("creating ParametricCurve with x(t) = " + xT + "and y(t) = " + yT +
            ", segments " + segmentsN + ", between [ " + tmin + " and " + tmax + " ]");

        // draw style for drawing the line
        this.lineStyle = lineStyle || {
            width: "4",
            color: "#0000AA"
        };

        // initial values in case either point is undefined
        this.xT = xT || "100*Math.sin(t)";
        this.yT = yT || "100*Math.cos(t)";
        this.tmin = tmin || 0;
        this.tmax = tmax || Math.PI / 2;
        this.segmentsN = segmentsN || 6;
        this.lines = new Array(this.segmentsN);
        makeCurve(this);
    };

    var makeCurve = function(paracurve) {
        var points = [];
        for (var i = 0; i < paracurve.segmentsN + 1; i++) {
            // t = t_min + i/N * (t_max - t_min)
            var t = paracurve.tmin + i / paracurve.segmentsN * (paracurve.tmax - paracurve.tmin);
            points.push([eval(paracurve.xT), eval(paracurve.yT)]);
        }
        for (var i = 1; i < paracurve.segmentsN + 1; i++) {
            paracurve.lines[i - 1] = new StraightLine(points[i - 1], points[i], paracurve.lineStyle);
        }

    };


    // draw this ParametricCurve into the provided 2D rendering context
    ParametricCurve.prototype.draw = function(context) {

        // draw actual line
        context.beginPath();

        for (var i = 0; i < this.segmentsN; i++) {
            this.lines[i].draw(context);
        }


        // start drawing
        context.stroke();


    };

    // test whether the mouse position is on this ParametricCurveline segment
    ParametricCurve.prototype.isHit = function(context, mousepos) {
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].isHit(context, mousepos)) {
                return true;
            }
        }
        return false;
    };

    // empty list
    ParametricCurve.prototype.createDraggers = function() {
        return [];
    };

    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

})); // define