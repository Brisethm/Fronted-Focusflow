<template>
  <div class="focus-root">
    <!-- Header -->
    <header class="header">
      <button class="icon-btn">
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </svg>
      </button>
      <h1 class="header-title">Sesión de Enfoque</h1>
    </header>

    <!-- Mode Selector -->
    <div class="mode-bar-wrap">
      <div class="mode-bar">
        <button v-for="m in modeKeys" :key="m" class="mode-pill" :class="{ active: mode === m }"
          :style="mode === m ? { background: MODES[m].color } : {}" @click="switchMode(m)">{{ m }}</button>
      </div>
    </div>

    <!-- Timer -->
    <div class="timer-section">
      <div class="timer-wrap">
        <svg viewBox="0 0 120 120" class="timer-svg">
          <circle cx="60" cy="60" r="54" fill="none" class="ring-bg" stroke-width="10" />
          <circle cx="60" cy="60" r="54" fill="none" :stroke="accent" stroke-width="10" stroke-linecap="round"
            :stroke-dasharray="CIRCUMFERENCE" :stroke-dashoffset="dashOffset" class="ring-fg"
            :style="{ transition: running ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease' }" />
          <circle cx="60" cy="60" r="46" fill="transparent"
            :style="{ fill: accent, opacity: completed ? 0.08 : 0.04 }" />
        </svg>

        <div class="timer-inner">
          <template v-if="completed">
            <div class="completed-badge fade-in">
              <span class="done-icon">✅</span>
              <p class="done-label" :style="{ color: accent }">¡Completado!</p>
            </div>
          </template>
          <template v-else>
            <span class="timer-digits">{{ formatTime(secondsLeft) }}</span>
            <span class="timer-sub">
              <span v-if="running" class="pulse">{{ MODES[mode].label }} activo</span>
              <span v-else>Sesión de {{ MODES[mode].label }}</span>
            </span>
          </template>
        </div>
      </div>

      <!-- Action rows -->
      <div class="actions">
        <!-- Link task -->
        <button class="action-row" :style="linkedTask ? { background: '#ffffff', borderColor: accent } : {}"
          @click="showTaskModal = true">
          <div class="action-left">
            <div class="action-icon" :style="{ background: linkedTask ? '#ffffff' : 'var(--surface)' }">
              <svg width="22" height="22" :fill="linkedTask ? accent : 'var(--muted)'" viewBox="0 0 256 256">
                <path
                  d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </div>
            <div class="action-text">
              <p class="action-title" style="color: var(--text);">
                {{ linkedTask ? linkedTask.titulo : 'Vincular tarea' }}
              </p>
              <p v-if="linkedTask" class="action-sub">{{ linkedTask.categoria }}</p>
            </div>
          </div>
          <svg width="16" height="16" fill="var(--muted)" viewBox="0 0 256 256">
            <path
              d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>

        <!-- Adjust time -->
        <button class="action-row" @click="openTimeModal">
          <div class="action-left">
            <div class="action-icon">
              <svg width="18" height="18" fill="var(--muted)" viewBox="0 0 256 256">
                <path
                  d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z" />
              </svg>
            </div>
            <p class="action-title">Ajustar tiempo</p>
          </div>
          <span class="action-badge" :style="{ color: accent }">{{ minutes }} min</span>
        </button>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div class="bottom-controls">
      <template v-if="completed">
        <div class="btn-row fade-in">
          <button class="btn-ghost" @click="handleReset">Nueva sesión</button>
          <button class="btn-main" :style="{ background: saved ? '#10b981' : accent, opacity: saving ? 0.7 : 1 }"
            :disabled="saving || saved" @click="handleSaveSession">
            {{ saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar sesión' }}
          </button>
        </div>
      </template>
      <template v-else>
        <div class="btn-row">
          <button v-if="running || secondsLeft < totalSeconds" class="btn-ghost btn-icon" @click="handleReset">
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 256 256">
              <path
                d="M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.17A80,80,0,1,0,207.6,136H184a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8Z" />
            </svg>
          </button>
          <button class="btn-main" :style="{
            background: running ? 'var(--surface)' : accent,
            color: running ? 'var(--text)' : '#fff',
            boxShadow: running ? 'none' : `0 4px 20px ${accent}40`
          }" @click="handleStart">
            <template v-if="running">
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z" />
              </svg>
              Pausar
            </template>
            <template v-else>
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,216.13V39.87L232,128Z" />
              </svg>
              {{ secondsLeft < totalSeconds ? 'Reanudar' : 'Iniciar sesión' }} </template>
          </button>
        </div>
      </template>
    </div>
    <FooterNav />

    <!-- Task Modal -->
    <Transition name="sheet">
      <div v-if="showTaskModal" class="overlay" @click.self="showTaskModal = false">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <h2 class="sheet-title">Vincular tarea</h2>
          <input v-model="taskSearch" class="search-input" placeholder="Buscar tarea..." autofocus />
          <div class="task-list">
            <div v-if="filteredTasks.length === 0" class="task-empty">No hay tareas que coincidan</div>
            <button v-for="task in filteredTasks" :key="task.id" class="task-item"
              :class="{ selected: linkedTask?.id === task.id }" @click="selectTask(task)">
              <div class="task-dot"
                :style="{ background: linkedTask?.id === task.id ? accent : 'var(--border-solid)' }">
              </div>
              <div class="task-info">
                <p class="task-name">{{ task.titulo }}</p>
                <p class="task-cat">{{ task.categoria }}</p>
              </div>
              <svg v-if="linkedTask?.id === task.id" width="16" height="16" :fill="accent" viewBox="0 0 256 256">
                <path
                  d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
              </svg>
            </button>
          </div>
          <button v-if="linkedTask" class="btn-ghost btn-full" style="margin-top: 12px; color: #ef4444;"
            @click="linkedTask = null; showTaskModal = false">Quitar vínculo</button>
        </div>
      </div>
    </Transition>

    <!-- Time Adjust Modal -->
    <Transition name="sheet">
      <div v-if="showTimeModal" class="overlay" @click.self="showTimeModal = false">
        <div class="sheet">
          <div class="sheet-handle"></div>
          <h2 class="sheet-title">Ajustar tiempo</h2>

          <div class="time-display" :style="{ color: accent }">
            {{ pendingMinutes }} <span class="time-unit">min</span>
          </div>

          <input type="range" class="range-slider" :style="{ accentColor: accent }" min="5" max="120" step="5"
            v-model.number="pendingMinutes" />
          <div class="range-labels">
            <span>5 min</span><span>120 min</span>
          </div>

          <div class="preset-grid">
            <button v-for="p in presets" :key="p" class="preset-btn" :class="{ 'preset-active': pendingMinutes === p }"
              :style="pendingMinutes === p ? { background: accent, color: '#fff', borderColor: accent } : {}"
              @click="pendingMinutes = p">{{ p }}m</button>
          </div>

          <button class="btn-main btn-full" :style="{ background: accent }" @click="applyTime">Aplicar</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { getTasks, createFocusSession } from "../services/api.js";
import FooterNav from "../components/FooterNav.vue";
// ──────────────────────────────────────────────────────────────────────────

const CIRCUMFERENCE = 2 * Math.PI * 54

const MODES = {
  Pomodoro: { label: 'Pomodoro', defaultMin: 25, color: '#ef4444' },
  Timeboxing: { label: 'Timeboxing', defaultMin: 45, color: '#13a4ec' },
  Descanso: { label: 'Descanso', defaultMin: 5, color: '#10b981' },
}
const modeKeys = Object.keys(MODES)
const presets = [5, 15, 25, 30, 45, 60, 90]

// State
const mode = ref('Timeboxing')
const minutes = ref(MODES['Timeboxing'].defaultMin)
const totalSeconds = ref(minutes.value * 60)
const secondsLeft = ref(totalSeconds.value)
const running = ref(false)
const completed = ref(false)
const linkedTask = ref(null)
const tasks = ref([])
const taskSearch = ref('')
const showTaskModal = ref(false)
const showTimeModal = ref(false)
const pendingMinutes = ref(minutes.value)
const saving = ref(false)
const saved = ref(false)
let timer = null

// Computed
const accent = computed(() => MODES[mode.value].color)
const dashOffset = computed(() =>
  CIRCUMFERENCE * (1 - (totalSeconds.value > 0 ? secondsLeft.value / totalSeconds.value : 0))
)
const filteredTasks = computed(() =>
  tasks.value.filter(t => t.titulo.toLowerCase().includes(taskSearch.value.toLowerCase()))
)

// Load tasks
getTasks().then(data => { tasks.value = data })

// Helpers
function pad(n) { return String(n).padStart(2, '0') }
function formatTime(s) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}` }

function clearTimer() { if (timer) { clearInterval(timer); timer = null } }


function startTimer() {
  clearTimer()
  timer = setInterval(() => {
    if (secondsLeft.value <= 1) {
      secondsLeft.value = 0
      clearTimer()

      const campana = new Audio('https://actions.google.com/sounds/v1/alarms/ding.ogg')
      campana.play().catch(err => console.log('El navegador bloqueó el audio:', err))

      if (mode.value !== 'Descanso') {
        createFocusSession({
          duracionMinutos: minutes.value,
          tipo: mode.value,
          fecha: new Date().toISOString(),
        }).catch(err => console.error("Error al guardar la sesión:", err))

        switchMode('Descanso')
      } else {
        running.value = false
        completed.value = true
      }
    } else {
      secondsLeft.value--
    }
  }, 1000)
}

function switchMode(m) {
  // 1. Si haces clic en el modo que ya está activo, no hace nada
  if (mode.value === m) return

  // 2. Si el tiempo es menor al total y no ha terminado, significa que hay una sesión en curso
  if (secondsLeft.value < totalSeconds.value && !completed.value) {
    const confirmar = confirm("Tienes una sesión en curso. ¿Seguro que quieres cambiar de modo y reiniciar el tiempo?");
    if (!confirmar) return; // Si le das a cancelar, la función se detiene y no se restablece nada
  }

  // 3. Si no hay sesión en curso (o confirmaste el cambio), se hace el cambio normal
  clearTimer()
  mode.value         = m
  minutes.value      = MODES[m].defaultMin
  totalSeconds.value = minutes.value * 60
  secondsLeft.value  = totalSeconds.value
  running.value      = false
  completed.value    = false
  saved.value        = false
}

function handleStart() {
  if (completed.value) return
  if (running.value) {
    clearTimer()
    running.value = false
  } else {
    running.value = true
    startTimer()
  }
}

function handleReset() {
  clearTimer()
  running.value = false
  completed.value = false
  saved.value = false
  secondsLeft.value = minutes.value * 60
  totalSeconds.value = minutes.value * 60
}

function openTimeModal() {
  pendingMinutes.value = minutes.value
  showTimeModal.value = true
}

function applyTime() {
  clearTimer()
  minutes.value = pendingMinutes.value
  totalSeconds.value = pendingMinutes.value * 60
  secondsLeft.value = totalSeconds.value
  running.value = false
  completed.value = false
  saved.value = false
  showTimeModal.value = false
}

function selectTask(task) {
  linkedTask.value = task
  showTaskModal.value = false
  taskSearch.value = ''
}

async function handleSaveSession() {
  saving.value = true
  try {
    await createFocusSession({
      duracionMinutos: minutes.value,
      tipo: mode.value,
      fecha: new Date().toISOString(),
    })
    saved.value = true
  } finally {
    saving.value = false
  }
}

onUnmounted(clearTimer)

</script>

<style src="../styles/focus.css"></style>