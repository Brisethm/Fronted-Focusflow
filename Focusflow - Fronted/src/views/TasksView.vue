<template>
  <section class="generic-view">
    <h1>Tareas</h1>
    <div v-if="loading" class="loading">Cargando tareas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="empty">No hay tareas disponibles</div>
    <ul v-else class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-header">
          <h3>{{ task.titulo }}</h3>
          <span :class="['status', task.estado]">{{ task.estado }}</span>
        </div>
        <p v-if="task.descripcion" class="task-description">{{ task.descripcion }}</p>
        <div class="task-meta">
          <span v-if="task.fechaLimite">📅 {{ formatDate(task.fechaLimite) }}</span>
          <span v-if="task.prioridad">⭐ {{ task.prioridad }}</span>
          <span v-if="task.nivelEsfuerzo">💪 {{ task.nivelEsfuerzo }}</span>
        </div>
      </li>
    </ul>
  </section>
  <FooterNav />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FooterNav from '../components/FooterNav.vue'
import { getTasks } from '../services/api.js'

const tasks = ref([])
const loading = ref(true)
const error = ref(null)

const userTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota'

const parseUtcDateTime = (dateString) => {
  if (!dateString) return null
  if (dateString.includes('Z') || dateString.includes('+')) {
    return new Date(dateString)
  }
  // La DB guarda UTC sin Z → se lo agregamos
  return new Date(dateString.replace(' ', 'T') + 'Z')
}

const formatDate = (dateString) => {
  const date = parseUtcDateTime(dateString)
  if (!date || isNaN(date)) return dateString

  return date.toLocaleString('es-CO', {
    timeZone: userTimeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  try {
    loading.value = true
    const data = await getTasks()

    // 👇 Log para ver qué llega exactamente de la API
    console.log('Zona horaria del navegador:', userTimeZone)
    console.log('Tareas crudas:', JSON.stringify(data, null, 2))
    data.forEach(task => {
      const parsed = parseUtcDateTime(task.fecha_limite)
      console.log(
        `Tarea: "${task.titulo}" | Raw: ${task.fecha_limite} | Parseado: ${parsed} | Formateado: ${formatDate(task.fecha_limite)}`
      )
    })

    tasks.value = data
  } catch (e) {
    error.value = 'Error al cargar las tareas'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.task-list {
  list-style: none;
  padding: 0;
}
.task-item {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.task-header h3 {
  margin: 0;
  font-size: 1.1rem;
}
.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}
.status.pending { background: #fff3cd; color: #856404; }
.status.in-progress { background: #cce5ff; color: #004085; }
.status.completed { background: #d4edda; color: #155724; }
.task-description {
  color: #666;
  margin: 8px 0;
}
.task-meta {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: #888;
}
.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error { color: #dc3545; }
</style>