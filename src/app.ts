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

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
            console.log("ねやーん");
            this.tween.forEach((t) => t.update());
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
        this.createParticles();
        this.tween = [];
        let end_vertex = new THREE.TorusGeometry(100, 20, 50, 20).vertices;
        for (let pIndex = 0; pIndex < 19; pIndex++) {
            //スタート地点
            let geom = <THREE.Geometry>this.cloud.geometry;
            let vertices = geom.vertices;

            let sqx = vertices[pIndex].x;
            let sqy = vertices[pIndex].y;
            let sqz = vertices[pIndex].z;
            //ゴール地点
            let shx = end_vertex[pIndex].x;
            let shz = end_vertex[pIndex].y;
            let shy = end_vertex[pIndex].z;

            let tweeninfo = { x: sqx, y: sqy, z: sqz, index: pIndex };
            let t = new TWEEN.Tween(tweeninfo)
                .to({ x: shx, y: shy, z: shz }, 3000)
                .onUpdate(() => {
                    this.updateCloud(
                        tweeninfo.index,
                        tweeninfo.x,
                        tweeninfo.y,
                        tweeninfo.z
                    );
                });
            this.tween.push(t);
            t.start(2000);
            t.repeat(2000);
        }

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };
    private updateCloud = (index, x, y, z) => {
        let geom = <THREE.Geometry>this.cloud.geometry;
        geom.verticesNeedUpdate = true;
        let vertices = geom.vertices;
        vertices[index].x = x; // ここに注意
        vertices[index].y = y; //
        vertices[index].z = z;
        geom.vertices = vertices;
        this.cloud.geometry = geom;
    };
    /*
    Particle生成用処理
    */
    private createParticles = () => {
        this.cloud = this.createPoints(
            new THREE.BoxGeometry(50, 50, 50, 10, 9, 8),
            new THREE.Color(0x0000ff)
        );
        this.scene.add(this.cloud);
    };
    /*
    Points生成用処理
    */
    private createPoints = (geom: THREE.Geometry, color: THREE.Color) => {
        let material = new THREE.PointsMaterial({
            color: color,
            size: 3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return new THREE.Points(geom, material);
    };
}
let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(
    640,
    480,
    new THREE.Vector3(0, -100, 20)
);
document.body.appendChild(viewport);
