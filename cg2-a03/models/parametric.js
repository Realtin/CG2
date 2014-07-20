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
    var ParametricSurface = function(gl, posFunc, normalFunc, config) {
        
         // read the configuration parameters
        config         = config             || {};
        var uSegments  = config.uSegments   || 10;
        var vSegments  = config.vSegments   || 10;
        var uMin       = config.uMin        || 0;
        var uMax       = config.uMax        || 1;
        var vMin       = config.vMin        || 0;
        var vMax       = config.vMax        || 1;

        this.drawStyle = config.drawStyle   || "points";
        // this.asWireframe = config.asWireframe || false;

        window.console.log("creating ParametricCurve with  uSegments: " + uSegments + " vSegments: "+ vSegments+ " and u between "+ uMin+ " - "+uMax+" and v between "+ vMin+" - "+vMax);
        
        // coordinates
        var points = [];
        var normals = [];
        var texcoords = [];
        //PosFunc coordinates
        var pos = [];
        var norm = [];
        //Wireframe
        var lines = [];
        var triangles =[];

        var a, u, v, x, y, z;

        for (var i = 0; i <= uSegments; i++) {
            u = uMin + i*(uMax-uMin)/uSegments;
            v = vMin
            for (var j = 0; j <= vSegments; j++) {
                // t = t_min + i/N * (t_max - t_min)
                v = vMin + j*(vMax-vMin)/vSegments;
                pos = posFunc(u,v);
                x = pos[0];
                y = pos[1];
                z = pos[2];
                points.push(x,y,z);

                norm = normalFunc(u,v);
                x = norm[0];
                y = norm[1];
                z = norm[2];
                normals.push(x,y,z);

                texcoords.push((v/(2*Math.PI)),(u/Math.PI));


            }
        }
        for (var i = 0; i < uSegments; i++) {
            for (var j = 0; j < vSegments; j++) {
                // t = t_min + i/N * (t_max - t_min)
                if (this.drawStyle == "lines"){
                    lines.push(i*(vSegments+1)+j, i*(vSegments+1)+j+1);
                    lines.push(i*(vSegments+1)+j, (i+1)*(vSegments+1)+j);
                };
            }
        }

        if (this.drawStyle == "surface"){
         for (var i = 1; i <= uSegments; i++) {
            for (var j = 1; j <= vSegments; j++) {
                a = i* (vSegments +1) + j;
                triangles.push(a)
                triangles.push(a-1);
                triangles.push(a-1 -(vSegments+1));

                triangles.push(a);
                triangles.push(a-(vSegments+1));
                triangles.push(a-1 -(vSegments+1));
            }
          }
        }
   // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": points 
                                                  } );
        this.texCoordsBuffer = new vbo.Attribute(gl, { "numComponents": 2,
                                                        "dataType": gl.FLOAT,
                                                        "data": texcoords 
                                                    } );
        this.linesBuffer = new vbo.Indices(gl, {"indices": lines});
        this.trianglesBuffer = new vbo.Indices(gl, {"indices": triangles});
 
   // create vertex buffer object (VBO) for the coordinates = vertex position
        this.normalBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": normals 
                                                  } ); 
    };  

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,material) {
    material.apply();

   // bind the attribute buffers
        var program = material.getProgram();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.normalBuffer.bind(gl, program, "vertexNormal");
        this.texCoordsBuffer.bind(gl, program, "vertexTexCoords");
 
        // draw the vertices as points
        if(this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
        } else if ( this.drawStyle == "surface") {
            this.trianglesBuffer.bind(gl);
            gl.drawElements(gl.TRIANGLES, this.trianglesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0); 
        } else if (this.drawStyle == "lines"){         //Wireframe
            this.linesBuffer.bind(gl);
            gl.drawElements(gl.LINES, this.linesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }else {
            window.console.log("ParametricSurface: draw style " + this.drawStyle + " not implemented.");
        }        
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;

})); // define

    
