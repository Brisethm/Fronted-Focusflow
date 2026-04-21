import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5097/api",
});

// Interceptor para incluir el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de servicio
export async function register(email, password, nombre) {
  return (
    await api.post("/Auth/register", {
      email: email,
      password: password,
      nombre: nombre,
    })
  ).data;
}

export async function login(email, password) {
  const data = (await api.post("/Auth/login", { email, password })).data;
  localStorage.setItem("token", data.token);
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
    await api.post("/RegistrosEmocionales", {
      estadoAnimo,
      nivelEnergia,
      notaOpcional,
      fechaRegistro,
    }, {
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