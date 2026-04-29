<template>
  <div class="task-page">
    <section class="task-card task-card--form">
      <div class="card-heading card-heading--center">
        <h1 class="card-title">Crear tarea</h1>
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

      if (field !== 'recordatorio' && (!value || value.toString().trim() === '')) {
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
    validateForm() {
      const fields = ['nombre', 'esfuerzo', 'prioridad', 'fechaLimite']
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
          fecha_limite: this.toUtcString(this.task.fechaLimite),
          descripcion: this.task.descripcion,
          icono: this.task.icono,
          recordatorio: this.toUtcString(this.task.recordatorio),
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
<style scoped src="../styles/create-task.css"></style>