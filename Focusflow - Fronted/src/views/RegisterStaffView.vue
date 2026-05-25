<template>
  <div
    class="min-h-screen bg-[#f5f1eb] font-display flex items-center justify-center py-10 px-4 text-slate-900"
  >
    <div class="w-full max-w-lg">
      <div class="mb-8 px-2 sm:px-0">
        <button
          @click="router.back()"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#7f5a31] hover:text-slate-900 transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          {{ t("common.back") }}
        </button>
        <h1 class="mt-4 text-3xl font-extrabold text-slate-900">
          {{ t("registerStaff.title") }}
        </h1>
      </div>
      <div
        class="relative overflow-hidden rounded-[32px] bg-white shadow-[0_25px_90px_rgba(15,23,42,0.08)] border border-slate-200"
      >
        <div
          class="relative overflow-hidden bg-[#f5ebe2] px-8 pt-10 pb-8 sm:px-12 sm:pt-12"
        >
          <div
            class="absolute left-[-10%] top-6 h-36 w-36 rounded-full bg-[#e7d4bb] opacity-80 blur-3xl"
          ></div>
          <div
            class="absolute right-[-6%] top-20 h-36 w-36 rounded-full bg-[#fff4e7] opacity-80 blur-3xl"
          ></div>
          <div
            class="absolute inset-x-0 top-6 flex justify-center pointer-events-none"
          >
            <div class="relative h-14 w-48">
              <span
                class="material-symbols-outlined absolute left-0 top-1 text-[#e7d4bb] text-xl"
                >star</span
              >
              <span
                class="material-symbols-outlined absolute left-12 top-3 text-[#e7d4bb] text-2xl"
                >star</span
              >
              <span
                class="material-symbols-outlined absolute right-0 top-1 text-[#e7d4bb] text-lg"
                >star</span
              >
              <span
                class="material-symbols-outlined absolute right-8 top-5 text-[#e7d4bb] text-xl"
                >star</span
              >
            </div>
          </div>
          <div
            class="relative z-10 mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-8 border-white bg-slate-100 text-[#7f5a31] shadow-[0_16px_45px_rgba(15,23,42,0.12)] overflow-hidden"
          >
            <template v-if="userAdd">
              <img
                :src="userAdd"
                alt="Agregar usuario"
                class="h-full w-full object-cover"
              />
            </template>
            <template v-else>
              <!-- Fallback SVG si la imagen no está disponible -->
              <svg
                viewBox="0 0 120 120"
                class="h-24 w-24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="#fffefc"
                  stroke="#e7d4bb"
                  stroke-width="6"
                />
                <circle cx="52" cy="48" r="12" fill="#8b5cf6" />
                <path
                  d="M36 84c0-14 10-26 28-26s28 12 28 26v2H36v-2z"
                  fill="#8b5cf6"
                  opacity="0.95"
                />
                <rect
                  x="82"
                  y="44"
                  width="6"
                  height="20"
                  rx="1"
                  fill="#1d4ed8"
                />
                <rect
                  x="72"
                  y="54"
                  width="20"
                  height="6"
                  rx="1"
                  fill="#1d4ed8"
                />
              </svg>
            </template>
          </div>
          <div class="relative z-10 text-center">
            <h1 class="text-3xl font-extrabold text-slate-900">
              {{ t("registerStaff.title") }}
            </h1>
            <p class="mt-3 text-sm text-slate-500">
              {{ t("registerStaff.subtitle") }}
            </p>
          </div>

          <div
            class="relative z-10 mt-8 rounded-[28px] border border-[#e7d4bb] bg-white/45 p-4"
          >
            <div class="mx-auto h-1.5 w-20 rounded-full bg-[#7f5a31]"></div>
          </div>
        </div>

        <div class="px-6 pb-10 sm:px-10">
          <form @submit.prevent="handleRegisterStaff" class="space-y-4">
            <div
              class="rounded-[26px] border border-slate-200 bg-[#faf6f1] px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[#dbe9ff] text-[#1d4ed8]"
              >
                <span class="material-symbols-outlined">badge</span>
              </div>
              <div class="flex-1 min-w-0">
                <label
                  class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >{{ t("registerStaff.fullName") }}</label
                >
                <input
                  type="text"
                  v-model="form.nombre"
                  required
                  :placeholder="t('registerStaff.fullName')"
                  class="mt-2 w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div
              class="rounded-[26px] border border-slate-200 bg-[#faf6f1] px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[#d7f4e7] text-[#047857]"
              >
                <span class="material-symbols-outlined">mail</span>
              </div>
              <div class="flex-1 min-w-0">
                <label
                  class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >{{ t("registerStaff.email") }}</label
                >
                <input
                  type="email"
                  v-model="form.email"
                  required
                  placeholder="staff@focusflow.com"
                  class="mt-2 w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div
              class="rounded-[26px] border border-slate-200 bg-[#faf6f1] px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9d7ff] text-[#7c3aed]"
              >
                <span class="material-symbols-outlined">lock</span>
              </div>
              <div class="flex-1 min-w-0 relative">
                <label
                  class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >{{ t("registerStaff.tempPassword") }}</label
                >
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  required
                  :placeholder="t('registerStaff.tempPassword')"
                  class="mt-2 w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-0 top-8 text-slate-400 hover:text-[#7c3aed] transition-colors"
                >
                  <span class="material-symbols-outlined">{{
                    showPassword ? "visibility_off" : "visibility"
                  }}</span>
                </button>
              </div>
            </div>

            <div
              class="rounded-[26px] border border-slate-200 bg-[#faf6f1] px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div
                class="grid h-12 w-12 place-items-center rounded-2xl bg-[#fde7d7] text-[#c2410c]"
              >
                <span class="material-symbols-outlined">manage_accounts</span>
              </div>
              <div class="flex-1 min-w-0">
                <label
                  class="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >{{ t("registerStaff.selectRole") }}</label
                >
                <select
                  v-model="form.rol"
                  required
                  class="mt-2 w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 appearance-none pr-8"
                >
                  <option value="" disabled>
                    {{ t("registerStaff.selectRole") }}
                  </option>
                  <option value="support">
                    {{ t("registerStaff.supportRole") }}
                  </option>
                  <option value="admin">
                    {{ t("registerStaff.adminRole") }}
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading || form.password.length < 8"
              class="mt-2 w-full rounded-[20px] bg-[#7f5a31] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(127,90,49,0.22)] transition hover:bg-[#6f4d2a] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span
                v-if="loading"
                class="animate-spin material-symbols-outlined"
                >progress_activity</span
              >
              <span v-else class="material-symbols-outlined">how_to_reg</span>
              {{
                loading
                  ? t("registerStaff.creating")
                  : t("registerStaff.createAccount")
              }}
            </button>
          </form>

          <div class="mt-6 border-t border-slate-200 pt-6 text-center">
            <p class="text-sm text-slate-500">
              {{ t("registerStaff.alreadyHaveAccount") }}
              <a
                @click.prevent="router.push('/login')"
                href="#"
                class="font-semibold text-[#7f5a31] hover:text-slate-900"
                >{{ t("registerStaff.login") }}</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userAddAsset from "../assets/user-add.svg";
import { registerStaff } from "../services/api.js";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { t } from "../stores/locale";

export default {
  name: "CreateStaffView",
  setup() {
    return {
      router: useRouter(),
    };
  },
  data() {
    return {
      userAdd: userAddAsset,
      form: {
        nombre: "",
        email: "",
        password: "",
        rol: "",
      },
      showPassword: false,
      loading: false,
      toast: useToast(),
    };
  },

  methods: {
    t,
    async handleRegisterStaff() {
      this.loading = true;
      try {
        await registerStaff(
          this.form.email,
          this.form.password,
          this.form.nombre,
          this.form.rol,
        );

        this.toast.success(`¡Éxito! ${this.form.nombre} ha sido registrado.`);

        // Limpiamos el form
        this.form = { nombre: "", email: "", password: "", rol: "" };
      } catch (error) {
        const errorMsg =
          error.response?.data?.message || "Error al crear staff";
        this.toast.error(errorMsg);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Para quitar la flecha por defecto del select en algunos navegadores */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
}

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
