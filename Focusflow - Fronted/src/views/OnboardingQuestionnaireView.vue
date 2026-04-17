<template>
  <div
    class="flex flex-col min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 dark:from-gray-800 dark:via-gray-900 dark:to-black font-body">
    <div class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8">
      <header
        class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm -mx-6 px-6 py-4 mb-8 rounded-xl">
        <div class="flex justify-between items-center mb-3">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
            Cuéntanos sobre ti
          </h1>

          <span class="text-sm font-semibold text-primary">
            {{ currentStep }} / {{ totalQuestions }}
          </span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div class="bg-primary h-2.5 rounded-full transition-all" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </header>

      <main class="flex flex-1 flex-col justify-center">
        <section class="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-primary/20">
            {{ currentQuestion.section }}
          </h2>

          <p class="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {{ currentQuestion.text }}
          </p>

          <div class="space-y-3">
            <button v-for="option in currentQuestion.options" :key="option.label" type="button"
              @click="selectOption(currentQuestion.id, option)"
              class="w-full text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              :class="isSelected(currentQuestion.id, option.label)
                ? 'border-2 border-primary bg-primary/10 ring-2 ring-primary/50'
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700/50'">
              <span class="text-lg" :class="isSelected(currentQuestion.id, option.label)
                ? 'font-semibold text-primary'
                : 'font-medium text-gray-700 dark:text-gray-200'">
                {{ option.label }}
              </span>
            </button>
          </div>

          <p v-if="errorMessage"
            class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ errorMessage }}
          </p>
        </section>

        <section class="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-lg shadow-slate-200/50">
          <div class="flex flex-wrap gap-3">
            <div v-for="question in questions" :key="question.id"
              class="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border px-3 py-3" :class="answers[question.id]
                ? 'border-primary/30 bg-primary/10'
                : 'border-slate-200 bg-white'">

              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" :class="answers[question.id]
                ? 'bg-primary text-white'
                : 'bg-slate-200 text-slate-600'">
                {{ question.order }}
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">
                  {{ question.shortLabel }}
                </p>
                <p class="truncate text-xs text-slate-500">
                  {{ answers[question.id]?.label || 'Sin responder' }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button"
          class="h-12 rounded-2xl border border-slate-300 px-6 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentIndex === 0 || isSubmitting" @click="goToPrevious">
          Anterior
        </button>

        <div class="flex flex-col items-stretch gap-3 sm:flex-row">
          <button type="button"
            class="h-12 rounded-2xl bg-primary px-6 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canGoNext || isSubmitting" @click="goToNext">
            Siguiente
          </button>


         <button type="button"
            class="h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 px-6 font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!isComplete || isSubmitting" @click="submitQuestionnaire">
            {{ isSubmitting ? 'Guardando...' : 'Finalizar cuestionario' }}
          </button>

        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { submitQuestionnaire as submitQuestionnaireRequest } from "../services/api";

const router = useRouter();

const questions = [
  {
    id: "timeSkill",
    order: 1,
    section: "Gestion del tiempo",
    shortLabel: "Tiempo",
    text: "¿Cómo describes tu habilidad para gestionar tu tiempo?",
    options: [
      { label: "Excelente, siempre cumplo con mis plazos", score: 0, category: "Procrastinacion" },
      { label: "Buena, pero a veces procrastino", score: 1, category: "Procrastinacion" },
      { label: "Regular, me cuesta organizarme", score: 2, category: "Organizacion" },
      { label: "Mala, dejo todo para última hora", score: 3, category: "Procrastinacion" },
    ],
  },
  {
    id: "postponeTasks",
    order: 2,
    section: "Gestion del tiempo",
    shortLabel: "Tareas",
    text: "¿Con qué frecuencia sueles posponer tareas importantes?",
    options: [
      { label: "Nunca", score: 0, category: "Procrastinacion" },
      { label: "A veces", score: 1, category: "Procrastinacion" },
      { label: "Frecuentemente", score: 2, category: "Procrastinacion" },
      { label: "Siempre", score: 3, category: "Procrastinacion" },
    ],
  },
  {
    id: "stressLevel",
    order: 3,
    section: "Salud mental y bienestar",
    shortLabel: "Estrés",
    text: "En una escala del 1 al 5, ¿cómo calificarías tu nivel de estrés actual?",
    options: [
      { label: "1 - Muy bajo", score: 0, category: "Estres" },
      { label: "2 - Bajo", score: 1, category: "Estres" },
      { label: "3 - Moderado", score: 2, category: "Estres" },
      { label: "4 - Alto", score: 3, category: "Estres" },
      { label: "5 - Muy alto", score: 4, category: "Estres" },
    ],
  },
  {
    id: "overwhelmed",
    order: 4,
    section: "Salud mental y bienestar",
    shortLabel: "Saturación",
    text: "¿Te sientes abrumado por tus responsabilidades?",
    options: [
      { label: "Nunca", score: 0, category: "Estres" },
      { label: "A veces", score: 1, category: "Estres" },
      { label: "Frecuentemente", score: 2, category: "Estres" },
      { label: "Siempre", score: 3, category: "Estres" },
    ],
  },
  {
    id: "energyLevel",
    order: 5,
    section: "Salud mental y bienestar",
    shortLabel: "Energía",
    text: "¿Cómo es tu nivel de energía durante el día?",
    options: [
      { label: "Muy alto", score: 0, category: "Energia" },
      { label: "Alto", score: 1, category: "Energia" },
      { label: "Medio", score: 2, category: "Energia" },
      { label: "Bajo", score: 3, category: "Energia" },
      { label: "Muy bajo", score: 4, category: "Energia" },
    ],
  },
  {
    id: "sleepHours",
    order: 6,
    section: "Salud mental y bienestar",
    shortLabel: "Sueño",
    text: "¿Cuántas horas duermes en promedio por noche?",
    options: [
      { label: "Más de 8h", score: 0, category: "Energia" },
      { label: "6-8h", score: 1, category: "Energia" },
      { label: "Varía mucho", score: 2, category: "Energia" },
      { label: "Menos de 6h", score: 3, category: "Energia" },
    ],
  },
  {
    id: "expenseTracking",
    order: 7,
    section: "Finanzas personales",
    shortLabel: "Finanzas",
    text: "¿Qué tan seguido llevas el control de tus gastos?",
    options: [
      { label: "Siempre", score: 0, category: "Organizacion" },
      { label: "A veces", score: 1, category: "Organizacion" },
      { label: "Rara vez", score: 2, category: "Organizacion" },
      { label: "Nunca", score: 3, category: "Organizacion" },
    ],
  },
];

const categoryDescriptions = {
  Gestion: "Tus respuestas nos ayudan a entender cómo te organizas y cuánto tiendes a procrastinar.",
  Salud: "Aquí evaluamos tu nivel de estrés y energía para adaptar mejor el acompañamiento.",
  Finanzas: "Esta información nos ayuda a complementar tu nivel de organización.",
};

const currentIndex = ref(0);
const answers = reactive({});
const errorMessage = ref("");
const isSubmitting = ref(false);

const totalQuestions = questions.length;

const currentQuestion = computed(() => questions[currentIndex.value]);
const currentStep = computed(() => currentIndex.value + 1);
const progressPercentage = computed(() => Math.round((currentStep.value / totalQuestions) * 100));
const canGoNext = computed(() => Boolean(answers[currentQuestion.value.id]) && currentIndex.value < totalQuestions - 1);
const isComplete = computed(() => questions.every((question) => Boolean(answers[question.id])));

const categoryHint = computed(() => {
  if (currentQuestion.value.section.includes("Gestion")) return categoryDescriptions.Gestion;
  if (currentQuestion.value.section.includes("Salud")) return categoryDescriptions.Salud;
  return categoryDescriptions.Finanzas;
});

function isSelected(questionId, optionLabel) {
  return answers[questionId]?.label === optionLabel;
}

function getOptionClasses(questionId, optionLabel) {
  return isSelected(questionId, optionLabel)
    ? "border-sky-400 bg-sky-50 shadow-md shadow-sky-100"
    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/60";
}

function selectOption(questionId, option) {
  answers[questionId] = {
    label: option.label,
    score: option.score,
    category: option.category,
  };
  errorMessage.value = "";
}

function goToNext() {
  if (!answers[currentQuestion.value.id]) {
    errorMessage.value = "Selecciona una opcion antes de continuar.";
    return;
  }

  if (currentIndex.value < totalQuestions - 1) {
    currentIndex.value += 1;
  }
}

function goToPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    errorMessage.value = "";
  }
}

function calculateScores() {
  const totals = {
    Estres: 0,
    Energia: 0,
    Organizacion: 0,
    Procrastinacion: 0,
  };

  const respuestas = questions.map((question) => {
    const answer = answers[question.id];
    totals[answer.category] += answer.score;

    return {
      pregunta: question.text,
      valor: answer.label,
      categoria: answer.category,
      puntaje: answer.score,
    };
  });

  return {
    puntajeTotal: respuestas.reduce((sum, answer) => sum + answer.puntaje, 0),
    nivelEstres: totals.Estres,
    nivelEnergia: totals.Energia,
    nivelOrganizacion: totals.Organizacion,
    nivelProcrastinacion: totals.Procrastinacion,
    respuestas,
  };
}

function calculateProfile(scores) {
  const critico =
    scores.nivelEstres >= 6 &&
    scores.nivelEnergia >= 6 &&
    scores.nivelProcrastinacion >= 5;

  const saturado =
    scores.nivelEstres >= 6 &&
    scores.nivelEnergia >= 5;

  const procrastinador =
    scores.nivelProcrastinacion >= 5 &&
    scores.nivelOrganizacion >= 2;

  const equilibrado =
    scores.nivelEstres <= 2 &&
    scores.nivelEnergia <= 2 &&
    scores.nivelProcrastinacion <= 2;

  if (critico) return "critico";
  if (saturado) return "saturado";
  if (procrastinador) return "procrastinador";
  if (equilibrado) return "equilibrado";
  return "inestable";
}

async function submitQuestionnaire() {
  if (!isComplete.value) {
    errorMessage.value = "Completa todas las preguntas antes de finalizar.";
    return;
  }

  const scores = calculateScores();
  const payload = {
    ...scores,
    completado: true,
    perfil: calculateProfile(scores),
  };

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const response = await submitQuestionnaireRequest(payload);
    localStorage.setItem("questionnaireProfile", payload.perfil);
    localStorage.setItem("questionnaireResult", JSON.stringify(response ?? payload));
    await router.push("/dashboard");
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "No se pudo guardar el cuestionario.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
