// 20FI100 松平陽

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Physijs from "physijs-webpack";
import Stats from "stats.js";
import TWEEN from "@tweenjs/tween.js";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private myMesh: THREE.Mesh;
    private frame: number = 0;
    private material: THREE.Material;
    cloud: THREE.Points;
    pvelocity: THREE.Vector3[];
    tween: any[];
    geom: THREE.BoxGeometry;
    constructor() {
        this.createScene();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (
        width: number,
        height: number,
        cameraPos: THREE.Vector3
    ) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);
        
        this.scene.add(this.CreatePointItem());

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        //両面映るMaterial
        this.material = new THREE.MeshNormalMaterial();
        this.material.side = THREE.DoubleSide;

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };

    private CreatePointItem = () => {
        let geo = new THREE.SphereGeometry(10,2,10);
        let material = new THREE.LineBasicMaterial({color:0xffffff});
        let mesh = new THREE.Mesh(geo, material);
        return mesh;
    };

}
let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(
    640,
    480,
    new THREE.Vector3(0, -100, 20)
);
document.body.appendChild(viewport);
