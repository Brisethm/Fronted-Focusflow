import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5097/api",
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
          globalThis.location.href = "/login";
        }
      }
    }

    throw error;
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

export async function getProfile() {
  return (await api.get("/Auth/profile")).data;
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
      fechaLimite: fecha_limite,
      ...(descripcion && { descripcion }),
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

// ========== Planes Personalizados ==========
export async function getUserPlans() {
  return (await api.get("/PlanesPersonalizados")).data;
}

export async function updatePlan(idPlan, planData) {
  return (await api.put(`/PlanesPersonalizados/${idPlan}`, planData)).data;
}

// ========== Gestión de Tareas Local ==========
const TASKS_STORAGE_KEY = "focusflow_tasks";

export function getStoredTasks() {
  try {
    const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error al obtener tareas del almacenamiento local:", error);
    return [];
  }
}

export function saveTaskToStorage(task) {
  try {
    const tasks = getStoredTasks();
    const newTask = {
      id: Date.now(), // ID único basado en timestamp
      icon: task.icono || "📝",
      title: task.titulo,
      time: task.recordatorio ? new Date(task.recordatorio).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "Sin hora",
      priority: task.prioridad,
      effort: task.nivel_esfuerzo,
      status: "todo",
      selected: false,
      fechaLimite: task.fecha_limite,
      descripcion: task.descripcion,
      recordatorio: task.recordatorio,
    };
    tasks.push(newTask);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error("Error al guardar tarea en almacenamiento local:", error);
    return null;
  }
}

export function updateTaskInStorage(taskId, updatedTask) {
  try {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return null;
    }

    const currentTask = tasks[taskIndex];
    const newTask = {
      ...currentTask,
      icon: updatedTask.icono || currentTask.icon,
      title: updatedTask.titulo || currentTask.title,
      time: updatedTask.recordatorio
        ? new Date(updatedTask.recordatorio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : currentTask.time,
      priority: updatedTask.prioridad || currentTask.priority,
      effort: updatedTask.nivel_esfuerzo || currentTask.effort,
      fechaLimite: updatedTask.fecha_limite || currentTask.fechaLimite,
      descripcion: updatedTask.descripcion || currentTask.descripcion,
      recordatorio: updatedTask.recordatorio || currentTask.recordatorio,
    };

    tasks[taskIndex] = newTask;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error('Error al actualizar tarea en almacenamiento local:', error);
    return null;
  }
}

export function updateTaskStatus(taskId, newStatus) {
  try {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = newStatus;
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al actualizar estado de tarea:", error);
    return false;
  }
}

export function updateStoredTask(taskId, updatedData) {
  try {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];
    const mergedTask = {
      ...task,
      ...updatedData,
      icon: updatedData.icono || task.icon,
      title: updatedData.titulo || task.title,
      time: updatedData.recordatorio
        ? new Date(updatedData.recordatorio).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        : task.time,
      fechaLimite: updatedData.fecha_limite ?? task.fechaLimite,
      descripcion: updatedData.descripcion ?? task.descripcion,
      recordatorio: updatedData.recordatorio ?? task.recordatorio,
      priority: updatedData.prioridad ?? task.priority,
      effort: updatedData.nivel_esfuerzo ?? task.effort,
    };

    tasks[taskIndex] = mergedTask;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Error al actualizar tarea en almacenamiento local:", error);
    return false;
  }
}

export function getStoredTaskById(taskId) {
  try {
    const tasks = getStoredTasks();
    return tasks.find((task) => task.id === Number(taskId)) || null;
  } catch (error) {
    console.error("Error al obtener tarea por id:", error);
    return null;
  }
}

export function deleteStoredTask(taskId) {
  try {
    const tasks = getStoredTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
    return true;
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return false;
  }
}