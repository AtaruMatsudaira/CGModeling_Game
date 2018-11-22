import * as THREE from "three";
import "./node_modules/three/examples/js/controls/OrbitControls.js";

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

    constructor() {
        this.createRenderer();
        this.createScene();
    } 

    private createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x495ed));
        document.getElementById("viewport").appendChild(this.renderer.domElement);
    }  

    private createScene() {
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: 0x55ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
        this.camera = new THREE.PerspectiveCamera(75, this.screenWidth /   
 this.screenHeight, 0.1, 1000);
        this.camera.position.x = 3;
        this.camera.position.y = 3;
        this.camera.position.z = 3;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    } 

    public render() {
        this.cube.rotation.x += 0.02;
        this.cube.rotation.y += 0.02;

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

}

window.onload = () => {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render(); 
};