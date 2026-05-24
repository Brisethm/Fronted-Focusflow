import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://focusflow-backend-yr16.onrender.com";

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
    await api.post("api/Auth/register", {
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
    await api.post("api/Auth/register-staff", {
      email,
      password,
      nombre,
      rol
    })
  ).data;
}

export async function login(email, password, rememberMe = true) {
  const data = (await api.post("api/Auth/login", { email, password })).data;

  persistAuth(data, rememberMe);

  return data;
}

export async function resetPassword(email) {
  return (await api.post("api/Auth/reset-password", { email })).data;
}

export async function updatePassword(newPassword) {
  return (await api.post("api/Auth/update-password", { newPassword })).data;
}

export async function createEmotionalRecord({
  estadoAnimo,
  nivelEnergia,
  notaOpcional,
  fechaRegistro,
}) {
  return (
    await api.post(
      "api/RegistrosEmocionales",
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
    await api.post("api/Cuestionarios", payload, {
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
    await api.post("api/Tareas", {
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
      "api/PlanesPersonalizados",
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
  return (await api.get("api/Tareas")).data;
}
export async function getTaskById(id) {
  return (await api.get(`api/Tareas/${id}`)).data;
}
// Actualizar una tarea existente (PUT)
export async function updateTask(id, taskData) {
  return (await api.put(`api/Tareas/${id}`, taskData)).data;
}

// Eliminar una tarea (DELETE)
export async function deleteTask(id) {
  return (await api.delete(`api/Tareas/${id}`)).data;
}

export async function getUserPlans() {
  return (await api.get("api/PlanesPersonalizados")).data;
}

export async function updatePlan(idPlan, planData) {
  return (await api.put(`api/PlanesPersonalizados/${idPlan}`, planData)).data;
}


export async function getFocusSessions() {
  return (await api.get("api/SesionesEnfoque")).data;
}

export async function createFocusSession({ duracionMinutos, tipo, fecha }) {
  return (
    await api.post(
      "api/SesionesEnfoque",
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
  return (await api.get("api/Transacciones")).data;
}

// Obtener una transacción específica por su ID (GET por ID)
export async function getTransaccionById(id) {
  return (await api.get(`api/Transacciones/${id}`)).data;
}

// Crear una nueva transacción (POST)
export async function createTransaccion(transaccionData) {
  return (await api.post("api/Transacciones", transaccionData)).data;
}

export async function updateTransaccion(id, transaccionData) {
  return (await api.put(`api/Transacciones/${id}`, transaccionData)).data;
}

export async function deleteTransaccion(id) {
  return (await api.delete(`api/Transacciones/${id}`)).data;
}
// --- ENDPOINTS DE TICKETS (SOPORTE) ---

// Obtener mis tickets (Usuario común)
export async function getMyTickets() {
  return (await api.get("api/Tickets/my-tickets")).data;
}

// Crear un nuevo ticket (PQR)
export async function createTicket({ asunto, descripcion, categoria, prioridad }) {
  return (await api.post("api/Tickets", { asunto, descripcion, categoria, prioridad })).data;
}

// Obtener todos los tickets (Solo Admin/Support)
export async function getAllTickets() {
  return (await api.get("api/Tickets/all")).data;
}

// Obtener la conversación de un ticket específico
export async function getTicketResponses(ticketId) {
  return (await api.get(`api/Tickets/${ticketId}/responses`)).data;
}

// Enviar una respuesta en un ticket
export async function sendTicketResponse(ticketId, mensaje) {
  return (await api.post(`api/Tickets/${ticketId}/responses`, { mensaje })).data;
}

// Actualizar estado de un ticket (Solo Staff)
export async function updateTicketStatus(ticketId, newStatus) {
  // Enviamos el string directamente en el body como espera el backend
  return (await api.put(`api/Tickets/${ticketId}/status`, JSON.stringify(newStatus), {
    headers: { 'Content-Type': 'application/json' }
  })).data;
}

// Cancelar/Cerrar ticket (Usuario)
export async function cancelTicket(ticketId) {
  return (await api.delete(`api/Tickets/${ticketId}`)).data;
}


// --- ENDPOINTS DE PERFIL USUARIO (EXTENDIDO) ---

// Ya tenías getProfile, pero aquí lo reforzamos si necesitas más datos
export async function getProfile() {
  return (await api.get("api/PerfilUsuario")).data;
}

// Actualizar datos del perfil (nombre, edad, ocupación, etc.)
export async function updateProfile(perfilData) {
  return (await api.put("api/PerfilUsuario", perfilData)).data;
}

// Eliminar cuenta (¡Cuidado con este!)
export async function deleteAccount() {
  return (await api.delete("api/PerfilUsuario")).data;
}

// Obtener todos mis recordatorios activos/inactivos
export async function getRecordatorios() {
  return (await api.get("api/Recordatorios")).data;
}

// Obtener un recordatorio específico
export async function getRecordatorioById(id) {
  return (await api.get(`api/Recordatorios/${id}`)).data;
}

// Crear un nuevo recordatorio (Tarea o Plan de Sueño)
export async function createRecordatorio({ mensaje, fechaHora, fecha_hora, tipo, activo = true }) {
  return (
    await api.post("api/Recordatorios", {
      mensaje,
      fechaHora: fechaHora ?? fecha_hora,
      tipo,
      activo
    })
  ).data;
}

// Actualizar un recordatorio (Ej: marcar como activo = false tras sonar)
export async function updateRecordatorio(id, recordatorioData) {
  const { fecha_hora, ...data } = recordatorioData;

  return (await api.put(`api/Recordatorios/${id}`, {
    ...data,
    ...(data.fechaHora || fecha_hora ? { fechaHora: data.fechaHora ?? fecha_hora } : {})
  })).data;
}

// Eliminar un recordatorio
export async function deleteRecordatorio(id) {
  return (await api.delete(`api/Recordatorios/${id}`)).data;
}
