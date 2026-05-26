import { computed, ref } from "vue";
import { translations } from "./translations.js";

const STORAGE_KEY = "focusflow-locale";

const savedLocale =
  globalThis.window === undefined ? null : localStorage.getItem(STORAGE_KEY);
const initialLocale =
  savedLocale === "es" || savedLocale === "en" ? savedLocale : "es";
export const locale = ref(initialLocale);

export const availableLanguages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

export const localeCode = computed(() =>
  locale.value === "en" ? "en-US" : "es-CO",
);

export function setLocale(newLocale) {
  if (translations[newLocale]) {
    locale.value = newLocale;
    if (globalThis.window !== undefined) {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }
}

export function useLocale() {
  return {
    locale,
    localeCode,
    availableLanguages,
    setLocale,
    t,
  };
}

export function t(path, values = {}) {
  const segments = path.split(".");
  let result = translations[locale.value];
  for (const segment of segments) {
    if (!result) break;
    result = result[segment];
  }
  if (typeof result !== "string") return path;

  return result.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? ` ${key} `);
}
