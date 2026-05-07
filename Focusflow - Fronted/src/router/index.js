import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import LandingView from "../views/LandingView.vue";
import CreateTask from '../views/CreateTaskView.vue';
import { getProfile } from '../services/api.js';

const routes = [
  { path: "/", name: "Landing", component: LandingView },
  { path: "/register", name: "Register", component: RegisterView },
  { path: '/admin-panel', name: 'AdminPanel', component: () => import('../views/AdminPanelView.vue'), meta: { requiereAdmin: true }},
  { path: "/login", name: "Login", component: LoginView },
  { path: "/register-staff", name: "RegisterStaff", component: () => import("../views/RegisterStaffView.vue"), meta: { requiereAdmin: true }},
  { path: "/profile", name: "Profile", component: () => import("../views/ProfileView.vue") },
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
  { path: "/transactions", name: "Transactions", component: () => import("../views/TransactionsView.vue") },
  { path: "/create-task", name: "CreateTask", component: CreateTask },
  { path: "/ajustar-plan", name: "AjustarPlan", component: () => import("../views/AdjustPlanView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach(async (to, from, next) => {
  // Si la ruta no requiere auth, deja pasar
  if (!to.meta.requiereAdmin) {
    return next();
  }

  try {
    const profile = await getProfile();
    
    if (profile && profile.rol === 'admin') {
      next(); // Es admin, entra
    } else {
      console.warn("Access denied: Not an admin");
      next("/dashboard"); // No es admin, mándalo a la vista normal
    }
  } catch (error) {
    console.error("Auth guard error:", error);
    next("/login"); // Falló la sesión, afuera
  }
});
export default router;
