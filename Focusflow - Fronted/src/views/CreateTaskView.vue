<template>
  <div class="task-page-container">
    <div class="task-page">
      <section class="task-card task-card--form">
        <div class="card-heading">
          <!-- Botón de Atrás agregado aquí -->
          <button @click="goBack" class="back-button" aria-label="Volver a tareas">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="card-title">{{ isEditing ? 'Editar Tarea' : 'Crear Tarea' }}</h1>
          <!-- Div vacío para mantener el título centrado (flexbox) -->
          <div style="width: 40px;"></div> 
        </div>

        <form @submit.prevent="crearTarea" class="task-form">
          <div class="field-group">
            <label class="field-label required" for="task-name">Nombre de la tarea</label>
            <div class="input-icon-row">
              <div class="emoji-avatar">{{ task.icono || '😊' }}</div>
              <input
                id="task-name"
                v-model="task.nombre"
                @blur="touchField('nombre')"
                :class="{ 'input-invalid': errors.nombre }"
                type="text"
                placeholder="Ej. Preparar la presentación"
              />
            </div>
            <p v-if="errors.nombre" class="field-error">* {{ errors.nombre }}</p>
          </div>

          <div class="field-group">
            <div class="field-label">Emoji</div>
            <div class="emoji-picker">
              <button
                v-for="emoji in emojiOptions"
                :key="emoji"
                type="button"
                class="emoji-button"
                :class="{ active: task.icono === emoji }"
                @click="selectEmoji(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
          </div>

          <div class="field-group">
            <div class="field-label required">Prioridad</div>
            <div class="button-group">
              <button
                type="button"
                class="option-button priority-alta"
                :class="{ active: task.prioridad === 'alta' }"
                @click="selectPriority('alta')"
              >
                Alta
              </button>
              <button
                type="button"
                class="option-button priority-media"
                :class="{ active: task.prioridad === 'media' }"
                @click="selectPriority('media')"
              >
                Media
              </button>
              <button
                type="button"
                class="option-button priority-baja"
                :class="{ active: task.prioridad === 'baja' }"
                @click="selectPriority('baja')"
              >
                Baja
              </button>
            </div>
            <p v-if="errors.prioridad" class="field-error">* {{ errors.prioridad }}</p>
          </div>

          <div class="field-group">
            <div class="field-label required">Esfuerzo</div>
            <div class="button-group">
              <button
                type="button"
                class="option-button effort-alto"
                :class="{ active: task.esfuerzo === 'alto' }"
                @click="selectEffort('alto')"
              >
                Alto
              </button>
              <button
                type="button"
                class="option-button effort-medio"
                :class="{ active: task.esfuerzo === 'medio' }"
                @click="selectEffort('medio')"
              >
                Medio
              </button>
              <button
                type="button"
                class="option-button effort-bajo"
                :class="{ active: task.esfuerzo === 'bajo' }"
                @click="selectEffort('bajo')"
              >
                Bajo
              </button>
            </div>
            <p v-if="errors.esfuerzo" class="field-error">* {{ errors.esfuerzo }}</p>
          </div>

          <div class="field-group">
            <div class="field-label required">Estado</div>
            <div class="button-group status-group">
              <button
                type="button"
                class="option-button status-por-hacer"
                :class="{ active: task.estado === 'Por Hacer' }"
                @click="selectStatus('Por Hacer')"
              >
                Por Hacer
              </button>
              <button
                type="button"
                class="option-button status-en-progreso"
                :class="{ active: task.estado === 'En Progreso' }"
                @click="selectStatus('En Progreso')"
              >
                En Progreso
              </button>
              <button
                type="button"
                class="option-button status-completado"
                :class="{ active: task.estado === 'Completado' }"
                @click="selectStatus('Completado')"
              >
                Completado
              </button>
            </div>
          </div>

          <div class="fields-grid fields-grid--wide">
            <div class="field-group">
              <label class="field-label required" for="fecha-limite">Fecha límite</label>
              <input
                id="fecha-limite"
                type="datetime-local"
                v-model="task.fechaLimite"
                @blur="touchField('fechaLimite')"
                :class="{ 'input-invalid': errors.fechaLimite }"
              />
              <p v-if="errors.fechaLimite" class="field-error">* {{ errors.fechaLimite }}</p>
            </div>

            <div class="field-group">
              <label class="field-label" for="recordatorio">Recordatorio</label>
              <input
                id="recordatorio"
                type="datetime-local"
                v-model="task.recordatorio"
                @blur="touchField('recordatorio')"
                :class="{ 'input-invalid': errors.recordatorio }"
              />
              <p v-if="errors.recordatorio" class="field-error">* {{ errors.recordatorio }}</p>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label" for="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              v-model="task.descripcion"
              placeholder="Añade más detalles sobre la tarea..."
              rows="4"
            ></textarea>
          </div>

          <button type="submit" class="button-primary">{{ isEditing ? 'Actualizar Tarea' : 'Añadir Tarea' }}</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import { createTask, updateTask } from '../services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'CreateTask',
  data() {
    return {
      taskId: null,
      isEditing: false,
      task: {
        nombre: '',
        icono: '',
        esfuerzo: '',
        prioridad: '',
        descripcion: '',
        fechaLimite: '',
        recordatorio: '',
        estado: 'Por Hacer',
      },
      emojiOptions: ['😊', '💡', '🔥', '🎯', '🧠', '⭐'],
      errors: {
        nombre: '',
        esfuerzo: '',
        prioridad: '',
        fechaLimite: '',
        recordatorio: '',
      },
      touched: {
        nombre: false,
        esfuerzo: false,
        prioridad: false,
        fechaLimite: false,
        recordatorio: false,
      },
      toast: useToast(),
    }
  },
  created() {
    const editingTask = sessionStorage.getItem('editingTask')
    if (editingTask) {
      const task = JSON.parse(editingTask)

      this.taskId = task.idTarea || task.id
      this.isEditing = true

      this.task = {
        nombre: task.titulo || '',
        icono: task.icono || '',
        esfuerzo: task.nivelEsfuerzo ? task.nivelEsfuerzo.toLowerCase() : '',
        prioridad: task.prioridad ? task.prioridad.toLowerCase() : '',
        descripcion: task.descripcion || '',
        estado: task.estado || 'Por Hacer',
        fechaLimite: task.fechaLimite ? this.formatDateForInput(task.fechaLimite) : '',
        recordatorio: task.recordatorio ? this.formatDateForInput(task.recordatorio) : '',
      }

      sessionStorage.removeItem('editingTask')
    }
  },
  methods: {
    parseUtcDateTime(dateString) {
      if (!dateString) return null
      if (dateString.includes('Z') || dateString.includes('+')) {
        return new Date(dateString)
      }
      return new Date(dateString.replace(' ', 'T') + 'Z')
    },
    formatDateForInput(dateString) {
      const date = this.parseUtcDateTime(dateString)
      if (!date || isNaN(date)) return ''

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    toUtcString(value) {
      if (!value) return ''
      const [date, time] = value.split('T')
      if (!date || !time) return ''
      const dateParts = date.split('-').map(Number)
      const timeParts = time.split(':').map(Number)
      return new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1] || 0,
        timeParts[2] || 0
      ).toISOString()
    },
    touchField(field) {
      this.touched[field] = true
      this.validateField(field)
    },
    selectEmoji(emoji) {
      this.task.icono = emoji
    },
    selectPriority(value) {
      this.task.prioridad = value
      this.touchField('prioridad')
    },
    selectEffort(value) {
      this.task.esfuerzo = value
      this.touchField('esfuerzo')
    },
    selectStatus(value) {
      this.task.estado = value
    },
    validateField(field) {
      const value = this.task[field]
      if (field !== 'recordatorio' && (!value || value.toString().trim() === '')) {
        this.errors[field] = 'Este campo es obligatorio'
        return
      }
      this.errors[field] = ''
    },
    validateForm() {
      const fields = ['nombre', 'esfuerzo', 'prioridad', 'fechaLimite']
      fields.forEach((field) => {
        this.touched[field] = true
        this.validateField(field)
      })
      return fields.every((field) => !this.errors[field])
    },
    async crearTarea() {
      if (!this.validateForm()) return

      try {
        if (this.isEditing && this.taskId) {
          const updatePayload = {
            idTarea: this.taskId,
            titulo: this.task.nombre,
            descripcion: this.task.descripcion,
            prioridad: this.task.prioridad,
            nivelEsfuerzo: this.task.esfuerzo,
            estado: this.task.estado,
            fechaLimite: this.toUtcString(this.task.fechaLimite)
          }
          await updateTask(this.taskId, updatePayload)
          this.toast.success('Tarea actualizada con éxito', { position: 'top-right', timeout: 4000 })
        } else {
          const createPayload = {
            titulo: this.task.nombre,
            prioridad: this.task.prioridad,
            nivel_esfuerzo: this.task.esfuerzo,
            estado: this.task.estado,
            fecha_limite: this.toUtcString(this.task.fechaLimite),
            descripcion: this.task.descripcion,
            icono: this.task.icono,
            recordatorio: this.toUtcString(this.task.recordatorio),
          }
          await createTask(createPayload)
          this.toast.success('Tarea generada con éxito', { position: 'top-right', timeout: 2000 })
        }

        this.$router.push('/tasks')
      } catch (error) {
        console.error(error)
        const message = error?.response?.data?.message || error?.message || 'Error al procesar la tarea'
        alert(message)
      }
    },
    // Nueva función para el botón de retroceso
    goBack() {
      this.$router.push('/tasks')
    }
  },
}
</script>

<style scoped>
/* Contenedor principal para fondo en PC */
.task-page-container {
  min-height: 100vh;
  background-color: #f3f4f6; /* Fondo base para móvil */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Manrope', sans-serif;
}

/* Efectos para PC: Centrado y fondo más elaborado */
@media (min-width: 768px) {
  .task-page-container {
    padding: 40px 20px;
    /* Fondo opcional para PC: un degradado suave o color sólido */
    background: linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%);
    align-items: center; /* Centrar verticalmente en PC */
  }
  
  .task-card {
    /* Efecto "glass" sutil para resaltar la tarjeta */
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0,0,0,0.05) !important;
  }
}

.task-page {
  width: 100%;
  max-width: 600px; /* Un poco más ancho para respirar mejor en PC */
  padding: 0; /* Quitamos padding aquí, se lo damos al contenedor y la tarjeta */
}

/* Ajustes para la tarjeta en móvil */
@media (max-width: 767px) {
  .task-page {
    padding: 16px;
  }
  .task-card {
    border-radius: 20px; /* Bordes un poco menos pronunciados en móvil */
  }
}

.task-card {
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  padding: 24px 22px;
  margin-bottom: 0; /* Quitamos el margen inferior porque ya no hay footer */
  width: 100%;
  box-sizing: border-box;
}

/* Nuevo estilo para la cabecera con botón de atrás */
.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribuye el espacio entre botón, título y espacio vacío */
  margin-bottom: 24px;
}

.back-button {
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4b5563;
  transition: background-color 0.2s, color 0.2s;
}

.back-button:hover {
  background: #e5e7eb;
  color: #111827;
}

.card-title {
  margin: 0;
  font-size: 1.5rem; /* Un poco más pequeño para acomodar el botón */
  font-weight: 800;
  color: #111827;
  text-align: center;
}

.task-form {
  display: grid;
  gap: 20px;
}

.field-group {
  display: grid;
  gap: 10px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.field-label.required::after {
  content: '*';
  color: #dc2626;
  font-size: 1rem;
  margin-left: 4px;
}

.input-icon-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: center;
}

.emoji-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: #eff6ff;
  font-size: 1.65rem;
  color: #2563eb;
  border: 1px solid #d1d5db;
}

.emoji-picker {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.emoji-button {
  appearance: none;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  border-radius: 18px;
  padding: 14px 0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.emoji-button:hover,
.emoji-button.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.input-invalid {
  border-color: #dc2626;
}

input,
select,
textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 0.95rem;
  border: 1px solid #d1d5db;
  border-radius: 18px;
  background: #f9fafb;
  color: #111827;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.field-error {
  margin: 0;
  color: #dc2626;
  font-size: 0.85rem;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.option-button {
  padding: 16px 0;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-weight: 700;
  color: #1f2937;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.option-button:hover {
  transform: translateY(-1px);
}

.option-button.active {
  color: #0f172a;
  border-width: 2px;
}

/* Colores de Prioridad */
.priority-alta { border-color: #fca5a5; }
.priority-alta.active { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

.priority-media { border-color: #facc15; }
.priority-media.active { background: #fef3c7; border-color: #facc15; color: #b45309; }

.priority-baja { border-color: #86efac; }
.priority-baja.active { background: #dcfce7; border-color: #86efac; color: #047857; }

/* Colores de Esfuerzo */
.effort-alto { border-color: #fca5a5; }
.effort-alto.active { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

.effort-medio { border-color: #facc15; }
.effort-medio.active { background: #fef3c7; border-color: #facc15; color: #b45309; }

.effort-bajo { border-color: #86efac; }
.effort-bajo.active { background: #dcfce7; border-color: #86efac; color: #047857; }

/* Colores de Estado */
.status-por-hacer { border-color: #93c5fd; }
.status-por-hacer.active { background: #eff6ff; border-color: #60a5fa; color: #1d4ed8; }

.status-en-progreso { border-color: #fde047; }
.status-en-progreso.active { background: #fef9c3; border-color: #facc15; color: #a16207; }

.status-completado { border-color: #86efac; }
.status-completado.active { background: #dcfce7; border-color: #4ade80; color: #15803d; }

/* Grilla para las fechas */
.fields-grid--wide {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.fields-grid--wide .field-group {
  flex: 1 1 240px;
  min-width: 0;
}

.button-primary {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 9999px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 10px;
}

.button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.25);
}
</style>