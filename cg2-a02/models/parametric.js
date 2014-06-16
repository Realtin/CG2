/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
     *         and drawStyle (i.e. "points", "wireframe", or "surface")
     */ 
    var ParametricSurface = function(gl, posFunc, config) {
        
         // read the configuration parameters
        config         = config             || {};
        var uSegments  = config.uSegments   || 10;
        var vSegments  = config.vSegments   || 10;
        var uMin       = config.uMin        || 0;
        var uMax       = config.uMax        || 1;
        var vMin       = config.vMin        || 0;
        var vMax       = config.vMax        || 1;

        this.drawStyle = config.drawStyle   || "points";

        window.console.log("creating ParametricCurve with  uSegments: " + uSegments + "vSegments: "+ vSegments+ " and u between "+ uMin+ " - "+uMax+" and v between "+ vMin+" - "+vMax+ " ")
        
        // coordinates
        var points = [];
        //PosFunc coordinates
        var pos = [];
        var u, v, x, y, z;

        for (var i = 0; i < uSegments + 1; i++) {
            for (var j = 0; j < vSegments + 1; j++) {
                // t = t_min + i/N * (t_max - t_min)
                u = uMin + i*(uMax-uMin)/uSegments;
                v = vMin + j*(vMax-vMin)/vSegments;
                pos = posFunc(u,v);
                x = pos[0];
                y = pos[1];
                z = pos[2];

                points.push(x,y,z);
            };
        }
        
   // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": points 
                                                  } );


    };  

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,program) {
    
   // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
 
        // draw the vertices as points
        if(this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
        } else {
            window.console.log("ParametricSurface: draw style " + this.drawStyle + " not implemented.");
        }
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;

})); // define

    
