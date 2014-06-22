/* requireJS module definition */
define(["scene_node", "gl-matrix", "program", "models/band", "models/triangle", "models/cube", "models/parametric"], (function(SceneNode, glMatrix, Program, Band, Triangle, Cube, ParametricSurface) {

	"use strict";

	/* constructor for Robot-Model
	 */
	var Robot = function(gl, programs) {

		//Komponenten
		var cube = new Cube(gl);
		var band = new Band(gl, {
			height: 0.2,
			drawStyle: "triangles"
		});

		//Dimensionen
		var headSize = [0.25, 0.3, 0.25];
		var torsoSize = [0.6, 0.9, 0.4];
		var neckSize = [0.2, 0.05, 0.2];
		var shoulderSize = [0.1, 0.25, 0.1];


		//Skelett
		this.head = new SceneNode("head");
		mat4.translate(this.head.transform(), [0, neckSize[1] / 2 + headSize[1] / 2, 0]);

		this.torso = new SceneNode("torso");

		this.neck = new SceneNode("neck");
		mat4.translate(this.neck.transform(), [0, (torsoSize[1] / 2 + neckSize[1] / 2), 0]);
		mat4.rotate(this.neck.transform(), 0.6 * Math.PI, [0, 1, 0]);

		this.shoulder = new SceneNode("shoulder");
		mat4.translate(this.shoulder.transform(), [-(torsoSize[0]/ 2 + neckSize[1] / 2), (torsoSize[1] / 3 + shoulderSize[0] / 2), 0]);
		mat4.rotate(this.shoulder.transform(), Math.PI, [1,1,0]);


		this.torso.add(this.neck);
		this.neck.add(this.head);
		this.torso.add(this.shoulder);

		//Skins
		var torsoSkin = new SceneNode("torso skin");
		torsoSkin.add(cube, programs.vertexColor);
		mat4.scale(torsoSkin.transform(), torsoSize);

		var neckSkin = new SceneNode("neck skin");
		neckSkin.add(cube, programs.vertexColor);
		mat4.rotate(neckSkin.transform(), 0.6 * Math.PI, [0, 1, 0]);
		mat4.scale(neckSkin.transform(), neckSize);

		var headSkin = new SceneNode("head skin");
		headSkin.add(cube, programs.vertexColor);
		mat4.rotate(headSkin.transform(), 0.6 * Math.PI, [0, 1, 0]);
		mat4.scale(headSkin.transform(), headSize);

		var shoulderSkin = new SceneNode("shoulder skin");
        shoulderSkin.add(band, programs.black);
        mat4.scale(shoulderSkin.transform(), shoulderSize);

		//Verbindung Skelett + Skins
		this.torso.add(torsoSkin);
		this.head.add(headSkin);
		this.neck.add(neckSkin);
		this.shoulder.add(shoulderSkin);

	};

	Robot.prototype.draw = function(gl, program, transformation) {
		this.torso.draw(gl, program, transformation);
	};

	return Robot;

})); // define