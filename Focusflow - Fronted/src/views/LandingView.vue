<template>
  <div class="landing-container bg-slate-50 font-display min-h-screen flex flex-col relative overflow-hidden">

    <!-- Glow -->
    <div class="ambient-glow glow-blue"></div>
    <div class="ambient-glow glow-purple"></div>

    <!-- HERO -->
    <main class="flex-grow flex items-center relative z-10">
      <div class="container mx-auto px-6 md:px-12 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- Left -->
        <section class="hero-content text-center lg:text-left">

          <!-- Title -->
          <h1
            class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-[1.05] mb-5 tracking-normal">

            Organiza tu vida y

            <br class="hidden lg:block" />

            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#13a4ec] to-blue-400">
              enfócate
            </span>

            en un solo lugar.
          </h1>

          <!-- Description -->
          <p class="text-slate-600 text-lg md:text-xl mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">

            Tu santuario digital diseñado para cultivar la calma y maximizar tu
            productividad consciente.
          </p>

          <!-- Rotating text -->
          <div class="h-8 mb-8 overflow-hidden">

            <Transition name="fade" mode="out-in">
              <div :key="currentIndex" class="text-[#13a4ec] font-medium text-lg">

                {{ features[currentIndex] }}
              </div>
            </Transition>

          </div>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

            <!-- Login -->
            <button @click="goLogin"
              class="group px-8 py-3.5 rounded-2xl bg-[#13a4ec] text-white font-semibold shadow-lg shadow-[#13a4ec]/30 hover:-translate-y-1 hover:shadow-[#13a4ec]/50 transition-all duration-300 flex items-center justify-center gap-2">

              Iniciar Sesión

              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="group-hover:translate-x-1 transition-transform duration-300">

                <line x1="5" y1="12" x2="19" y2="12"></line>

                <polyline points="12 5 19 12 12 19"></polyline>

              </svg>
            </button>

            <!-- Register -->
            <button @click="goRegister"
              class="px-8 py-3.5 rounded-2xl bg-white text-[#13a4ec] border border-blue-100 font-semibold hover:border-[#13a4ec] hover:bg-blue-50 transition-all duration-300 shadow-sm">

              Registrarse
            </button>

          </div>
        </section>

        <!-- Right -->
        <section class="hero-visual flex justify-center items-center relative mt-10 lg:mt-0">

          <!-- Background -->
          <div class="absolute inset-0 flex justify-center items-center">

            <div
              class="w-[90%] h-[90%] rounded-[4rem] bg-gradient-to-tr from-[#13a4ec]/15 via-blue-300/15 to-purple-300/15 blur-2xl">
            </div>

          </div>

          <!-- Image -->
          <div class="relative z-10 p-4 md:p-8 w-[520px] lg:w-[680px] flex items-center justify-center">

            <img src="/hero.svg" alt="FocusFlow" width="680" height="680" loading="eager" decoding="async"
              class="floating-illustration select-none pointer-events-none w-full h-auto" />
          </div>

        </section>
      </div>
    </main>

    <!-- FOOTER -->
    <footer
      class="bg-white border-t border-blue-50 text-slate-600 pt-12 pb-6 relative z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.02)]">

      <div class="container mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Brand -->
        <div>

          <div class="flex items-center gap-2 mb-4">

            <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden">

              <img src="/icon.svg" alt="FocusFlow Icon"
                class="w-6 h-6 object-contain select-none pointer-events-none" />
            </div>

            <span class="text-slate-800 font-bold text-lg">
              FocusFlow
            </span>
          </div>

          <p class="text-sm text-slate-500 leading-relaxed max-w-xs">

            Encuentra tu equilibrio perfecto entre productividad, descanso y
            bienestar personal.
          </p>
        </div>

        <!-- Links -->
        <div class="flex flex-col gap-3">

          <span class="text-slate-800 font-bold mb-1">
            Legal y Ayuda
          </span>

          <button @click="goTerms" class="footer-link">

            Términos y condiciones
          </button>

          <button @click="goPrivacy" class="footer-link">

            Política de privacidad
          </button>

          <button @click="handleSupport" class="footer-link">

            Soporte técnico
          </button>
        </div>

        <!-- Community -->
        <div>

          <span class="text-slate-800 font-bold mb-3 block">
            Comunidad
          </span>

          <div class="flex gap-3 mt-2">

            <button aria-label="Correo" class="social-btn">
              📧
            </button>

            <button aria-label="WhatsApp" class="social-btn">
              📱
            </button>

            <button aria-label="Sitio web" class="social-btn">
              🌐
            </button>

          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-slate-100 mt-10 pt-6 text-center text-sm text-slate-400">

        © 2026 FocusFlow — Todos los derechos reservados.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = ref(false)

const features = [
  '📌 Gestiona tus tareas fácilmente',
  '⏱️ Controla tu tiempo con calma',
  '🎯 Cumple tus objetivos sin estrés'
]

const currentIndex = ref(0)

let interval

// Navigation
const goLogin = () => router.push('/login')

const goRegister = () => router.push('/register')

const goTerms = () => router.push('/terms-and-conditions')

const goPrivacy = () => router.push('/privacy-policy')

// Support
const handleSupport = () => {
  router.push(isLoggedIn.value ? '/support' : '/login')
}

// Rotate text
onMounted(() => {
  interval = globalThis.window.setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % features.length
  }, 2500)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* =========================================
   Global improvements
========================================= */
:global(html) {
  font-size: 17px;
}

:global(body) {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Firefox Linux fixes */
@-moz-document url-prefix() {
  :global(html) {
    font-size: 18px;
  }

  .floating-illustration {
    transform: scale(1.08);
  }

  .ambient-glow {
    animation: none;
    opacity: 0.35;
  }
}

/* =========================================
   Layout
========================================= */
.landing-container {
  min-height: 100dvh;
}

/* =========================================
   Glow
========================================= */
.ambient-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 9999px;
  filter: blur(60px);
  opacity: 0.45;
  pointer-events: none;
  z-index: 0;

  transform: translateZ(0);
  backface-visibility: hidden;

  animation: pulse-glow 8s ease-in-out infinite alternate;
}

.glow-blue {
  top: -10%;
  left: -5%;
  background: rgba(19, 164, 236, 0.25);
}

.glow-purple {
  bottom: 10%;
  right: -10%;
  background: rgba(168, 85, 247, 0.12);
}

/* =========================================
   Hero
========================================= */
.hero-content,
.hero-visual,
.floating-illustration,
.ambient-glow {
  transform: translateZ(0);
  backface-visibility: hidden;
}

.hero-content {
  animation: fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-visual {
  animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: 0.05s;
  opacity: 0;
}

.floating-illustration {
  animation: float 4s ease-in-out infinite;
  transform-origin: center;
}

img {
  image-rendering: auto;
}

/* =========================================
   Footer
========================================= */
.footer-link {
  text-align: left;
  font-size: 0.875rem;
  width: fit-content;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #13a4ec;
}

.social-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: rgb(239 246 255);
  color: #1d4ed8 !important;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.social-btn:hover {
  background: #1d4ed8;
  color: #ffffff !important; 
}

/* =========================================
   Text transition
========================================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================================
   Keyframes
========================================= */
@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse-glow {
  from {
    transform: scale(1);
    opacity: 0.35;
  }

  to {
    transform: scale(1.08);
    opacity: 0.55;
  }
}

/* =========================================
   Responsive
========================================= */
@media (max-width: 1024px) {

  .ambient-glow {
    width: 300px;
    height: 300px;
  }

  .hero-content h1 {
    font-size: 4rem;
  }
}

@media (max-width: 640px) {

  .ambient-glow {
    width: 220px;
    height: 220px;
    filter: blur(40px);
  }

  .hero-content h1 {
    font-size: 3rem;
  }
}
</style>