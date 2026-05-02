<template>
  <div class="task-page">
    <section class="task-card task-card--form">
      <div class="card-heading card-heading--center">
        <h1 class="card-title">Crear tarea</h1>
      </div>

      <form @submit.prevent="crearTarea" class="task-form">
        <div
          style="
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            flex-wrap: wrap;
          "
        >
          <div
            class="field-group"
            style="flex: 2; min-width: 250px; margin-bottom: 0"
          >
            <label class="field-label required" for="task-name"
              >Nombre de la tarea</label
            >
            <div class="input-icon-row">
              <div class="emoji-avatar">{{ task.icono || "😊" }}</div>
              <input
                id="task-name"
                v-model="task.nombre"
                @blur="touchField('nombre')"
                :class="{ 'input-invalid': errors.nombre }"
                type="text"
                placeholder="Ej. Preparar la presentación"
              />
            </div>
            <p v-if="errors.nombre" class="field-error">
              * {{ errors.nombre }}
            </p>
          </div>

          <div
            class="field-group"
            style="flex: 1; min-width: 150px; margin-bottom: 0"
          >
            <label class="field-label required" for="estado">Estado</label>
            <select
              id="estado"
              v-model="task.estado"
              style="
                width: 100%;
                height: 48px;
                padding: 0 1rem;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: white;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
              "
            >
              <option value="Por Hacer">Por Hacer</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom: 1.5rem"></div>

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
          <p v-if="errors.prioridad" class="field-error">
            * {{ errors.prioridad }}
          </p>
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
          <p v-if="errors.esfuerzo" class="field-error">
            * {{ errors.esfuerzo }}
          </p>
        </div>

        <div class="fields-grid fields-grid--wide">
          <div class="field-group">
            <label class="field-label required" for="fecha-limite"
              >Fecha límite</label
            >
            <input
              id="fecha-limite"
              type="datetime-local"
              v-model="task.fechaLimite"
              @blur="touchField('fechaLimite')"
              :class="{ 'input-invalid': errors.fechaLimite }"
            />
            <p v-if="errors.fechaLimite" class="field-error">
              * {{ errors.fechaLimite }}
            </p>
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
            <p v-if="errors.recordatorio" class="field-error">
              * {{ errors.recordatorio }}
            </p>
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
import { createTask, updateTask } from "../services/api";
import { useToast } from "vue-toastification";

export default {
  name: "CreateTask",
  data() {
    return {
      taskId: null,
      isEditing: false,
      task: {
        nombre: "",
        icono: "",
        esfuerzo: "",
        prioridad: "",
        descripcion: "",
        fechaLimite: "",
        recordatorio: "",
        estado: "Por Hacer",
      },
      emojiOptions: ["😊", "💡", "🔥", "🎯", "🧠", "⭐"],
      errors: {
        nombre: "",
        esfuerzo: "",
        prioridad: "",
        fechaLimite: "",
        recordatorio: "",
      },
      touched: {
        nombre: false,
        esfuerzo: false,
        prioridad: false,
        fechaLimite: false,
        recordatorio: false,
      },
      toast: useToast(),
    };
  },
  created() {
    const editingTask = sessionStorage.getItem("editingTask");
    if (editingTask) {
      const task = JSON.parse(editingTask);

      this.taskId = task.idTarea || task.id;
      this.isEditing = true;

      this.task = {
        nombre: task.titulo || "",
        icono: task.icono || "",
        esfuerzo: task.nivelEsfuerzo ? task.nivelEsfuerzo.toLowerCase() : "",
        prioridad: task.prioridad ? task.prioridad.toLowerCase() : "",
        descripcion: task.descripcion || "",
        estado: task.estado || "Por Hacer",
        fechaLimite: task.fechaLimite
          ? this.formatDateForInput(task.fechaLimite)
          : "",
        recordatorio: task.recordatorio
          ? this.formatDateForInput(task.recordatorio)
          : "",
      };

      this.$nextTick(() => {
        const titleEl = document.querySelector(".card-title");
        const btnEl = document.querySelector(".button-primary");
        if (titleEl) titleEl.textContent = "Editar tarea";
        if (btnEl) btnEl.textContent = "Actualizar Tarea";
      });

      sessionStorage.removeItem("editingTask");
    }
  },
  methods: {
    parseUtcDateTime(dateString) {
      if (!dateString) return null;
      if (dateString.includes("Z") || dateString.includes("+")) {
        return new Date(dateString);
      }
      return new Date(dateString.replace(" ", "T") + "Z");
    },
    formatDateForInput(dateString) {
      const date = this.parseUtcDateTime(dateString);
      if (!date || isNaN(date)) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    toUtcString(value) {
      if (!value) return "";
      const [date, time] = value.split("T");
      if (!date || !time) return "";
      const dateParts = date.split("-").map(Number);
      const timeParts = time.split(":").map(Number);
      return new Date(
        dateParts[0],
        dateParts[1] - 1,
        dateParts[2],
        timeParts[0],
        timeParts[1] || 0,
        timeParts[2] || 0,
      ).toISOString();
    },
    touchField(field) {
      this.touched[field] = true;
      this.validateField(field);
    },
    selectEmoji(emoji) {
      this.task.icono = emoji;
    },
    selectPriority(value) {
      this.task.prioridad = value;
      this.touchField("prioridad");
    },
    selectEffort(value) {
      this.task.esfuerzo = value;
      this.touchField("esfuerzo");
    },
    validateField(field) {
      const value = this.task[field];
      if (
        field !== "recordatorio" &&
        (!value || value.toString().trim() === "")
      ) {
        this.errors[field] = "Este campo es obligatorio";
        return;
      }
      this.errors[field] = "";
    },
    validateForm() {
      const fields = ["nombre", "esfuerzo", "prioridad", "fechaLimite"];
      fields.forEach((field) => {
        this.touched[field] = true;
        this.validateField(field);
      });
      return fields.every((field) => !this.errors[field]);
    },
    async crearTarea() {
      if (!this.validateForm()) return;

      try {
        if (this.isEditing && this.taskId) {
          const updatePayload = {
            idTarea: this.taskId,
            titulo: this.task.nombre,
            descripcion: this.task.descripcion,
            prioridad: this.task.prioridad,
            nivelEsfuerzo: this.task.esfuerzo,
            estado: this.task.estado,
            fechaLimite: this.toUtcString(this.task.fechaLimite),
          };
          await updateTask(this.taskId, updatePayload);
          this.toast.success("Tarea actualizada con éxito", {
            position: "top-right",
            timeout: 4000,
          });
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
          };
          await createTask(createPayload);
          this.toast.success("Tarea generada con éxito", {
            position: "top-right",
            timeout: 2000,
          });
        }

        // --- CAMBIO AQUÍ ---
        // Eliminamos el IF y redirigimos siempre después del éxito
        this.$router.push("/tasks");
      } catch (error) {
        console.error(error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Error al procesar la tarea";
        alert(message);
      }
    },
  },
};
</script>
<style scoped src="../styles/create-task.css"></style>
