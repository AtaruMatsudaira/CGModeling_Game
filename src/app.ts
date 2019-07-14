import * as THREE from "three";
import "three/examples/js/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Stats from "stats.js";
import * as TWEEN from "@tweenjs/tween.js";
import * as Physijs from "physijs-webpack";


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

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width = 640, height = 480, cameraPos = new THREE.Vector3(3, 3, 3)) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0,0,0));

        const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

        // 毎フレームのupdateを呼んで，render
        // reqest... により次フレームを呼ぶ
        const render = () => {
            orbitControls.update();

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        render();

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        this.geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);

        // requireにより，サーバーサイド読み込み
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


        // 毎フレームのupdateを呼んで，更新
        // reqest... により次フレームを呼ぶ
        const update = () => {
            this.torus.rotateX(0.01);

            requestAnimationFrame(update);
        }
        update();
    }
}

const container = new ThreeJSContainer();

const viewport = container.createRendererDOM();
document.body.appendChild(viewport);
