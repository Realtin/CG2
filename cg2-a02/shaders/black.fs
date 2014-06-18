/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Fragment Shader: "Black", just makes every fragment red
 *
 * This shader expects a varying variable fragColor to contain the color
 * to be used for rendering the fragment.
 *
 */


precision mediump float;

void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
} 
 