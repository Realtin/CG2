/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "shaders", "models/band", "models/triangle", "models/cube",
        "models/parametric", "models/robot"], 
       (function(glmatrix, Program, shaders, Band, Triangle, Cube, ParametricSurface, Robot) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.red = new Program(gl, 
                                        shaders.getVertexShader("red"), 
                                        shaders.getFragmentShader("red") );
        this.programs.black = new Program(gl, 
                                        shaders.getVertexShader("red"), 
                                        shaders.getFragmentShader("black") );
        this.programs.vertexColor = new Program(gl, 
                                                shaders.getVertexShader("vertex_color"), 
                                                shaders.getFragmentShader("vertex_color") );   


        
        // create some objects to be drawn in this scene
        this.triangle  = new Triangle(gl);
        this.cube      = new Cube(gl); 
        this.band      = new Band(gl, {height: 0.4, drawStyle: "points", asWireframe: false});
        this.bandTriangles = new Band(gl, {height: 0.4, drawStyle: "triangles"});
        this.bandLines = new Band(gl, {height: 0.4, drawStyle: "points", asWireframe: true});


        // create a parametric surface to be drawn in this scene
        var positionFunc = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
        };

        // Drop
        var t1 = 1;
        var t2 = 0.5;
        var positionFuncDrop  = function(u,v) {
            return [ t1 * (t2 - Math.cos(u)) * Math.sin(u) * Math.cos(v),
                     t1 * (t2 - Math.cos(u)) * Math.sin(u) * Math.sin(v),
                     Math.cos(u) ];
        };

        // Torus
        var r1 = 0.2
        var r2 = 0.5
        var positionFuncTorus  = function(u,v) {
            return [ (r2 + r1 * Math.cos(v)) * Math.cos(u),
                     (r2 + r1 * Math.cos(v)) * Math.sin(u),
                     r1 * Math.sin(v) ];
        };

        var config = {
            "uMin": -Math.PI, 
            "uMax":  Math.PI, 
            "vMin": -Math.PI, 
            "vMax":  Math.PI, 
            "uSegments": 30,
            "vSegments": 20,
            "asWireframe": false
        };

         var configWF = {
            "uMin": -Math.PI, 
            "uMax":  Math.PI, 
            "vMin": -Math.PI, 
            "vMax":  Math.PI, 
            "uSegments": 30,
            "vSegments": 20,
            "asWireframe": true
        };

         var configDrop = {
            "uMin": 1, 
            "uMax":  Math.PI, 
            "vMin": 0, 
            "vMax":  Math.PI*2, 
            "uSegments": 50,
            "vSegments": 50,
            "asWireframe": true
        };
        var configTorus = {
            "uMin": 0, 
            "uMax":  2*Math.PI,
            "vMin": 0, 
            "vMax":  2*Math.PI,
            "uSegments": 100,
            "vSegments": 10,
            "asWireframe": false
        };

        this.ellipsoid = new ParametricSurface(gl, positionFunc, config);
        this.ellipsoidWF = new ParametricSurface(gl, positionFunc, configWF);
        this.Drop = new ParametricSurface(gl, positionFuncDrop, configDrop);
        this.torus = new ParametricSurface(gl, positionFuncTorus, configTorus);
        this.robot = new Robot(gl, this.programs);


        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false, 
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band": false,
                             "Show Band as Triangles": false,
                             "Show Band as Wireframe": false,
                             "Show Ellipsoid": false,
                             "Show Ellipsoid as Wireframe": false,
                             "Show Drop": false,
                             "Show Torus": false,
                             "Show Robot": true
                             };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }

        // set offset to avoid z-fighting
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
        
        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
                
        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {    
            this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Cube"]) {    
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band"]) {    
            this.band.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Band as Triangles"]){
            this.bandTriangles.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Band as Wireframe"]){
            this.bandLines.draw(gl, this.programs.black);
        }
        if(this.drawOptions["Show Ellipsoid"]) {    
            this.ellipsoid.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Ellipsoid as Wireframe"]) {    
            this.ellipsoidWF.draw(gl, this.programs.black);
        }
        if(this.drawOptions["Show Drop"]) {    
            this.Drop.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Torus"]) {    
            this.torus.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Robot"]) {    
            this.robot.draw(gl, null,  this.transformation);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        // window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
            case "shoulderR": 
                mat4.rotate(this.robot.shoulderR.transformation, angle, [0,1,0]);
                break;
            case "shoulderL": 
                mat4.rotate(this.robot.shoulderL.transformation, angle, [0,1,0]);
                break;
            case "neck": 
                mat4.rotate(this.robot.neck.transformation, angle, [0,1,0]);
                break;
            case "elbowR": 
                mat4.rotate(this.robot.elbowR.transformation, angle, [0,1,0]);
                break;
            case "elbowL": 
                mat4.rotate(this.robot.elbowL.transformation, angle, [0,1,0]);
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        mat4.rotate(this.robot.finger1R.transformation, 0.5, [0,1,0]);
        mat4.rotate(this.robot.finger1L.transformation, 0.5, [0,1,0]);


        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

