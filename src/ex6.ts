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
    private klein: THREE.Mesh;
    private mevius: THREE.Mesh;
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
            meviusRot: 0.01,
            klineRot: 0.01,
        };

        //パラメータの設定
        let gui = new dat.GUI({ autoPlace: true, width: 256 });
        let controller = gui.add(controls, "meviusRot", 0, 0.5);
        let controller2 = gui.add(controls, "klineRot", 0, 0.5);

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
            this.mevius.rotateY(controls.meviusRot);
            this.klein.rotateY(controls.klineRot);

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

        //meviusの点群
        let mevius = (u: number, v: number, target: THREE.Vector3) => {
            let a = 3;
           
            //パラメータの基底を変更
            u -= 0.5;
            v *= 2 * Math.PI;
            let x = Math.cos(v) * (a + u * Math.cos(v / 2));
            let y = Math.sin(v) * (a + u * Math.cos(v / 2));
            let z = u * Math.sin(v / 2);
            target.set(x, y, z);
        };

        //kleinの点群
        let klein = (u: number, v: number, target: THREE.Vector3) => {
            //パラメータの基底を変更
            u *= Math.PI * 2;
            v *= Math.PI * 2;
            let r = 4 * (1 - Math.cos(u) / 2);

            //三項演算子を使用
            let x =
                u < Math.PI
                    ? 6 * Math.cos(u) * (1 + Math.sin(u)) +
                      r * Math.cos(u) * Math.cos(v)
                    : 6 * Math.cos(u) * (1 + Math.sin(u)) +
                      r * Math.cos(v + Math.PI);

            let y =
                u < Math.PI
                    ? 16 * Math.sin(u) + r * Math.sin(u) * Math.cos(v)
                    : 16 * Math.sin(u);

            let z = r * Math.sin(v);
            target.set(x / 5, -y / 5, z / 5);
        };

        //Geometryを格納するコレクション
        let geometrys = [
            new THREE.ParametricGeometry(mevius, 50, 50),
            new THREE.ParametricGeometry(klein, 50, 50),
        ];

        //GeoMetryのコレクションを回してMeshを生成し。Sceneに配置
        for (let i = 0; i < geometrys.length; i++) {
            let mesh = new THREE.Mesh(geometrys[i], material);
            
            // オブジェクト同士の感覚を取っている
            mesh.position.x = (i * geometrys.length - 1) * 6;
            if (i == 0) this.mevius = mesh;
            else this.klein = mesh;

            //シーン自体に追加
            this.scene.add(mesh);
        }

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };
}

let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(
    640,
    480,
    new THREE.Vector3(-13, 10, 7)
);
document.body.appendChild(viewport);
