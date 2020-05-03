<template>
  <div>
    <iframe
      id="arviewer"
      src="./arviewer.html"
      frameborder="5"
      allowfullscreen
    ></iframe>
    <v-btn
      @click="changeToVRMode"
      color="success"
      small
      dark
      fixed
      top
      right
      fab
    >
      <v-icon>mdi-virtual-reality</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data: () => ({}),
  methods: {
    ...mapMutations("scene3D", ["changeToVRMode"])
  }
};
</script>

<style>
body {
  margin: 0;
}
#arviewer {
  position: absolute;
  height: calc(100vh - 4px);
  width: calc(100vw - 4px);
  box-sizing: border-box;
}
</style>
