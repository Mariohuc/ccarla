import * as THREE from "three";
import { create, all } from "mathjs";
const config = {};
const math = create(all, config);

export default {
  namespaced: true,
  state: {
    zFuncText: "sin(sqrt(a*x^2  + b*y^2))", //default function
    segments: 40,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    zMin: -10,
    zMax: 10,
    parameters: { a: 1, b: 1, c: 1, d: 1, e: 1 },
    axesItem: {
      number_size: 0.2,
      number_height: 0.05,
      font: undefined,
      axis_size: 25
    },
    // Properties to save 3D objects
    plane3D: null,
    graphGeometry: null,
    wireMaterial: null,
    graphMesh: null,
    parser: math.parser()
  },
  mutations: {
    setZFuncText(state, newvalue) {
      state.zFuncText = newvalue;
    },
    setSegments(state, newvalue) {
      state.segments = newvalue;
    },
    setXMin(state, newvalue) {
      state.xMin = newvalue;
    },
    setXMax(state, newvalue) {
      state.xMax = newvalue;
    },
    setYMin(state, newvalue) {
      state.yMin = newvalue;
    },
    setYMax(state, newvalue) {
      state.yMax = newvalue;
    },
    setZMin(state, newvalue) {
      state.zMin = newvalue;
    },
    setZMax(state, newvalue) {
      state.zMax = newvalue;
    },
    setAxesFont(state, newfont) {
      state.axesItem.font = newfont;
    },
    setGraphGeometry(state, newvalue) {
      state.graphGeometry = newvalue;
    },
    setWireMaterial(state, newvalue) {
      state.wireMaterial = newvalue;
    },
    createDefaultWireMaterial(state) {
      if (this.wireMaterial) return;
      var wireTexture = new THREE.TextureLoader().load(
        `${process.env.BASE_URL}images/square.png`
      );
      wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
      wireTexture.repeat.set(state.segments, state.segments);
      state.wireMaterial = new THREE.MeshBasicMaterial({
        map: wireTexture,
        vertexColors: true,
        side: THREE.DoubleSide
      });
    },
    setGraphMesh(state, newvalue) {
      state.graphMesh = newvalue;
    },
    setOneParameter(state, { param, newval }) {
      var temp = state.parameters;
      // object.a es igual a object["a"] - object.a is equal to object["a"]
      if (temp[param] !== undefined) {
        temp = Object.assign(temp, { [param]: newval });
      }
      state.parameters = temp;
    },
    setParameters(state, newobject) {
      state.parameters = newobject;
    }
  },
  getters: {
    xRange(state) {
      return state.xMax - state.xMin;
    },
    yRange(state) {
      return state.yMax - state.yMin;
    },
    zRange(state) {
      return state.zMax - state.zMin;
    }
  },
  actions: {
    setFirstGraphtoScene({ dispatch, state }, scene) {
      return new Promise((resolve, reject) => {
        if (!state.graphMesh) {
          dispatch("createGraph", scene)
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          scene.add(state.graphMesh);
          resolve();
        }
      });
    },
    createGraph({ dispatch, commit, state, getters }, scene) {
      return new Promise((resolve, reject) => {
        dispatch("resetParameters")
          .then(result => {
            var meshFunction = function(x, y, target) {
              x = getters.xRange * x + state.xMin;
              y = getters.yRange * y + state.yMin;
              var z = result(x, y);
              if (isNaN(z)) target.set(0, 0, 0);
              else target.set(x, y, z);
            };

            // true => sensible image tile repeat...
            commit(
              "setGraphGeometry",
              new THREE.ParametricBufferGeometry(
                meshFunction,
                state.segments,
                state.segments
              )
            );
            state.graphGeometry.computeBoundingBox();
            commit("setZMin", state.graphGeometry.boundingBox.min.z);
            commit("setZMax", state.graphGeometry.boundingBox.max.z);
            if (state.wireMaterial) {
              dispatch("setVertexColors")
                .then(() => {
                  if (state.graphMesh) {
                    scene.remove(state.graphMesh);
                  }
                  state.wireMaterial.map.repeat.set(
                    state.segments,
                    state.segments
                  );
                  commit(
                    "setGraphMesh",
                    new THREE.Mesh(state.graphGeometry, state.wireMaterial)
                  );
                  state.graphMesh.doubleSided = true;
                  scene.add(state.graphMesh);
                  resolve();
                })
                .catch(error => reject(error));
            } else {
              reject("WireMaterial es nulo");
            }
          })
          .catch(error => reject(error));
      });
    },
    updateGraph({ dispatch, commit, state, getters }, scene) {
      return new Promise((resolve, reject) => {
        if (!state.graphMesh) reject();
        var zFunc = state.parser.get("f");
        var meshFunction = function(x, y, target) {
          x = getters.xRange * x + state.xMin;
          y = getters.yRange * y + state.yMin;
          var z = zFunc(x, y);
          if (isNaN(z)) target.set(0, 0, 0);
          else target.set(x, y, z);
        };
        commit(
          "setGraphGeometry",
          new THREE.ParametricBufferGeometry(
            meshFunction,
            state.segments,
            state.segments
          )
        );
        state.graphGeometry.computeBoundingBox();
        commit("setZMin", state.graphGeometry.boundingBox.min.z);
        commit("setZMax", state.graphGeometry.boundingBox.max.z);
        dispatch("setVertexColors")
          .then(() => {
            if (state.graphMesh) {
              scene.remove(state.graphMesh);
            }
            state.wireMaterial.map.repeat.set(state.segments, state.segments);
            commit(
              "setGraphMesh",
              new THREE.Mesh(state.graphGeometry, state.wireMaterial)
            );
            state.graphMesh.doubleSided = true;
            scene.add(state.graphMesh);
            resolve();
          })
          .catch(error => reject(error));
      });
    },
    setVertexColors({ state, getters }) {
      return new Promise((resolve, reject) => {
        if (!state.graphGeometry) reject();
        var positions = state.graphGeometry.getAttribute("position");
        var color;
        var colors = [];
        for (let i = 0; i < positions.count; i++) {
          color = new THREE.Color(0x0000ff);
          color.setHSL(
            (0.7 * (state.zMax - positions.getZ(i))) / getters.zRange,
            1,
            0.5
          );
          colors.push(color.r, color.g, color.b);
        }
        state.graphGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );
        resolve();
      });
    },
    resetParameters({ state, commit }) {
      return new Promise(resolve => {
        state.parser.clear();
        state.parser.evaluate("f(x,y) = ".concat(state.zFuncText)); // f(x, y)
        state.parser.set("a", 1);
        state.parser.set("b", 1);
        state.parser.set("c", 1);
        state.parser.set("d", 1);
        state.parser.set("e", 1);
        var zmax_pos = math.abs(state.parser.evaluate("f(10,10)"));
        var zmax_neg = math.abs(state.parser.evaluate("f(-10,-10)"));
        var major = zmax_pos > zmax_neg ? zmax_pos : zmax_neg;
        if (major >= 100) {
          commit("setXMax", 3);
          commit("setYMax", 3);
          commit("setXMin", -3);
          commit("setYMin", -3);
        } else if (major >= 50) {
          commit("setXMax", 6);
          commit("setYMax", 6);
          commit("setXMin", -6);
          commit("setYMin", -6);
        }
        resolve(state.parser.get("f"));
      });
    },
    createPlane3D({ state, dispatch }, scene) {
      if (!state.plane3D) {
        state.plane3D = new THREE.Group();
        dispatch("createAxes");
        dispatch("createAxesNumbers");
      }
      scene.add(state.plane3D);
    },
    createAxes({ state }) {
      if (!state.plane3D) return;
      var axes_posXYZ = new THREE.AxesHelper(state.axesItem.axis_size);
      var axes_negXY = new THREE.AxesHelper(state.axesItem.axis_size);
      var axes_negZ = new THREE.AxesHelper(state.axesItem.axis_size);
      axes_negXY.rotation.x = Math.PI;
      axes_negXY.rotation.y = Math.PI;
      axes_negZ.rotation.x = Math.PI;
      state.plane3D.add(axes_posXYZ);
      state.plane3D.add(axes_negXY);
      state.plane3D.add(axes_negZ);
    },
    createAxesNumbers({ dispatch, commit, state }) {
      if (!state.plane3D) return;
      var loader = new THREE.FontLoader();
      loader.load(
        `${process.env.BASE_URL}assets/fonts3d/helvetiker_regular.typeface.json`,
        response => {
          commit("setAxesFont", response);
          /* Create a point of origin */
          dispatch("createPoint", {
            x: 0,
            y: 0,
            z: 0,
            color: 0xff0000
          }).then(result => state.plane3D.add(result));
          /* points for axis X */
          var index = state.axesItem.axis_size - (state.axesItem.axis_size % 5);
          var temp = -index;
          while (index >= temp) {
            if (index === 0) {
              index -= 5;
              continue;
            }
            dispatch("createPoint", {
              x: index,
              y: 0,
              z: 0,
              color: 0xff0000
            }).then(result => state.plane3D.add(result));
            dispatch("createNumber", {
              x: index,
              y: 0,
              z: -(state.axesItem.number_size + 0.05),
              text: String(index),
              color: 0xff0000
            }).then(result => state.plane3D.add(result));
            index -= 5;
          }
          /* points for axis Y */
          index = -temp;
          while (index >= temp) {
            if (index === 0) {
              index -= 5;
              continue;
            }
            dispatch("createPoint", {
              x: 0,
              y: index,
              z: 0,
              color: 0x00ff00
            }).then(result => state.plane3D.add(result));
            dispatch("createNumber", {
              x: 0,
              y: index,
              z: -(state.axesItem.number_size + 0.05),
              text: String(index),
              color: 0x00ff00,
              forma: 2
            }).then(result => state.plane3D.add(result));
            index -= 5;
          }
          /* points for axis Z */
          index = -temp;
          while (index >= temp) {
            if (index === 0) {
              index -= 5;
              continue;
            }
            dispatch("createPoint", {
              x: 0,
              y: 0,
              z: index,
              color: 0x0000ff
            }).then(result => state.plane3D.add(result));
            dispatch("createNumber", {
              x: 0,
              y: 0.1,
              z: index,
              text: String(index),
              color: 0x0000ff,
              forma: 2
            }).then(result => state.plane3D.add(result));
            index -= 5;
          }
        }
      );
    },
    createNumber({ state }, { x, y, z, text, color, forma = 1 }) {
      return new Promise((resolve, reject) => {
        if (!state.plane3D) reject();
        var textMesh, textGeo;
        textGeo = new THREE.TextGeometry(text, {
          font: state.axesItem.font,
          size: state.axesItem.number_size,
          height: state.axesItem.number_height
        });
        textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
        textMesh = new THREE.Mesh(
          textGeo,
          new THREE.MeshStandardMaterial({ color })
        );
        textMesh.position.set(x, y, z);
        textMesh.rotation.x = Math.PI / 2;
        if (forma === 1) {
          textMesh.rotation.y = Math.PI;
        } else if (forma === 2) {
          textMesh.rotation.y = Math.PI / 2;
        }
        resolve(textMesh);
      });
    },
    createPoint({ state }, items) {
      return new Promise((resolve, reject) => {
        if (!state.plane3D) reject();
        var sphere_geometry = new THREE.SphereBufferGeometry(0.06);
        var sphere_material = new THREE.MeshStandardMaterial({
          color: items.color
        });
        var sphere_mesh = new THREE.Mesh(sphere_geometry, sphere_material);
        sphere_mesh.position.set(items.x, items.y, items.z);

        resolve(sphere_mesh);
      });
    }
  }
};
