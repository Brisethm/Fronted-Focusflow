<template>
  <div
    class="bg-background-light dark:bg-background-dark font-display min-h-screen"
  >
    <div class="relative flex min-h-screen w-full flex-col group/design-root">
      <!-- Header con navegación -->
      <header
        class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/80 backdrop-blur-sm px-4"
      >
        <button
          @click="$router.back()"
          class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary hover:bg-primary/10 transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1
          class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10"
        >
          Mi Cuenta
        </h1>
      </header>

      <main class="flex-1 px-4 py-8">
        <div v-if="loading" class="flex justify-center py-20">
          <span
            class="material-symbols-outlined text-primary text-5xl animate-spin"
            >progress_activity</span
          >
        </div>

        <div v-else class="mx-auto max-w-lg space-y-8">
          <!-- Perfil Principal -->
          <section class="flex w-full flex-col items-center gap-4">
            <div class="relative">
              <div
                class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-card-light bg-primary/10 text-primary shadow-md dark:border-card-dark"
              >
                <span class="material-symbols-outlined !text-7xl"
                  >account_circle</span
                >
              </div>
            </div>
            <div class="flex flex-col items-center justify-center text-center">
              <p
                class="text-[22px] font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary"
              >
                {{ userProfile.nombre || "Usuario FocusFlow" }}
              </p>
              <p
                class="text-base font-normal text-text-light-secondary dark:text-text-dark-secondary"
              >
                {{ userProfile.email }}
              </p>
              <!-- Badge de Rol (Solo Staff) -->
              <span
                v-if="
                  userProfile.rol === 'admin' || userProfile.rol === 'support'
                "
                class="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                :class="
                  userProfile.rol === 'admin'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                "
              >
                {{ userProfile.rol }}
              </span>
            </div>
          </section>

          <!-- Sección Configuración y Edición -->
          <section class="space-y-2">
            <h2
              class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary px-2"
            >
              Configuración Personal
            </h2>

            <div
              class="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark transition-all duration-300"
            >
              <!-- MODO VISTA: Lista de opciones -->
              <div v-if="!isEditingProfile && !isChangingPassword">
                <button
                  @click="toggleEditProfile"
                  class="w-full flex items-center gap-4 px-4 min-h-[3.75rem] justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                      <span class="material-symbols-outlined">edit_square</span>
                    </div>
                    <p
                      class="flex-1 text-left truncate text-base font-medium text-text-light-primary dark:text-text-dark-primary"
                    >
                      Editar Información
                    </p>
                  </div>
                  <div class="shrink-0">
                    <span
                      class="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary"
                      >chevron_right</span
                    >
                  </div>
                </button>

                <hr class="border-border-light dark:border-border-dark" />

                <button
                  @click="toggleChangePassword"
                  class="w-full flex items-center gap-4 px-4 min-h-[3.75rem] justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    >
                      <span class="material-symbols-outlined">password</span>
                    </div>
                    <p
                      class="flex-1 text-left truncate text-base font-medium text-text-light-primary dark:text-text-dark-primary"
                    >
                      Cambiar Contraseña
                    </p>
                  </div>
                  <div class="shrink-0">
                    <span
                      class="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary"
                      >chevron_right</span
                    >
                  </div>
                </button>
              </div>

              <!-- MODO EDICIÓN: Perfil -->
              <div
                v-else-if="isEditingProfile"
                class="p-5 space-y-4 bg-background-light/50 dark:bg-background-dark/50"
              >
                <div class="space-y-1">
                  <label
                    class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                    >Nombre Completo</label
                  >
                  <input
                    type="text"
                    v-model="editForm.nombre"
                    class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label
                      class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                      >Edad</label
                    >
                    <input
                      type="number"
                      v-model="editForm.edad"
                      min="10"
                      max="120"
                      class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label
                      class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                      >Ocupación</label
                    >
                    <input
                      type="text"
                      v-model="editForm.ocupacion"
                      placeholder="Ej. Estudiante"
                      class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label
                    class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                  >
                    Objetivo Principal
                  </label>
                  <div class="relative">
                    <select
                      v-model="editForm.objetivo_principal"
                      class="w-full px-4 py-2.5 appearance-none rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Selecciona tu objetivo principal...
                      </option>
                      <option value="reducir_estres">Reducir estrés</option>
                      <option value="mejorar_organizacion">
                        Mejorar organización
                      </option>
                      <option value="aumentar_productividad">
                        Aumentar productividad
                      </option>
                      <option value="equilibrio_vida_trabajo">
                        Equilibrar vida y trabajo
                      </option>
                      <option value="mejorar_habitos">
                        Construir mejores hábitos
                      </option>
                      <option value="otro">Otro</option>
                    </select>
                    <span
                      class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-light-secondary dark:text-text-dark-secondary"
                    >
                      expand_more
                    </span>
                  </div>
                </div>

                <div class="flex gap-3 pt-2">
                  <button
                    @click="toggleEditProfile"
                    :disabled="savingProfile"
                    class="flex-1 py-2.5 rounded-lg font-semibold text-text-light-secondary hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="saveProfileInfo"
                    :disabled="savingProfile"
                    class="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-colors flex justify-center items-center gap-2"
                  >
                    <span
                      v-if="savingProfile"
                      class="material-symbols-outlined animate-spin"
                      >progress_activity</span
                    >
                    {{ savingProfile ? "Guardando..." : "Guardar Cambios" }}
                  </button>
                </div>
              </div>
              <div
                v-else-if="isChangingPassword"
                class="p-5 space-y-4 bg-background-light/50 dark:bg-background-dark/50"
              >
                <div class="space-y-1">
                  <label
                    class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                    >Nueva Contraseña</label
                  >
                  <input
                    type="password"
                    v-model="passwordForm.newPassword"
                    placeholder="Mínimo 8 caracteres"
                    class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div class="space-y-1">
                  <label
                    class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                    >Confirmar Contraseña</label
                  >
                  <input
                    type="password"
                    v-model="passwordForm.confirmPassword"
                    placeholder="Repite la nueva contraseña"
                    class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div class="flex gap-3 pt-2">
                  <button
                    @click="toggleChangePassword"
                    :disabled="savingPassword"
                    class="flex-1 py-2.5 rounded-lg font-semibold text-text-light-secondary hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="saveNewPassword"
                    :disabled="savingPassword"
                    class="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-colors flex justify-center items-center gap-2"
                  >
                    <span
                      v-if="savingPassword"
                      class="material-symbols-outlined animate-spin"
                      >progress_activity</span
                    >
                    {{ savingPassword ? "Actualizando..." : "Actualizar" }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Soporte y PQRs -->
          <section class="space-y-2">
            <h2
              class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary px-2"
            >
              Centro de Ayuda
            </h2>
            <div
              class="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark"
            >
              <button
                @click="$router.push('/support')"
                class="w-full flex items-center gap-4 px-4 py-4 justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark group"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform"
                  >
                    <span class="material-symbols-outlined">support_agent</span>
                  </div>
                  <div class="text-left">
                    <p
                      class="text-base font-bold text-text-light-primary dark:text-text-dark-primary leading-tight"
                    >
                      Soporte Técnico y PQRs
                    </p>
                    <p
                      class="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-0.5"
                    >
                      Reporta un problema o revisa tus tickets
                    </p>
                  </div>
                </div>
                <div class="shrink-0">
                  <span
                    class="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary"
                    >chevron_right</span
                  >
                </div>
              </button>
            </div>
          </section>

          <!-- Panel de Administración / Soporte (Solo Staff) -->
          <section
            v-if="userProfile.rol === 'admin' || userProfile.rol === 'support'"
            class="space-y-2"
          >
            <h2
              class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary px-2"
            >
              Herramientas de Staff
            </h2>
            <div
              class="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark"
            >
              <!-- Ruteo dinámico basado en el rol -->
              <button
                @click="
                  $router.push(
                    userProfile.rol === 'admin'
                      ? '/admin-panel'
                      : '/support-dashboard',
                  )
                "
                class="w-full flex items-center gap-4 px-4 py-4 justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark group"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="flex size-10 shrink-0 items-center justify-center rounded-lg group-hover:scale-110 transition-transform"
                    :class="
                      userProfile.rol === 'admin'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    "
                  >
                    <!-- Icono dinámico -->
                    <span class="material-symbols-outlined">
                      {{
                        userProfile.rol === "admin"
                          ? "admin_panel_settings"
                          : "support_agent"
                      }}
                    </span>
                  </div>
                  <div class="text-left">
                    <!-- Título dinámico -->
                    <p
                      class="text-base font-bold text-text-light-primary dark:text-text-dark-primary leading-tight"
                    >
                      {{
                        userProfile.rol === "admin"
                          ? "Panel de Administración"
                          : "Panel de Soporte"
                      }}
                    </p>
                    <!-- Descripción dinámica -->
                    <p
                      class="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-0.5"
                    >
                      {{
                        userProfile.rol === "admin"
                          ? "Gestión total de FocusFlow"
                          : "Gestión de tickets y usuarios"
                      }}
                    </p>
                  </div>
                </div>
                <div class="shrink-0">
                  <span
                    class="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary"
                    >chevron_right</span
                  >
                </div>
              </button>
            </div>
          </section>

          <div class="pt-2">
            <button
              @click="logout"
              class="w-full rounded-lg bg-transparent px-4 py-2.5 text-center font-bold text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
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
