/* requireJS module definition */
define(["util", "vec2", "scene", "straight_line", "point_dragger", "parametric_curve", "control_polygon"], (function(Util, vec2, Scene, StraightLine, PointDragger, ParametricCurve, ControlPolygon) {
    "use strict";


    // var BezierCurve = new ParametricCurve(xOfT, yofT, tmin,tmax,segment, tickMarks, lineStyle);
    var BezierCurve = function(p0, p1, p2, p3, tmin, tmax, segments, lineStyle) {

        console.log("creating bezierCurve with " + segments + " segments, between [ " + tmin + " and " + tmax + " ]");

        // draw style for drawing the line
        this.lineStyle = lineStyle || {
            width: "4",
            color: "#0000AA"
        };
        // initial values in case either point is undefined

        this.p0 = p0 || [0.4, 0.4];
        this.p1 = p1 || [0.6, 0.6];
        this.p2 = p2 || [0.3, 0.7];
        this.p3 = p3 || [0.2, 0.8];
        this.tmin = 0;
        this.tmax = 1;
        this.segments = segments || 20;
        this.lines = [];
        makeBezier(this);

    };

    var makeBezier = function(bezier) {
        // create new array and push the first point 
        var points = [];
        bezier.lines = [];

        // points.push([bezier.p0[0], bezier.p0[1]]);


        for (var i = 0; i <= bezier.segments; i++) {
            //t goes from 0 to 1

            var t = 1 / bezier.segments * i;

            // P = (1−t)^*3[P1] + 3(1−t)^2*t*[P2] +3(1−t)t^2*[P3] + t^3*[P4]

            var x = (Math.pow((1 - t), 3) * bezier.p0[0]) + (3 * Math.pow((1 - t), 2) * t * bezier.p1[0]) + (3 * (1 - t) * Math.pow(t, 2) * bezier.p2[0]) + (Math.pow(t, 3) * bezier.p3[0]);
            var y = (Math.pow((1 - t), 3) * bezier.p0[1]) + (3 * Math.pow((1 - t), 2) * t * bezier.p1[1]) + (3 * (1 - t) * Math.pow(t, 2) * bezier.p2[1]) + (Math.pow(t, 3) * bezier.p3[1]);;

            //push all calculated points into the array
            points.push([x, y]);
            // var line = new StraightLine(points[i], points[i+1], bezier.lineStyle);
            // bezier.lines.push(line);


        }
        // console.log("Points: "+ points)
        for (var i = 1; i <= bezier.segments; i++) {
            bezier.lines[i - 1] = new StraightLine(points[i - 1], points[i], bezier.lineStyle);

            // console.log("Lines: "+bezier.lines[i-1][0].toString())

        }


    };
    BezierCurve.prototype.setTickMarks = function(tickM) {
        this.tickMarks = tickM;
    };

    // BezierCurve.prototype.draw = ParametricCurve.prototype.draw;
    BezierCurve.prototype.isHit = ParametricCurve.prototype.isHit;

    // return no list of draggers to manipulate this curve
    BezierCurve.prototype.createDraggers = function() {
        var manipulStyle = {
            radius: 4,
            color: "#ff0000",
            width: 0,
            fill: false
        }
        var draggerStyle = {
            radius: 4,
            color: this.lineStyle.color,
            width: 0,
            fill: true
        }
        var polygonStyle = {
            radius: 4,
            width: 2,
            color: "#ff0000",
            fill: false
        };

        var draggers = [];

        // create closure and callbacks for dragger
        var _curve = this;
        var getP0 = function() {
            return _curve.p0;
        };
        var getP1 = function() {
            return _curve.p1;
        };
        var getP2 = function() {
            return _curve.p2;
        };
        var getP3 = function() {
            return _curve.p3;
        };

        var setP0 = function(dragEvent) {
            _curve.p0 = dragEvent.position;
        };
        var setP1 = function(dragEvent) {
            _curve.p1 = dragEvent.position;
        };
        var setP2 = function(dragEvent) {
            _curve.p2 = dragEvent.position;
        };
        var setP3 = function(dragEvent) {
            _curve.p3 = dragEvent.position;
        };

        draggers.push(new ControlPolygon(getP0, getP1, getP2, getP3, setP0, polygonStyle));


        draggers.push(new PointDragger(getP0, setP0, draggerStyle));
        draggers.push(new PointDragger(getP1, setP1, manipulStyle));
        draggers.push(new PointDragger(getP2, setP2, manipulStyle));
        draggers.push(new PointDragger(getP3, setP3, draggerStyle));
        return draggers;
    };

    // draw this ParametricCurve into the provided 2D rendering context
    BezierCurve.prototype.draw = function(context) {
        makeBezier(this);
        // draw actual line
        context.beginPath();

        for (var i = 0; i < this.segments; i++) {
            this.lines[i].draw(context);
        }
        // start drawing
        context.stroke();



    };

    // this module only exports the constructor for ParametricCurve objects
    return BezierCurve;
})); // define