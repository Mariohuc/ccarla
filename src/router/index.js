import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import FunctionGrapher from "../views/FunctionGrapher.vue";
/* import VRGrapher from "../views/VRGrapher.vue";
import ARGrapher from "../views/ARGrapher.vue"; */
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/About.vue")
      }
    ]
  },

  {
    path: "/functiongrapher",
    component: FunctionGrapher
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
