<template>
  <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col justify-between">

    <!-- CONTENIDO PRINCIPAL -->
    <div class="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10">

      <div class="max-w-xl text-center md:text-left animate-fade-in">

        <!-- LOGO / BRAND -->
        <div class="flex items-center justify-center md:justify-start gap-2 mb-4">
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            F
          </div>
          <span class="text-primary font-semibold">FocusFlow</span>
        </div>

        <!-- TITULO -->
        <h1 class="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight mb-4">
          Bienvenido a <span class="text-primary italic">FocusFlow</span>
        </h1>

        <!-- SUBTITULO -->
        <p class="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 max-w-md">
          Tu santuario digital diseñado para cultivar la calma y maximizar tu productividad consciente.
        </p>

        <!-- BOTONES (ESTILO MODERNO TIPO CARD) -->
        <div class="flex flex-col md:flex-row gap-4 items-center md:items-start">

          <button @click="goToLogin"
            class="w-full md:w-auto px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">
            <span>Iniciar Sesión</span>
          </button>

          <button @click="goToRegister"
            class="w-full md:w-auto px-8 py-3 rounded-full bg-white dark:bg-gray-800 text-primary border border-primary font-semibold hover:scale-105 transition flex items-center justify-center gap-2">
            <span>Registrarse</span>
          </button>

        </div>

        <!-- LINK SECUNDARIO -->
        <p class="text-sm text-gray-500 mt-6">
          ¿Olvidaste tu contraseña?
          <span class="text-primary cursor-pointer hover:underline" @click="goToForgot">
            Restablecer
          </span>
        </p>

      </div>

      <!-- CARRUSEL DE MEDITACIÓN -->
      <div class="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center animate-slide-in">

        <div class="relative w-full max-w-md overflow-hidden rounded-2xl shadow-lg">

          <!-- TRACK -->
          <div ref="carousel" class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">

            <!-- Slide 1 -->
            <div class="min-w-full snap-center relative">
              <img class="w-full h-[420px] object-cover"
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773" />
              <div class="absolute bottom-0 w-full bg-black/40 p-4 text-white">
                <p class="font-bold">Respira profundo</p>
              </div>
            </div>

            <!-- Slide 2 -->
            <div class="min-w-full snap-center relative">
              <img class="w-full h-[420px] object-cover"
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438" />
              <div class="absolute bottom-0 w-full bg-black/40 p-4 text-white">
                <p class="font-bold">Calma interior</p>
              </div>
            </div>

            <!-- Slide 3 -->
            <div class="min-w-full snap-center relative">
              <img class="w-full h-[420px] object-cover"
                src="https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83" />
              <div class="absolute bottom-0 w-full bg-black/40 p-4 text-white">
                <p class="font-bold">Conexión profunda</p>
              </div>
            </div>

          </div>

          <!-- DOTS -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <span class="w-2.5 h-2.5 bg-white/70 rounded-full"></span>
            <span class="w-2.5 h-2.5 bg-white/40 rounded-full"></span>
            <span class="w-2.5 h-2.5 bg-white/40 rounded-full"></span>
          </div>

        </div>
      </div>

    </div>

    <footer class="bg-gray-900 text-gray-300 pt-10 pb-6 mt-10">

      <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- BRAND -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              F
            </div>
            <span class="text-white font-semibold text-lg">FocusFlow</span>
          </div>

          <p class="text-sm text-gray-400">
            Encuentra tu equilibrio entre productividad y bienestar.
          </p>
        </div>

        <!-- LINKS -->
        <div class="flex flex-col gap-2">
          <span class="text-white font-semibold mb-2">Enlaces</span>

          <span @click="goToTerms" class="cursor-pointer hover:text-white transition">
            Términos y condiciones
          </span>

          <span @click="goToPolicy" class="cursor-pointer hover:text-white transition">
            Política de privacidad
          </span>

          <span class="cursor-pointer hover:text-white transition">
            Soporte
          </span>
        </div>

        <!-- CONTACTO -->
        <div>
          <span class="text-white font-semibold mb-2 block">Contacto</span>

          <div class="flex gap-4 mt-3">

            <!-- ICONOS (decorativos) -->
            <div
              class="w-9 h-9 bg-gray-800 hover:bg-primary transition rounded-full flex items-center justify-center cursor-pointer">
              📧
            </div>

            <div
              class="w-9 h-9 bg-gray-800 hover:bg-primary transition rounded-full flex items-center justify-center cursor-pointer">
              📱
            </div>

            <div
              class="w-9 h-9 bg-gray-800 hover:bg-primary transition rounded-full flex items-center justify-center cursor-pointer">
              🌐
            </div>

          </div>
        </div>

      </div>

      <!-- DIVISOR -->
      <div class="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © 2026 FocusFlow — Todos los derechos reservados
      </div>

    </footer>

  </div>
</template>

<script>
import illustration from "../assets/login-illustration.svg";

export default {
  name: "LandingView",
  data() {
    return {
      illustration,
      currentIndex: 0,
      features: [
        "📌 Gestiona tus tareas fácilmente",
        "⏱️ Controla tu tiempo",
        "🎯 Cumple tus objetivos",
      ],
    };
  },
  mounted() {
    setInterval(() => {
      this.currentIndex =
        (this.currentIndex + 1) % this.features.length;
    }, 2500);
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToForgot() {
      this.$router.push("/forgot-password");
    },
    goToTerms() {
      this.$router.push("/terms-and-conditions");
    },
    goToPolicy() {
      this.$router.push("/data-policy");
    },
  },
};
</script>

<style src="../styles/login.css"></style>

<style scoped>
/* Animaciones */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(40px);
  }

  to {
    opacity: 1;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease;
}

.animate-slide-in {
  animation: slideIn 1s ease;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>