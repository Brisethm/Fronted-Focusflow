<template>
  <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-950 font-display min-h-screen">
    <main class="px-4 pb-24 pt-4">
      <header class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{{ t('tasks.sectionTitle') }}</p>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">{{ t('tasks.title') }}</h1>
        </div>
        <button
          type="button"
          @click="goToCreateTask"
          class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
          :aria-label="t('tasks.addTask')"
        >
          <span class="text-2xl">+</span>
        </button>
      </header>

      <!-- Estado de Carga -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <p class="text-lg font-medium text-slate-500 animate-pulse">{{ t('tasks.loadingTasks') }}</p>
      </div>

      <!-- Estado de Error -->
      <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-900/10">
        <p class="text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
      </div>

      <!-- Estado Vacío -->
      <section v-else-if="tasks.length === 0" class="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t('tasks.noTasksAvailable') }}</p>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ t('tasks.noTasksMessage') }}</p>
      </section>

      <!-- Lista de Tareas Agrupadas -->
      <div class="space-y-8" v-else>
        <div v-for="group in taskGroups" :key="group.title">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ group.title }}</h2>
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ group.tasks.length }} {{ t('tasks.taskCountLabel') }}</span>
          </div>
          
          <div class="space-y-4">
            <article
              v-for="task in group.tasks"
              :key="task.id"
              class="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-slate-100 text-lg text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <span>{{ task.icono || '📝' }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ task.titulo }}</p>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400" v-if="task.fechaLimite">
                      📅 {{ formatDate(task.fechaLimite) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    :class="statusPillClass(task.estado)"
                  >
                    {{ statusLabel(task.estado) }}
                  </span>
                </div>
              </div>

              <p v-if="task.descripcion" class="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {{ task.descripcion }}
              </p>

              <div class="mt-4 flex flex-col gap-3 text-sm">
                <!-- Etiquetas de Prioridad y Esfuerzo -->
                <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span v-if="task.prioridad" class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-900 capitalize">
                    <span class="h-2.5 w-2.5 rounded-full" :class="priorityDotClass(task.prioridad)"></span>
                    {{ t('tasks.priority') }} {{ task.prioridad }}
                  </span>
                  <span v-if="task.nivelEsfuerzo" class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-900 capitalize">
                    <span class="h-2.5 w-2.5 rounded-full" :class="effortDotClass(task.nivelEsfuerzo)"></span>
                    {{ t('tasks.effort') }} {{ task.nivelEsfuerzo }}
                  </span>
                </div>
                
                <!-- Acciones (Editar y Eliminar) -->
                <div class="mt-3 flex gap-2">
                  <button
                    type="button"
                    @click="editTask(task)"
                    class="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    ✏️ {{ t('tasks.edit') }}
                  </button>
                  <button
                    type="button"
                    @click="confirmDeleteTask(task)"
                    class="rounded-full border border-red-300 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20 transition"
                  >
                    🗑️ {{ t('tasks.delete') }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>

    <!-- Usamos el FooterNav de tu primer código, o puedes reemplazar esto por el HTML del footer si prefieres -->
    <FooterNav />

    <!-- Modal de confirmación estilizado con Tailwind -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4" @click="showDeleteModal = false">
      <div class="w-full max-w-sm rounded-[24px] bg-white p-6 text-center shadow-xl dark:bg-slate-900" @click.stop>
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <span class="text-3xl">⚠️</span>
        </div>
        <h3 class="mb-2 text-xl font-bold text-slate-900 dark:text-white">{{ t('tasks.deleteModalTitle') }}</h3>
        <p class="mb-6 text-sm text-slate-600 dark:text-slate-400">{{ t('tasks.deleteModalMessage', { task: taskToDelete?.titulo }) }}</p>
        <div class="flex gap-3">
          <button class="flex-1 rounded-full bg-slate-100 py-3 font-semibold text-slate-700 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" @click="showDeleteModal = false">
            {{ t('tasks.cancel') }}
          </button>
          <button class="flex-1 rounded-full bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition shadow-lg shadow-red-500/30" @click="deleteTask">
            {{ t('tasks.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import FooterNav from '../components/FooterNav.vue'
import { getTasks, deleteTask as apiDeleteTask } from '../services/api.js'
import { t, localeCode } from '../stores/locale'


const router = useRouter()

const tasks = ref([])
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota'

// --- LÓGICA DE FECHAS ---
const parseUtcDateTime = (dateString) => {
  if (!dateString) return null
  if (dateString.includes('Z') || dateString.includes('+')) {
    return new Date(dateString)
  }
  return new Date(dateString.replace(' ', 'T') + 'Z')
}

const formatDate = (dateString) => {
  const date = parseUtcDateTime(dateString)
  if (!date || Number.isNaN(date)) return dateString

  return date.toLocaleString(localeCode.value, {
    timeZone: userTimeZone,
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// --- COMPUTED PARA AGRUPAR TAREAS ---
const taskGroups = computed(() => {
  const now = new Date()
  
  // Llevamos "hoy" a la medianoche exacta para comparar solo las fechas (días) sin importar la hora
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const atrasadas = []
  const hoy = []
  const manana = []
  const proximamente = []

  tasks.value.forEach((task) => {
    const dueDateRaw = parseUtcDateTime(task.fechaLimite)
    
    // Si no tiene fecha, la mandamos a próximamente
    if (!dueDateRaw || Number.isNaN(dueDateRaw.getTime())) {
      proximamente.push(task)
      return
    }

    // Llevamos la fecha de la tarea a la medianoche para comparar manzanas con manzanas
    const dueDate = new Date(dueDateRaw.getFullYear(), dueDateRaw.getMonth(), dueDateRaw.getDate())

    if (dueDate < today) {
      // Opcional: Si no quieres que las completadas salgan como atrasadas, descomenta el if de abajo
      // if (task.estado.toLowerCase() !== 'completado' && task.estado.toLowerCase() !== 'finalizada') {
      atrasadas.push(task)
      // }
    } else if (dueDate.getTime() === today.getTime()) {
      hoy.push(task)
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      manana.push(task)
    } else {
      proximamente.push(task)
    }
  })

  const groups = []
  // Se agregan en el orden en que quieres que aparezcan en pantalla
  
  if (hoy.length > 0) groups.push({ title: t('tasks.group.today'), tasks: hoy })
  if (manana.length > 0) groups.push({ title: t('tasks.group.tomorrow'), tasks: manana })
  if (proximamente.length > 0) groups.push({ title: t('tasks.group.upcoming'), tasks: proximamente })
  if (atrasadas.length > 0) groups.push({ title: t('tasks.group.past'), tasks: atrasadas })

  return groups
})

const statusLabel = (status) => {
  const mapping = {
    'Por Hacer': t('tasks.status.todo'),
    'En Progreso': t('tasks.status.inProgress'),
    'Completado': t('tasks.status.completed'),
    'Finalizada': t('tasks.status.completed'),
  }
  return mapping[status] || status
}

// --- FUNCIONES DE NAVEGACIÓN Y ACCIONES ---
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
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (e) {
    console.error('Error al eliminar la tarea:', e)
    error.value = t('tasks.errorDelete')
  }
}

// --- HELPERS PARA CLASES TAILWIND ---
const statusPillClass = (status) => {
  const s = status?.toLowerCase() || ''
  if (s === "por hacer") return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
  if (s === "en progreso") return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
  if (s === "completado" || s === "finalizada") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
  return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
}

const priorityDotClass = (priority) => {
  const p = priority?.toLowerCase() || ''
  if (p === "alta") return "bg-red-500"
  if (p === "media") return "bg-amber-500"
  return "bg-emerald-500"
}

const effortDotClass = (effort) => {
  const e = effort?.toLowerCase() || ''
  if (e === "alto") return "bg-red-500"
  if (e === "medio") return "bg-amber-500"
  return "bg-emerald-500"
}

// --- CARGA INICIAL ---
onMounted(async () => {
  try {
    loading.value = true
    const data = await getTasks()
    
    tasks.value = data.map(task => ({
      ...task,
      id: task.idTarea 
    }))

  } catch (e) {
    error.value = t('tasks.errorLoading')
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Puedes dejar tu estilo CSS aquí si tienes algo adicional, 
   pero la mayoría del estilo ya está en las clases de Tailwind */
</style>