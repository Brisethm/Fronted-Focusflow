<template>
    <div class="bg-background-light dark:bg-background-dark font-display min-h-screen">
        <div class="relative flex min-h-screen w-full flex-col group/design-root">

            <!-- Header con navegación -->
            <header
                class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/80 backdrop-blur-sm px-4">
                <button @click="$router.back()"
                    class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary">
                    <span class="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1
                    class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10">
                    Mi Cuenta</h1>
            </header>

            <main class="flex-1 px-4 py-8">
                <div v-if="loading" class="flex justify-center py-20">
                    <span class="text-primary animate-pulse text-xl font-bold">Cargando perfil...</span>
                </div>

                <div v-else class="mx-auto max-w-lg space-y-8">

                    <!-- Perfil Principal -->
                    <section class="flex w-full flex-col items-center gap-4">
                        <div class="relative">
                            <div
                                class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-card-light bg-primary/10 text-primary shadow-md dark:border-card-dark">
                                <span class="material-symbols-outlined !text-7xl">account_circle</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-center justify-center text-center">
                            <p
                                class="text-[22px] font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">
                                {{ userProfile.nombre }}
                            </p>
                            <p class="text-base font-normal text-text-light-secondary dark:text-text-dark-secondary">
                                {{ userProfile.email }}
                            </p>
                            <span v-if="userProfile.rol === 'admin' || userProfile.rol === 'support'"
                                class="mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                                :class="userProfile.rol === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'">
                                {{ userProfile.rol }}
                            </span>
                        </div>
                    </section>

                    <!-- Sección Cuenta -->
                    <section class="space-y-2">
                        <h2 class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary px-2">
                            Configuración</h2>
                        <div
                            class="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark">

                            <!-- Botón para disparar el Reset Password que ya tienes -->
                            <button @click="handleResetPassword"
                                class="w-full flex items-center gap-4 px-4 min-h-[3.75rem] justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <span class="material-symbols-outlined">lock</span>
                                    </div>
                                    <p
                                        class="flex-1 truncate text-base font-medium text-text-light-primary dark:text-text-dark-primary">
                                        Restablecer Contraseña</p>
                                </div>
                                <div class="shrink-0">
                                    <span
                                        class="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
                                </div>
                            </button>

                            <hr class="border-border-light dark:border-border-dark" />

                            <div
                                class="flex items-center gap-4 px-4 min-h-[3.75rem] justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark opacity-50">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <span class="material-symbols-outlined">person</span>
                                    </div>
                                    <p
                                        class="flex-1 truncate text-base font-medium text-text-light-primary dark:text-text-dark-primary">
                                        Editar Información (Próximamente)</p>
                                </div>
                            </div>

                        </div>
                    </section>

                    <!-- Soporte (Ideal para tu flujo de PQRs) -->
                    <section class="space-y-2">
                        <h2 class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary px-2">Ayuda
                        </h2>
                        <div
                            class="overflow-hidden rounded-xl border border-border-light bg-card-light shadow-sm dark:border-border-dark dark:bg-card-dark">
                            <button @click="$router.push('/support')"
                                class="w-full flex items-center gap-4 px-4 min-h-[3.75rem] justify-between transition-colors hover:bg-background-light dark:hover:bg-background-dark">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <span class="material-symbols-outlined">help_center</span>
                                    </div>
                                    <p
                                        class="flex-1 truncate text-base font-medium text-text-light-primary dark:text-text-dark-primary">
                                        Reportar PQR</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    <div class="pt-4">
                        <button @click="logout"
                            class="w-full rounded-lg bg-transparent px-4 py-2.5 text-center font-semibold text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { getProfile, resetPassword } from "../services/api.js";
import { useToast } from "vue-toastification";

export default {
    name: "AccountView",
    data() {
        return {
            userProfile: {
                nombre: "",
                email: "",
                rol: ""
            },
            loading: true,
            toast: useToast()
        };
    },
    async mounted() {
        try {
            const profile = await getProfile();
            this.userProfile = profile;
        } catch (error) {
            this.toast.error("Error al cargar los datos de la cuenta.");
            console.error(error);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        async handleResetPassword() {
            try {
                await resetPassword(this.userProfile.email);
                this.toast.success("Correo de recuperación enviado a " + this.userProfile.email);
            } catch (error) {
                this.toast.error("No se pudo enviar el correo de recuperación.");
            }
        },
        logout() {
            // Limpiamos el localStorage y mandamos al login
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            this.$router.push("/login");
            this.toast.info("Has cerrado sesión correctamente.");
        }
    }
};
</script>

<style scoped>
/* Tu configuración de Manrope ya está en el index.html, así que aquí no hace falta cargarla */
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>