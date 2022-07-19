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

            //シーン上に存在するMeshオブジェクトを全て回転させている
            this.scene.children.forEach((mesh) => {
                mesh.rotateX(0.01);
                mesh.rotateY(-0.03);
                mesh.rotateZ(0.05);
            });
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

        //ホーン用の点群
        let points: THREE.Vector2[] = [];
        for (let i = 0.1; i < 1; i += 0.1) {
            //ホーンの式は  (t, ln(t) + 1) 0.1 <= t < 1
            points.push(new THREE.Vector2(i, Math.log(i) + 1).divideScalar(1));
        }

        //Geometryを格納するコレクション
        let geometrys = [
            new THREE.LatheGeometry(points, 12),
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
        ];

        //GeoMetryのコレクションを回してMeshを生成し。Sceneに配置
        for (let i = 0; i < geometrys.length; i++) {
            let mesh = new THREE.Mesh(geometrys[i], material);
            mesh.position.x = i * geometrys.length - 1;
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
