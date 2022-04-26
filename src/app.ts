import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Physijs from "physijs-webpack";
import Stats from "stats.js";
//import TWEEN from "@tweenjs/tween.js";


class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

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

            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    /*
    * ランダムなMeshを返します。
    */
    private getRamdomMesh = () => {
        let index: number = Math.floor(Math.random() * 4);

        //ランダムなGeoMetryを決める
        let getRamdomGeometry = (index) => {
            //ランダムにサイズを決める
            let size: number = Math.random() * 3;

            //ランダムにGeoMetryを決める
            switch (index) {
                case 0:
                    return new THREE.BoxGeometry(size);
                case 1:
                    return new THREE.SphereGeometry(size);
                case 2:
                    return new THREE.CylinderGeometry(size);
                case 3:
                    return new THREE.TorusGeometry(size);
            }
        }

        //ランダムな色を決める
        var material = new THREE.MeshLambertMaterial({ color: Math.random() * 255 * 255 * 255 });

        //Meshを返す
        return new THREE.Mesh(getRamdomGeometry(index), material);
    }
    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        //床の生成
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshLambertMaterial({ color: Math.random() * 255 * 255 * 255 }));
        plane.position.y = -1;
        plane.rotateX(-Math.PI / 2);
        this.scene.add(plane);

        //100個のランダムな図形を生成している
        for (var i = 0; i < 100; i++) {

            //ランダムなMeshを受け取る
            let ramdomMesh: THREE.Mesh = this.getRamdomMesh();
            
            //座標をランダムにする
            ramdomMesh.position.z = Math.random() * 40 - 20;
            ramdomMesh.position.x = Math.random() * 40 - 20;
            ramdomMesh.rotateY(Math.random() * 2 * Math.PI);
            ramdomMesh.castShadow = true;
            this.scene.add(ramdomMesh);
        }


        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }
}

let container = new ThreeJSContainer();

let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-10, 10, 10));
document.body.appendChild(viewport);
