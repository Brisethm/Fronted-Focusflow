import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  request: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
    },
    response: {
      use: vi.fn(),
    },
  },
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockApi),
  },
}));

import {
  login,
  register,
  getAuthToken,
  getTasks,
  createTask,
  updateTask,
  submitQuestionnaire,
  createEmotionalRecord,
  updatePassword,
  resetPassword,
  updateProfile,
  deleteAccount,
  registerStaff,
  deleteTask,
  createRecordatorio,
  getRecordatorioById,
  deleteRecordatorio,
  getRecordatorios,
  getUserPlans,
  createPersonalizedPlan,
  updatePlan,
  getAllTickets,
  getTicketResponses,
  sendTicketResponse,
  updateTicketStatus,
  getTransacciones,
  deleteTransaccion,
  createTransaccion,
  getTicketHubUrl,
  getTransaccionById,
  updateTransaccion,
} from "../../services/api";

const requestInterceptor = mockApi.interceptors.request.use.mock.calls[0]?.[0];
const responseErrorHandler =
  mockApi.interceptors.response.use.mock.calls[0]?.[1];

describe("API Service", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.resetAllMocks();

    const locationMock = { href: "" };
    vi.stubGlobal("location", locationMock);
  });

  it("guarda token en localStorage con rememberMe=true", async () => {
    const mockData = {
      token: "fake-token",
      refreshToken: "fake-refresh-token",
    };

    mockApi.post.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await login("test@test.com", "password", true);

    expect(mockApi.post).toHaveBeenCalled();

    expect(result).toEqual(mockData);

    expect(localStorage.getItem("token")).toBe("fake-token");

    expect(localStorage.getItem("refreshToken")).toBe("fake-refresh-token");
  });

  it("register llama al endpoint correcto y persiste auth", async () => {
    const mockData = { token: "reg-token" };
    mockApi.post.mockResolvedValueOnce({ data: mockData });

    const result = await register(
      "new@test.com",
      "password123",
      "Test User",
      true,
    );

    expect(mockApi.post).toHaveBeenCalledWith("api/Auth/register", {
      email: "new@test.com",
      password: "password123",
      nombre: "Test User",
    });
    expect(result).toEqual(mockData);
    expect(localStorage.getItem("token")).toBe("reg-token");
  });

  it("guarda token en sessionStorage con rememberMe=false", async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        token: "session-token",
      },
    });

    await login("test@test.com", "password", false);

    expect(sessionStorage.getItem("token")).toBe("session-token");
  });

  it("obtiene token almacenado", () => {
    localStorage.setItem("token", "stored-token");

    expect(getAuthToken()).toBe("stored-token");
  });

  it("getTasks obtiene tareas", async () => {
    const mockTasks = [
      {
        id: 1,
        titulo: "Tarea 1",
      },
    ];

    mockApi.get.mockResolvedValueOnce({
      data: mockTasks,
    });

    const result = await getTasks();

    expect(mockApi.get).toHaveBeenCalled();

    expect(result).toEqual(mockTasks);
  });

  it("deleteTask elimina una tarea por ID", async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });

    const result = await deleteTask(123);

    expect(mockApi.delete).toHaveBeenCalledWith("api/Tareas/123");
    expect(result.success).toBe(true);
  });

  it("registra interceptor request", () => {
    expect(requestInterceptor).toBeTypeOf("function");
  });

  it("adjunta Authorization cuando existe token", () => {
    localStorage.setItem("token", "my-auth-token");

    expect(requestInterceptor).toBeDefined();

    const config = {
      headers: {},
    };

    const result = requestInterceptor(config);

    expect(result.headers.Authorization).toBe("Bearer my-auth-token");
  });

  it("createRecordatorio mapea fecha_hora a fechaHora correctamente", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createRecordatorio({
      mensaje: "Test",
      fecha_hora: "2023-10-10T10:00:00",
      tipo: "Notificación",
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      "api/Recordatorios",
      expect.objectContaining({
        fechaHora: "2023-10-10T10:00:00",
      }),
    );
  });

  describe("Interceptor de Respuesta (401 Refresh)", () => {
    it("intenta refrescar el token ante un error 401", async () => {
      localStorage.setItem("refreshToken", "old-refresh");

      const mockError = {
        config: { url: "/api/Tareas", headers: {} },
        response: { status: 401 },
      };

      mockApi.post.mockResolvedValueOnce({
        data: { token: "new-token", refreshToken: "new-refresh" },
      });

      mockApi.request.mockResolvedValueOnce({ data: "success" });

      await responseErrorHandler(mockError);

      expect(mockApi.post).toHaveBeenCalledWith("/Auth/refresh", {
        refreshToken: "old-refresh",
      });
      expect(localStorage.getItem("token")).toBe("new-token");
    });

    it("limpia auth y redirige si el refresh falla", async () => {
      localStorage.setItem("token", "bad-token");
      localStorage.setItem("refreshToken", "bad-refresh");

      const mockError = {
        config: { url: "/api/Tareas", headers: {} },
        response: { status: 401 },
      };

      mockApi.post.mockRejectedValueOnce(new Error("Refresh failed"));

      await expect(responseErrorHandler(mockError)).rejects.toThrow();

      expect(localStorage.getItem("token")).toBeNull();
      expect(globalThis.location.href).toBe("/login");
    });
  });

  it("createTask mapea snake_case a camelCase para el backend", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { id: 1 } });

    await createTask({
      titulo: "Nueva Tarea",
      prioridad: "Alta",
      nivel_esfuerzo: "Medio",
      fecha_limite: "2023-12-31",
    });

    expect(mockApi.post).toHaveBeenCalledWith(
      "api/Tareas",
      expect.objectContaining({
        nivelEsfuerzo: "Medio",
        fechaLimite: "2023-12-31",
      }),
    );
  });

  it("resetPassword llama al endpoint de recuperación", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { message: "Email sent" } });
    const result = await resetPassword("user@test.com");
    expect(mockApi.post).toHaveBeenCalledWith("api/Auth/reset-password", {
      email: "user@test.com",
    });
    expect(result.message).toBe("Email sent");
  });

  it("updateProfile envía datos del perfil vía PUT", async () => {
    const profileData = { nombre: "Nuevo Nombre", bio: "Hola" };
    mockApi.put.mockResolvedValueOnce({ data: profileData });
    const result = await updateProfile(profileData);
    expect(mockApi.put).toHaveBeenCalledWith("api/PerfilUsuario", profileData);
    expect(result).toEqual(profileData);
  });

  it("getUserPlans obtiene los planes del usuario", async () => {
    const mockPlans = [{ idPlan: 1 }];
    mockApi.get.mockResolvedValueOnce({ data: mockPlans });
    const result = await getUserPlans();
    expect(mockApi.get).toHaveBeenCalledWith("api/PlanesPersonalizados");
    expect(result).toEqual(mockPlans);
  });

  it("updateTask envía actualización vía PUT", async () => {
    const updateData = { idTarea: 1, titulo: "Updated" };
    mockApi.put.mockResolvedValueOnce({ data: updateData });
    const result = await updateTask(1, updateData);
    expect(mockApi.put).toHaveBeenCalledWith("api/Tareas/1", updateData);
    expect(result).toEqual(updateData);
  });

  it("getRecordatorios recupera la lista completa", async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] });
    await getRecordatorios();
    expect(mockApi.get).toHaveBeenCalledWith("api/Recordatorios");
  });

  it("createPersonalizedPlan crea un nuevo plan", async () => {
    const plan = { idCuestionario: 1, pausasDiarias: 3 };
    mockApi.post.mockResolvedValueOnce({ data: plan });
    const result = await createPersonalizedPlan(plan);
    expect(mockApi.post).toHaveBeenCalledWith(
      "api/PlanesPersonalizados",
      plan,
      { timeout: 10000 },
    );
    expect(result).toEqual(plan);
  });

  it("updatePlan modifica un plan existente", async () => {
    const plan = { idPlan: 1, pausasDiarias: 5 };
    mockApi.put.mockResolvedValueOnce({ data: plan });
    const result = await updatePlan(1, plan);
    expect(mockApi.put).toHaveBeenCalledWith(
      "api/PlanesPersonalizados/1",
      plan,
    );
    expect(result).toEqual(plan);
  });

  it('submitQuestionnaire envía datos del cuestionario', async () => {
    const mockRes = { idCuestionario: 1 }
    mockApi.post.mockResolvedValueOnce({ data: mockRes })
    
    const result = await submitQuestionnaire({ perfil: 'equilibrado', completado: true })
    
    expect(mockApi.post).toHaveBeenCalledWith('api/Cuestionarios', expect.objectContaining({
      perfil: 'equilibrado'
    }), { timeout: 10000 })
    expect(result).toEqual(mockRes)
  })

  it('createEmotionalRecord envía registro de ánimo y energía', async () => {
    const record = { estadoAnimo: 'feliz', nivelEnergia: 5 }
    mockApi.post.mockResolvedValueOnce({ data: { success: true } })
    
    await createEmotionalRecord(record)
    
    expect(mockApi.post).toHaveBeenCalledWith('api/RegistrosEmocionales', record, { timeout: 10000 })
  })

  it('updatePassword envía nueva contraseña vía POST', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } })
    
    await updatePassword('newPassword123')
    
    expect(mockApi.post).toHaveBeenCalledWith('api/Auth/update-password', { newPassword: 'newPassword123' })
  })

  it('getAllTickets recupera todos los tickets para el staff', async () => {
    const mockTickets = [{ idTicket: 1 }]
    mockApi.get.mockResolvedValueOnce({ data: mockTickets })
    const result = await getAllTickets()
    expect(mockApi.get).toHaveBeenCalledWith('api/Tickets/all')
    expect(result).toEqual(mockTickets)
  })

  it('getTransacciones obtiene la lista de movimientos', async () => {
    const mockT = [{ idTransaccion: 1, monto: 100 }];
    mockApi.get.mockResolvedValueOnce({ data: mockT });
    const result = await getTransacciones();
    expect(mockApi.get).toHaveBeenCalledWith('api/Transacciones');
    expect(result).toEqual(mockT);
  });

  it('deleteTransaccion elimina por ID', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });
    await deleteTransaccion(55);
    expect(mockApi.delete).toHaveBeenCalledWith('api/Transacciones/55');
  });

  it('createTransaccion envía datos de nuevo movimiento', async () => {
    const t = { monto: 50, tipo: 'Gasto' };
    mockApi.post.mockResolvedValueOnce({ data: t });
    const result = await createTransaccion(t);
    expect(mockApi.post).toHaveBeenCalledWith('api/Transacciones', t);
    expect(result).toEqual(t);
  });

  it('getTransaccionById obtiene detalle de una transacción', async () => {
    const mockT = { idTransaccion: 1, monto: 100 };
    mockApi.get.mockResolvedValueOnce({ data: mockT });
    const result = await getTransaccionById(1);
    expect(mockApi.get).toHaveBeenCalledWith('api/Transacciones/1');
    expect(result).toEqual(mockT);
  });

  it('updateTransaccion actualiza datos vía PUT', async () => {
    const t = { monto: 120 };
    mockApi.put.mockResolvedValueOnce({ data: t });
    const result = await updateTransaccion(1, t);
    expect(mockApi.put).toHaveBeenCalledWith('api/Transacciones/1', t);
    expect(result).toEqual(t);
  });

  it('getTicketResponses obtiene mensajes de un ticket', async () => {
    const mockR = [{ idRespuesta: 1 }];
    mockApi.get.mockResolvedValueOnce({ data: mockR });
    const result = await getTicketResponses(123);
    expect(mockApi.get).toHaveBeenCalledWith('api/Tickets/123/responses');
    expect(result).toEqual(mockR);
  });

  it('sendTicketResponse envía mensaje de soporte', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { id: 1 } });
    await sendTicketResponse(123, 'test message');
    expect(mockApi.post).toHaveBeenCalledWith('api/Tickets/123/responses', { mensaje: 'test message' });
  });

  it('updateTicketStatus actualiza el estado', async () => {
    mockApi.put.mockResolvedValueOnce({ data: { success: true } });
    await updateTicketStatus(123, 'closed');
    expect(mockApi.put).toHaveBeenCalledWith('api/Tickets/123/status', JSON.stringify('closed'), {
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('getTicketHubUrl construye la URL del hub correctamente basado en la base', () => {
    const url = getTicketHubUrl();
    // API_BASE_URL: https://focusflow-backend-yr16.onrender.com
    expect(url).toBe('https://focusflow-backend-yr16.onrender.com/ticketHub');
  });

  it('registerStaff envía el rol correctamente', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });
    await registerStaff('staff@test.com', 'pass', 'Staff User', 'admin');
    expect(mockApi.post).toHaveBeenCalledWith("api/Auth/register-staff", {
      email: 'staff@test.com',
      password: 'pass',
      nombre: 'Staff User',
      rol: 'admin'
    });
  });

  it('deleteAccount elimina la cuenta del usuario', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });
    await deleteAccount();
    expect(mockApi.delete).toHaveBeenCalledWith("api/PerfilUsuario");
  });

  it('getRecordatorioById obtiene un recurso específico', async () => {
    const mockRec = { id: 5, mensaje: 'Recordatorio' };
    mockApi.get.mockResolvedValueOnce({ data: mockRec });
    const result = await getRecordatorioById(5);
    expect(mockApi.get).toHaveBeenCalledWith("api/Recordatorios/5");
    expect(result).toEqual(mockRec);
  });

  it('deleteRecordatorio envía la petición DELETE correcta', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { ok: true } });
    await deleteRecordatorio(10);
    expect(mockApi.delete).toHaveBeenCalledWith("api/Recordatorios/10");
  });
});
