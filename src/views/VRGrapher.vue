<template>
  <div id="graph" style="position: absolute; height: 100%; left:0px; top:0px">
    <v-btn @click="goback" color="red" small dark fixed top left fab>
      <v-icon>mdi-keyboard-return</v-icon>
    </v-btn>
    <v-btn
      @click="changeToARMode"
      color="primary"
      small
      dark
      fixed
      top
      right
      fab
    >
      <v-icon>mdi-augmented-reality</v-icon>
    </v-btn>
  </div>
</template>

<style></style>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import router from "../router";

export default {
  data() {
    return {
      container: null
    };
  },
  computed: {
    ...mapState("singleFunction", ["xMax", "yMax", "zMax"]),
    ...mapState("scene3D", ["scene", "camera", "renderer", "controls"])
  },
  mounted() {
    this.container = document.getElementById("graph");
    // WIREMATERIAL FOR GRAPHMESH
    this.createDefaultWireMaterial();

    this.init(this.container).then(() => {
      // ADD AXES AND PLANE
      this.createPlane3D(this.scene);
      // ADD THE MAIN GRAPH TO SCENE
      this.setFirstGraphtoScene(this.scene)
        .then(() => {
          this.resetCameraforSF({
            xMax: this.xMax,
            yMax: this.yMax,
            zMax: this.zMax
          });
          this.animate();
        })
        .catch(error => {
          alert(error);
          this.resetCameraforSF({ xMax: 10, yMax: 10, zMax: 1 });
          this.animate();
        });
    });
  },
  methods: {
    ...mapMutations("singleFunction", ["createDefaultWireMaterial"]),
    ...mapMutations("scene3D", ["changeToARMode"]),
    ...mapActions("singleFunction", ["setFirstGraphtoScene", "createPlane3D"]),
    ...mapActions("scene3D", ["init", "resetCameraforSF", "exportGLTF"]),
    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();

      this.renderer.render(this.scene, this.camera);
    },
    goback() {
      // go back by one record, the same as history.back()
      router.push("/");
    }
  }
};
</script>
