<template>
  <div>
    <Appbar></Appbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<style lang="scss"></style>

<script>
// @ is an alias to /src
import Appbar from "../components/Appbar.vue";

export default {
  name: "Home",
  components: { Appbar }
};
</script>
