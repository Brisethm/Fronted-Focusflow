# Focusflow Frontend

Frontend de Focusflow construido con Vue 3, Vite, Vitest y Nginx para despliegue en Docker.

## Requisitos

- Node.js 20.19 o superior
- npm 10 o superior
- Docker Desktop, si se va a ejecutar con contenedores

> La aplicacion esta dentro de la carpeta `Focusflow - Fronted`. Ejecuta los comandos desde esta carpeta, no desde la raiz del repositorio.

## Instalacion

Instalacion recomendada, usando el `package-lock.json` del proyecto:

```bash
npm ci
```

Si necesitas reinstalar manualmente las librerias principales en otro PC, estos son los paquetes usados por el proyecto:

```bash
npm install vue@^3.5.30 vue-toastification@^2.0.0-rc.5 vue-router@^5.0.7 axios@^1.16.1 @supabase/supabase-js@^2.106.1 @microsoft/signalr@^10.0.0
npm install -D vite@^8.0.3 vitest@^4.1.7 @vitest/coverage-v8@^4.1.7 @vitejs/plugin-vue@^6.0.7 @vue/test-utils@^2.4.10 jsdom@^29.1.1
```

## Ejecucion local

```bash
npm run dev
```

Compilar para produccion:

```bash
npm run build
```

Previsualizar la compilacion:

```bash
npm run preview
```

## Tests y cobertura

Ejecutar tests:

```bash
npm test
```

Generar cobertura para Sonar:

```bash
npm run coverage
```

El reporte que lee Sonar se genera en:

```text
coverage/lcov.info
```

## SonarQube / SonarCloud

La configuracion esta en `sonar-project.properties`. El analisis usa:

- `sonar.sources=src`
- `sonar.tests=src/tests`
- `sonar.javascript.lcov.reportPaths=coverage/lcov.info`
- `sonar.qualitygate.wait=true`

En GitHub Actions primero se ejecuta `npm ci`, luego `npm run coverage` y finalmente el escaneo con `projectBaseDir: Focusflow - Fronted`. Para que funcione, el repositorio debe tener configurado el secreto `SONAR_TOKEN`.

## Docker

Construir la imagen:

```bash
docker build -t focusflow-frontend .
```

Ejecutar el contenedor:

```bash
docker run --rm -p 5137:80 focusflow-frontend
```

Abrir la aplicacion en:

```text
http://localhost:5137
```

Tambien se puede usar Docker Compose:

```bash
docker compose up --build
```

Para detenerlo:

```bash
docker compose down
```
