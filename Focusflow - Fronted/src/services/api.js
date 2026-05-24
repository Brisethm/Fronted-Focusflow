import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://focusflow-backend-yr16.onrender.com";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

function getTokenValue(data) {
  return data?.token ?? data?.accessToken ?? data?.access_token ?? null;
}

function getRefreshTokenValue(data) {
  return data?.refreshToken ?? data?.refresh_token ?? null;
}

function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

function getStoredRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
}

function usingPersistentStorage() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) !== null || localStorage.getItem(TOKEN_KEY) !== null;
}

function clearStoredAuth() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  });
}

function persistAuth(data, rememberMe = true) {
  const token = getTokenValue(data);
  const refreshToken = getRefreshTokenValue(data);
  
  const targetStorage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(REFRESH_TOKEN_KEY);

  if (token) targetStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) targetStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  return token;
}

export function getAuthToken() {
  return getStoredToken();
}

export function getTicketHubUrl() {
  if (import.meta.env.VITE_TICKET_HUB_URL) {
    return import.meta.env.VITE_TICKET_HUB_URL;
  }
  return API_BASE_URL.replace(/\/api\/?$/i, "").replace(/\/$/, "") + "/ticketHub";
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const isRetryable = originalRequest && !originalRequest._retry;
    const isNotRefreshEndpoint =
      originalRequest?.url !== "/Auth/refresh";

    if (isUnauthorized && isRetryable && isNotRefreshEndpoint) {
      originalRequest._retry = true;

      const refreshToken = getStoredRefreshToken();

      if (refreshToken) {
        try {
          const res = await api.post("/Auth/refresh", { refreshToken });

          const newToken = persistAuth(
            res.data,
            usingPersistentStorage()
          );

          if (newToken) {
            originalRequest.headers ??= {};
            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;

            return api.request(originalRequest);
          }
        } catch {
          clearStoredAuth();
          globalThis.location.href = "/login";
        }
      }
    }

    throw error;
  }
);

export async function register(email, password, nombre, rememberMe = true) {
  const { data } = await api.post("api/Auth/register", { email, password, nombre });
  persistAuth(data, rememberMe);
  return data;
}

export async function registerStaff(email, password, nombre, rol) {
  const { data } = await api.post("api/Auth/register-staff", { email, password, nombre, rol });
  return data;
}

export async function login(email, password, rememberMe = true) {
  const { data } = await api.post("api/Auth/login", { email, password });
  persistAuth(data, rememberMe);
  return data;
}

export async function resetPassword(email) {
  const { data } = await api.post("api/Auth/reset-password", { email });
  return data;
}

export async function updatePassword(newPassword) {
  const { data } = await api.post("api/Auth/update-password", { newPassword });
  return data;
}

export async function createEmotionalRecord(payload) {
  const { data } = await api.post("api/RegistrosEmocionales", payload, { timeout: 10000 });
  return data;
}

export async function submitQuestionnaire(payload) {
  const { data } = await api.post("api/Cuestionarios", payload, { timeout: 10000 });
  return data;
}

export async function createPersonalizedPlan(payload) {
  const { data } = await api.post("api/PlanesPersonalizados", payload, { timeout: 10000 });
  return data;
}

export async function getUserPlans() {
  const { data } = await api.get("api/PlanesPersonalizados");
  return data;
}

export async function updatePlan(idPlan, planData) {
  const { data } = await api.put(`api/PlanesPersonalizados/${idPlan}`, planData);
  return data;
}

export async function createTask({ titulo, prioridad, nivel_esfuerzo, fecha_limite, descripcion, icono, recordatorio, estado = "En progreso" }) {
  const payload = {
    titulo, prioridad, nivelEsfuerzo: nivel_esfuerzo, estado, descripcion, fechaLimite: fecha_limite,
    ...(icono && { icono }),
    ...(recordatorio && { recordatorio }),
  };
  const { data } = await api.post("api/Tareas", payload);
  return data;
}

export async function getTasks() {
  const { data } = await api.get("api/Tareas");
  return data;
}

export async function getTaskById(id) {
  const { data } = await api.get(`api/Tareas/${id}`);
  return data;
}

export async function updateTask(id, taskData) {
  const { data } = await api.put(`api/Tareas/${id}`, taskData);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`api/Tareas/${id}`);
  return data;
}

export async function getFocusSessions() {
  const { data } = await api.get("api/SesionesEnfoque");
  return data;
}

export async function createFocusSession(payload) {
  const { data } = await api.post("api/SesionesEnfoque", payload, { timeout: 10000 });
  return data;
}

export async function getTransacciones() {
  const { data } = await api.get("api/Transacciones");
  return data;
}

export async function getTransaccionById(id) {
  const { data } = await api.get(`api/Transacciones/${id}`);
  return data;
}

export async function createTransaccion(transaccionData) {
  const { data } = await api.post("api/Transacciones", transaccionData);
  return data;
}

export async function updateTransaccion(id, transaccionData) {
  const { data } = await api.put(`api/Transacciones/${id}`, transaccionData);
  return data;
}

export async function deleteTransaccion(id) {
  const { data } = await api.delete(`api/Transacciones/${id}`);
  return data;
}

export async function getMyTickets() {
  const { data } = await api.get("api/Tickets/my-tickets");
  return data;
}

export async function createTicket(payload) {
  const { data } = await api.post("api/Tickets", payload);
  return data;
}

export async function getAllTickets() {
  const { data } = await api.get("api/Tickets/all");
  return data;
}

export async function getTicketResponses(ticketId) {
  const { data } = await api.get(`api/Tickets/${ticketId}/responses`);
  return data;
}

export async function sendTicketResponse(ticketId, mensaje) {
  const { data } = await api.post(`api/Tickets/${ticketId}/responses`, { mensaje });
  return data;
}

export async function updateTicketStatus(ticketId, newStatus) {
  const { data } = await api.put(`api/Tickets/${ticketId}/status`, JSON.stringify(newStatus), {
    headers: { 'Content-Type': 'application/json' }
  });
  return data;
}

export async function cancelTicket(ticketId) {
  const { data } = await api.delete(`api/Tickets/${ticketId}`);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("api/PerfilUsuario");
  return data;
}

export async function updateProfile(perfilData) {
  const { data } = await api.put("api/PerfilUsuario", perfilData);
  return data;
}

export async function deleteAccount() {
  const { data } = await api.delete("api/PerfilUsuario");
  return data;
}

export async function getRecordatorios() {
  const { data } = await api.get("api/Recordatorios");
  return data;
}

export async function getRecordatorioById(id) {
  const { data } = await api.get(`api/Recordatorios/${id}`);
  return data;
}

export async function createRecordatorio({ mensaje, fechaHora, fecha_hora, tipo, activo = true }) {
  const { data } = await api.post("api/Recordatorios", {
    mensaje, fechaHora: fechaHora ?? fecha_hora, tipo, activo
  });
  return data;
}

export async function updateRecordatorio(id, recordatorioData) {
  const { fecha_hora, ...dataToUpdate } = recordatorioData;
  const payload = {
    ...dataToUpdate,
    ...(dataToUpdate.fechaHora || fecha_hora ? { fechaHora: dataToUpdate.fechaHora ?? fecha_hora } : {})
  };
  const { data } = await api.put(`api/Recordatorios/${id}`, payload);
  return data;
}

export async function deleteRecordatorio(id) {
  const { data } = await api.delete(`api/Recordatorios/${id}`);
  return data;
}