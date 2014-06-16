/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

    "use strict";

    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context, scene, sceneController) {


        // generate random X coordinate within the canvas
        var randomX = function() {
            return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
        };

        // generate random Y coordinate within the canvas
        var randomY = function() {
            return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
        };

        //generate random radius
        var randomRadius = function() {
            return Math.floor(Math.random() * (context.canvas.height + 11) / 2) + 5;
        };

        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if (s.length == 1) s = "0" + s; // pad with leading 0
                return s;
            };

            var r = Math.floor(Math.random() * 25.9) * 10;
            var g = Math.floor(Math.random() * 25.9) * 10;
            var b = Math.floor(Math.random() * 25.9) * 10;

            // convert to hex notation
            return "#" + toHex2(r) + toHex2(g) + toHex2(b);
        };

        /*
         * event handler for "new line button".
         */
        $("#btnNewLine").click((function() {

            // create the actual line and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var line = new StraightLine([randomX(), randomY()], [randomX(), randomY()],
                style);
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw

        }));

        /*
         * event handler for "new circle button".
         */
        $("#btnNewCircle").click((function() {

            // create the actual circle and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var circle = new Circle([randomX(), randomY()], randomRadius(), style);

            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw

        }));

        /*
         * event handler for "new parametric curve button".
         */
        $("#btnNewPCurve").click((function() {
            // create the actual curve and add it to the scene
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };

            var xInpt = $("#xCord").val();
            var yInpt = $("#yCord").val();

            var tminInpt = parseFloat($("#minT").val());
            var tmaxInpt = parseFloat($("#maxT").val());
            if (tmaxInpt <= tminInpt) {
                alert(" 'min t' muss kleiner als 'max t' sein");
            }

            var segmentInpt = parseInt($("#inpSegment").val());

            var parametricCurve = new ParametricCurve(xInpt, yInpt, tminInpt, tmaxInpt, segmentInpt, style);
            scene.addObjects([parametricCurve]);
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(parametricCurve); // this will also redraw

        }));

            $("#btnNewBezier").click( (function() {
            var style = {
                width: Math.floor(Math.random() * 3) + 1,
                color: randomColor()
            };
                     
            var segmentInpt = parseInt($("#inpSegment").val());

            var bezier = new BezierCurve(
            [randomX(),randomY()],[randomX(),randomY()], //p0,p1
            [randomX(),randomY()],[randomX(),randomY()], //p2,p3               
            0,1, segmentInpt, style
                );
            
            scene.addObjects([bezier]);
            sceneController.deselect();
            sceneController.select(bezier);  // this will also redraw
         }));

        /**
         * Color
         */
        $("#inputColor").change((function() {
            var obj = sceneController.getSelectedObject();
            obj.lineStyle.color = $('#inputColor').val();
            sceneController.deselect();
            sceneController.select(obj);
        }));

        /**
         * Linestyle.
         */
        $("#inputNumber").change((function() {
            var obj = sceneController.getSelectedObject();
            obj.lineStyle.width = parseInt($('#inputNumber').val());
            sceneController.deselect();
            sceneController.select(obj);
        }));

        /**
         * Radius
         */
        $("#showRadius").change((function() {
            var obj = sceneController.getSelectedObject();
            if (obj instanceof Circle) {
                obj.radius = parseInt($("#showRadius").val());
                sceneController.deselect();
                sceneController.select(obj);
            }
        }));

        /**
         * Change Values
         */
        var changeCanvasValues = function() {
            var obj = sceneController.getSelectedObject();
            $('#inputColor').val(obj.lineStyle.color);
            $('#inputNumber').val(obj.lineStyle.width);

            if (obj instanceof Circle) {
                $('#showRadius').val(obj.radius.toFixed(2)); // 2 nachkomma           
                $('#radiusContainer').show();
            } else {
                $('#radiusContainer').hide();
            }
        };

        sceneController.onObjChange(changeCanvasValues);
        sceneController.onSelection(changeCanvasValues);
    };
    // return the constructor function 
    return HtmlController;


})); // require