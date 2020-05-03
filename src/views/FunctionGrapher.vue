<template>
  <div>
    <VRGrapher v-if="displayMode === 'VR'"></VRGrapher>
    <ARGrapher v-else></ARGrapher>
    <BottomNavigation></BottomNavigation>
  </div>
</template>

<script>
import { mapState } from "vuex";

import BottomNavigation from "../components/BottomNavigation.vue";
import VRGrapher from "../views/VRGrapher.vue";
import ARGrapher from "../views/ARGrapher.vue";

export default {
  data: () => ({}),
  computed: {
    ...mapState("scene3D", ["displayMode"])
  },
  components: {
    BottomNavigation,
    VRGrapher,
    ARGrapher
  }
};
</script>

<style></style>
