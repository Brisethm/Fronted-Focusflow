<template>
    <div class="font-display">
        <div class="relative flex flex-col min-h-screen w-full group/design-root overflow-x-hidden">
            <header class="px-6 pt-8 pb-4">
                <div class="flex justify-between items-center">
                    <button class="p-2 rounded-full">
                        <span
                            class="material-symbols-outlined text-text-light dark:text-text-dark">arrow_back_ios_new</span>
                    </button>
                    <h1 class="text-xl font-bold text-text-light dark:text-text-dark">Tu Plan Personalizado</h1>
                    <button class="p-2 rounded-full">
                        <span class="material-symbols-outlined text-text-light dark:text-text-dark">more_horiz</span>
                    </button>
                </div>
            </header>
            <main class="flex-grow flex flex-col px-6 py-4">
                <div class="mb-4 text-center">
                    <span class="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                        Perfil: {{ profileLabel }}
                    </span>
                    <p v-if="questionnaireId" class="mt-2 text-sm text-slate-500">
                        ID Cuestionario: {{ questionnaireId }}
                    </p>
                </div>
                <div class="mb-6 text-center">
                    <p class="text-lg text-gray-600 dark:text-gray-300">
                        {{ planIntro }}
                    </p>
                    <p v-if="questionnaireResult" class="mt-2 text-sm text-slate-500">
                        Resumen: {{ questionnaireResult.perfil ? `Perfil ${profileLabel}` : 'Datos guardados localmente' }}
                    </p>
                    <p v-else class="mt-2 text-sm text-slate-500">
                        No se encontró un cuestionario previo. El plan usa el perfil guardado en tu navegador.
                    </p>
                </div>
                <div class="space-y-6">
                    <div v-for="card in planCards" :key="card.title"
                        class="p-6 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div class="flex items-center gap-4">
                            <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                                <span class="material-symbols-outlined text-primary text-3xl">{{ card.icon }}</span>
                            </div>
                            <div>
                                <h2 class="font-bold text-lg text-text-light dark:text-white">{{ card.title }}</h2>
                                <p class="text-gray-700 dark:text-gray-300">{{ card.subtitle || '' }}</p>
                            </div>
                        </div>
                        <p class="mt-4 text-gray-600 dark:text-gray-400">
                            {{ card.description }}
                        </p>
                    </div>
                </div>
            </main>
            <footer class="px-6 pb-8 pt-4 sticky bottom-0 bg-background-light dark:bg-background-dark">
                <div class="flex flex-col gap-4 max-w-md mx-auto">
                    <button @click="startDay"
                        class="w-full h-14 px-5 rounded-xl bg-primary text-white font-bold tracking-wide shadow-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">play_arrow</span>
                        Comenzar mi día
                    </button>
                    <button @click="adjustPlan"
                        class="w-full h-12 px-5 rounded-xl text-primary dark:text-primary-light font-bold tracking-wide hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-300">
                        Ajustar mi plan
                    </button>
                </div>
            </footer>
        </div>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const savedProfile = ref(localStorage.getItem('questionnaireProfile') || 'desconocido')
const questionnaireId = ref(localStorage.getItem('questionnaireId') || null)
const questionnaireResult = ref(null)

try {
  questionnaireResult.value = JSON.parse(localStorage.getItem('questionnaireResult') || 'null')
} catch {
  questionnaireResult.value = null
}

const profileLabel = computed(() => {
  const profile = savedProfile.value
  if (profile === 'desconocido') return 'Perfil no disponible'
  return profile.charAt(0).toUpperCase() + profile.slice(1)
})

const planIntro = computed(() => {
  switch (savedProfile.value) {
    case 'critico':
      return 'Tu plan está enfocado en reducir el estrés elevado y recuperar energía con pasos claros y sencillos.'
    case 'saturado':
      return 'Este plan te ayudará a bajar la carga diaria y ganar estabilidad con descansos conscientes.'
    case 'procrastinador':
      return 'Vamos a estructurar tu día para que avances con menos distracciones y más foco.'
    case 'equilibrado':
      return 'Ya tienes buenas bases; este plan refuerza tus hábitos y te mantiene en equilibrio.'
    default:
      return 'Aquí tienes un plan para mejorar tu equilibrio día a día, basado en tu perfil guardado.'
  }
})

const planCards = computed(() => {
  const base = [
    {
      title: 'Pausas Conscientes',
      icon: 'self_improvement',
      defaultText: 'Dedica 5 minutos a respirar profundamente y reconectar contigo. Te enviaremos recordatorios a las 10 AM, 1 PM y 4 PM.',
    },
    {
      title: 'Ritual de Descanso',
      icon: 'dark_mode',
      defaultText: 'Establecer un horario de sueño regular mejorará tu energía y concentración. Activa un recordatorio 30 minutos antes.',
    },
    {
      title: 'Enfoque Diario',
      icon: 'checklist',
      defaultText: 'Define tu tarea más importante cada mañana para avanzar en tus metas sin sentirte abrumado.',
    },
  ]

  return base.map((card) => {
    let description = card.defaultText

    if (savedProfile.value === 'critico' && card.title === 'Enfoque Diario') {
      description = 'Prioriza solo una tarea crítica por día y deja espacio para pausas de recuperación.'
    }

    if (savedProfile.value === 'saturado' && card.title === 'Ritual de Descanso') {
      description = 'Apaga pantallas 30 minutos antes de dormir y establece un descanso sin tareas pendientes.'
    }

    if (savedProfile.value === 'procrastinador' && card.title === 'Enfoque Diario') {
      description = 'Empieza con una tarea pequeña y clara para crear impulso y evitar postergar.'
    }

    if (savedProfile.value === 'equilibrado' && card.title === 'Pausas Conscientes') {
      description = 'Mantén tu ritmo con breves pausas de cara y respiración durante tu jornada activa.'
    }

    return {
      ...card,
      description,
    }
  })
})

function startDay() {
  console.log('Inicio de día activado')
}

function adjustPlan() {
  router.push('/dashboard')
}
</script>
<style src="../styles/generateplan.css"></style>
