/*
  *
 * Module scene: Computergrafik 2, Aufgabe 3
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "scene_node", "shaders", "directional_light", "material", "texture", 
        "models/cube", "models/parametric"], 
       (function(glmatrix, Program, SceneNode, shaders, DirectionalLight, Material, texture, 
        Cube, ParametricSurface) {

    "use strict";

    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  

        // set of GPU programs to be used
        this.programs = {};
        this.programs.unicolor = new Program(gl, shaders.getVertexShader("unicolor"), 
                                             shaders.getFragmentShader("unicolor") );
        this.programs.planet = new Program(gl, shaders.getVertexShader("planet"), 
                                              shaders.getFragmentShader("planet") );

        // create a parametric surface to be drawn in this scene
        var r = 1;
        var positionFunc = function(u,v) {
            return [ r * Math.sin(u) * Math.cos(v),
                     r * Math.sin(u) * Math.sin(v),
                     r * Math.cos(u) ];
        };

        var normalFunc = function(u,v) {
            return [ Math.sin(u) * Math.cos(v),
                     Math.sin(u) * Math.sin(v),
                     Math.cos(u) ];
        };

        var config = {
            "uMin":  0, 
            "uMax":  Math.PI, 
            "vMin":  0, 
            "vMax":  Math.PI*2, 
            "uSegments": 50,
            "vSegments": 50,
            // "asWireframe": false,
            "drawStyle": "surface"
        };

         var configWF = {
            "uMin":  0, 
            "uMax":  Math.PI, 
            "vMin":  0, 
            "vMax":  Math.PI*2, 
            "uSegments": 50,
            "vSegments": 50,
            // "asWireframe": true,
            "drawStyle": "lines"
        };

        // set of materials to be used
        this.materials = {};
        this.materials.blue   = new Material("blue", this.programs.unicolor);
        this.materials.grid   = new Material("grid", this.programs.unicolor);
        this.materials.planet = new Material("planet", this.programs.planet);

        // set uniforms required by the respective shaders
        this.materials.blue.setUniform( "uniColor", "vec4", [0.1, 0.1, 0.8, 1] );
        this.materials.grid.setUniform( "uniColor", "vec4", [0.7, 0.7, 0.7, 1] );
        this.materials.planet.setUniform( "material.ambient",   "vec3", [0.6,0.2,0.2] ); 
        this.materials.planet.setUniform( "material.diffuse",   "vec3", [0.8,0.2,0.2] ); 
        this.materials.planet.setUniform( "material.specular",  "vec3", [0.4,0.4,0.4] ); 
        this.materials.planet.setUniform( "material.shininess", "float", 80 ); 

        this.materials.planet.setUniform("debug", "bool", false);

        // set light properties for shader
        this.materials.planet.setUniform( "ambientLight", "vec3", [0.4,0.4,0.4]);
        this.materials.planet.setUniform( "light.on", "bool", true );
        this.materials.planet.setUniform( "light.type", "int", 0 );
        this.materials.planet.setUniform( "light.direction", "vec3", [-1,0,0] );
        this.materials.planet.setUniform( "light.color", "vec3", [1,1,1] );

        // TODO load and create required textures

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.worldTransformation = mat4.identity();

        // light node - rotation will change light direction
        this.sunLight = new DirectionalLight();
        this.sunNode = new SceneNode("Sunlight");
        this.sunNode.add(this.sunLight);
        // which shaders/materials will be affected by this light?
        this.sunLight.addMaterial(this.materials.planet);

        // planet surface
        //this.planetSurface = new Cube(gl);
        this.planetSurface = new ParametricSurface(gl, positionFunc, normalFunc, config);
        this.surfaceNode = new SceneNode("Surface");
        this.surfaceNode.add(this.planetSurface, this.materials.planet);
        
        //wireframe
        this.planetGrid = new ParametricSurface(gl, positionFunc, normalFunc, configWF);
        this.gridNode = new SceneNode("Grid");
        this.gridNode.add(this.planetGrid, this.materials.grid);

        // planet node contains surface + wireframe (todo)
        this.planetNode = new SceneNode("Planet");
        this.planetNode.add(this.surfaceNode);
        this.planetNode.add(this.gridNode);

        // rotate cube so that we see two faces initially 
        // mat4.rotate(this.planetNode.transform(), Math.PI/4, [0,1,0]);

        //poles align with y-axis
        mat4.rotate(this.planetNode.transform(), 0.5 * Math.PI, [1,0,0]);

        // our universe: planet + sunlight
        this.universeNode = new SceneNode("Universe");
        this.universeNode.add(this.planetNode);
        this.universeNode.add(this.sunNode);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { 
                             "Show Surface": true,
                             "Show Grid": false,
                             "Show Debug": false,
                             "Day Earth Texture": true,
                             "Night Earth Texture": true,
                             "Clouds": false
                            };  
        // Texturen
        this.tex = new texture.Texture2D(gl, "textures/earth_month04.jpg", true);
        this.tex2 = new texture.Texture2D(gl, "textures/earth_at_night_2048.jpg", true);
        this.tex3 = new texture.Texture2D(gl, "textures/earth_clouds_2048.jpg", true);

        var _scene = this;

        texture.onAllTexturesLoaded( function(){
            _scene.programs.planet.use();
            _scene.programs.planet.setTexture("daylightTexture", 0, _scene.tex);
            _scene.programs.planet.setTexture("nightlightTexture", 1, _scene.tex2);
            _scene.programs.planet.setTexture("cloudTexture", 2, _scene.tex3);
            _scene.draw();
        });

    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = mat4.perspective(45, aspectRatio, 0.01, 100); 
                             
        // multiple world and camera transformations to obtain model-view matrix
        var modelViewMatrix = mat4.create(this.cameraTransformation); 
        mat4.multiply(modelViewMatrix, this.worldTransformation);

        // set the uniform variables for all used programs
        for(var p in this.materials) {
            this.materials[p].setUniform("projectionMatrix", "mat4", projection);
        }

        // clear color and depth buffers
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  

        // show/hide certain parts of the scene            
        this.surfaceNode.setVisible( this.drawOptions["Show Surface"] ); 
        this.gridNode.setVisible(this.drawOptions["Show Grid"]);

        // Debug switch
        if (this.drawOptions["Show Debug"]){
            this.materials.planet.setUniform("debug", "bool", true);

        }else{
            this.materials.planet.setUniform("debug", "bool", false);
        }

        if (this.drawOptions["Day Earth Texture"]) {
            this.materials.planet.setUniform("daylight", "bool", true);
        } else {
            this.materials.planet.setUniform("daylight", "bool", false);
        }
        if (this.drawOptions["Night Earth Texture"]) {
            this.materials.planet.setUniform("nightlight", "bool", true);
        } else {
            this.materials.planet.setUniform("nightlight", "bool", false);
        }
        if (this.drawOptions["Clouds"]) {
            this.materials.planet.setUniform("clouds", "bool", true);
        } else {
            this.materials.planet.setUniform("clouds", "bool", false);
        }
        // draw the scene 
        this.universeNode.draw(gl, null, modelViewMatrix);
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
                mat4.rotate(this.worldTransformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.worldTransformation, angle, [1,0,0]);
                break;
            case "sunLight": 
                // rotate the sunlight around the Y axis
                mat4.rotate(this.sunNode.transformation, angle, [0,1,0] );
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

