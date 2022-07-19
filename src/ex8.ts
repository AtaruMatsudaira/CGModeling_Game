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
    private start_p: THREE.Vector3;
    end_p: THREE.Vector3;
    adj_p1: THREE.Vector3;
    adj_p2: THREE.Vector3;
    curveObject: THREE.Line;
    ctrl_sph1: THREE.Mesh;
    ctrl_sph2: THREE.Mesh;
    ctrl_sph3: THREE.Mesh;
    ctrl_sph4: THREE.Mesh;
    constructor() {

        //毎フレームBezier曲線を生成している都合上、コンストラクタで制御点を初期化
        this.start_p = new THREE.Vector3(-10, 0, 0);
        this.end_p = new THREE.Vector3(10, 0, 0);
        this.adj_p1 = new THREE.Vector3(-5, 15, 0);
        this.adj_p2 = new THREE.Vector3(15, 15, 0); //ベジエ曲線を設定

        this.createScene();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (
        width: number,
        height: number,
        cameraPos: THREE.Vector3
    ) => {
        let controls = {
            adj_p1_x: this.adj_p1.x,
            adj_p1_y: this.adj_p1.y,
            adj_p1_z: this.adj_p1.z,
            adj_p2_x: this.adj_p2.x,
            adj_p2_y: this.adj_p2.y,
            adj_p2_z: this.adj_p2.z,
        };

        //パラメータの設定
        let gui = new dat.GUI({ autoPlace: true, width: 256 });
        let ctrl_p1x = gui
            .add(controls, "adj_p1_x", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p1.setX(e);
            });
        let ctrl_p1y = gui
            .add(controls, "adj_p1_y", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p1.setY(e);
            });
        let ctrl_p1z = gui
            .add(controls, "adj_p1_z", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p1.setZ(e);
            });
        let ctrl_p2x = gui
            .add(controls, "adj_p2_x", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p2.setX(e);
            });
        let ctrl_p2y = gui
            .add(controls, "adj_p2_y", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p2.setY(e);
            });
        let ctrl_p2z = gui
            .add(controls, "adj_p2_z", -25, 25)
            .onChange((e: number) => {
                //ここにGUIにより値が変わったときの動作を追記
                this.adj_p2.setZ(e);
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

            //毎フレームベジべ曲線を作り直している
            this.createCubicBezierCurve();
            
            
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
        let material = new THREE.MeshNormalMaterial();
        material.side = THREE.DoubleSide;

        this.createCubicBezierCurve();

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };

    private createCubicBezierCurve = () => {
        //すでにSceneに存在するオブジェクトを破棄
        this.scene.children // シーンに含まれているオブジェクト
            .forEach(
                //ラムダ式でコレクションに対して処理を行う
                (
                    child //childはそれぞれの要素
                ) => this.scene.remove(child) //シーンから除去
            );

        //ベジエ曲線上の点を取得
        let curve = new THREE.CubicBezierCurve3(
            this.start_p,
            this.adj_p1,
            this.adj_p2,
            this.end_p
        );

        //分割数は100
        let points = curve.getPoints(100);

        //点からGeometryを作成
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        // Materialを作成

        var material = new THREE.LineBasicMaterial({
            color: new THREE.Color(0, 0, 0),
        });

        // オブジェクトの生成
        this.curveObject = new THREE.Line(geometry, material);

        //曲線のオブジェクトをSceneに追加
        this.scene.add(this.curveObject);

        let sph_geo = new THREE.SphereGeometry(0.5, 10, 10);

        this.ctrl_sph1 = new THREE.Mesh(
            sph_geo,
            new THREE.LineBasicMaterial({ color: new THREE.Color(0xfff500) })
        );
        this.ctrl_sph1.position.copy(this.start_p);

        this.ctrl_sph2 = new THREE.Mesh(
            sph_geo,
            new THREE.LineBasicMaterial({ color: new THREE.Color(0xec008c) })
        );
        this.ctrl_sph2.position.copy(this.adj_p1);

        this.ctrl_sph3 = new THREE.Mesh(
            sph_geo,
            new THREE.LineBasicMaterial({ color: new THREE.Color(0x00aeef) })
        );
        this.ctrl_sph3.position.copy(this.adj_p2);

        this.ctrl_sph4 = new THREE.Mesh(
            sph_geo,
            new THREE.LineBasicMaterial({ color: new THREE.Color(0xfff500) })
        );
        this.ctrl_sph4.position.copy(this.end_p);

        this.scene.add(this.ctrl_sph1);
        this.scene.add(this.ctrl_sph2);
        this.scene.add(this.ctrl_sph3);
        this.scene.add(this.ctrl_sph4);
    };
}

let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(
    640,
    480,
    new THREE.Vector3(0, -10, 20)
);
document.body.appendChild(viewport);
