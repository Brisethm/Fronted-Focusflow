import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import LandingView from "../views/LandingView.vue";

const routes = [
  { path: "/", name: "Landing", component: LandingView },

  { path: "/login", name: "Login", component: LoginView },
  { path: "/register", name: "Register", component: RegisterView },

  {
    path: "/terms-and-conditions",
    name: "Terms",
    component: () => import("../views/TermsView.vue"),
  },
  {
    path: "/data-policy",
    name: "DataPolicy",
    component: () => import("../views/DataPolicyView.vue"),
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: () => import("../views/WelcomeView.vue"),
  },

  // (opcional) fallback por si escriben mal la URL
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
