// src/router.ts

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("./App.vue"), // Remplacez par le composant de votre page d'accueil
  },
  {
    path: "/:word",
    name: "WordDetail",
    component: () => import("./components/Word.vue"), // Remplacez par le composant de détail du mot
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
