<template>
  <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-950 font-display min-h-screen">
    <main class="px-4 pb-24 pt-4">
      <header class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Tareas</p>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">Tus tareas</h1>
        </div>
        <button
          type="button"
          @click="goToCreateTask"
          class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
          aria-label="Agregar tarea"
        >
          <span class="text-2xl">+</span>
        </button>
      </header>

      <section v-if="taskGroups.length === 0" class="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <p class="text-lg font-semibold text-slate-900 dark:text-slate-100">No hay tareas registradas</p>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Crea una nueva tarea para que aparezca aquí.</p>
      </section>

      <div class="space-y-8" v-else>
        <div v-for="group in taskGroups" :key="group.title">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">{{ group.title }}</h2>
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ group.tasks.length }} tareas</span>
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
                    <span>{{ task.icon }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ task.title }}</p>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ task.time }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100"
                    @click="goToEditTask(task.id)"
                  >
                    Editar
                  </button>
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                    :class="statusPillClass(task.status)"
                  >
                    {{ statusLabel(task.status) }}
                  </span>
                </div>
              </div>

              <p v-if="task.descripcion" class="mt-4 text-sm text-slate-600 dark:text-slate-300">{{ task.descripcion }}</p>

              <div class="mt-4 flex flex-col gap-3 text-sm">
                <div class="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span class="font-semibold">Estado:</span>
                  <div class="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-900">
                    <button
                      v-for="option in statusOptions"
                      :key="option.value"
                      type="button"
                      class="rounded-full px-3 py-1 text-[11px] font-semibold transition"
                      :class="task.status === option.value ? option.activeClass : option.inactiveClass"
                      @click="changeTaskStatus(task, option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-900">
                    <span class="h-2.5 w-2.5 rounded-full" :class="priorityDotClass(task.priority)"></span>
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-slate-900">
                    <span class="h-2.5 w-2.5 rounded-full" :class="effortDotClass(task.effort)"></span>
                    {{ effortLabel(task.effort) }}
                  </span>
                </div>
                <div class="mt-3 flex gap-2">
                  <button
                    type="button"
                    @click="goToEditTask(task.id)"
                    class="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    @click="deleteTask(task.id)"
                    class="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>

    <footer class="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
      <nav class="flex justify-around py-2">
        <button
          type="button"
          class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark"
          @click="goToDashboard"
        >
          <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
          </svg>
          <span class="text-xs font-medium">Inicio</span>
        </button>
        <button
          type="button"
          class="flex flex-col items-center gap-1 p-2 text-primary"
        >
          <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z" />
          </svg>
          <span class="text-xs font-medium">Tareas</span>
        </button>
        <button type="button" class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark">
          <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z" />
          </svg>
          <span class="text-xs font-medium">Enfoque</span>
        </button>
        <button type="button" class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark">
          <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
          </svg>
          <span class="text-xs font-medium">Bienestar</span>
        </button>
        <button type="button" class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark">
          <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z" />
          </svg>
          <span class="text-xs font-medium">Finanzas</span>
        </button>
      </nav>
      <div class="h-safe-bottom"></div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { deleteStoredTask, getStoredTasks, updateTaskStatus } from "../services/api";
import "../styles/dashboard.css";

const router = useRouter();
const allTasks = ref([]);
const taskGroups = ref([]);
const statusOptions = [
  {
    value: "todo",
    label: "Por hacer",
    activeClass: "bg-slate-900 text-white",
    inactiveClass: "bg-transparent text-slate-500 hover:bg-slate-200",
  },
  {
    value: "in-progress",
    label: "En progreso",
    activeClass: "bg-amber-500 text-white",
    inactiveClass: "bg-transparent text-amber-700 hover:bg-amber-100",
  },
  {
    value: "done",
    label: "Finalizada",
    activeClass: "bg-blue-500 text-white",
    inactiveClass: "bg-transparent text-slate-500 hover:bg-slate-100",
  },
];

function goToCreateTask() {
  router.push("/create-task");
}

function goToDashboard() {
  router.push("/dashboard");
}

function parseLocalDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value + "T00:00");
  }
  return new Date(value);
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function loadTasks() {
  const tasks = getStoredTasks();
  allTasks.value = tasks;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayTasks = [];
  const tomorrowTasks = [];
  const otherTasks = [];

  tasks.forEach((task) => {
    const dueDate = parseLocalDate(task.fechaLimite);
    if (!dueDate || Number.isNaN(dueDate.getTime())) {
      otherTasks.push(task);
      return;
    }

    if (isSameDay(dueDate, today)) {
      todayTasks.push(task);
    } else if (isSameDay(dueDate, tomorrow)) {
      tomorrowTasks.push(task);
    } else {
      otherTasks.push(task);
    }
  });

  const groups = [];
  if (todayTasks.length > 0) groups.push({ title: "Hoy", tasks: todayTasks });
  if (tomorrowTasks.length > 0) groups.push({ title: "Mañana", tasks: tomorrowTasks });
  if (otherTasks.length > 0) groups.push({ title: "Otros", tasks: otherTasks });

  taskGroups.value = groups;
}

function changeTaskStatus(task, status) {
  updateTaskStatus(task.id, status);
  loadTasks();
}

function deleteTask(taskId) {
  if (!confirm('¿Eliminar esta tarea?')) {
    return
  }
  deleteStoredTask(taskId);
  loadTasks();
}

function goToEditTask(taskId) {
  router.push({ path: "/create-task", query: { id: taskId } });
}

function statusLabel(status) {
  if (status === "todo") return "Por hacer";
  if (status === "in-progress") return "En progreso";
  return "Finalizada";
}

function statusPillClass(status) {
  if (status === "todo") {
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
  if (status === "in-progress") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }
  return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
}

function priorityLabel(priority) {
  if (priority === "alta") return "Prioridad Alta";
  if (priority === "media") return "Prioridad Media";
  return "Prioridad Baja";
}

function effortLabel(effort) {
  if (effort === "alto") return "Esfuerzo Alto";
  if (effort === "medio") return "Esfuerzo Medio";
  return "Esfuerzo Bajo";
}

function priorityDotClass(priority) {
  if (priority === "alta") return "bg-red-500";
  if (priority === "media") return "bg-amber-500";
  return "bg-emerald-500";
}

function effortDotClass(effort) {
  if (effort === "alto") return "bg-red-500";
  if (effort === "medio") return "bg-amber-500";
  return "bg-emerald-500";
}

onMounted(loadTasks);
</script>
