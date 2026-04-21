<template>
  <div class="task-page">
    <section class="task-card task-card--form">
      <div class="card-heading card-heading--center">
        <h1 class="card-title">Crear Tarea</h1>
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

        <div class="fields-grid fields-grid--wide">
          <div class="field-group">
            <label class="field-label required" for="fecha-limite">Fecha límite</label>
            <input
              id="fecha-limite"
              type="date"
              v-model="task.fechaLimite"
              @blur="touchField('fechaLimite')"
              :class="{ 'input-invalid': errors.fechaLimite }"
            />
            <p v-if="errors.fechaLimite" class="field-error">* {{ errors.fechaLimite }}</p>
          </div>

          <div class="field-group">
            <label class="field-label required" for="recordatorio">Recordatorio</label>
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

        <button type="submit" class="button-primary">Añadir Tarea</button>
      </form>
    </section>
  </div>
</template>

<script>
import { createTask } from '../services/api'
import { useToast } from 'vue-toastification'

export default {
  name: 'CreateTask',
  data() {
    return {
      task: {
        nombre: '',
        icono: '',
        esfuerzo: '',
        prioridad: '',
        descripcion: '',
        fechaLimite: '',
        recordatorio: '',
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
  methods: {
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
    validateField(field) {
      const value = this.task[field]

      if (!value || value.toString().trim() === '') {
        this.errors[field] = 'Este campo es obligatorio'
        return
      }

      if (field === 'nombre') {
        if (/\d/.test(value)) {
          this.errors.nombre = 'El nombre no puede contener números'
          return
        }
      }

      this.errors[field] = ''
    },
    validateForm() {
      const fields = ['nombre', 'esfuerzo', 'prioridad', 'fechaLimite', 'recordatorio']
      fields.forEach((field) => {
        this.touched[field] = true
        this.validateField(field)
      })
      return fields.every((field) => !this.errors[field])
    },
    async crearTarea() {
      if (!this.validateForm()) {
        return
      }

      try {
        const data = await createTask({
          titulo: this.task.nombre,
          prioridad: this.task.prioridad,
          nivel_esfuerzo: this.task.esfuerzo,
          fecha_limite: this.task.fechaLimite,
          descripcion: this.task.descripcion,
          icono: this.task.icono,
          recordatorio: this.task.recordatorio,
        })

        this.toast.success('Tarea generada con éxito', {
          position: 'top-right',
          timeout: 4000,
        })
        console.log(data)

        this.task = {
          nombre: '',
          icono: '',
          esfuerzo: '',
          prioridad: '',
          descripcion: '',
          fechaLimite: '',
          recordatorio: '',
        }
        this.errors = {
          nombre: '',
          esfuerzo: '',
          prioridad: '',
          fechaLimite: '',
          recordatorio: '',
        }
        this.touched = {
          nombre: false,
          esfuerzo: false,
          prioridad: false,
          fechaLimite: false,
          recordatorio: false,
        }
      } catch (error) {
        console.error(error)
        const message = error?.response?.data?.message || error?.message || 'Error al crear la tarea'
        alert(message)
      }
    },
  },
}
</script>

<style scoped>
.task-page {
  max-width: 540px;
  margin: 0 auto;
  padding: 24px 16px 32px;
  background: #f3f4f6;
  min-height: 100vh;
  font-family: Inter, Arial, sans-serif;
}

.task-page__header {
  margin-bottom: 18px;
}

.section-label {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.task-page h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  color: #111827;
}

.task-card {
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 20px;
  margin-bottom: 18px;
}

.task-card--form {
  padding: 24px 22px 22px;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.card-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
}

.card-subtitle {
  margin: 8px 0 0;
  font-size: 0.95rem;
  color: #6b7280;
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

.field-help {
  color: #6b7280;
  font-size: 0.9rem;
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

.priority-alta {
  border-color: #fca5a5;
}

.priority-alta.active {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}

.priority-media {
  border-color: #facc15;
}

.priority-media.active {
  background: #fef3c7;
  border-color: #facc15;
  color: #b45309;
}

.priority-baja {
  border-color: #86efac;
}

.priority-baja.active {
  background: #dcfce7;
  border-color: #86efac;
  color: #047857;
}

.effort-alto {
  border-color: #fca5a5;
}

.effort-alto.active {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #b91c1c;
}

.effort-medio {
  border-color: #facc15;
}

.effort-medio.active {
  background: #fef3c7;
  border-color: #facc15;
  color: #b45309;
}

.effort-bajo {
  border-color: #86efac;
}

.effort-bajo.active {
  background: #dcfce7;
  border-color: #86efac;
  color: #047857;
}

.fields-grid {
  display: grid;
  gap: 16px;
}

.fields-grid--wide {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
}

.button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.25);
}

.task-section {
  margin-top: 10px;
}

.section-header {
  margin-bottom: 10px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-top-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.task-icon {
  width: 44px;
  height: 44px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #eff6ff;
  font-size: 1.25rem;
}

.task-title-group {
  flex: 1;
}

.task-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.task-time {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.task-details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.priority-badge {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.priority--high {
  background: #dc2626;
}

.priority--medium {
  background: #f59e0b;
}

.priority--low {
  background: #10b981;
}

.effort-meter {
  display: flex;
  align-items: center;
  gap: 6px;
}

.effort-segment {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: #d1d5db;
}

.effort-segment--active {
  background: #2563eb;
}

.effort-label {
  color: #6b7280;
  font-size: 0.82rem;
}

@media (max-width: 520px) {
  .fields-grid--wide {
    grid-template-columns: 1fr;
  }
}
</style>