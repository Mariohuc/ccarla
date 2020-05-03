import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

export default {
  namespaced: true,
  state: {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    glTFBlob: null,
    displayMode: "VR" // by default "VR" OR "AR"
  },
  mutations: {
    setScene(state, newvalue) {
      state.scene = newvalue;
    },
    setCamera(state, newvalue) {
      state.camera = newvalue;
    },
    setRenderer(state, newvalue) {
      state.renderer = newvalue;
    },
    setControls(state, newvalue) {
      state.controls = newvalue;
    },
    setGLTFBlob(state, newvalue) {
      state.glTFBlob = newvalue;
    },
    changeToARMode(state) {
      state.displayMode = "AR";
    },
    changeToVRMode(state) {
      state.displayMode = "VR";
    }
  },
  actions: {
    init({ state, commit }, container) {
      return new Promise((resolve, reject) => {
        if (!container) reject();
        // SCENE
        commit("setScene", new THREE.Scene());
        // CAMERA
        var SCREEN_WIDTH = window.innerWidth,
          SCREEN_HEIGHT = window.innerHeight;
        /* RENDERER */
        commit("setRenderer", new THREE.WebGLRenderer({ antialias: true }));
        state.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        /* LIGHT */
        var light1 = new THREE.PointLight(0xffffff);
        light1.position.set(0, 0, 250);
        var light2 = new THREE.PointLight(0xffffff);
        light2.position.set(0, 0, -250);
        state.scene.add(light1);
        state.scene.add(light2);
        // bgcolor
        state.renderer.setClearColor(0xcccccc, 1);
        container.appendChild(state.renderer.domElement);
        resolve();
      });
    },
    resetCameraforSF({ state, commit }, { xMax, yMax, zMax }) {
      var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
      var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;

      // CAMERA
      commit(
        "setCamera",
        new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
      );
      state.camera.position.set(
        1.5 * xMax,
        1.5 * yMax,
        zMax < 2 ? 4 * zMax : 4
      );
      state.camera.up = new THREE.Vector3(0, 0, 1);
      state.camera.lookAt(state.scene.position);
      state.scene.add(state.camera);
      commit(
        "setControls",
        new OrbitControls(state.camera, state.renderer.domElement)
      );
    },
    exportGLTF({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (!state.scene) return reject();
        var gltfExporter = new GLTFExporter();

        var options = {
          onlyVisible: true,
          truncateDrawRange: true
        };
        gltfExporter.parse(
          state.scene,
          result => {
            if (result instanceof ArrayBuffer) {
              //filename "scene.glb"
              commit(
                "setGLTFBlob",
                new Blob([result], {
                  type: "application/octet-stream"
                })
              );
            } else {
              var output = JSON.stringify(result, null, 2);
              //filename "scene.gltf";
              commit("setGLTFBlob", new Blob([output], { type: "text/plain" }));
            }
            resolve();
          },
          options
        );
      });
    }
  }
};
