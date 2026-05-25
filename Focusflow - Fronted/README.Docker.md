🐳 Guía de Despliegue con Docker - FocusFlow Frontend

Este documento contiene las instrucciones necesarias para construir, configurar y ejecutar de forma segura la aplicación frontend de FocusFlow utilizando Docker y contenedores de producción optimizados.
📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

    Docker Desktop (versión 20.10 o superior) o Docker Engine en Linux.

    Docker Compose (generalmente incluido en Docker Desktop).

🔒 Configuración del Entorno (.env)

El frontend de la aplicación depende de variables de entorno para compilar los endpoints correctos de la API y los tokens de Supabase mediante Vite.

Por estrictas razones de seguridad, los archivos .env reales están ignorados en el repositorio mediante el archivo .dockerignore. Sigue estos pasos para configurarlo localmente antes de levantar el contenedor:

    En la raíz del proyecto, crea un nuevo archivo llamado .env.

    Copia la estructura del archivo de plantilla .env.example y rellena los campos con tus credenciales reales:

Plaintext

# Configuración de Supabase (Autenticación y Base de Datos)
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui

# Endpoints de la API Backend de .NET en Render
VITE_API_BASE_URL=https://focusflow-backend-yr16.onrender.com/
VITE_TICKET_HUB_URL=https://focusflow-backend-yr16.onrender.com/ticketHub

    ⚠️ Nota de producción: Al construir la imagen, Vite inyectará de forma fija estos valores dentro del empaquetado final (dist/). Si necesitas cambiar de backend, deberás reconstruir la imagen de Docker.

🛠️ Arquitectura y Seguridad del Contenedor

Para cumplir con los estándares de SonarLint (DevSecOps) y garantizar un despliegue seguro, el entorno Docker de FocusFlow se diseñó bajo los siguientes pilares:

    Construcción Multi-etapa (Multi-stage build): Aísla el entorno de desarrollo de Node.js del entorno final para mantener la imagen ligera.

    Instalación Segura (--ignore-scripts): Bloquea la ejecución automática de scripts maliciosos de dependencias de terceros en npm durante el npm ci.

    Imagen Base No-Root (nginx-unprivileged): El servidor Nginx no se ejecuta como superusuario (root). Si el proceso se ve comprometido, el atacante no tendrá privilegios en el contenedor ni en el servidor host.

    Puerto de Escucha Segura: Debido a las restricciones de usuario sin privilegios de la imagen base, la aplicación web se expone internamente en el puerto 8080.

🚀 Comandos de Ejecución
1. Construir la Imagen de Docker manualmente

Para compilar los archivos estáticos de Vue 3/Vite y levantar el servidor web Nginx seguro:
Bash

docker build -t focusflow-frontend .

2. Ejecutar el Contenedor

Para correr el frontend mapeando el puerto seguro 8080 del contenedor hacia el puerto de tu preferencia en tu máquina local (por ejemplo, el 80 o el 8080):
Bash

docker run -d -p 8080:8080 --name focusflow-frontend-app focusflow-frontend

Ahora puedes abrir tu navegador e ingresar a http://localhost:8080.
3. Detener el Contenedor

Cuando termines tus pruebas o desarrollo, puedes apagar el contenedor con:
Bash

docker stop focusflow-frontend-app
docker rm focusflow-frontend-app