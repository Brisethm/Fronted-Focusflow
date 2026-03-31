import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/terms-and-conditions", name: "Terms", component: () => import("../views/TermsView.vue") },
  { path: "/data-policy", name: "DataPolicy", component: () => import("../views/DataPolicyView.vue") },
  { path: "/welcome", name: "Welcome", component: () => import("../views/WelcomeView.vue") },
  { path: "/", redirect: "/login" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
