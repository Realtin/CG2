/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius        || 1.0;
        var height       = config.height        || 0.1;
        var segments     = config.segments      || 20;
        this.drawStyle   = config.drawStyle     || "points";
        this.asWireframe = config.asWireframe   || false;

        window.console.log("Creating a Band with radius="+radius+", height="+height+", segments="+segments+", sytle="+this.drawStyle+ (this.asWireframe? "and Wireframe" : "")); 
    
        // generate vertex coordinates and store in an array
        var coords = [];
        var indices = [];
        var lines = [];
        for(var i=0; i<segments*2; i++) {
            
            // Points
            if (i<=segments){
                 // X and Z coordinates are on a circle around the origin
                var t = (i/segments)*Math.PI*2;
                var x = Math.sin(t) * radius;
                var z = Math.cos(t) * radius;
                // Y coordinates are simply -height/2 and +height/2 
                var y0 = height/2;
                var y1 = -height/2;
                
                // add two points for each position on the circle
                // IMPORTANT: push each float value separately!
                coords.push(x,y0,z);
                coords.push(x,y1,z);   
            }
            
            // Triangles
            if (i%2==0){
                // 2 Triangles per Segment  [ABC], [CBD]
                indices.push(i, i+1, i+2);
                indices.push(i+2, i+1, i+3);

            // Lines
                // [AB] Senkrechte
                lines.push(i, i+1);
                // [AC] Obere Waagerechte
                lines.push(i, i+2);
                // [BD] Untere Waagerechte
                lines.push(i+1, i+3);
            }
        };  
        window.console.log("Indices: "+indices.length)        
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
        this.triangleBuffer = new vbo.Indices(gl, {"indices": indices});
        this.linesBuffer = new vbo.Indices(gl, {"indices": lines});

    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.triangleBuffer.bind(gl);
 
        // draw the vertices as points
        if(this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
        } else if (this.drawStyle == "triangles") {
            gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        } else {
            window.console.log("Band: draw style " + this.drawStyle + " not implemented.");
        }

        //Wireframe
        if(this.asWireframe){

            //destroys my triangles when outside the if ... 
            this.linesBuffer.bind(gl);

            gl.drawElements(gl.LINES, this.linesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }
         
    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
