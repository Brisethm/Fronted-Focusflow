<template>
  <div class="bg-background-light dark:bg-background-dark font-display relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden">
    <div class="flex-grow">
      <!-- Header: Botón eliminado y título centrado -->
      <header
        class="sticky top-0 z-10 flex items-center bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80"
      >
        <h1
          class="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white"
        >
          Bienestar
        </h1>
      </header>

      <main class="p-4 sm:p-6">
        <!-- Título y Descripción -->
        <div class="mb-6">
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white">
            Bienestar
          </h2>
          <p class="mt-2 text-slate-600 dark:text-slate-400">
            Encuentra tu equilibrio con ejercicios de respiración, pausas
            activas y meditaciones guiadas.
          </p>
        </div>

        <div class="space-y-8">
          <!-- Sección de Respiración -->
          <section>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Ejercicios de respiración
            </h3>
            <div class="space-y-4">
              
              <!-- Ejercicio 1: Respiración Cuadrada -->
              <div
                class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
              >
                <div
                  class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                  style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDra2tNFX06RiuzI1ZjxXSB5GqsWzO2-bTg6wu7d_g98sMJ4jg37Uc4bbt2cDimivunb8I91_x3DL3pCdhW6FbjaddZKFf7S_KpOKsTqKy-0g7y-9TgNLOxGX2aV_Lmuj69IHomOoU2wS1YM8hOQ4bSxZTe6MYGJjus2_p2Z5pi-E5PsB3jWevhO3g3b0E8ozH_EilaXns-PSUc6IEipm3xSXoom0mJK1zLGSyrhh9PQtgBuPkYqc5BN6FDJx4YC2vTfXQg6wpQhCUl');"
                ></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-primary">3 minutos</p>
                  <p class="text-base font-bold text-slate-800 dark:text-slate-100">
                    Respiración cuadrada
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    Inhala, mantén, exhala, mantén. Repite.
                  </p>
                </div>
                <button class="text-slate-400 dark:text-slate-500">
                  <span class="material-symbols-outlined text-3xl">play_circle</span>
                </button>
              </div>

              <!-- Ejercicio 2: Técnica de la Caja (Desplegable) -->
              <div
                class="flex flex-col rounded-xl bg-white p-4 shadow-sm transition-all duration-300 dark:bg-slate-800/50"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-lXBRuDEQxWNV887gETPFT4PjJ2r1njdMbDni95GdDMEGNmJd1KgxONto7fqZBhk3DP5_OdEHZdRX-Nl1yXDCJX0yxaTtND659uVDI8Gbo05eOh4Cnd48o2osDSSI4k5M8gOxr7uEw7IltCsAoAtLfIw0S7GcYOUhHzlTgWcSw9j290cVa2J9jswGERCNlN2YXnDhD2dTS_S08yGfBXc5OMllUJuOa4yOPXPlw3JmCwmlmEzwY_Eyk2EjOz2jTEa0V_IqiHhd7bNa');"
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">11 minutos</p>
                    <p class="text-base font-bold text-slate-800 dark:text-slate-100">
                      Técnica: La Caja
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Inhala 4s, mantén 4s, exhala 4s.
                    </p>
                  </div>
                  
                  <button 
                    @click="mostrarVideoCaja = !mostrarVideoCaja"
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-light"
                  >
                    <span class="material-symbols-outlined">
                      {{ mostrarVideoCaja ? 'expand_less' : 'play_arrow' }}
                    </span>
                  </button>
                </div>

                <div 
                  v-show="mostrarVideoCaja" 
                  class="mt-4 w-full overflow-hidden rounded-lg bg-slate-900 shadow-inner"
                >
                  <div class="aspect-video w-full">
                    <iframe 
                      class="h-full w-full border-0"
                      src="https://www.youtube.com/embed/AXsBog5Q9BU" 
                      title="TÉCNICA RESPIRACIÓN PARA LA ANSIEDAD - LA CAJA" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div class="bg-slate-100 py-1.5 px-3 text-right dark:bg-slate-800">
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Créditos: The Vortex Way
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección de Pausas Activas -->
          <section>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Pausas activas
            </h3>
            <div class="space-y-4">
              <div
                class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
              >
                <div
                  class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                  style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB2JH5F4oLmCjzG77p9P5GGyGcNnOxhi-5FpfY8aBx-UXneqEfobztKWElQIcozpOveOgvmSJ3ZOMsPc8SAPiQbKSHbmSyf82kfiuaOe-OnuyyvDB622X2WGzkN9kyu5WjsZ1Ns1XoZ22ImNk5wTrtDkUJN6wP343bkCjZ_Ay_7GsGco7iG3LoBFeq9fdTqleBtq0LokrNFcbJ46oVjQzrmzbxREPfVq66DhV5HuShpjsDyzpJuhDA-YyUYUBTv_TnisxrVhIxcdK0F');"
                ></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-primary">10 minutos</p>
                  <p class="text-base font-bold text-slate-800 dark:text-slate-100">
                    Estiramientos de oficina
                  </p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">
                    Alivia la tensión acumulada.
                  </p>
                </div>
                <button class="text-slate-400 dark:text-slate-500">
                  <span class="material-symbols-outlined text-3xl">play_circle</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
    <FooterNav />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FooterNav from '../components/FooterNav.vue'; // Corregido el import (sin llaves si es export default)

const mostrarVideoCaja = ref(false);
</script>