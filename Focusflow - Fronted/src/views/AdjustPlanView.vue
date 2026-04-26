<template>
  <div class="font-display">
    <div
      class="relative flex flex-col min-h-screen w-full group/design-root overflow-x-hidden"
    >
      <header class="px-6 pt-8 pb-4">
        <div class="flex justify-between items-center">
          <button @click="goBack" class="p-2 rounded-full">
            <span
              class="material-symbols-outlined text-text-light dark:text-text-dark"
              >arrow_back_ios_new</span
            >
          </button>
          <h1
            class="text-3xl font-extrabold tracking-tight text-black dark:text-white"
          >
            Ajustar mi plan
          </h1>
          <div class="w-10"></div>
        </div>
      </header>

      <main class="flex-grow flex flex-col px-6 py-4 overflow-y-auto">
        <div class="mb-8 text-center">
          <p
            class="mx-auto max-w-xl text-lg text-slate-700 dark:text-slate-300"
          >
            Modifica tus metas para que se adapten mejor a tu ritmo y
            necesidades actuales.
          </p>
        </div>

        <div class="space-y-6 max-w-4xl mx-auto w-full">
          <!-- Pausas Conscientes -->
          <div
            class="rounded-3xl border border-violet-200 bg-white/95 shadow-[0_20px_60px_rgba(139,92,246,0.12)] overflow-hidden"
          >
            <div
              class="relative overflow-hidden bg-gradient-to-br from-[#f5ecff] via-[#ecdbff] to-[#e6cffb] px-6 py-5"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.22em] text-violet-600/90"
                  >
                    Bienestar emocional
                  </p>
                  <h3 class="mt-2 text-xl font-bold text-violet-900">
                    Pausas Conscientes
                  </h3>
                </div>
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-2xl"
                >
                  🧘
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-sm text-violet-700/80 mb-6">
                ¿Cuántas veces al día quieres hacer pausas?
              </p>
              <div class="flex items-center justify-center gap-8">
                <button
                  @click="decrement('pausasDiarias')"
                  class="w-14 h-14 rounded-full bg-violet-100 text-violet-700 text-2xl font-bold hover:bg-violet-200 transition"
                >
                  -
                </button>
                <div class="text-center">
                  <span class="text-5xl font-bold text-violet-800">{{
                    form.pausasDiarias
                  }}</span>
                  <p class="text-xs text-violet-500 mt-1">veces al día</p>
                </div>
                <button
                  @click="increment('pausasDiarias')"
                  class="w-14 h-14 rounded-full bg-violet-600 text-white text-2xl font-bold hover:bg-violet-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Ritual de Descanso -->
          <div
            class="rounded-3xl border border-violet-200 bg-white/95 shadow-[0_20px_60px_rgba(139,92,246,0.12)] overflow-hidden"
          >
            <div
              class="relative overflow-hidden bg-gradient-to-br from-[#f5ecff] via-[#ecdbff] to-[#e6cffb] px-6 py-5"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.22em] text-violet-600/90"
                  >
                    Hábito nocturno
                  </p>
                  <h3 class="mt-2 text-xl font-bold text-violet-900">
                    Ritual de Descanso
                  </h3>
                </div>
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-2xl"
                >
                  🌙
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-sm text-violet-700/80 mb-6">
                ¿A qué hora quieres ir a dormir?
              </p>
              <div class="flex items-center justify-center gap-8">
                <div class="flex flex-col items-center">
                  <button
                    @click="changeHour(1)"
                    class="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-xl font-bold hover:bg-violet-200 transition"
                  >
                    ▲
                  </button>
                  <span class="text-4xl font-bold text-violet-800 my-2">{{
                    formattedHour
                  }}</span>
                  <button
                    @click="changeHour(-1)"
                    class="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-xl font-bold hover:bg-violet-200 transition"
                  >
                    ▼
                  </button>
                  <span class="text-xs text-violet-500 mt-1">Horas</span>
                </div>
                <span class="text-3xl font-bold text-violet-400">:</span>
                <div class="flex flex-col items-center">
                  <button
                    @click="changeMinute(5)"
                    class="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-xl font-bold hover:bg-violet-200 transition"
                  >
                    ▲
                  </button>
                  <span class="text-4xl font-bold text-violet-800 my-2">{{
                    formattedMinute
                  }}</span>
                  <button
                    @click="changeMinute(-5)"
                    class="w-12 h-12 rounded-full bg-violet-100 text-violet-700 text-xl font-bold hover:bg-violet-200 transition"
                  >
                    ▼
                  </button>
                  <span class="text-xs text-violet-500 mt-1">Minutos</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Enfoque Diario -->
          <div
            class="rounded-3xl border border-violet-200 bg-white/95 shadow-[0_20px_60px_rgba(139,92,246,0.12)] overflow-hidden"
          >
            <div
              class="relative overflow-hidden bg-gradient-to-br from-[#f5ecff] via-[#ecdbff] to-[#e6cffb] px-6 py-5"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.22em] text-violet-600/90"
                  >
                    Productividad
                  </p>
                  <h3 class="mt-2 text-xl font-bold text-violet-900">
                    Enfoque Diario
                  </h3>
                </div>
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-2xl"
                >
                  ⭐
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-sm text-violet-700/80 mb-6">
                ¿Cuántas tareas prioritarias quieres completar cada día?
              </p>
              <div class="flex items-center justify-center gap-8">
                <button
                  @click="decrement('enfoqueDiario')"
                  class="w-14 h-14 rounded-full bg-violet-100 text-violet-700 text-2xl font-bold hover:bg-violet-200 transition"
                >
                  -
                </button>
                <div class="text-center">
                  <span class="text-5xl font-bold text-violet-800">{{
                    form.enfoqueDiario
                  }}</span>
                  <p class="text-xs text-violet-500 mt-1">
                    {{ form.enfoqueDiario === 1 ? "tarea" : "tareas" }}
                  </p>
                </div>
                <button
                  @click="increment('enfoqueDiario')"
                  class="w-14 h-14 rounded-full bg-violet-600 text-white text-2xl font-bold hover:bg-violet-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        class="px-6 pb-8 pt-4 sticky bottom-0 bg-background-light dark:bg-background-dark"
      >
        <div class="flex flex-col gap-4 max-w-md mx-auto">
          <button
            @click="savePlan"
            :disabled="loading"
            class="w-full h-14 px-5 rounded-xl bg-violet-700 text-white font-bold tracking-wide shadow-lg hover:bg-violet-800 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading" class="material-symbols-outlined">save</span>
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            {{ loading ? "Guardando..." : "Guardar Cambios" }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  getUserPlans,
  createPersonalizedPlan,
  updatePlan,
} from "../services/api";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const form = ref({
  horaDescanso: "22:00",
  pausasDiarias: 3,
  enfoqueDiario: 1,
});

const hour = ref(22);
const minute = ref(0);
const existingPlan = ref(null);
const questionnaireId = ref(null);

const formattedHour = computed(() => hour.value.toString().padStart(2, "0"));
const formattedMinute = computed(() =>
  minute.value.toString().padStart(2, "0"),
);

function updateTimeString() {
  form.value.horaDescanso = `${formattedHour.value}:${formattedMinute.value}`;
}

function changeHour(delta) {
  let newHour = hour.value + delta;
  if (newHour < 0) newHour = 23;
  if (newHour > 23) newHour = 0;
  hour.value = newHour;
  updateTimeString();
}

function changeMinute(delta) {
  let newMinute = minute.value + delta;
  if (newMinute < 0) newMinute = 55;
  if (newMinute > 55) newMinute = 0;
  minute.value = newMinute;
  updateTimeString();
}

function setTimeFromString(timeStr) {
  if (!timeStr) return;
  const [h, m] = timeStr.split(":").map(Number);
  if (!isNaN(h)) hour.value = h;
  if (!isNaN(m)) minute.value = m;
  updateTimeString();
}

function increment(field) {
  if (field === "pausasDiarias") form.value.pausasDiarias++;
  if (field === "enfoqueDiario") form.value.enfoqueDiario++;
}

function decrement(field) {
  if (field === "pausasDiarias" && form.value.pausasDiarias > 1)
    form.value.pausasDiarias--;
  if (field === "enfoqueDiario" && form.value.enfoqueDiario > 1)
    form.value.enfoqueDiario--;
}

async function loadPlan() {
  try {
    const planes = await getUserPlans();
    if (planes && planes.length > 0) {
      const plan = planes[0];
      existingPlan.value = plan;
      let hora = plan.horaDescanso;
      if (hora && hora.includes(":")) {
        hora = hora.length > 5 ? hora.substring(0, 5) : hora;
      }
      form.value = {
        horaDescanso: hora || "22:00",
        pausasDiarias: plan.pausasDiarias,
        enfoqueDiario: plan.enfoqueDiario,
      };
      setTimeFromString(form.value.horaDescanso);
    }
  } catch (error) {
    console.log("No hay plan previo");
  }
}

onMounted(async () => {
  const storedId = localStorage.getItem("questionnaireId");
  if (storedId) questionnaireId.value = parseInt(storedId);
  await loadPlan();
  setTimeFromString(form.value.horaDescanso);
});

async function savePlan() {
  if (!questionnaireId.value) {
    toast.error("Completa primero el cuestionario inicial", { timeout: 4000 });
    return;
  }

  loading.value = true;

  try {
    const payload = {
      idCuestionario: questionnaireId.value,
      horaDescanso: form.value.horaDescanso + ":00",
      enfoqueDiario: form.value.enfoqueDiario,
      pausasDiarias: form.value.pausasDiarias,
    };

    if (existingPlan.value) {
      await updatePlan(existingPlan.value.idPlan, payload);
      toast.success("Plan actualizado correctamente.", { timeout: 3000 });
    } else {
      await createPersonalizedPlan(payload);
      toast.success("Plan creado correctamente.", { timeout: 3000 });
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    console.error(error);
    toast.error("Error al guardar el plan. Por favor, intenta de nuevo.", {
      timeout: 4000,
    });
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}
</script>
