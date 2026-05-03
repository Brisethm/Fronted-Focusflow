<template>
  <div class="bg-background-light dark:bg-background-dark font-display">
    <div
      class="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden"
    >
      <div class="flex-grow">
        <header
          class="sticky top-0 z-10 flex items-center bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80"
        >
          <button class="text-slate-800 dark:text-slate-200">
            <span class="material-symbols-outlined text-3xl">menu</span>
          </button>
          <h1
            class="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white pr-8"
          >
            Bienestar
          </h1>
        </header>
        <main class="p-4 sm:p-6">
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
            <section>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Ejercicios de respiración
              </h3>
              <div class="space-y-4">
                <div
                  class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
                >
                  <div
                    class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuDra2tNFX06RiuzI1ZjxXSB5GqsWzO2-bTg6wu7d_g98sMJ4jg37Uc4bbt2cDimivunb8I91_x3DL3pCdhW6FbjaddZKFf7S_KpOKsTqKy-0g7y-9TgNLOxGX2aV_Lmuj69IHomOoU2wS1YM8hOQ4bSxZTe6MYGJjus2_p2Z5pi-E5PsB3jWevhO3g3b0E8ozH_EilaXns-PSUc6IEipm3xSXoom0mJK1zLGSyrhh9PQtgBuPkYqc5BN6FDJx4YC2vTfXQg6wpQhCUl&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">3 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Respiración cuadrada
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Inhala, mantén, exhala, mantén. Repite.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
                <div
                  class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
                >
                  <div
                    class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuA-lXBRuDEQxWNV887gETPFT4PjJ2r1njdMbDni95GdDMEGNmJd1KgxONto7fqZBhk3DP5_OdEHZdRX-Nl1yXDCJX0yxaTtND659uVDI8Gbo05eOh4Cnd48o2osDSSI4k5M8gOxr7uEw7IltCsAoAtLfIw0S7GcYOUhHzlTgWcSw9j290cVa2J9jswGERCNlN2YXnDhD2dTS_S08yGfBXc5OMllUJuOa4yOPXPlw3JmCwmlmEzwY_Eyk2EjOz2jTEa0V_IqiHhd7bNa&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">5 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Respiración 4-7-8
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Inhala 4s, mantén 7s, exhala 8s.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
              </div>
            </section>
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
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuB2JH5F4oLmCjzG77p9P5GGyGcNnOxhi-5FpfY8aBx-UXneqEfobztKWElQIcozpOveOgvmSJ3ZOMsPc8SAPiQbKSHbmSyf82kfiuaOe-OnuyyvDB622X2WGzkN9kyu5WjsZ1Ns1XoZ22ImNk5wTrtDkUJN6wP343bkCjZ_Ay_7GsGco7iG3LoBFeq9fdTqleBtq0LokrNFcbJ46oVjQzrmzbxREPfVq66DhV5HuShpjsDyzpJuhDA-YyUYUBTv_TnisxrVhIxcdK0F&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">10 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Estiramientos de oficina
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Estiramientos para aliviar la tensión.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
                <div
                  class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
                >
                  <div
                    class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuBAYYxwgNkzENmeXtN5-WZVaP5DBj9jkbO8m-tQTIwcDDwCSRjq0Re48mZD0UHOsXDyraEPQkEZB1gPQq8_u7qmP5VT1tg4OrCWR3Hlmqjhtvupkz8Mcn9ALYMSwqdYU2QDbzhDghcHtxKCKwaQoV0jFi1f2TFaY1KN7Mzc1Ekd1Tky1FR-6jAT9ykRj722LeMkGwqlx-5nLnrN0WfYYWQsqamvDZ7gL0NTiQu9ZHFyD63_Ekc7vPPO1I7nH38DNSVsCrzVVkk33l4T&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">15 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Yoga de escritorio
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Posturas de yoga para hacer en tu silla.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
              </div>
            </section>
            <section>
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Meditaciones guiadas
              </h3>
              <div class="space-y-4">
                <div
                  class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
                >
                  <div
                    class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuBL_GhmgafrW129CM-Ux5j5wWTs2zBCuE-O-AWc0xOzTD3XrzouadTz3h43yChKPVwg66iuem--WmFVeh94XSgG2gdoQOb0D1rFoAcF62H3d8qjRxpc-XJV2Q97hk-7ZAfLNmZ2N6wa-Hp30ooEKGav9p0saaqsWpwaC9lrRlJcFwoen7JZ8n5uPzWzzP5axzcQ0-LauEAx_wId6RGw9yGql4vQmqMidkeE2Vl6O6MC9PU3K6W0hea3HsJH3KK88nYKU8KhMQCCVDnS&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">20 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Meditación de atención plena
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Enfócate en el presente.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
                <div
                  class="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800/50"
                >
                  <div
                    class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style="
                      background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuDxoJasmLrbZR_eq6DEyzBQ2ASfz2r9d-vTnZqxBxYejRKOvz-TUbeW1oq1kd5KVCAq13nub9SPDjTDzeZKz1C6y5-VWSI-dYoUzNe6nXH-BDBDRpou_cFIHV9xiGN78l0u5-7uE2g9LarCf_WgL6bk1e0L5H02yOcUkKwHf8AKMhl1YIVlvSyw_4_fBbZY_7iFBP4R4NUc1qAQ5JfECnS_rHwdWScPUjCEvzEX8aZT-K7jL01RRhPMVp3EjaZTtdNGvLyKxZIAjvfu&quot;);
                    "
                  ></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-primary">25 minutos</p>
                    <p
                      class="text-base font-bold text-slate-800 dark:text-slate-100"
                    >
                      Meditación de gratitud
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Reflexiona sobre lo que agradeces.
                    </p>
                  </div>
                  <button class="text-slate-400 dark:text-slate-500">
                    <span class="material-symbols-outlined">play_circle</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <nav
        class="sticky bottom-0 z-10 border-t border-slate-200 bg-background-light/90 backdrop-blur-sm dark:border-slate-800 dark:bg-background-dark/90"
      >
        <div class="flex justify-around px-2 pt-2 pb-4">
          <a
            class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            href="#"
          >
            <span class="material-symbols-outlined">home</span>
            <span class="text-xs font-medium">Inicio</span>
          </a>
          <a
            class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            href="#"
          >
            <span class="material-symbols-outlined">check_box</span>
            <span class="text-xs font-medium">Tareas</span>
          </a>
          <a
            class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            href="#"
          >
            <span class="material-symbols-outlined">track_changes</span>
            <span class="text-xs font-medium">Enfoque</span>
          </a>
          <a class="flex flex-col items-center gap-1 text-primary" href="#">
            <span
              class="material-symbols-outlined"
              style="font-variation-settings: &quot;FILL&quot; 1"
              >favorite</span
            >
            <span class="text-xs font-bold">Bienestar</span>
          </a>
          <a
            class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            href="#"
          >
            <span class="material-symbols-outlined">paid</span>
            <span class="text-xs font-medium">Finanzas</span>
          </a>
        </div>
      </nav>
    </div>
  </div>
</template>
<script setup>
// Importamos ref para estados reactivos
import { ref } from "vue";

// Ejemplo de estado
const mensaje = ref("Hola desde la vista");

// Ejemplo de función
function accion() {
  console.log(mensaje.value);
}
</script>
