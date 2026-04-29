import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import LandingView from "../views/LandingView.vue";
import CreateTask from '../views/CreateTaskView.vue';

const routes = [
  { path: "/", name: "Landing", component: LandingView },
  { path: "/register", name: "Register", component: RegisterView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/terms-and-conditions", name: "Terms", component: () => import("../views/TermsView.vue") },
  { path: "/data-policy", name: "DataPolicy", component: () => import("../views/DataPolicyView.vue") },
  { path: "/welcome", name: "Welcome", component: () => import("../views/WelcomeView.vue") },
  { path: "/onboarding-questionnaire", name: "OnboardingQuestionnaire", component: () => import("../views/OnboardingQuestionnaireView.vue") },
  { path: "/generated-plan", name: "GeneratedPlan", component: () => import("../views/GeneratedPlanView.vue") },
  { path: "/forgot-password", name: "ForgotPassword", component: () => import("../views/ForgotPasswordView.vue") },
  { path: "/update-password", name: "UpdatePassword", component: () => import("../views/UpdatePasswordView.vue") },
  { path: "/dashboard", name: "Dashboard", component: () => import("../views/DashboardView.vue") },
  { path: "/tasks", name: "Tasks", component: () => import("../views/TasksView.vue") },
  { path: "/focus", name: "Focus", component: () => import("../views/FocusView.vue") },
  { path: "/create-task", name: "CreateTask", component: CreateTask },
  { path: "/ajustar-plan", name: "AjustarPlan", component: () => import("../views/AdjustPlanView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
