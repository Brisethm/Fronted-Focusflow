<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div class="flex flex-col min-h-screen justify-between">
      <main class="flex-grow">
        <header class="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
          <button class="text-content-light dark:text-content-dark" type="button" aria-label="Abrir menu">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
            </svg>
          </button>
          <h1 class="text-lg font-bold text-content-light dark:text-content-dark">Resumen</h1>
          <button class="text-content-light dark:text-content-dark" type="button" aria-label="Configuracion">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
            </svg>
          </button>
        </header>

        <div class="px-4 pb-8 space-y-6">
          <section class="p-4 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 class="text-xl font-bold text-content-light dark:text-content-dark">Como te sientes hoy?</h2>
                <p class="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                  Registra tu energia y tu estado emocional para seguir tu bienestar.
                </p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="saveStatusClass">
                {{ saveStatus }}
              </span>
            </div>

            <form class="space-y-6" @submit.prevent="saveEmotionalRecord">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block font-medium text-content-light dark:text-content-dark" for="energy-level">
                    Nivel de energia
                  </label>
                  <span class="text-sm font-semibold text-primary">{{ energy }}</span>
                </div>
                <div class="relative">
                  <input
                    id="energy-level"
                    v-model="energy"
                    class="w-full h-2 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer"
                    max="5"
                    min="1"
                    name="energy"
                    type="range" />
                </div>
                <div class="flex justify-between text-xs text-subtle-light dark:text-subtle-dark mt-1">
                  <span>Bajo</span>
                  <span>Medio</span>
                  <span>Alto</span>
                </div>
              </div>

              <div>
                <label class="block font-medium text-content-light dark:text-content-dark mb-3">
                  Estado emocional
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <button
                    v-for="option in moodOptions"
                    :key="option.value"
                    :aria-pressed="mood === option.value"
                    class="flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors"
                    :class="mood === option.value ? activeMoodClass : inactiveMoodClass"
                    type="button"
                    @click="mood = option.value">
                    <span class="text-2xl">{{ option.emoji }}</span>
                    <span class="text-xs font-medium">{{ option.label }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block font-medium text-content-light dark:text-content-dark mb-2" for="wellbeing-note">
                  Nota opcional
                </label>
                <textarea
                  id="wellbeing-note"
                  v-model.trim="optionalNote"
                  class="w-full rounded-lg border border-border-light dark:border-border-dark bg-transparent px-3 py-3 text-sm text-content-light dark:text-content-dark placeholder:text-subtle-light dark:placeholder:text-subtle-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe brevemente como te sientes o que influye en tu dia."
                  rows="3"></textarea>
              </div>

              <div class="rounded-lg border border-border-light dark:border-border-dark p-3">
                <p class="text-sm font-medium text-content-light dark:text-content-dark">Registro actual</p>
                <p class="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                  Emocion:
                  <span class="font-semibold text-content-light dark:text-content-dark">{{ selectedMoodLabel }}</span>
                </p>
                <p class="text-sm text-subtle-light dark:text-subtle-dark">
                  Energia:
                  <span class="font-semibold text-content-light dark:text-content-dark">{{ energy }}/5</span>
                </p>
                <p v-if="optionalNote" class="text-sm text-subtle-light dark:text-subtle-dark">
                  Nota:
                  <span class="font-semibold text-content-light dark:text-content-dark">{{ optionalNote }}</span>
                </p>
                <p v-if="lastSavedAt" class="text-xs text-subtle-light dark:text-subtle-dark mt-2">
                  Ultima actualizacion: {{ lastSavedAt }}
                </p>
              </div>

              <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isSaving"
                  type="submit">
                  {{ isSaving ? "Guardando..." : "Guardar registro" }}
                </button>
                <p v-if="errorMessage" class="text-sm text-red-500">
                  {{ errorMessage }}
                </p>
              </div>
            </form>
          </section>

          <section>
            <h2 class="text-xl font-bold text-content-light dark:text-content-dark mb-4">Tareas</h2>
            <div class="space-y-3">
              <div class="flex items-center gap-4 p-3 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
                <div class="flex items-center justify-center rounded-full size-10 bg-primary/10 dark:bg-primary/20 text-primary">
                  <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-content-light dark:text-content-dark">Revisar el informe de marketing</p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">10:00 AM</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-3 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
                <div class="flex items-center justify-center rounded-full size-10 bg-primary/10 dark:bg-primary/20 text-primary">
                  <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-content-light dark:text-content-dark">Llamada con el equipo de ventas</p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">11:30 AM</p>
                </div>
              </div>
              <div class="flex items-center gap-4 p-3 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
                <div class="flex items-center justify-center rounded-full size-10 bg-primary/10 dark:bg-primary/20 text-primary">
                  <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-content-light dark:text-content-dark">Preparar la presentacion del cliente</p>
                  <p class="text-sm text-subtle-light dark:text-subtle-dark">2:00 PM</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-bold text-content-light dark:text-content-dark mb-4">Progreso</h2>
            <div class="p-4 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
              <div class="flex justify-between items-center mb-2">
                <p class="font-medium text-content-light dark:text-content-dark">Tareas completadas</p>
                <p class="text-sm font-medium text-subtle-light dark:text-subtle-dark">3/4</p>
              </div>
              <div class="w-full bg-border-light dark:bg-border-dark rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" style="width: 75%"></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer
        class="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
        <nav class="flex justify-around py-2">
          <a class="flex flex-col items-center gap-1 p-2 text-primary" href="#">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
            </svg>
            <span class="text-xs font-medium">Inicio</span>
          </a>
          <a class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark" href="#">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z" />
            </svg>
            <span class="text-xs font-medium">Tareas</span>
          </a>
          <a class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark" href="#">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z" />
            </svg>
            <span class="text-xs font-medium">Enfoque</span>
          </a>
          <a class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark" href="#">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z" />
            </svg>
            <span class="text-xs font-medium">Bienestar</span>
          </a>
          <a class="flex flex-col items-center gap-1 p-2 text-subtle-light dark:text-subtle-dark" href="#">
            <svg class="icon" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z" />
            </svg>
            <span class="text-xs font-medium">Finanzas</span>
          </a>
        </nav>
        <div class="h-safe-bottom"></div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { createEmotionalRecord } from "../services/api";
import "../styles/dashboard.css";

const moodOptions = [
  { value: "feliz", label: "Feliz", emoji: "😊" },
  { value: "calmado", label: "Calmado", emoji: "😌" },
  { value: "triste", label: "Triste", emoji: "😟" },
  { value: "enojado", label: "Enojado", emoji: "😠" },
  { value: "cansado", label: "Cansado", emoji: "😥" },
];

const energy = ref(3);
const mood = ref("feliz");
const optionalNote = ref("");
const saveStatus = ref("Sin guardar");
const lastSavedAt = ref("");
const isSaving = ref(false);
const errorMessage = ref("");

const inactiveMoodClass =
  "border-transparent text-subtle-light dark:text-subtle-dark hover:bg-gray-100 dark:hover:bg-white/5";
const activeMoodClass =
  "border-primary bg-primary/10 dark:bg-primary/20 text-primary";

const selectedMoodLabel = computed(() => {
  return moodOptions.find((option) => option.value === mood.value)?.label ?? "Sin definir";
});

const saveStatusClass = computed(() => {
  if (saveStatus.value === "Guardado") {
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
  }

  if (saveStatus.value === "Guardando...") {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
  }

  if (saveStatus.value === "Error al guardar") {
    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  }

  return "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300";
});

function formatSavedAt(dateString) {
  return new Date(dateString).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

async function saveEmotionalRecord() {
  const fechaRegistro = new Date().toISOString();

  isSaving.value = true;
  saveStatus.value = "Guardando...";
  errorMessage.value = "";

  try {
    await createEmotionalRecord({
      estadoAnimo: mood.value,
      nivelEnergia: Number(energy.value),
      notaOpcional: optionalNote.value,
      fechaRegistro,
    });

    lastSavedAt.value = formatSavedAt(fechaRegistro);
    saveStatus.value = "Guardado";
  } catch (error) {
    console.error("No se pudo guardar el registro emocional.", error);
    saveStatus.value = "Error al guardar";
    errorMessage.value =
      error?.response?.data?.message ||
      "No pudimos guardar el registro. Verifica tu sesion e intenta de nuevo.";
  } finally {
    isSaving.value = false;
  }
}
</script>

<style src="../styles/dashboard.css"></style>
