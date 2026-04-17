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
