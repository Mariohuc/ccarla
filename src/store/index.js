import Vue from "vue";
import Vuex from "vuex";
import singleFunction from "./singleFunction";
import scene3D from "./scene3D";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    singleFunction,
    scene3D
  }
});
