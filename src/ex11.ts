// 20FI100 松平陽

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Physijs from "physijs-webpack";
import Stats from "stats.js";
import TWEEN from "@tweenjs/tween.js";

/*
 Particle用クラス
*/
class ParticleObj {
    public obj: THREE.Points;
    public moveSpeed: THREE.Vector3;
    private rotateSpeed: number;
    public constructor(obj: THREE.Points, moveSpeed: THREE.Vector3) {
        this.obj = obj;
        this.moveSpeed = moveSpeed;
        this.rotateSpeed = (Math.random() - 0.5) / 9.9;
    }
    public move() {
        this.obj.position.x += this.moveSpeed.x;
        this.obj.position.y += this.moveSpeed.y;
        this.obj.position.z += this.moveSpeed.z;
        this.obj.rotateZ(this.rotateSpeed);
    }
    public Clone(): ParticleObj {
        return new ParticleObj(this.obj.clone(), this.moveSpeed);
    }
}
/*
Particleをグループで管理するクラス
*/
class TorusGroup {
    public torusList: Array<ParticleObj>;

    constructor() {
        this.torusList = new Array<ParticleObj>();
    }

    public move() {
        this.torusList.forEach((torus) => torus.move());
    }
    public Clone(): TorusGroup {
        let group = new TorusGroup();
        this.torusList.forEach((torus) => {
            let newTorus = torus.Clone();
            newTorus.obj.position.set(0, 0, 0);
            group.torusList.push(newTorus);
        });
        return group;
    }
}

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private myMesh: THREE.Mesh;
    private frame: number = 0;
    private material: THREE.Material;
    cloud: THREE.Points;
    pvelocity: THREE.Vector3[];
    firstGroup: TorusGroup;
    otherGroups: TorusGroup[] = [];
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
            
            //それぞれ動かしている
            this.firstGroup.move();
            this.otherGroups.forEach((group) => group.move());

            //300フレームごとに新しいオブジェクトを生成している
            if (this.frame % 300 == 0) {
                let newGroup = this.firstGroup.Clone();
                this.otherGroups.push(newGroup);
                newGroup.torusList.forEach((group) => {
                    this.scene.add(group.obj);
                });
            }
            this.frame++;
            orbitControls.update();

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

        this.createParticles();

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        let lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    };

    /*
    Particle生成用処理
    */
    private createParticles = () => {
        let colors = [
            new THREE.Color(0x0000ff),
            new THREE.Color(0x00ff00),
            new THREE.Color(0xff0000),
        ];
        this.firstGroup = new TorusGroup();
        colors.forEach((color) => {
            let points = this.createPoints(
                new THREE.TorusGeometry(50, 5, 10, 10),
                color
            );
            this.firstGroup.torusList.push(
                new ParticleObj(points, new THREE.Vector3(0, 0, 0.1))
            );
            this.scene.add(points);
        });
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
