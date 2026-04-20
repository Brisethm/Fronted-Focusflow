<template>
  <div class="font-display">
    <div class="relative flex flex-col min-h-screen w-full group/design-root overflow-x-hidden">
      <header class="px-6 pt-8 pb-4">
        <div class="flex justify-between items-center">
          <button class="p-2 rounded-full">
            <span class="material-symbols-outlined text-text-light dark:text-text-dark">arrow_back_ios_new</span>
          </button>
          <h1 class="generated-plan-title text-3xl font-extrabold tracking-tight">
            Tu Plan Personalizado
          </h1>
          <div class="w-10"></div>
        </div>
      </header>
      <main class="flex-grow flex flex-col px-6 py-4">
        <div class="mb-4 text-center">
          <div
            class="inline-flex min-w-[240px] items-center justify-center gap-4 rounded-full border border-violet-200 bg-violet-50 px-5 py-3 shadow-sm">
            <span class="text-3xl">{{ profileBadge.emoji }}</span>
            <div class="text-center">
              <p class="text-xs uppercase tracking-[0.3em] text-violet-600">
                Perfil
              </p>
              <p class="text-lg font-semibold text-violet-900">
                {{ profileBadge.label }}
              </p>
            </div>
          </div>
        </div>
        <div class="mb-6 text-center">
          <p class="mx-auto max-w-xl text-xl font-semibold text-slate-800 dark:text-slate-100">
            Basado en tus respuestas, este es tu plan para empezar a construir
            un mayor equilibrio.
          </p>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {{ planIntro }}
          </p>
          <div v-if="planDetails"
            class="plan-details-card mt-6 overflow-hidden rounded-[32px] border border-violet-200 bg-white/95 shadow-[0_20px_60px_rgba(139,92,246,0.12)] text-left mx-auto max-w-4xl">
            <div
              class="relative overflow-hidden bg-gradient-to-br from-[#f5ecff] via-[#ecdbff] to-[#e6cffb] px-6 py-5 text-violet-900">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.22em] text-violet-600/90">
                    Bienestar emocional
                  </p>
                  <h3 class="mt-2 text-2xl font-bold">
                    Tu mejor versión empieza por dentro.
                  </h3>
                </div>
                <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/80 text-3xl">
                  🧘
                </div>
              </div>
              <div class="mt-4 rounded-3xl border border-white/60 bg-white/70 p-4 text-left">
                <p class="text-sm text-violet-900/75">
                  Este plan te ayuda a equilibrar tu descanso, a enfocarte y a
                  realizar pausas con un estilo de vida motivador.
                </p>
              </div>
            </div>
            <div class="space-y-3 p-5">
              <div class="rounded-3xl bg-violet-50 px-4 py-4">
                <p class="text-xs uppercase tracking-[0.24em] text-violet-500">
                  Hora de descanso
                </p>
                <p class="mt-2 text-2xl font-bold text-violet-700">
                  {{ planDetails.horaDescanso }}
                </p>
              </div>
              <div class="rounded-3xl bg-violet-50 px-4 py-4">
                <p class="text-xs uppercase tracking-[0.24em] text-violet-500">
                  Pausas diarias
                </p>
                <p class="mt-2 text-2xl font-bold text-violet-700">
                  {{ planDetails.pausasDiarias }}
                </p>
              </div>
              <div class="rounded-3xl bg-violet-50 px-4 py-4">
                <p class="text-xs uppercase tracking-[0.24em] text-violet-500">
                  Enfoque diario
                </p>
                <p class="mt-2 text-2xl font-bold text-violet-700">
                  {{ planDetails.enfoqueDiario }}
                  {{ planDetails.enfoqueDiario === 1 ? "tarea" : "tareas" }}
                </p>
              </div>
            </div>
          </div>
          <p v-if="creationStatus" class="mt-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {{ creationStatus }}
          </p>
          <p v-if="errorMessage" class="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
            {{ errorMessage }}
          </p>
        </div>
        <div class="space-y-6">
          <div v-for="card in planCards" :key="card.title" :class="`${card.wrapperClass} p-6 rounded-3xl shadow-sm`">
            <div class="flex items-center gap-4">
              <div class="bg-white/90 p-3 rounded-full shadow-sm">
                <span class="material-symbols-outlined text-violet-700 text-3xl">{{ card.icon }}</span>
              </div>
              <div>
                <h2 class="font-bold text-lg text-violet-900">
                  {{ card.title }}
                </h2>
                <p class="text-violet-700/80">{{ card.subtitle || "" }}</p>
              </div>
            </div>
            <p class="mt-4 text-slate-700 dark:text-slate-300">
              {{ card.description }}
            </p>
          </div>
        </div>
      </main>
      <footer class="px-6 pb-8 pt-4 sticky bottom-0 bg-background-light dark:bg-background-dark">
        <div class="flex flex-col gap-4 max-w-md mx-auto">
          <button @click="startDay"
            class="w-full h-14 px-5 rounded-xl bg-violet-700 text-white font-bold tracking-wide shadow-lg hover:bg-violet-800 transition-colors duration-300 flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">play_arrow</span>
            Comenzar mi día
          </button>
          <button @click="adjustPlan"
            class="w-full h-12 px-5 rounded-xl bg-violet-100 text-violet-900 font-bold tracking-wide hover:bg-violet-200 transition-colors duration-300">
            Ajustar mi plan
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { createPersonalizedPlan} from "../services/api";

const router = useRouter();

/* ======================
   FUENTE DE VERDAD
====================== */
const profile = ref(localStorage.getItem("questionnaireProfile") || "inestable");
const questionnaireId = ref(localStorage.getItem("questionnaireId") || null);

/* ======================
   UI: PERFIL
====================== */
const profileBadge = computed(() => {
  const badges = {
    critico: { emoji: "🧨", label: "Crítico" },
    saturado: { emoji: "😵", label: "Saturado" },
    procrastinador: { emoji: "⏳", label: "Procrastinador" },
    inestable: { emoji: "⚖️", label: "Inestable" },
    equilibrado: { emoji: "🚀", label: "Equilibrado" },
  };
  return badges[profile.value] || badges.inestable;
});

const planIntro = computed(() => {
  switch (profile.value) {
    case "critico":
      return "Tu plan está enfocado en reducir el estrés elevado y recuperar energía con pasos claros y sencillos.";
    case "saturado":
      return "Este plan te ayudará a bajar la carga diaria y ganar estabilidad con descansos conscientes.";
    case "procrastinador":
      return "Vamos a estructurar tu día para que avances con menos distracciones y más foco.";
    case "equilibrado":
      return "Ya tienes buenas bases; este plan refuerza tus hábitos y te mantiene en equilibrio.";
    default:
      return "Aquí tienes un plan para mejorar tu equilibrio día a día.";
  }
});

/* ======================
   CONFIG PLAN
====================== */
const profilePlanMapping = {
  saturado: { horaDescanso: "22:00:00", enfoqueDiario: 3, pausasDiarias: 3 },
  critico: { horaDescanso: "21:30:00", enfoqueDiario: 1, pausasDiarias: 5 },
  procrastinador: { horaDescanso: "23:00:00", enfoqueDiario: 5, pausasDiarias: 2 },
  inestable: { horaDescanso: "22:30:00", enfoqueDiario: 3, pausasDiarias: 2 },
  equilibrado: { horaDescanso: "23:00:00", enfoqueDiario: 1, pausasDiarias: 1 },
};

const planDetails = computed(() => {
  const plan = profilePlanMapping[profile.value] || profilePlanMapping.inestable;

  return {
    horaDescanso: plan.horaDescanso,
    enfoqueDiario: plan.enfoqueDiario,
    pausasDiarias: plan.pausasDiarias,
  };
});

/* ======================
   CARDS
====================== */
const planCards = computed(() => {
  const plan = profilePlanMapping[profile.value] || profilePlanMapping.inestable;

  return [
    {
      title: "Pausas Conscientes",
      icon: "self_improvement",
      subtitle:
        profile.value === "critico"
          ? "Pausa energética"
          : profile.value === "saturado"
          ? "Relajación suave"
          : profile.value === "procrastinador"
          ? "Pausa estratégica"
          : profile.value === "equilibrado"
          ? "Pausa de recarga"
          : "Pausa equilibrante",
      description:
        profile.value === "critico"
          ? "Tu mente necesita respiro; haz pausas cortas para evitar agotamiento."
          : profile.value === "saturado"
          ? "Cinco minutos de pausa te ayudan a bajar la intensidad del día."
          : profile.value === "procrastinador"
          ? "Haz pequeñas desconexiones para recuperar foco sin bloquearte."
          : profile.value === "equilibrado"
          ? "Mantén tu buen ritmo con descansos conscientes que te recargan."
          : "Pausas breves te ayudan a mantener equilibrio y claridad mental.",
      wrapperClass: "p-6 rounded-3xl border bg-[#f5f3ff] border-[#ddd6fe]",
    },
    {
      title: "Ritual de Descanso",
      icon: "dark_mode",
      subtitle: `Ir a dormir a las ${plan.horaDescanso}`,
      description:
        profile.value === "critico"
          ? "Dormir temprano te ayuda a recuperar energía y calmar la sobrecarga."
          : profile.value === "saturado"
          ? "Una hora de descanso estable reduce el estrés acumulado."
          : profile.value === "procrastinador"
          ? "Un horario fijo de sueño te da estructura y más energía."
          : profile.value === "equilibrado"
          ? "Seguir este horario refuerza el equilibrio que ya tienes."
          : "Dormir a esta hora mejora tu claridad y descanso emocional.",
      wrapperClass: "p-6 rounded-3xl border bg-[#f5f3ff] border-[#ddd6fe]",
    },
    {
      title: "Enfoque Diario",
      icon: "checklist",
      subtitle: `${plan.enfoqueDiario} tareas prioritarias`,
      description:
        profile.value === "critico"
          ? "Una tarea prioritaria para avanzar sin generar presión extra."
          : profile.value === "saturado"
          ? "Tres objetivos claros te permiten manejar mejor el ritmo."
          : profile.value === "procrastinador"
          ? "Cinco tareas pequeñas te ayudan a crear impulso hoy."
          : profile.value === "equilibrado"
          ? "Una sola meta diaria te permite mantener el balance perfecto."
          : "Tres enfoques te ayudan a organizar tu jornada con fluidez.",
      wrapperClass: "p-6 rounded-3xl border bg-[#f5f3ff] border-[#ddd6fe]",
    },
  ];
});

/* ======================
   UTILIDADES
====================== */
function formatLocalDeadline(hour, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  const pad = (v) => String(v).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getTasksForProfile(profile) {
  const tasks = {
    critico: [
      {
        titulo: "Priorizar tarea clave del día",
        prioridad: "Alta",
        nivelEsfuerzo: "Medio",
        estado: "Pendiente",
        fechaLimite: formatLocalDeadline(21),
      },
    ],
    saturado: [
      {
        titulo: "Terminar una tarea importante",
        prioridad: "Alta",
        nivelEsfuerzo: "Medio",
        estado: "Pendiente",
        fechaLimite: formatLocalDeadline(20),
      },
    ],
    procrastinador: [
      {
        titulo: "Iniciar tarea pequeña",
        prioridad: "Alta",
        nivelEsfuerzo: "Bajo",
        estado: "Pendiente",
        fechaLimite: formatLocalDeadline(19),
      },
    ],
    equilibrado: [
      {
        titulo: "Reforzar hábito positivo",
        prioridad: "Media",
        nivelEsfuerzo: "Bajo",
        estado: "Pendiente",
        fechaLimite: formatLocalDeadline(20),
      },
    ],
  };

  return tasks[profile] || [];
}

/* ======================
   API
====================== */
const creationStatus = ref("");
const errorMessage = ref("");

async function createPlanAndTasks() {
  if (!questionnaireId.value) {
    errorMessage.value = "No se encontró el cuestionario.";
    return;
  }

  const planCreatedKey = `personalizedPlanCreated_${questionnaireId.value}`;

  if (localStorage.getItem(planCreatedKey) === "true") {
    creationStatus.value = "El plan ya fue guardado.";
    return;
  }

  const planData = profilePlanMapping[profile.value] || profilePlanMapping.inestable;

  try {
    await createPersonalizedPlan({
      horaDescanso: planData.horaDescanso,
      enfoqueDiario: planData.enfoqueDiario,
      pausasDiarias: planData.pausasDiarias,
      idCuestionario: Number(questionnaireId.value),
    });

    localStorage.setItem(planCreatedKey, "true");
    creationStatus.value = "Plan guardado correctamente.";
  } catch {
    errorMessage.value = "Error al guardar el plan.";
  }
}

onMounted(() => {
  createPlanAndTasks();
});

/* ======================
   NAV
====================== */
function startDay() {
  router.push("/dashboard");
}

function adjustPlan() {
  router.push("/ajustar-plan");
}
</script>
