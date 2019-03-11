import * as THREE from "three";
import "three/examples/js/controls/OrbitControls";

declare function require(name:string);

class ThreeJSTest {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.Geometry;
    private material: THREE.MeshNormalMaterial;
    private cube: THREE.Mesh;
    private light: THREE.Light;
    private screenWidth: number = 640;
    private screenHeight: number = 480;
    private torus: THREE.Mesh;
    private uniforms: THREE.Uniform[];

    private orbitControls: THREE.OrbitControls;

    constructor() {
        this.createRenderer();
        this.createScene();
    }

    get domElement() { return this.renderer.domElement; }

    private createRenderer = () => {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        document.getElementById("viewport").appendChild(this.renderer.domElement);
    }

    private createScene = () => {
        this.scene = new THREE.Scene();
        this.geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);

        const vert = <string>require("./vertex.vs");
        const frag = <string>require("./fragment.fs");
        this.uniforms = [];
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vert,
            fragmentShader: frag,
        });

        this.torus = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.torus);
        this.camera = new THREE.PerspectiveCamera(75, this.screenWidth /  this.screenHeight, 0.1, 1000);
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    }

    public render = () => {
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }

}

window.onload = () => {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
};
