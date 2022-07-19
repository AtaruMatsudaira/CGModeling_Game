// 20FI100 松平陽
//イメージはポケットモンスターのラプラス

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

    //押し出し設定用フィールド
    private bevelThickness = 2;
    private bevelSize = 1;
    private bevelSegments = 3;
    
    private material: THREE.Material;

    constructor() {
        this.createScene();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (
        width: number,
        height: number,
        cameraPos: THREE.Vector3
    ) => {
        let controls = {
            bevelThickness: 2,
            bevelSize: 1,
            bevelSegments: 3,
        };

        //パラメータの設定
        let gui = new dat.GUI({ autoPlace: true, width: 256 });

        let ctrl_thickness = gui
            .add(controls, "bevelThickness", 1, 5)
            .onChange((e: number) => {
                this.bevelThickness = e;
                this.updateMyMesh();
            });

        let ctrl_size = gui
            .add(controls, "bevelSize", 1, 5)
            .onChange((e: number) => {
                this.bevelSize = e;
                this.updateMyMesh();
            });

        let ctrl_segments = gui
            .add(controls, "bevelSegments", 3, 20)
            .onChange((e: number) => {
                this.bevelSegments = e;
                this.updateMyMesh();
            });

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);

            //それぞれ回転させている
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
        let shapeGeometry = this.drawShape();

        this.scene.add(shapeGeometry);

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };

    private drawShape = () => {
        // THREE.Shapeを作成
        let shape = new THREE.Shape();
        // スタート地点へ移動
        shape.moveTo(0, 0);

        let posList_1 = [new THREE.Vector2(1, 1), new THREE.Vector2(0, 2)];

        //Spline曲線を描く
        shape.splineThru(posList_1);

        let posList_2 = [new THREE.Vector2(1, 3), new THREE.Vector2(0, 4)];


        //Spline曲線を描く
        shape.splineThru(posList_2);

        //ハートの角へ
        shape.lineTo(-2, 2);

        //再び線を描きスタート地点に戻る
        shape.lineTo(0, 0);

        //オプションMapの生成
        let controls = {
            depth: 2,
            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelSegments: this.bevelSegments,
            bevelEnabled: true,
            curveSegments: 30,
            steps: 1,
        };

        //Meshを生成
        this.myMesh = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shape, controls),
            this.material
        );

        //メッシュを返す
        return this.myMesh;
    };

    private updateMyMesh() {
        this.scene.remove(this.myMesh);
        this.scene.add(this.drawShape());
    }
}

let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(
    640,
    480,
    new THREE.Vector3(0, -10, 20)
);
document.body.appendChild(viewport);
