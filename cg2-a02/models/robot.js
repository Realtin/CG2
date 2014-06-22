/* requireJS module definition */
define(["scene_node", "gl-matrix", "program", "models/band", "models/triangle", "models/cube", "models/parametric"], (function(SceneNode, glMatrix, Program, Band, Triangle, Cube, ParametricSurface) {

	"use strict";

	/* constructor for Robot-Model
	 */
	var Robot = function(gl, programs) {

		//Komponenten
		var cube = new Cube(gl);

		//Dimensionen
		var headSize = [0.3, 0.35, 0.3];
		var torsoSize = [0.6, 1.0, 0.4];

		//Skelett
		this.head = new SceneNode("head");
		mat4.translate(this.head.transform(), [0, torsoSize[1] / 2 + headSize[1] / 2, 0]);

		this.torso = new SceneNode("torso");
		this.torso.add(this.head);

		//Skins
		var torsoSkin = new SceneNode("torso skin");
		torsoSkin.add(cube, programs.vertexColor);
		mat4.scale(torsoSkin.transform(), torsoSize);

		var headSkin = new SceneNode("head skin");
		headSkin.add(cube, programs.vertexColor);
		mat4.rotate(headSkin.transform(), 0.6 * Math.PI, [0, 1, 0]); //wgen farben ..?
		mat4.scale(headSkin.transform(), headSize);

		//Verbindung Skelett + Skins
		this.torso.add(torsoSkin);
		this.head.add(headSkin);

	};

	Robot.prototype.draw = function(gl, program, transformation) {
		this.torso.draw(gl, program, transformation);
	};

	return Robot;

})); // define