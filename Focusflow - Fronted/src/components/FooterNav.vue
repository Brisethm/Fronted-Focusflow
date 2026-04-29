<template>
  <div class="h-[4.5rem] shrink-0" aria-hidden="true" />

  <footer
    class="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark"
  >
    <nav
      role="navigation"
      aria-label="Navegación principal"
      class="flex justify-around items-center py-2"
    >
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        :aria-current="currentTab === item.id ? 'page' : undefined"
        :class="[
          'relative flex flex-col items-center gap-1 p-2 rounded-lg',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          currentTab === item.id
            ? 'text-primary'
            : 'text-subtle-light dark:text-subtle-dark hover:text-primary/70 dark:hover:text-primary/70',
        ]"
        @click.prevent="handleSelect(item.id, item.href)"
      >
        <span
          v-if="currentTab === item.id"
          class="absolute inset-0 rounded-lg bg-primary/10 dark:bg-primary/15"
          aria-hidden="true"
        />

        <!-- Icono -->
        <svg
          class="w-6 h-6"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path :d="item.iconPath" />
        </svg>

        <span class="text-xs font-medium leading-none">{{ item.label }}</span>
      </a>
    </nav>
    <div class="h-safe-bottom" />
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  activeTab: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["update:activeTab"]);

const router = useRouter();
const route = useRoute();

// ✅ Deriva el tab activo desde la ruta, sin depender de estado interno
const currentRouteTab = computed(() => {
  const match = navItems.find((item) => item.href === route.path);
  return match?.id ?? "inicio";
});

const currentTab = computed(() => props.activeTab ?? currentRouteTab.value);

function handleSelect(id, href) {
  if (props.activeTab !== null) {
    emit("update:activeTab", id);
  }
  router.push(href);
}

const navItems = [
  {
    id: "inicio",
    label: "Inicio",
    href: "/dashboard",
    iconPath:
      "M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z",
  },
  {
    id: "tareas",
    label: "Tareas",
    href: "/tasks",
    iconPath:
      "M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z",
  },
  {
    id: "enfoque",
    label: "Enfoque",
    href: "/focus",
    iconPath:
      "M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z",
  },
  {
    id: "bienestar",
    label: "Bienestar",
    href: "/",
    iconPath:
      "M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z",
  },
  {
    id: "finanzas",
    label: "Finanzas",
    href: "/",
    iconPath:
      "M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z",
  },
];
</script>
