<template>
  <section class="generic-view">
    <h1>Tareas</h1>
    <div v-if="loading" class="loading">Cargando tareas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="empty">No hay tareas disponibles</div>
    <ul v-else class="task-list">
      <li 
        v-for="task in tasks" 
        :key="task.id" 
        class="task-item"
        :class="{ expanded: expandedTaskId === task.id }"
        @click="toggleTaskActions(task.id)"
      >
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
        
        <!-- Acciones de la tarea -->
        <div v-if="expandedTaskId === task.id" class="task-actions" @click.stop>
          <button class="btn-edit" @click="editTask(task)">✏️ Editar</button>
          <button class="btn-delete" @click="confirmDeleteTask(task)">🗑️ Eliminar</button>
        </div>
      </li>
    </ul>
    
    <!-- Botón flotante para crear tarea -->
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
import { getTasks, deleteTask as apiDeleteTask } from '../services/api.js'

const router = useRouter()

const tasks = ref([])
const loading = ref(true)
const error = ref(null)
const expandedTaskId = ref(null)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)

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

// Alternar visibilidad de acciones de tarea
const toggleTaskActions = (taskId) => {
  expandedTaskId.value = expandedTaskId.value === taskId ? null : taskId
}

// Ir a crear tarea
const goToCreateTask = () => {
  router.push('/create-task')
}

// Editar tarea - navegar a CreateTask con la tarea seleccionada
const editTask = (task) => {
  // Guardar la tarea en sessionStorage para editarla en CreateTaskView
  sessionStorage.setItem('editingTask', JSON.stringify(task))
  router.push('/create-task')
}

// Confirmar eliminación de tarea
const confirmDeleteTask = (task) => {
  taskToDelete.value = task
  showDeleteModal.value = true
}

// Eliminar tarea
const deleteTask = async () => {
  if (!taskToDelete.value) return
  
  try {
    await apiDeleteTask(taskToDelete.value.id)
    // Actualizar la lista local
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
    expandedTaskId.value = null
  } catch (e) {
    console.error('Error al eliminar la tarea:', e)
    error.value = 'Error al eliminar la tarea'
  }
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
  cursor: pointer;
  transition: all 0.2s ease;
}
.task-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.task-item.expanded {
  border-color: #4a90d9;
  background: #f8faff;
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

/* Acciones de tarea */
.task-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.task-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-edit {
  background: #4a90d9;
  color: white;
}
.btn-edit:hover {
  background: #357abd;
}
.btn-delete {
  background: #dc3545;
  color: white;
}
.btn-delete:hover {
  background: #c82333;
}

/* Botón flotante */
.fab-add {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #4a90d9;
  color: white;
  font-size: 32px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(74, 144, 217, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 100;
}
.fab-add:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(74, 144, 217, 0.5);
}

/* Modal de confirmación */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 90%;
  width: 320px;
  text-align: center;
}
.modal-content h3 {
  margin: 0 0 12px;
  color: #333;
}
.modal-content p {
  color: #666;
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
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}
.btn-cancel {
  background: #e0e0e0;
  color: #333;
}
.btn-cancel:hover {
  background: #d0d0d0;
}
.btn-confirm-delete {
  background: #dc3545;
  color: white;
}
.btn-confirm-delete:hover {
  background: #c82333;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  color: #666;
}
.error { color: #dc3545; }
</style>