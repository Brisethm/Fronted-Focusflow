<template>
  <div class="bg-[#f5f1eb] min-h-screen font-display text-slate-900">
    <main class="relative mx-auto max-w-xl px-4 py-8">
      <button
        @click="$router.push('/dashboard')"
        class="fixed left-4 top-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm text-slate-800 transition hover:bg-slate-100"
        aria-label="Volver al dashboard"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>

      <div
        class="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_90px_rgba(15,23,42,0.08)]"
      >
        <div
          class="profile-hero relative overflow-hidden rounded-[32px] bg-[#f5ebe2] px-6 pb-14 pt-8"
        >
          <div
            class="absolute left-[-10%] top-6 h-36 w-36 rounded-full bg-[#e7d4bb] opacity-80 blur-3xl"
          ></div>
          <div
            class="absolute right-[-6%] top-20 h-36 w-36 rounded-full bg-[#fff4e7] opacity-80 blur-3xl"
          ></div>

          <div class="relative z-10 text-center">
            <h1 class="text-xl font-semibold tracking-tight text-slate-900">
              Mi Cuenta
            </h1>
            <div
              class="relative mx-auto mt-6 h-32 w-32 rounded-full border-8 border-white bg-slate-100 shadow-[0_16px_45px_rgba(15,23,42,0.12)] flex items-center justify-center text-slate-500"
            >
              <span class="material-symbols-outlined !text-[64px]"
                >account_circle</span
              >
            </div>
            <p class="mt-5 text-xl font-semibold text-slate-900">
              {{ userProfile.nombre || "Usuario FocusFlow" }}
            </p>
            <p class="text-sm text-slate-500">{{ userProfile.email }}</p>
            <span
              v-if="userProfile.rol"
              class="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f2e1c9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7f5a31]"
            >
              <span class="material-symbols-outlined text-base">shield</span>
              {{ String(userProfile.rol).toUpperCase() }}
            </span>
          </div>
        </div>

        <div class="relative px-6 pb-8 pt-8">
          <div v-if="loading" class="flex justify-center py-20">
            <span
              class="material-symbols-outlined text-primary text-5xl animate-spin"
              >progress_activity</span
            >
          </div>

          <div v-else class="space-y-6">
            <section class="space-y-3">
              <h2 class="text-base font-semibold tracking-tight text-slate-900">
                Configuración Personal
              </h2>
              <div class="space-y-3">
                <button
                  @click="toggleEditProfile"
                  class="flex w-full items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-[#faf6f1] px-4 py-4 text-left transition hover:bg-[#f8f3ee]"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#dbe9ff] text-[#1d4ed8] shadow-sm"
                    >
                      <span class="material-symbols-outlined">edit_square</span>
                    </div>
                    <div>
                      <p class="text-base font-semibold text-slate-900">
                        Editar Información
                      </p>
                      <p class="text-sm text-slate-500">
                        Actualiza tus datos personales
                      </p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-slate-400"
                    >chevron_right</span
                  >
                </button>

                <button
                  @click="toggleChangePassword"
                  class="flex w-full items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-[#faf6f1] px-4 py-4 text-left transition hover:bg-[#f8f3ee]"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#e9d7ff] text-[#7c3aed] shadow-sm"
                    >
                      <span class="material-symbols-outlined">lock</span>
                    </div>
                    <div>
                      <p class="text-base font-semibold text-slate-900">
                        Cambiar Contraseña
                      </p>
                      <p class="text-sm text-slate-500">
                        Mantén tu cuenta segura
                      </p>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-slate-400"
                    >chevron_right</span
                  >
                </button>
              </div>
            </section>

            <section class="space-y-3">
              <h2 class="text-base font-semibold tracking-tight text-slate-900">
                Centro de Ayuda
              </h2>
              <button
                @click="$router.push('/support')"
                class="flex w-full items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-[#fafaf8] px-4 py-4 text-left transition hover:bg-[#f4f2ef]"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#d7f4e7] text-[#047857] shadow-sm"
                  >
                    <span class="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p class="text-base font-semibold text-slate-900">
                      Soporte Técnico y PQRs
                    </p>
                    <p class="text-sm text-slate-500">
                      Reporta un problema o revisa tus tickets
                    </p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-400"
                  >chevron_right</span
                >
              </button>
            </section>

            <section
              v-if="
                userProfile.rol === 'admin' || userProfile.rol === 'support'
              "
              class="space-y-3"
            >
              <h2 class="text-base font-semibold tracking-tight text-slate-900">
                Herramientas de Staff
              </h2>
              <button
                @click="
                  $router.push(
                    userProfile.rol === 'admin'
                      ? '/admin-panel'
                      : '/support-dashboard',
                  )
                "
                class="flex w-full items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-[#fafaf8] px-4 py-4 text-left transition hover:bg-[#f4f2ef]"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#fde7d7] text-[#c2410c] shadow-sm"
                  >
                    <span class="material-symbols-outlined"
                      >admin_panel_settings</span
                    >
                  </div>
                  <div>
                    <p class="text-base font-semibold text-slate-900">
                      Panel de Administración
                    </p>
                    <p class="text-sm text-slate-500">
                      Gestión total de FocusFlow
                    </p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-400"
                  >chevron_right</span
                >
              </button>
            </section>

            <div class="pt-2">
              <button
                @click="logout"
                class="w-full rounded-3xl border border-red-200 bg-white px-4 py-3 text-center text-sm font-bold text-red-600 transition hover:bg-red-50"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getProfile, updateProfile, updatePassword } from "../services/api.js";
import { useToast } from "vue-toastification";

export default {
  name: "ProfileView",
  data() {
    return {
      userProfile: {},
      loading: true,

      isEditingProfile: false,
      isChangingPassword: false,

      savingProfile: false,
      savingPassword: false,

      editForm: {
        nombre: "",
        edad: null,
        ocupacion: "",
        objetivo_principal: "",
      },
      passwordForm: {
        newPassword: "",
        confirmPassword: "",
      },

      toast: useToast(),
    };
  },
  async mounted() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      try {
        this.loading = true;
        const profile = await getProfile();
        this.userProfile = profile;

        this.editForm = {
          nombre: profile.nombre || "",
          edad: profile.edad || null,
          ocupacion: profile.ocupacion || "",
          objetivo_principal: profile.objetivo_principal || "",
        };
      } catch (error) {
        this.toast.error("Error al cargar los datos de la cuenta.");
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    toggleEditProfile() {
      if (this.isEditingProfile) {
        this.editForm = {
          nombre: this.userProfile.nombre || "",
          edad: this.userProfile.edad || null,
          ocupacion: this.userProfile.ocupacion || "",
          objetivo_principal: this.userProfile.objetivo_principal || "",
        };
      }
      this.isEditingProfile = !this.isEditingProfile;
      this.isChangingPassword = false;
    },
    async saveProfileInfo() {
      this.savingProfile = true;
      try {
        console.log(this.editForm);
        await updateProfile(this.editForm);
        this.userProfile.nombre = this.editForm.nombre;
        this.userProfile.edad = this.editForm.edad;
        this.userProfile.ocupacion = this.editForm.ocupacion;
        this.userProfile.objetivo_principal = this.editForm.objetivo_principal;

        this.toast.success("¡Perfil actualizado correctamente!");
        this.isEditingProfile = false;
      } catch (error) {
        this.toast.error("Hubo un error al guardar tus cambios.");
        console.error(error);
      } finally {
        this.savingProfile = false;
      }
    },

    toggleChangePassword() {
      this.isChangingPassword = !this.isChangingPassword;
      this.isEditingProfile = false;
      this.passwordForm = { newPassword: "", confirmPassword: "" };
    },
    async saveNewPassword() {
      if (this.passwordForm.newPassword.length < 8) {
        return this.toast.warning(
          "La contraseña debe tener al menos 8 caracteres.",
        );
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        return this.toast.error("Las contraseñas no coinciden.");
      }

      this.savingPassword = true;
      try {
        await updatePassword(this.passwordForm.newPassword);
        this.toast.success("¡Contraseña actualizada con éxito!");
        this.toggleChangePassword();
      } catch (error) {
        this.toast.error(
          error.response?.data?.message ||
            "No se pudo actualizar la contraseña.",
        );
        console.error(error);
      } finally {
        this.savingPassword = false;
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      this.$router.push("/login");
      this.toast.info("Has cerrado sesión correctamente.");
    },
  },
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}
</style>
