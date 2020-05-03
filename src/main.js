import Vue from "vue";
import vuetify from "@/plugins/vuetify";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

/* Vue.config.ignoredElements = [
  "a-scene",
  "a-entity",
  "a-camera",
  "a-box",
  "a-sky",
  "a-assets",
  "a-marker",
  "a-marker-camera"
]; */

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
