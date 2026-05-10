import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5097/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

function getTokenValue(data) {
  return data?.token ?? data?.accessToken ?? data?.access_token ?? null;
}

function getRefreshTokenValue(data) {
  return data?.refreshToken ?? data?.refresh_token ?? null;
}

function getStoredToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
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

function getStoredRefreshToken() {
  return sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken");
}

function usingPersistentStorage() {
  return localStorage.getItem("refreshToken") !== null || localStorage.getItem("token") !== null;
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
}

function persistAuth(data, rememberMe = true) {
  const token = getTokenValue(data);
  const refreshToken = getRefreshTokenValue(data);
  const targetStorage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;

  otherStorage.removeItem("token");
  otherStorage.removeItem("refreshToken");

  if (token) {
    targetStorage.setItem("token", token);
  }

  if (refreshToken) {
    targetStorage.setItem("refreshToken", refreshToken);
  }

  return token;
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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/Auth/refresh"
    ) {
      originalRequest._retry = true;

      const refreshToken = getStoredRefreshToken();

      if (refreshToken) {
        try {
          const res = await api.post("/Auth/refresh", { refreshToken });
          const newToken = persistAuth(res.data, usingPersistentStorage());

          if (newToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api.request(originalRequest);
          }
        } catch {
          clearStoredAuth();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function register(email, password, nombre, rememberMe = true) {
  const data = (
    await api.post("/Auth/register", {
      email,
      password,
      nombre,
    })
  ).data;

  persistAuth(data, rememberMe);

  return data;
}
export async function registerStaff(email, password, nombre, rol) {
  return (
    await api.post("/Auth/register-staff", {
      email,
      password,
      nombre,
      rol
    })
  ).data;
}

export async function login(email, password, rememberMe = true) {
  const data = (await api.post("/Auth/login", { email, password })).data;

  persistAuth(data, rememberMe);

  return data;
}

export async function resetPassword(email) {
  return (await api.post("/Auth/reset-password", { email })).data;
}

export async function updatePassword(newPassword) {
  return (await api.post("/Auth/update-password", { newPassword })).data;
}

export async function createEmotionalRecord({
  estadoAnimo,
  nivelEnergia,
  notaOpcional,
  fechaRegistro,
}) {
  return (
    await api.post(
      "/RegistrosEmocionales",
      {
        estadoAnimo,
        nivelEnergia,
        notaOpcional,
        fechaRegistro,
      },
      {
        timeout: 10000,
      }
    )
  ).data;
}

export async function submitQuestionnaire(payload) {
  return (
    await api.post("/Cuestionarios", payload, {
      timeout: 10000,
    })
  ).data;
}

export async function createTask({
  titulo,
  prioridad,
  nivel_esfuerzo,
  fecha_limite,
  descripcion,
  icono,
  recordatorio,
  estado = "En progreso",
}) {
  return (
    await api.post("/Tareas", {
      titulo,
      prioridad,
      nivelEsfuerzo: nivel_esfuerzo,
      estado,
      descripcion,
      fechaLimite: fecha_limite,
      ...(icono && { icono }),
      ...(recordatorio && { recordatorio }),
    })
  ).data;
}
export async function createPersonalizedPlan({
  horaDescanso,
  enfoqueDiario,
  pausasDiarias,
  idCuestionario,
}) {
  return (
    await api.post(
      "/PlanesPersonalizados",
      {
        horaDescanso,
        enfoqueDiario,
        pausasDiarias,
        idCuestionario,
      },
      {
        timeout: 10000,
      }
    )
  ).data;
}
export async function getTasks() {
  return (await api.get("/Tareas")).data;
}
export async function getTaskById(id) {
  return (await api.get(`/Tareas/${id}`)).data;
}
// Actualizar una tarea existente (PUT)
export async function updateTask(id, taskData) {
  return (await api.put(`/Tareas/${id}`, taskData)).data;
}

// Eliminar una tarea (DELETE)
export async function deleteTask(id) {
  return (await api.delete(`/Tareas/${id}`)).data;
}

export async function getUserPlans() {
  return (await api.get("/PlanesPersonalizados")).data;
}

export async function updatePlan(idPlan, planData) {
  return (await api.put(`/PlanesPersonalizados/${idPlan}`, planData)).data;
}


export async function getFocusSessions() {
  return (await api.get("/SesionesEnfoque")).data;
}

export async function createFocusSession({ duracionMinutos, tipo, fecha }) {
  return (
    await api.post(
      "/SesionesEnfoque",
      {
        duracionMinutos,
        tipo,
        fecha,
      },
      {
        timeout: 10000,
      }
    )
  ).data;
}
// --- ENDPOINTS DE TRANSACCIONES ---

// Obtener todas las transacciones (GET)
export async function getTransacciones() {
  return (await api.get("/Transacciones")).data;
}

// Obtener una transacción específica por su ID (GET por ID)
export async function getTransaccionById(id) {
  return (await api.get(`/Transacciones/${id}`)).data;
}

// Crear una nueva transacción (POST)
export async function createTransaccion(transaccionData) {
  return (await api.post("/Transacciones", transaccionData)).data;
}

export async function updateTransaccion(id, transaccionData) {
  return (await api.put(`/Transacciones/${id}`, transaccionData)).data;
}

export async function deleteTransaccion(id) {
  return (await api.delete(`/Transacciones/${id}`)).data;
}
// --- ENDPOINTS DE TICKETS (SOPORTE) ---

// Obtener mis tickets (Usuario común)
export async function getMyTickets() {
  return (await api.get("/Tickets/my-tickets")).data;
}

// Crear un nuevo ticket (PQR)
export async function createTicket({ asunto, descripcion, categoria, prioridad }) {
  return (await api.post("/Tickets", { asunto, descripcion, categoria, prioridad })).data;
}

// Obtener todos los tickets (Solo Admin/Support)
export async function getAllTickets() {
  return (await api.get("/Tickets/all")).data;
}

// Obtener la conversación de un ticket específico
export async function getTicketResponses(ticketId) {
  return (await api.get(`/Tickets/${ticketId}/responses`)).data;
}

// Enviar una respuesta en un ticket
export async function sendTicketResponse(ticketId, mensaje) {
  return (await api.post(`/Tickets/${ticketId}/responses`, { mensaje })).data;
}

// Actualizar estado de un ticket (Solo Staff)
export async function updateTicketStatus(ticketId, newStatus) {
  // Enviamos el string directamente en el body como espera el backend
  return (await api.put(`/Tickets/${ticketId}/status`, JSON.stringify(newStatus), {
    headers: { 'Content-Type': 'application/json' }
  })).data;
}

// Cancelar/Cerrar ticket (Usuario)
export async function cancelTicket(ticketId) {
  return (await api.delete(`/Tickets/${ticketId}`)).data;
}


// --- ENDPOINTS DE PERFIL USUARIO (EXTENDIDO) ---

// Ya tenías getProfile, pero aquí lo reforzamos si necesitas más datos
export async function getProfile() {
  return (await api.get("/PerfilUsuario")).data;
}

// Actualizar datos del perfil (nombre, edad, ocupación, etc.)
export async function updateProfile(perfilData) {
  return (await api.put("/PerfilUsuario", perfilData)).data;
}

// Eliminar cuenta (¡Cuidado con este!)
export async function deleteAccount() {
  return (await api.delete("/PerfilUsuario")).data;
}
