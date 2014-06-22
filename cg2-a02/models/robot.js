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
		var kroneSize = [0.175, 0.3, 0.175];
		var headSize = [0.25, 0.3, 0.25];
		var neckSize = [0.2, 0.05, 0.2];
		var torsoSize = [0.6, 0.9, 0.4];
		var shoulderRSize = [0.1, 0.3, 0.1];
		var shoulderLSize = [0.1, 0.3, 0.1];
		var upperArmRSize = [0.4, 0.1, 0.1];
		var upperArmLSize = [0.4, 0.1, 0.1];
		var elbowRSize = [0.05,0.15,0.05];
		var elbowLSize = [0.05,0.15,0.05];
		var underArmRSize = [0.4, 0.1, 0.1];
		var wristRSize = [0.05,0.15,0.05];
		var finger1RSize = [0.1, 0.2, 0.1];
		var underArmLSize = [0.4, 0.1, 0.1];
		var wristLSize = [0.05,0.15,0.05];
		var finger1LSize = [0.1, 0.2, 0.1];


		//Skelett

		this.krone = new SceneNode("krone");
		mat4.translate(this.krone.transform(), [0, headSize[1] / 2, 0]);

		this.head = new SceneNode("head");
		mat4.translate(this.head.transform(), [0, neckSize[1] / 2 + headSize[1] / 2, 0]);

		this.torso = new SceneNode("torso");

		this.neck = new SceneNode("neck");
		mat4.translate(this.neck.transform(), [0, (torsoSize[1] / 2 + neckSize[1] / 2), 0]);
		// mat4.rotate(this.neck.transform(), Math.PI, [0, 0, 1]);

		this.shoulderR = new SceneNode("shoulder rechts");
		mat4.translate(this.shoulderR.transform(), [-(torsoSize[0] / 2 + shoulderRSize[0] / 4), (torsoSize[1] / 3 + shoulderRSize[0] / 2), 0]);
		mat4.rotate(this.shoulderR.transform(), Math.PI, [1, 1, 0]);

		this.upperArmR = new SceneNode("upper arm rechts");
		mat4.translate(this.upperArmR.transform(), [-upperArmRSize[0]/2, -upperArmRSize[1]/4, 0]);
		// mat4.rotate(this.upperArm.transform(), Math.PI, [1, 1, 0]);

		this.underArmR = new SceneNode("under arm rechts");
		mat4.translate(this.underArmR.transform(), [-underArmRSize[0]/2, 0, 0]);
		// mat4.rotate(this.underArm.transform(), Math.PI, [1, 1, 0]);

		this.wristR = new SceneNode("wrist rechts");
		mat4.translate(this.wristR.transform(), [-underArmRSize[0]/2, 0, 0]);
		mat4.rotate(this.wristR.transform(), Math.PI, [1, 1, 0]);

		this.elbowR = new SceneNode("elbow rechts");
		mat4.translate(this.elbowR.transform(), [-underArmRSize[0]/2, 0, 0]);
		// mat4.rotate(this.elbow.transform(), Math.PI, [1, 1, 0]);

		this.finger1R = new SceneNode("finger 1 rechts");
		mat4.translate(this.finger1R.transform(), [0, -finger1RSize[1]/2, 0])
		mat4.rotate(this.finger1R.transform(), Math.PI, [1, 0, 0]);

		this.shoulderL = new SceneNode("shoulder links");
		mat4.translate(this.shoulderL.transform(), [(torsoSize[0] / 2 + shoulderLSize[0]/4), (torsoSize[1] / 3 + shoulderLSize[0] / 2), 0]);
		mat4.rotate(this.shoulderL.transform(), Math.PI, [1, 1, 0]);

		this.upperArmL = new SceneNode("upper arm links");
		mat4.translate(this.upperArmL.transform(), [-upperArmLSize[0]/2, upperArmLSize[1]/4, 0]);
		// mat4.rotate(this.upperArm.transform(), Math.PI, [1, 1, 0]);

		this.underArmL = new SceneNode("under arm links");
		mat4.translate(this.underArmL.transform(), [-underArmLSize[0]/2, 0, 0]);
		// mat4.rotate(this.underArm.transform(), Math.PI, [1, 1, 0]);

		this.wristL = new SceneNode("wrist links");
		mat4.translate(this.wristL.transform(), [-underArmLSize[0]/2, 0, 0]);
		mat4.rotate(this.wristL.transform(), Math.PI, [1, 1, 0]);

		this.elbowL = new SceneNode("elbow links");
		mat4.translate(this.elbowL.transform(), [-underArmLSize[0]/2, 0, 0]);
		// mat4.rotate(this.elbow.transform(), Math.PI, [1, 1, 0]);

		this.finger1L = new SceneNode("finger 1 links");
		mat4.translate(this.finger1L.transform(), [0, -finger1LSize[1]/2, 0]);
		mat4.rotate(this.finger1L.transform(), Math.PI, [1, 0, 0]);


		this.torso.add(this.neck);
		this.head.add(this.krone);
		this.neck.add(this.head);
		this.torso.add(this.shoulderR);
		this.torso.add(this.shoulderL);
		this.shoulderR.add(this.upperArmR);
		this.upperArmR.add(this.elbowR);
		this.elbowR.add(this.underArmR);
		this.underArmR.add(this.wristR);
		this.wristR.add(this.finger1R);
		this.shoulderL.add(this.upperArmL);
		this.upperArmL.add(this.elbowL);
		this.elbowL.add(this.underArmL);
		this.underArmL.add(this.wristL);
		this.wristL.add(this.finger1L);

		//Skins
		var torsoSkin = new SceneNode("torso skin");
		torsoSkin.add(cube, programs.vertexColor);
		mat4.scale(torsoSkin.transform(), torsoSize);

		var neckSkin = new SceneNode("neck skin");
		neckSkin.add(cube, programs.vertexColor);
		// mat4.rotate(neckSkin.transform(), 0.6 * Math.PI, [0, 1, 0]);
		mat4.scale(neckSkin.transform(), neckSize);

		var headSkin = new SceneNode("head skin");
		headSkin.add(cube, programs.vertexColor);
		// mat4.rotate(headSkin.transform(), 0.6 * Math.PI, [0, 1, 0]);
		mat4.scale(headSkin.transform(), headSize);

		var shoulderRSkin = new SceneNode("shoulder skin");
		shoulderRSkin.add(band, programs.red);
		mat4.scale(shoulderRSkin.transform(), shoulderRSize);

		var upperArmRSkin = new SceneNode("upper arm skin");
		upperArmRSkin.add(ellipsoid, programs.black);
		mat4.scale(upperArmRSkin.transform(), upperArmRSize);

		var underArmRSkin = new SceneNode("under arm skin");
		underArmRSkin.add(ellipsoid, programs.black);
		mat4.scale(underArmRSkin.transform(), underArmRSize);

		var shoulderLSkin = new SceneNode("shoulder skin");
		shoulderLSkin.add(band, programs.red);
		mat4.scale(shoulderLSkin.transform(), shoulderLSize);

		var upperArmLSkin = new SceneNode("upper arm skin");
		upperArmLSkin.add(ellipsoid, programs.black);
		mat4.scale(upperArmLSkin.transform(), upperArmLSize);

		var underArmLSkin = new SceneNode("under arm skin");
		underArmLSkin.add(ellipsoid, programs.black);
		mat4.scale(underArmLSkin.transform(), underArmLSize);

		var kroneSkin = new SceneNode("krone skin");
		kroneSkin.add(bandWf, programs.red);
		mat4.scale(kroneSkin.transform(), kroneSize);

		var wristRSkin = new SceneNode("wrist skin");
		wristRSkin.add(band, programs.red);
		mat4.scale(wristRSkin.transform(), wristRSize);

		var elbowRSkin = new SceneNode("elbow skin");
		elbowRSkin.add(band, programs.red);
		mat4.scale(elbowRSkin.transform(), elbowRSize);

		var finger1RSkin = new SceneNode("finger1 skin");
		finger1RSkin.add(triangle, programs.vertexColor);
		mat4.scale(finger1RSkin.transform(), finger1RSize);

		var wristLSkin = new SceneNode("wrist left skin");
		wristLSkin.add(band, programs.red);
		mat4.scale(wristLSkin.transform(), wristLSize);

		var elbowLSkin = new SceneNode("elbow left skin");
		elbowLSkin.add(band, programs.red);
		mat4.scale(elbowLSkin.transform(), elbowLSize);

		var finger1LSkin = new SceneNode("finger1 left skin");
		finger1LSkin.add(triangle, programs.vertexColor);
		mat4.scale(finger1LSkin.transform(), finger1LSize);

		//Verbindung Skelett + Skins
		this.torso.add(torsoSkin);
		this.head.add(headSkin);
		this.neck.add(neckSkin);
		this.shoulderR.add(shoulderRSkin);
		this.upperArmR.add(upperArmRSkin);
		this.underArmR.add(underArmRSkin);
		this.shoulderL.add(shoulderLSkin);
		this.upperArmL.add(upperArmLSkin);
		this.underArmL.add(underArmLSkin);
		this.krone.add(kroneSkin);
		this.wristR.add(wristRSkin);
		this.elbowR.add(elbowRSkin);
		this.finger1R.add(finger1RSkin);
		this.wristL.add(wristLSkin);
		this.elbowL.add(elbowLSkin);
		this.finger1L.add(finger1LSkin);

	};

	Robot.prototype.draw = function(gl, program, transformation) {
		this.torso.draw(gl, program, transformation);
	};

	return Robot;

})); // define