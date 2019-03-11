import * as THREE from "three";
import "three/examples/js/controls/OrbitControls";

declare function require(name:string);

class ThreeJSContainer {
    private scene: THREE.Scene;
    private geometry: THREE.Geometry;
    private material: THREE.MeshNormalMaterial;
    private cube: THREE.Mesh;
    private light: THREE.Light;
    private torus: THREE.Mesh;
    private uniforms: THREE.Uniform[];

    constructor() {
        this.createScene();
    }

    public createRendererDOM = (width = 640, height = 480, cameraPos = new THREE.Vector3(3, 3, 3)) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0,0,0));

        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

        const update = () => {
            orbitControls.update();
            renderer.render(this.scene, camera);

            requestAnimationFrame(update);
        }
        update();

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
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
        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }
}

const container = new ThreeJSContainer();

const viewport = container.createRendererDOM();
document.body.appendChild(viewport);
