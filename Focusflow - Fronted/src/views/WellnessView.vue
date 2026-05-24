<template>
  <div
    class="bg-background-light dark:bg-background-dark font-display flex min-h-screen flex-col"
  >
    <header
      class="sticky top-0 z-10 bg-background-light/80 px-4 py-3 backdrop-blur-sm dark:bg-background-dark/80"
    >
      <h1 class="text-center text-lg font-bold text-slate-900 dark:text-white">
        Bienestar
      </h1>
    </header>

    <main class="flex-1 p-4 sm:p-6">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
          Módulo de bienestar
        </h2>

        <p class="text-slate-600 dark:text-slate-400 mt-2">
          Respiración, pausas activas y meditaciones guiadas para reducir estrés
          y mejorar concentración.
        </p>
      </div>

      <section v-for="section in sections" :key="section.title" class="mb-10">
        <h3 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          <span class="material-symbols-outlined mr-2 align-middle">
            {{ section.icon }}
          </span>

          {{ section.title }}
        </h3>

        <div class="space-y-4">
          <div
            v-for="video in section.videos"
            :key="video.title"
            class="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800"
          >
            <div class="flex gap-4">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10"
              >
                <span class="material-symbols-outlined text-3xl text-primary">
                  {{ video.videoIcon }}
                </span>
              </div>

              <div class="flex-1">
                <p class="text-sm text-primary">
                  {{ video.author }}
                </p>

                <h4 class="font-bold text-slate-800 dark:text-white">
                  {{ video.title }}
                </h4>
              </div>

              <button
                @click="toggleVideo(video.id)"
                class="h-10 w-10 rounded-full bg-primary/10"
              >
                <span class="material-symbols-outlined">
                  {{
                    expandedVideo === video.id ? "expand_less" : "play_arrow"
                  }}
                </span>
              </button>
            </div>

            <div
              v-show="expandedVideo === video.id"
              class="mt-4 overflow-hidden rounded-xl"
            >
              <div class="aspect-video">
                <iframe
                  class="h-full w-full"
                  :src="video.embed"
                  :title="video.title"
                  allowfullscreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterNav />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FooterNav from "../components/FooterNav.vue";

const expandedVideo = ref(null);

const toggleVideo = (id) => {
  expandedVideo.value = expandedVideo.value === id ? null : id;
};

const sections = [
  {
    title: "Respiración",
    icon: "air",

    videos: [
      {
        id: 0,
        videoIcon: "square",
        title: "Respiración de la Caja",
        author: "The Vortex Way",
        embed: "https://www.youtube.com/embed/AXsBog5Q9BU",
      },

      {
        id: 1,
        videoIcon: "air",
        title: "Respirar es vida | Pranayama",
        author: "Anabel Otero",
        embed: "https://www.youtube.com/embed/-LHUfN7n7Io",
      },

      {
        id: 2,
        videoIcon: "self_improvement",
        title: "4-7-8 Relaxation Breathing",
        author: "Hands-On Meditation",
        embed: "https://www.youtube.com/embed/S6CmxoIkHd4",
      },
    ],
  },

  {
    title: "Pausas activas",
    icon: "accessibility",

    videos: [
      {
        id: 3,
        videoIcon: "front_hand",
        title: "Ejercicios para túnel carpiano",
        author: "Marcos Sacristán",
        embed: "https://www.youtube.com/embed/zFwAaLhh2qw",
      },

      {
        id: 4,
        videoIcon: "airline_seat_recline_extra",
        title: "Dolor cuello y hombros",
        author: "Anabel Otero",
        embed: "https://www.youtube.com/embed/8tyO0ti6NL0",
      },

      {
        id: 5,
        videoIcon: "self_improvement",
        title: "Rutina cervicales 15 min",
        author: "Marcos Sacristán",
        embed: "https://www.youtube.com/embed/NEqp5YXLhs8",
      },

      {
        id: 6,
        videoIcon: "fitness_center",
        title: "Pausa activa cuello",
        author: "GYM HOME",
        embed: "https://www.youtube.com/embed/E6NhedE6SeA",
      },

      {
        id: 7,
        videoIcon: "front_hand",
        title: "Muñecas y brazos",
        author: "ACHS",
        embed: "https://www.youtube.com/embed/wgRunjcFwvA",
      },
    ],
  },

  {
    title: "Meditaciones",
    icon: "spa",

    videos: [
      {
        id: 8,
        videoIcon: "spa",
        title: "Mindfulness para relajar mente",
        author: "Mindful Science",
        embed: "https://www.youtube.com/embed/xxmtGjcKgo4",
      },

      {
        id: 9,
        videoIcon: "psychology",
        title: "Meditación principiantes",
        author: "CuriosaMente",
        embed: "https://www.youtube.com/embed/3oCC4NDgYrY",
      },

      {
        id: 10,
        videoIcon: "bedtime",
        title: "Dormir profundamente",
        author: "Mindful Science",
        embed: "https://www.youtube.com/embed/SaeHBAsVaGg",
      },

      {
        id: 11,
        videoIcon: "self_improvement",
        title: "Aquietar la mente",
        author: "Mindful Science",
        embed: "https://www.youtube.com/embed/NgmrVI5H5JE",
      },
    ],
  },
];
</script>
