<template>
  <section class="generic-view tasks-view">
    <div class="page-header">
      <h1>Tareas</h1>
    </div>

    <div v-if="loading" class="empty">Cargando tareas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="empty">No hay tareas disponibles</div>

    <ul v-else class="task-list">
      <li
        v-for="task in tasks"
        :key="task.id ?? task.idTarea ?? task.titulo"
        class="task-card"
      >
        <div class="task-card__main">
          <div class="task-card__check">
            <input
              type="checkbox"
              :checked="task.estado === 'Completado'"
              @change="toggleCompleted(task, $event.target.checked)"
              aria-label="Marcar tarea como completada"
            />
          </div>
          <div class="task-card__content">
            <div class="task-card__top">
              <div>
                <p class="task-card__title">{{ task.titulo }}</p>
                <p class="task-card__time">{{ formatTime(task.fechaLimite) }}</p>
                <span class="task-status-badge" :class="statusBadgeClass(task.estado)">{{ task.estado }}</span>
              </div>
              <div class="task-card__icon">{{ task.icono || '📝' }}</div>
            </div>

            <div class="task-card__meta">
              <span class="task-pill priority-pill" :class="priorityClass(task.prioridad)">
                <span class="pill-dot"></span>
                Prioridad {{ capitalize(task.prioridad) }}
              </span>

              <span class="task-pill effort-pill">
                <span class="effort-meter">
                  <span class="effort-segment" :class="{ active: task.nivelEsfuerzo === 'bajo' || task.nivelEsfuerzo === 'medio' || task.nivelEsfuerzo === 'alto' }"></span>
                  <span class="effort-segment" :class="{ active: task.nivelEsfuerzo === 'medio' || task.nivelEsfuerzo === 'alto' }"></span>
                  <span class="effort-segment" :class="{ active: task.nivelEsfuerzo === 'alto' }"></span>
                </span>
                Esfuerzo {{ capitalize(task.nivelEsfuerzo) }}
              </span>
            </div>

            <div class="status-selector">
              <button
                v-for="option in statusOptions"
                :key="option"
                type="button"
                class="status-option"
                :class="{ active: task.estado === option }"
                @click="changeStatus(task, option)"
              >
                {{ option }}
              </button>
            </div>

            <p v-if="task.descripcion" class="task-card__description">{{ task.descripcion }}</p>
          </div>
        </div>

        <div class="task-actions" @click.stop>
          <button class="btn-edit" @click="editTask(task)">✏️ Editar</button>
          <button class="btn-delete" @click="confirmDeleteTask(task)">🗑️ Eliminar</button>
        </div>
      </li>
    </ul>

    <button class="fab-add" @click="goToCreateTask" title="Crear nueva tarea">+</button>
  </section>

  <FooterNav />

  <!-- Modal de confirmación de eliminación -->
  <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
    <div class="modal-content" @click.stop>
      <h3>Confirmar eliminación</h3>
      <p>¿Estás seguro de que deseas eliminar la tarea "{{ taskToDelete?.titulo }}"?</p>
      <div class="modal-actions">
        <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
        <button class="btn-confirm-delete" @click="deleteTask">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterNav from '../components/FooterNav.vue'
import { getTasks, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../services/api.js'

const router = useRouter()

const tasks = ref([])
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const userTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota'

const parseUtcDateTime = (dateString) => {
  if (!dateString) return null
  if (dateString.includes('Z') || dateString.includes('+')) {
    return new Date(dateString)
  }
  return new Date(dateString.replace(' ', 'T') + 'Z')
}

const getTaskDeadline = (task) => task.fecha_limite ?? task.fechaLimite ?? null

const normalizeStatus = (status) => {
  if (!status) return 'Por Hacer'
  const lower = String(status).toLowerCase()
  if (lower.includes('complet')) return 'Completado'
  if (lower.includes('progreso')) return 'En Progreso'
  if (lower.includes('hacer') || lower.includes('pendiente') || lower.includes('por hacer')) return 'Por Hacer'
  return status
}

const formatTime = (dateString) => {
  const date = parseUtcDateTime(dateString)
  if (!date || Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('es-CO', {
    timeZone: userTimeZone,
    hour: '2-digit',
    minute: '2-digit',
  })
}

const capitalize = (value) =>
  value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : ''

const priorityClass = (priority) => {
  if (!priority) return 'priority-default'
  return {
    alta: 'priority-high',
    media: 'priority-medium',
    baja: 'priority-low',
  }[String(priority).toLowerCase()] || 'priority-default'
}

const statusBadgeClass = (status) => {
  switch (normalizeStatus(status)) {
    case 'Completado':
      return 'status-badge-completed'
    case 'En Progreso':
      return 'status-badge-progress'
    default:
      return 'status-badge-todo'
  }
}

const statusOptions = ['Por Hacer', 'En Progreso', 'Completado']

const changeStatus = async (task, status) => {
  const normalizedStatus = normalizeStatus(status)
  if (task.estado === normalizedStatus) return

  const originalStatus = task.estado
  task.estado = normalizedStatus

  try {
    await apiUpdateTask(task.id, {
      titulo: task.titulo,
      prioridad: task.prioridad,
      nivelEsfuerzo: task.nivelEsfuerzo,
      estado: normalizedStatus,
      descripcion: task.descripcion,
      fechaLimite: task.fechaLimite,
      icono: task.icono,
      recordatorio: task.recordatorio,
    })
  } catch (e) {
    console.error('Error actualizando estado de tarea:', e)
    task.estado = originalStatus
    error.value = 'No se pudo actualizar el estado de la tarea'
  }
}

const toggleCompleted = async (task, checked) => {
  await changeStatus(task, checked ? 'Completado' : 'Por Hacer')
}

const goToCreateTask = () => {
  router.push('/create-task')
}

const editTask = (task) => {
  sessionStorage.setItem('editingTask', JSON.stringify(task))
  router.push('/create-task')
}

const confirmDeleteTask = (task) => {
  taskToDelete.value = task
  showDeleteModal.value = true
}

const deleteTask = async () => {
  if (!taskToDelete.value) return

  try {
    await apiDeleteTask(taskToDelete.value.id)
    tasks.value = tasks.value.filter((t) => t.id !== taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (e) {
    console.error('Error al eliminar la tarea:', e)
    error.value = 'Error al eliminar la tarea'
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const data = await getTasks()

    tasks.value = data.map((task) => ({
      ...task,
      id: task.id_tarea ?? task.idTarea ?? task.id ?? null,
      fechaLimite: task.fechaLimite ?? task.fecha_limite ?? getTaskDeadline(task),
      estado: normalizeStatus(task.estado),
    }))
  } catch (e) {
    error.value = 'Error al cargar las tareas'
    console.error('Error cargando tareas en TasksView:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tasks-view {
  padding-bottom: 100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
}

.group-header {
  margin-bottom: 12px;
}

.group-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.task-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 14px;
}

.task-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.06);
  padding: 18px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 22px 36px rgba(15, 23, 42, 0.1);
}

.task-card.expanded {
  border-color: #4f46e5;
}

.task-card__main {
  display: grid;
  gap: 16px;
}

.task-card__check {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
}

.task-card__content {
  display: grid;
  gap: 12px;
}

.task-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.task-card__title-group {
  min-width: 0;
}

.task-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.task-card__time {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.task-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #eef2ff;
  color: #4338ca;
  font-size: 1.1rem;
}

.task-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.status-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.status-option {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  color: #334155;
  border-radius: 9999px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-option.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.task-card__check input {
  width: 18px;
  height: 18px;
  accent-color: #2563eb;
}

.task-status-badge {
  display: inline-flex;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-badge-completed {
  color: #165e36;
  background: #dcfce7;
}

.status-badge-progress {
  color: #1d4ed8;
  background: #dbeafe;
}

.status-badge-todo {
  color: #78350f;
  background: #fef3c7;
}

.task-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
  background: #f8fafc;
}

.pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  display: inline-block;
}

.priority-pill.priority-high .pill-dot {
  background: #dc2626;
}

.priority-pill.priority-medium .pill-dot {
  background: #f59e0b;
}

.priority-pill.priority-low .pill-dot {
  background: #16a34a;
}

.effort-meter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.effort-segment {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #d1d5db;
}

.effort-segment.active {
  background: #2563eb;
}

.task-card__description {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.5;
}

.task-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #eef2ff;
}

.task-actions button {
  flex: 0 0 auto;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.btn-edit {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #dbeafe;
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-delete {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fee2e2;
}

.btn-delete:hover {
  background: #fee2e2;
}

.fab-add {
  position: fixed;
  bottom: 84px;
  right: 22px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 32px;
  border: none;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(37, 99, 235, 0.24);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 100;
}

.fab-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 32px rgba(37, 99, 235, 0.28);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 20px;
  max-width: 92%;
  width: 360px;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 12px;
  color: #0f172a;
}

.modal-content p {
  color: #475569;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-cancel {
  background: #f1f5f9;
  color: #334155;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-confirm-delete {
  background: #b91c1c;
  color: white;
}

.btn-confirm-delete:hover {
  background: #7f1d1d;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error { color: #dc3545; }
</style>