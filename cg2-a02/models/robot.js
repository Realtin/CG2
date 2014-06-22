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

		var bandWf = new Band(gl, {
			height: 0.2,
			drawStyle: "points",
			asWireframe: true
		});

		var triangle = new Triangle(gl);

		var config = {
			"uMin": -Math.PI,
			"uMax": Math.PI,
			"vMin": -Math.PI,
			"vMax": Math.PI,
			"uSegments": 30,
			"vSegments": 20,
			"asWireframe": true
		};


		var positionFunc = function(u, v) {
			return [0.5 * Math.sin(u) * Math.cos(v),
				0.3 * Math.sin(u) * Math.sin(v),
				0.9 * Math.cos(u)];
		};

		var ellipsoid = new ParametricSurface(gl, positionFunc, config);

		//Dimensionen
		var kroneSize = [0.25, 0.3, 0.25];
		var headSize = [0.25, 0.3, 0.25];
		var neckSize = [0.2, 0.05, 0.2];
		var torsoSize = [0.6, 0.9, 0.4];
		var shoulderSize = [0.1, 0.3, 0.1];
		var upperArmSize = [0.4, 0.1, 0.1];
		var elbowSize = [0.05,0.15,0.05];
		var underArmSize = [0.4, 0.1, 0.1];
		var wristSize = [0.05,0.15,0.05];
		var finger1Size = [0.1, 0.2, 0.1];


		//Skelett
		this.head = new SceneNode("head");
		mat4.translate(this.head.transform(), [0, neckSize[1] / 2 + headSize[1] / 2, 0]);

		this.torso = new SceneNode("torso");

		this.neck = new SceneNode("neck");
		mat4.translate(this.neck.transform(), [0, (torsoSize[1] / 2 + neckSize[1] / 2), 0]);
		mat4.rotate(this.neck.transform(), 0.6 * Math.PI, [0, 1, 0]);

		this.shoulder = new SceneNode("shoulder");
		mat4.translate(this.shoulder.transform(), [-(torsoSize[0] / 2 + shoulderSize[0] / 4), (torsoSize[1] / 3 + shoulderSize[0] / 2), 0]);
		mat4.rotate(this.shoulder.transform(), Math.PI, [1, 1, 0]);

		this.upperArm = new SceneNode("upper arm");
		mat4.translate(this.upperArm.transform(), [-upperArmSize[0]/2, -upperArmSize[1]/4, 0]);
		// mat4.rotate(this.upperArm.transform(), Math.PI, [1, 1, 0]);

		this.underArm = new SceneNode("under arm");
		mat4.translate(this.underArm.transform(), [-underArmSize[0]/2, 0, 0]);
		// mat4.rotate(this.underArm.transform(), Math.PI, [1, 1, 0]);

		this.krone = new SceneNode("krone");

		this.wrist = new SceneNode("wrist");
		mat4.translate(this.wrist.transform(), [-underArmSize[0]/2, 0, 0]);
		mat4.rotate(this.wrist.transform(), Math.PI, [1, 1, 0]);

		this.elbow = new SceneNode("elbow");
		mat4.translate(this.elbow.transform(), [-underArmSize[0]/2, 0, 0]);
		// mat4.rotate(this.elbow.transform(), Math.PI, [1, 1, 0]);

		this.finger1 = new SceneNode("finger 1");
		mat4.translate(this.finger1.transform(), [0, -finger1Size[1]/2, 0])
		mat4.rotate(this.finger1.transform(), Math.PI, [1, 0, 0]);


		this.torso.add(this.neck);
		this.neck.add(this.head);
		this.torso.add(this.shoulder);
		this.shoulder.add(this.upperArm);
		this.upperArm.add(this.elbow);
		this.elbow.add(this.underArm);
		this.head.add(this.krone);
		this.underArm.add(this.wrist);
		this.wrist.add(this.finger1);

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
		shoulderSkin.add(band, programs.red);
		mat4.scale(shoulderSkin.transform(), shoulderSize);

		var upperArmSkin = new SceneNode("upper arm skin");
		upperArmSkin.add(ellipsoid, programs.black);
		mat4.scale(upperArmSkin.transform(), upperArmSize);

		var underArmSkin = new SceneNode("under arm skin");
		underArmSkin.add(ellipsoid, programs.black);
		mat4.scale(underArmSkin.transform(), underArmSize);

		var kroneSkin = new SceneNode("krone skin");
		kroneSkin.add(bandWf, programs.red);
		mat4.scale(kroneSkin.transform(), kroneSize);

		var wristSkin = new SceneNode("wrist skin");
		wristSkin.add(band, programs.red);
		mat4.scale(wristSkin.transform(), wristSize);

		var elbowSkin = new SceneNode("elbow skin");
		elbowSkin.add(band, programs.red);
		mat4.scale(elbowSkin.transform(), elbowSize);

		var finger1Skin = new SceneNode("finger1 skin");
		finger1Skin.add(triangle, programs.vertexColor);
		mat4.scale(finger1Skin.transform(), finger1Size);

		//Verbindung Skelett + Skins
		this.torso.add(torsoSkin);
		this.head.add(headSkin);
		this.neck.add(neckSkin);
		this.shoulder.add(shoulderSkin);
		this.upperArm.add(upperArmSkin);
		this.underArm.add(underArmSkin);
		this.krone.add(kroneSkin);
		this.wrist.add(wristSkin);
		this.elbow.add(elbowSkin);
		this.finger1.add(finger1Skin);

	};

	Robot.prototype.draw = function(gl, program, transformation) {
		this.torso.draw(gl, program, transformation);
	};

	return Robot;

})); // define