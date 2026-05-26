# 🧠 FocusFlow — Frontend (Vue 3 + Vite + Supabase)

Aplicación Web de cliente (SPA) desarrollada en **Vue 3 (Composition API)** con **Vite** para la plataforma **FocusFlow**, enfocada en productividad, gestión del tiempo, seguimiento emocional y finanzas básicas.

El frontend implementa autenticación directa con **Supabase Auth**, consumo de endpoints REST mediante **Axios**, empaquetado optimizado, pruebas unitarias y de interfaz con **Vitest + Vue Test Utils**, y suscripciones en tiempo real mediante el cliente de **SignalR**.

---

# 🚀 Tecnologías Utilizadas

| Tecnología | Uso |
| --- | --- |
| Vue 3 (Script Setup) | Framework progresivo de interfaz |
| Vite | Motor de construcción y bundler ultra veloz |
| Vue Router | Gestión y protección de rutas (Guards) |
| Supabase JS Client | Autenticación y persistencia secundaria |
| Axios | Cliente HTTP para consumir la API de .NET 8 |
| @microsoft/signalr | Cliente para comunicación WebSockets bidireccional |
| Vitest | Framework de testing nativo para Vite |
| Vue Test Utils | Utilidades para pruebas de componentes del DOM |
| Vue I18n | Internacionalización y soporte multiidioma |
| Docker | Contenedorización segura (No-Root / Unprivileged) |

---

# 📂 Estructura del Proyecto

El código fuente del cliente se organiza bajo las prácticas estándar de modularidad en Vue:

```plaintext
Focusflow Frontend /
│
├── src/
│   ├── components/       → Componentes globales y reutilizables (Nav, Modales)
│   ├── views/            → Vistas principales (Login, Dashboard, FocusView, Tasks)
│   ├── services/         → Clientes de API (Axios) y conexión con backend .NET
│   ├── stores/           → Estados globales (Idiomas, configuraciones locales)
│   ├── utils/            → Helpers, validadores de seguridad y notificaciones (`notifier.js`)
│   ├── assets/           → Estilos globales (Focus CSS), imágenes e iconos SVG
│   ├── router/           → Definición de rutas y Guards de seguridad
│   └── App.vue           → Componente raíz y renderizado de rutas (`RouterView`)
│
├── src/tests/            → Suite de pruebas automatizadas
│   ├── views/            → Tests de interfaz de componentes (`FocusView.test.js`)
│   └── utils/            → Tests de lógica utilitaria (`notifier.test.js`)
│
├── nginx.conf            → Configuración del servidor web de producción
├── Dockerfile            → Construcción multi-etapa segura
└── package.json          → Dependencias y scripts de ejecución

```

---

# 🧩 Arquitectura General

El flujo de control en el lado del cliente opera de la siguiente manera:

```plaintext
Vista (Usuario / DOM)
        │
        ▼
Componente de Vue (.vue / State)
        │
        ▼
Services (Axios HTTP / SignalR Hubs)
        │
        ▼
API Backend (.NET 8) ──► Base de Datos / Supabase

```

---

# 🔐 Seguridad y Autenticación

El cliente gestiona la seguridad de extremo a extremo mediante:

* **Supabase Auth Integration:** Recuperación automática de sesiones y flujos de restablecimiento de contraseña mediante parámetros hash de URL en la inicialización de la app.
* **Validación de Formularios Blindada:** Métodos de validación inmunes a ataques de denegación de servicio por expresiones regulares (**ReDoS**) y controles estrictos de longitud (`maxlength`).
* **Route Guards:** Verificación asíncrona de tokens y roles de usuario (`admin`, `support`, `user`) antes de permitir el acceso a las vistas internas del sistema.

Ejemplo de flujo de inicio:

```javascript
const hashParams = new URLSearchParams(globalThis.location.hash.substring(1));
if (hashParams.get("type") === "recovery") {
  await supabase.auth.setSession({ ... });
  router.push("/update-password");
}

```

---

# 📡 Comunicación en Tiempo Real y Notificaciones

La interactividad ágil de FocusFlow se apoya en dos tecnologías nativas del navegador:

* **SignalR Client WebSockets:** Conexión interactiva hacia el `ticketHub` del backend para la actualización instantánea de alertas de soporte técnico.
* **Web Notifications API:** Programación reactiva basada en el desfase de marcas de tiempo del sistema (Date.now()). Permite disparar alertas visuales al usuario de forma nativa cuando se agotan los cronómetros de las sesiones de enfoque, minimizando el impacto de congelamiento de hilos que aplican los navegadores en pestañas inactivas.

---

# 🗂️ Funcionalidades Implementadas

### 👤 Autenticación y Perfil

* Login con persistencia en almacenamiento de sesión.
* Recuperación de credenciales.
* Enrutamiento dinámico según roles profesionales corregidos.

### ✅ Gestión de Productividad

* Creación, actualización y filtrado de tareas complejas.
* Temporizadores dedicados para **Timeboxing**, **Pomodoro** y **Descansos**.
* Ajustes de intervalos personalizados con modales dinámicos.

### 🧠 Notificaciones Automáticas

* Programación reactiva de recordatorios asíncronos mediante `setTimeout` calibrados con el reloj del sistema.

---

# ⚙️ Variables de Entorno

Para levantar el proyecto, debes configurar un archivo de entorno en la raíz. Puedes guiarte de la plantilla del archivo `.env.example`:

```text
# Configuración de Supabase (Autenticación)
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui

# Endpoints de la API Backend de .NET
VITE_API_BASE_URL=https://focusflow-backend-yr16.onrender.com/
VITE_TICKET_HUB_URL=https://focusflow-backend-yr16.onrender.com/ticketHub

```

Ambos archivos están estrictamente protegidos del control de versiones mediante:

```plaintext
.gitignore
.dockerignore

```

---

# 🐳 Dockerización Segura (DevSecOps)

El proyecto utiliza una estrategia de empaquetado industrial:

1. **Build Inteligente:** Descarga e instala dependencias bloqueando scripts de terceros mediante el flag `--ignore-scripts`.
2. **Servidor Web No-Root:** Sirve el empaquetado estático utilizando la variante **`nginxinc/nginx-unprivileged:alpine`**, eliminando por completo los privilegios de ejecución como `root`.

Construir la imagen local:

```bash
docker build -t focusflow-frontend .

```

Ejecutar el contenedor en el puerto seguro de escucha `8080`:

```bash
docker run -d -p 8080:8080 --name focusflow-frontend-app focusflow-frontend

```

---

# 🚀 Instalación y Ejecución Local

Clonar el repositorio del frontend:

```bash
git clone https://github.com/TU-USUARIO/focusflow-frontend.git
cd focusflow-frontend

```

Instalar dependencias de desarrollo de forma limpia:

```bash
npm install

```

Ejecutar el servidor local en modo desarrollo (Vite):

```bash
npm run dev

```

Compilar el proyecto optimizado para producción:

```bash
npm run build

```

---

# 🧪 Suite de Testing Automatizado

Las pruebas unitarias y de integración se ejecutan de forma aislada a través del entorno de **Vitest** con soporte asíncrono para componentes de carga pesada utilizando bloques `<Suspense>` virtuales.

Ejecutar todas las pruebas del Frontend:

```bash
npm run test

```

Ejecutar únicamente la suite de pruebas del cronómetro de enfoque:

```bash
npx vitest src/tests/views/FocusView.test.js

```
