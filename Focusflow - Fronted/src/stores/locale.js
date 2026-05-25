import { computed, ref } from "vue";

const STORAGE_KEY = "focusflow-locale";

const savedLocale =
  globalThis.window === undefined ? null : localStorage.getItem(STORAGE_KEY);
const initialLocale =
  savedLocale === "es" || savedLocale === "en" ? savedLocale : "es";
export const locale = ref(initialLocale);

const translations = {
  es: {
    languageName: "Español",
    common: {
      email: "Correo Electrónico",
      password: "Contraseña",
      name: "Nombre",
      rememberMe: "Recuérdame",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      cancel: "Cancelar",
      save: "Guardar",
      continue: "Continuar",
      back: "Volver",
      home: "Inicio",
      profile: "Perfil",
      staff: "Staff",
      yes: "Sí",
      no: "No",
      search: "Buscar",
      viewProfile: "Ver Perfil",
    },
    buttons: {
      submit: "Enviar",
      register: "Registrarse",
      login: "Iniciar Sesión",
      createStaff: "Crear Cuenta de Staff",
      registering: "Registrando...",
      loading: "Cargando...",
      saveChanges: "Guardar Cambios",
      changePassword: "Cambiar contraseña",
      updatePassword: "Actualizar contraseña",
      createAccount: "Crear cuenta",
      accept: "Aceptar",
      send: "Enviar",
    },
    validation: {
      required: "Este campo es obligatorio",
      invalidEmail: "Correo no válido",
      invalidEmailExample: "Ejemplo válido: usuario@correo.com",
      passwordRequired: "La contraseña es obligatoria",
      passwordLength: "Debe tener al menos 8 caracteres",
      passwordRules:
        "Debe tener 8-20 caracteres, mayúscula, minúscula y un número",
      passwordsMismatch: "Las contraseñas no coinciden",
      termsRequired:
        "Debes aceptar los Términos y Condiciones y la Política de Datos",
    },
    login: {
      greeting: "¡Hola de nuevo!",
      subtitle:
        "Inicia sesión para continuar tu viaje hacia el bienestar y la productividad.",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordPlaceholder: "Ingresa tu contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes cuenta?",
      signUp: "Regístrate",
    },
    register: {
      title: "Crea tu cuenta",
      subtitle:
        "Únete a FocusFlow y empieza a transformar tu productividad y bienestar.",
      namePlaceholder: "Ingresa tu nombre",
      emailPlaceholder: "Ingresa tu correo electrónico",
      passwordPlaceholder: "Crea una contraseña segura",
      passwordRules: {
        minChars: "Mínimo 8 caracteres",
        uppercase: "Una mayúscula",
        lowercase: "Una minúscula",
        number: "Un número",
      },
      termsText:
        "Acepto los Términos y Condiciones, la Política de Datos y autorizo el uso de mis datos sensibles para las finalidades de la App.",
      success: "Registro exitoso",
      alreadyAccount: "¿Ya tienes cuenta?",
      login: "Inicia sesión",
    },
    forgotPassword: {
      title: "Restablece tu contraseña",
      subtitle:
        "Ingresa tu correo electrónico y si el correo existe, recibirás un enlace para crear una nueva contraseña.",
      emailPlaceholder: "Ingresa tu correo electrónico",
    },
    updatePassword: {
      title: "Crea una nueva contraseña",
      subtitle: "Elige una contraseña segura y única, distinta de la anterior.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmación de contraseña",
      submit: "Cambiar contraseña",
      success: "Contraseña actualizada correctamente",
      error: "No se pudo actualizar la contraseña",
    },
    welcome: {
      title: "Bienvenido a FocusFlow",
      subtitle:
        "Tu cuenta está lista. Ahora puedes empezar a administrar tareas, bienestar y objetivos.",
      continueButton: "Ir al panel",
    },
    profile: {
      title: "Mi Cuenta",
      personalSettings: "Configuración Personal",
      editInfo: "Editar Información",
      editInfoDescription: "Actualiza tus datos personales",
      changePassword: "Cambiar Contraseña",
      changePasswordDescription: "Mantén tu cuenta segura",
      helpCenter: "Centro de Ayuda",
      support: "Soporte Técnico y PQRs",
      supportDescription: "Reporta un problema o revisa tus tickets",
      staffTools: "Herramientas de Staff",
      adminPanel: "Panel de Administración",
      adminPanelDescription: "Gestión total de FocusFlow",
      logout: "Cerrar Sesión",
    },
    adminPanel: {
      title: "Panel de Administración",
      manageTasks:
        "Gestiona tus propias tareas, pomodoros y registros de energía.",
      attendPqrs: "Atender PQRs",
      createAccounts:
        "Crea nuevas cuentas para el equipo de soporte o administración.",
    },
    support: {
      title: "Soporte y PQRs",
      description:
        "Administra y da seguimiento a todos los tickets del sistema de forma rápida y ordenada.",
      category: "Categoría",
      priority: "Prioridad",
      detailedDescription: "Descripción Detallada",
      submit: "Enviar solicitud",
      cancel: "Cancelar",
    },
    supportDashboard: {
      title: "Soporte",
      manageTasks:
        "Gestiona tus propias tareas, pomodoros y registros de energía.",
      attendPqrs: "Atender PQRs",
    },
    tickets: {
      title: "Gestión de Tickets",
      loadingReports: "Cargando reportes...",
      noTickets: "No hay tickets",
      noTicketsPriority: "No hay tickets generados aún con esta prioridad.",
      noPending: "No hay tickets pendientes de soporte en este momento.",
    },
    createTask: {
      back: "Volver a tareas",
      taskName: "Nombre de la tarea",
      deadline: "Fecha límite",
      description: "Descripción",
      priority: "Prioridad",
      namePlaceholder: "Ej. Preparar la presentación",
    },
    registerStaff: {
      title: "Registrar Staff",
      subtitle: "Crea una cuenta para soporte o administración.",
      fullName: "Nombre Completo",
      email: "Correo Electrónico",
      tempPassword: "Contraseña Temporal",
      selectRole: "Selecciona un rol",
      supportRole: "Agente de Soporte (PQRs)",
      adminRole: "Administrador Global",
      creating: "Registrando...",
      createAccount: "Crear Cuenta de Staff",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      login: "Iniciar sesión",
    },
    landing: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      hero: "Gestiona tus tareas fácilmente",
      terms: "Términos y condiciones",
      support: "Soporte técnico",
    },
    terms: {
      title: "Términos y Condiciones",
      intro:
        "Al registrarse y utilizar la aplicación FocusFlow, el usuario acepta estos Términos y Condiciones, así como la Política de Datos.",
      section1: "Aceptación y Marco Legal",
      section3: "Registro, Cuenta y Seguridad",
      section7: "Seguridad de la Información",
      section8: "Responsabilidad y Garantías",
      section9: "Terminación y Suspensión",
      section10: "Legislación y Jurisdicción",
    },
    dataPolicy: {
      title: "Política de Datos",
      contact: "Para consultas de datos, contáctanos en soporte@focusflow.com.",
      collectedData:
        "Los datos personales que recolectamos (Nombre, correo electrónico, registros de actividad, estado de ánimo y hábitos de bienestar).",
      management:
        "Gestión del Servicio: Crear y administrar la cuenta del usuario.",
      personalization:
        "Personalización: Generar diagnósticos de bienestar y recomendaciones de productividad.",
      support:
        "Soporte: Atender peticiones, quejas, reclamos y sugerencias (PQRS).",
      security:
        "Seguridad: Procesar pagos de suscripciones a través de pasarelas seguras.",
      withdrawal:
        "Retirar la autorización de tratamiento en cualquier momento.",
      request: "Solicitar prueba de la autorización otorgada a FocusFlow.",
      sensitiveData:
        "FocusFlow recolecta datos sobre el estado de ánimo, niveles de estrés y hábitos de bienestar.",
    },
    onboarding: {
      title: "Cuestionario inicial",
      description:
        "Este cuestionario inicial nos ayudará a ofrecerte herramientas ajustadas a tus objetivos.",
      categories: {
        tasks: "Tareas",
        wellness: "Salud mental y bienestar",
        finances: "Finanzas personales",
      },
    },
    adjustPlan: {
      title: "Ajustar plan",
      dailyFocus: "Enfoque Diario",
      dailyFocusQuestion:
        "¿Cuántas tareas prioritarias quieres completar cada día?",
      saveChanges: "Guardar Cambios",
      saving: "Guardando...",
    },
    mood: {
      feliz: "Feliz",
      calmado: "Calmado",
      neutro: "Neutro",
      triste: "Triste",
      enojado: "Enojado",
      cansado: "Cansado",
    },
    footerNav: {
      home: "Inicio",
      tasks: "Tareas",
      focus: "Enfoque",
      wellness: "Bienestar",
      transactions: "Finanzas",
    },
    actions: {
      changeLanguage: "Idioma",
      settings: "Configuración",
      navigation: "Navegación principal",
    },
    dashboard: {
      title: "Resumen",
      howDoYouFeel: "¿Cómo te sientes hoy?",
      energyDescription:
        "Registra tu energía y tu estado emocional con estilo y claridad.",
      energySectionTitle: "Nivel de energía",
      veryLowEnergy: "Muy bajo",
      lowEnergy: "Bajo",
      mediumEnergy: "Medio",
      highEnergy: "Alto",
      veryHighEnergy: "Muy alto",
      moodTitle: "Estado de ánimo",
      optionalNote: "Nota opcional",
      optionalPlaceholder:
        "Describe brevemente cómo te sientes o qué influye en tu día.",
      currentRecord: "Registro actual",
      emotionLabel: "Emoción:",
      energyLabel: "Energía:",
      noteLabel: "Nota:",
      lastUpdated: "Última actualización:",
      savingStatus: "Guardando...",
      saveButton: "Guardar registro",
      saveTimer: "Puedes guardar otro registro en {seconds}s",
      tasksOfToday: "Tareas de hoy",
      loadingTasks: "Cargando tareas...",
      errorLoadingTasks: "Error al cargar las tareas",
      noTasksToday: "No hay tareas para hoy",
      progressDaily: "Progreso Diario",
      completedTasks: "Tareas completadas",
      savedStatus: "Guardado",
      saveError: "No se pudo guardar el registro.",
      unsavedStatus: "Sin guardar",
      unknownMood: "No definido",
    },
    // CORREGIDO: Se fusionaron los duplicados en una sola propiedad unificada
    tasks: {
      sectionTitle: "Tareas",
      title: "Tus tareas",
      loadingTasks: "Cargando tareas...",
      noTasksAvailable: "No hay tareas disponibles",
      noMatchingTasks: "No hay tareas que coincidan",
      deleteConfirm: "¿Esta acción no se puede deshacer?",
      group: {
        today: "Hoy",
        tomorrow: "Mañana",
        upcoming: "Próximamente",
        past: "Anteriores",
      },
      priority: "Prioridad",
      effort: "Esfuerzo",
      edit: "Editar",
      delete: "Eliminar",
      deleteModalTitle: "Eliminar tarea",
      deleteModalMessage:
        '¿Estás seguro de que deseas eliminar la tarea "{task}"? Esta acción no se puede deshacer.',
      cancel: "Cancelar",
      addTask: "Agregar tarea",
      noTasksMessage: "Crea una nueva tarea para que aparezca aquí.",
      taskCountLabel: "tareas",
      errorLoading: "Error al cargar las tareas",
      errorDelete: "Error al eliminar la tarea",
      status: {
        todo: "Por Hacer",
        inProgress: "En Progreso",
        completed: "Completado",
      },
    },
    // CORREGIDO: Unificado
    focus: {
      title: "Sesión de Enfoque",
      mode: {
        pomodoro: "Pomodoro",
        timeboxing: "Timeboxing",
        descanso: "Descanso",
      },
      linkTask: "Vincular tarea",
      adjustTime: "Ajustar tiempo",
      completed: "¡Completado!",
      activeSession: "{mode} activo",
      sessionType: "Sesión de {mode}",
      saveSession: "Guardar sesión",
      saved: "✓ Guardado",
      saving: "Guardando...",
      pause: "Pausar",
      resume: "Reanudar",
      startSession: "Iniciar sesión",
      noMatchingTasks: "No hay tareas que coincidan",
      cancel: "Cancelar",
      resetSession: "Nueva sesión",
      applyTime: "Aplicar",
      searchTaskPlaceholder: "Buscar tarea...",
      removeLink: "Quitar vínculo",
      timeLabel: "min",
    },
    // CORREGIDO: Unificado
    wellness: {
      title: "Bienestar",
      subtitle:
        "Encuentra tu equilibrio con ejercicios de respiración, pausas activas y meditaciones guiadas.",
      breathingTitle: "Ejercicios de respiración",
      breathingDuration1: "3 minutos",
      breathingName1: "Respiración cuadrada",
      breathingDesc1: "Inhala, mantén, exhala, mantén. Repite.",
      breathingDuration2: "11 minutos",
      breathingName2: "Técnica: La Caja",
      breathingDesc2: "Inhala 4s, mantén 4s, exhala 4s.",
      activeBreaksTitle: "Pausas activas",
      activeBreaksDesc:
        "Activa tu cuerpo y despeja tu mente con movimientos ligeros.",
      applyButton: "Aplicar",
    },
    // CORREGIDO: Unificado
    transactions: {
      title: "Finanzas",
      summary: "Resumen",
      totalBalance: "Balance Total",
      incomes: "Ingresos",
      expenses: "Gastos",
      loading: "Cargando transacciones...",
      noTransactions: "No hay transacciones registradas aún.",
      addTransaction: "Agregar Transacción",
      editTransaction: "Editar Transacción",
      newTransaction: "Agregar Transacción",
      closeForm: "Cerrar formulario",
      incomeType: "Ingreso",
      expenseType: "Gasto",
      deleteTransaction: "Eliminar",
      transactionLabel: "Transacción",
      categoryPlaceholder: "Ej. Salario",
      dateLabel: "Fecha",
      notePlaceholder: "Añadir una nota (opcional)",
      saving: "Guardando...",
      saveButton: "Guardar Transacción",
      completeFields: "Por favor completa todos los campos correctamente.",
      saveError: "No se pudo guardar la transacción. Intenta de nuevo.",
      deleteError: "No se pudo eliminar la transacción.",
      loadError: "Hubo un error al cargar los datos.",
      deleteConfirm: "¿Estás seguro de que deseas eliminar esta transacción?",
    },
  },
  en: {
    languageName: "English",
    common: {
      email: "Email",
      password: "Password",
      name: "Name",
      rememberMe: "Remember me",
      login: "Login",
      register: "Sign up",
      logout: "Logout",
      cancel: "Cancel",
      save: "Save",
      continue: "Continue",
      back: "Back",
      home: "Home",
      profile: "Profile",
      staff: "Staff",
      yes: "Yes",
      no: "No",
      search: "Search",
      viewProfile: "View Profile",
    },
    buttons: {
      submit: "Submit",
      register: "Sign up",
      login: "Log in",
      createStaff: "Create Staff Account",
      registering: "Registering...",
      loading: "Loading...",
      saveChanges: "Save Changes",
      changePassword: "Change password",
      updatePassword: "Update password",
      createAccount: "Create account",
      accept: "Accept",
      send: "Send",
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Invalid email",
      invalidEmailExample: "Valid example: user@email.com",
      passwordRequired: "Password is required",
      passwordLength: "Must be at least 8 characters",
      passwordRules:
        "Must have 8-20 characters, uppercase, lowercase and a number",
      passwordsMismatch: "Passwords do not match",
      termsRequired:
        "You must accept the Terms and Conditions and Privacy Policy",
    },
    login: {
      greeting: "Welcome back!",
      subtitle:
        "Log in to continue your journey toward wellbeing and productivity.",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
    },
    register: {
      title: "Create your account",
      subtitle:
        "Join FocusFlow and start transforming your productivity and wellbeing.",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Create a secure password",
      passwordRules: {
        minChars: "Minimum 8 characters",
        uppercase: "One uppercase letter",
        lowercase: "One lowercase letter",
        number: "One number",
      },
      termsText:
        "I accept the Terms and Conditions, the Privacy Policy and authorize the use of my sensitive data for App purposes.",
      success: "Registration successful",
      alreadyAccount: "Already have an account?",
      login: "Log in",
    },
    forgotPassword: {
      title: "Reset your password",
      subtitle:
        "Enter your email and if the address exists, you will receive a link to create a new password.",
      emailPlaceholder: "Enter your email",
    },
    updatePassword: {
      title: "Create a new password",
      subtitle:
        "Choose a secure and unique password different from your previous one.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      submit: "Change password",
      success: "Password updated successfully",
      error: "Could not update password",
    },
    welcome: {
      title: "Welcome to FocusFlow",
      subtitle:
        "Your account is ready. You can now start managing tasks, wellbeing, and goals.",
      continueButton: "Go to dashboard",
    },
    profile: {
      title: "My Account",
      personalSettings: "Personal Settings",
      editInfo: "Edit Information",
      editInfoDescription: "Update your personal details",
      changePassword: "Change Password",
      changePasswordDescription: "Keep your account secure",
      helpCenter: "Help Center",
      support: "Technical Support & PQRs",
      supportDescription: "Report an issue or review your tickets",
      staffTools: "Staff Tools",
      adminPanel: "Admin Panel",
      adminPanelDescription: "Full FocusFlow management",
      logout: "Logout",
    },
    adminPanel: {
      title: "Admin Panel",
      manageTasks: "Manage your own tasks, pomodoros and energy logs.",
      attendPqrs: "Attend PQRs",
      createAccounts: "Create new accounts for support or admin staff.",
    },
    support: {
      title: "Support & PQRs",
      description: "Manage and track all tickets quickly and neatly.",
      category: "Category",
      priority: "Priority",
      detailedDescription: "Detailed Description",
      submit: "Submit request",
      cancel: "Cancel",
    },
    supportDashboard: {
      title: "Support",
      manageTasks: "Manage your own tasks, pomodoros and energy logs.",
      attendPqrs: "Attend PQRs",
    },
    tickets: {
      title: "Ticket Management",
      loadingReports: "Loading reports...",
      noTickets: "No tickets",
      noTicketsPriority: "No tickets generated yet with this priority.",
      noPending: "No pending support tickets at the moment.",
    },
    createTask: {
      back: "Back to tasks",
      taskName: "Task name",
      deadline: "Deadline",
      description: "Description",
      priority: "Priority",
      namePlaceholder: "E.g. Prepare the presentation",
    },
    registerStaff: {
      title: "Register Staff",
      subtitle: "Create an account for support or admin staff.",
      fullName: "Full name",
      email: "Email",
      tempPassword: "Temporary password",
      selectRole: "Select a role",
      supportRole: "Support Agent (PQRs)",
      adminRole: "Global Administrator",
      creating: "Registering...",
      createAccount: "Create Staff Account",
      alreadyHaveAccount: "Already have an account?",
      login: "Log in",
    },
    landing: {
      login: "Log in",
      register: "Sign up",
      hero: "Manage your tasks easily",
      terms: "Terms and conditions",
      support: "Technical support",
    },
    terms: {
      title: "Terms and Conditions",
      intro:
        "By registering and using FocusFlow, the user accepts these Terms and Conditions as well as the Privacy Policy.",
      section1: "Acceptance and Legal Framework",
      section3: "Registration, Account and Security",
      section7: "Information Security",
      section8: "Responsibility and Warranties",
      section9: "Termination and Suspension",
      section10: "Law and Jurisdiction",
    },
    dataPolicy: {
      title: "Privacy Policy",
      contact: "For data inquiries, contact us at soporte@focusflow.com.",
      collectedData:
        "Personal data collected (Name, email, activity logs, mood and wellness habits).",
      management: "Service Management: Create and manage the user account.",
      personalization:
        "Personalization: Generate wellbeing diagnostics and productivity recommendations.",
      support:
        "Support: Attend requests, complaints, claims and suggestions (PQRs).",
      security:
        "Security: Process subscription payments through secure gateways.",
      withdrawal: "Withdraw authorization for data processing at any time.",
      request: "Request proof of authorization granted to FocusFlow.",
      sensitiveData:
        "FocusFlow collects data about mood, stress levels and wellness habits.",
    },
    onboarding: {
      title: "Initial questionnaire",
      description:
        "This initial questionnaire will help us offer tools tailored to your goals.",
      categories: {
        tasks: "Tasks",
        wellness: "Mental health and wellness",
        finances: "Personal finances",
      },
    },
    adjustPlan: {
      title: "Adjust plan",
      dailyFocus: "Daily Focus",
      dailyFocusQuestion:
        "How many priority tasks do you want to complete each day?",
      saveChanges: "Save changes",
      saving: "Saving...",
    },
    mood: {
      feliz: "Happy",
      calmado: "Calm",
      neutro: "Neutral",
      triste: "Sad",
      enojado: "Angry",
      cansado: "Tired",
    },
    footerNav: {
      home: "Home",
      tasks: "Tasks",
      focus: "Focus",
      wellness: "Wellness",
      transactions: "Transactions",
    },
    actions: {
      changeLanguage: "Language",
      settings: "Settings",
      navigation: "Main navigation",
    },
    dashboard: {
      title: "Summary",
      howDoYouFeel: "How are you feeling today?",
      energyDescription:
        "Record your energy and emotional state with style and clarity.",
      energySectionTitle: "Energy level",
      veryLowEnergy: "Very low",
      lowEnergy: "Low",
      mediumEnergy: "Medium",
      highEnergy: "High",
      veryHighEnergy: "Very high",
      moodTitle: "Mood",
      optionalNote: "Optional note",
      optionalPlaceholder:
        "Briefly describe how you feel or what influences your day.",
      currentRecord: "Current record",
      emotionLabel: "Emotion:",
      energyLabel: "Energy:",
      noteLabel: "Note:",
      lastUpdated: "Last updated:",
      savingStatus: "Saving...",
      saveButton: "Save record",
      saveTimer: "You can save again in {seconds}s",
      tasksOfToday: "Today’s tasks",
      loadingTasks: "Loading tasks...",
      errorLoadingTasks: "Error loading tasks",
      noTasksToday: "No tasks for today",
      progressDaily: "Daily progress",
      completedTasks: "Tasks completed",
      savedStatus: "Saved",
      saveError: "Could not save the record.",
      unsavedStatus: "Unsaved",
      unknownMood: "Undefined",
    },
    // CORREGIDO: Unificado
    tasks: {
      sectionTitle: "Tasks",
      title: "Your tasks",
      loadingTasks: "Loading tasks...",
      noTasksAvailable: "No tasks available",
      noMatchingTasks: "No matching tasks",
      deleteConfirm: "This action cannot be undone.",
      group: {
        today: "Today",
        tomorrow: "Tomorrow",
        upcoming: "Upcoming",
        past: "Past",
      },
      priority: "Priority",
      effort: "Effort",
      edit: "Edit",
      delete: "Delete",
      deleteModalTitle: "Delete task",
      deleteModalMessage:
        'Are you sure you want to delete the task "{task}"? This action cannot be undone.',
      cancel: "Cancel",
      addTask: "Add task",
      noTasksMessage: "Create a new task to see it here.",
      taskCountLabel: "tasks",
      errorLoading: "Error loading tasks",
      errorDelete: "Error deleting task",
      status: {
        todo: "To do",
        inProgress: "In progress",
        completed: "Completed",
      },
    },
    // CORREGIDO: Unificado
    focus: {
      title: "Focus Session",
      mode: {
        pomodoro: "Pomodoro",
        timeboxing: "Timeboxing",
        descanso: "Break",
      },
      linkTask: "Link task",
      adjustTime: "Adjust time",
      completed: "Completed!",
      activeSession: "{mode} active",
      sessionType: "{mode} session",
      saveSession: "Save session",
      saved: "✓ Saved",
      saving: "Saving...",
      resume: "Resume",
      startSession: "Start session",
      noMatchingTasks: "No matching tasks",
      cancel: "Cancel",
      resetSession: "New session",
      applyTime: "Apply",
      searchTaskPlaceholder: "Search task...",
      removeLink: "Remove link",
      timeLabel: "min",
    },
    // CORREGIDO: Unificado
    wellness: {
      title: "Wellness",
      subtitle:
        "Find your balance with breathing exercises, active breaks and guided meditations.",
      breathingTitle: "Breathing exercises",
      breathingDuration1: "3 minutes",
      breathingName1: "Square breathing",
      breathingDesc1: "Inhale, hold, exhale, hold. Repeat.",
      breathingDuration2: "11 minutes",
      breathingName2: "Box breathing",
      breathingDesc2: "Inhale 4s, hold 4s, exhale 4s.",
      activeBreaksTitle: "Active breaks",
      activeBreaksDesc:
        "Get your body moving and clear your mind with light movement.",
      applyButton: "Apply",
    },
    // CORREGIDO: Unificado
    transactions: {
      title: "Finances",
      summary: "Summary",
      totalBalance: "Total balance",
      incomes: "Income",
      expenses: "Expenses",
      loading: "Loading transactions...",
      noTransactions: "No transactions recorded yet.",
      addTransaction: "Add Transaction",
      editTransaction: "Edit Transaction",
      newTransaction: "Add Transaction",
      closeForm: "Close form",
      incomeType: "Income",
      expenseType: "Expense",
      deleteTransaction: "Delete",
      transactionLabel: "Transaction",
      dateLabel: "Date",
      notePlaceholder: "Add a note (optional)",
      saving: "Saving...",
      saveButton: "Save transaction",
      completeFields: "Please complete all fields correctly.",
      saveError: "Could not save the transaction. Try again.",
      deleteError: "Could not delete the transaction.",
      loadError: "There was an error loading data.",
      deleteConfirm: "Are you sure you want to delete this transaction?",
    },
  },
};

export const availableLanguages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

export const localeCode = computed(() =>
  locale.value === "en" ? "en-US" : "es-CO",
);

export function setLocale(newLocale) {
  if (translations[newLocale]) {
    locale.value = newLocale;
    if (globalThis.window !== undefined) {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }
}

export function useLocale() {
  return {
    locale,
    localeCode,
    availableLanguages,
    setLocale,
    t,
  };
}

export function t(path, values = {}) {
  const segments = path.split(".");
  let result = translations[locale.value];
  for (const segment of segments) {
    if (!result) break;
    result = result[segment];
  }
  if (typeof result !== "string") return path;

  return result.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? ` ${key} `);
}
