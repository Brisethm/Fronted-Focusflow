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
  { path: "/tickets", name: "Tickets", component: () => import("../views/TicketsView.vue"), meta: { requiereStaff: true } },
  { path: "/support-dashboard", name: "SupportDashboard", component: () => import("../views/SupportDashboardView.vue"), meta: { requiereSupport: true } },
  { path: "/support", name: "Support", component: () => import("../views/SupportView.vue") },
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
  if (!to.meta.requiereAdmin && !to.meta.requiereStaff && !to.meta.requiereSupport) {
    return next();
  }

  try {
    const profile = await getProfile();
    
    if (to.meta.requiereAdmin) {
      if (profile && profile.rol === 'admin') {
        return next(); 
      } else {
        console.warn("Acceso denegado: Se requiere ser Admin");
        return next("/dashboard"); 
      }
    }

    if (to.meta.requiereStaff) {
      if (profile && (profile.rol === 'admin' || profile.rol === 'support')) {
        return next(); 
      } else {
        console.warn("Acceso denegado: Se requiere ser Staff");
        return next("/dashboard"); 
      }
    }

    if (to.meta.requiereSupport) {
      if (profile && profile.rol === 'support') {
        return next(); 
      } else {
        console.warn("Acceso denegado: Se requiere ser support");
        return next("/dashboard"); 
      }
    }
  } catch (error) {
    console.error("Auth guard error:", error);
    next("/login");
  }
});

export default router;