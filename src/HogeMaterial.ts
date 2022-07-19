// 20FI100 松平陽

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Physijs from "physijs-webpack";
import Stats from "stats.js";
import TWEEN from "@tweenjs/tween.js";


class Hoge {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private geometry: THREE.Geometry;
    private material: THREE.Material;//ここで宣言
    private cube: THREE.Mesh;
    private group: THREE.Group;
    constructor() {
        this.createScene();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
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
            this.group.rotateX(0.01);
            this.group.rotateY(0.01);
            this.group.rotateZ(0.01);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }
    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry(3, 3, 3);

        this.group = new THREE.Group();

        this.geometry = new THREE.BoxGeometry(2.9, 2.9, 2.9);

        let matArray = [];
        matArray.push(new THREE.PointsMaterial({ color: 0x009e60 }));
        matArray.push(new THREE.MeshToonMaterial({ color: 0x0051ba }));
        matArray.push(new THREE.LineBasicMaterial({ color: 0x00ba51 }));
        matArray.push(new THREE.MeshLambertMaterial({ color: 0xff5800 }));
        matArray.push(new THREE.MeshNormalMaterial({}));
        matArray.push(new THREE.MeshBasicMaterial({ color: 0x0f43252 }));
        this.material = new THREE.MultiMaterial(matArray);

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    //ここでMeshを作成する。
                    let cube = new THREE.Mesh(this.geometry, this.material);
                    //ここで個々のcubeの位置を少しずつ変える
                    cube.position.set(x * 3 - 3, y * 3, z * 3 - 3);
                    //グループに追加する。
                    this.group.add(cube);
                }
            }
        }

        this.scene.add(this.group);
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }
}


let container = new Hoge();

let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-13, 10, 7));
document.body.appendChild(viewport);
