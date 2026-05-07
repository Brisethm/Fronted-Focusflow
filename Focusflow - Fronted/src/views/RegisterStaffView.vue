<template>
  <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/80 backdrop-blur-sm px-4">
      <button @click="$router.back()" class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary hover:bg-primary/10 transition-colors">
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
      <h1 class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10">Registrar Staff</h1>
    </header>

    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Card Principal -->
        <div class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl p-8 space-y-6">
          
          <div class="text-center space-y-2">
            <div class="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-2">
              <span class="material-symbols-outlined text-4xl">person_add</span>
            </div>
            <h2 class="text-2xl font-extrabold text-text-light-primary dark:text-text-dark-primary">Nuevo Miembro</h2>
            <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary">Crea una cuenta para soporte o administración.</p>
          </div>

          <form @submit.prevent="handleRegisterStaff" class="space-y-5">
            
            <!-- Campo Nombre -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1">Nombre Completo</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary text-xl">badge</span>
                <input type="text" v-model="form.nombre" required placeholder="Ej. Lina Pérez" 
                  class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"/>
              </div>
            </div>

            <!-- Campo Email -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1">Correo Electrónico</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary text-xl">mail</span>
                <input type="email" v-model="form.email" required placeholder="staff@focusflow.com" 
                  class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"/>
              </div>
            </div>

            <!-- Campo Contraseña -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1">Contraseña Temporal</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary text-xl">lock</span>
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required placeholder="Mínimo 8 caracteres" 
                  class="w-full pl-11 pr-12 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"/>
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-light-secondary hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              <p v-if="form.password && form.password.length < 8" class="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">error</span> Mínimo 8 caracteres
              </p>
            </div>

            <!-- Campo Rol -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1">Rol Asignado</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary text-xl">manage_accounts</span>
                <select v-model="form.rol" required 
                  class="w-full pl-11 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none">
                  <option value="" disabled>Selecciona un rol</option>
                  <option value="support">Agente de Soporte (PQRs)</option>
                  <option value="admin">Administrador Global</option>
                </select>
              </div>
            </div>

            <!-- Botón Submit -->
            <button type="submit" :disabled="loading || form.password.length < 8" 
              class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2">
              <span v-if="loading" class="animate-spin material-symbols-outlined">progress_activity</span>
              <span v-else class="material-symbols-outlined">how_to_reg</span>
              {{ loading ? 'Registrando...' : 'Crear Cuenta de Staff' }}
            </button>

          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { registerStaff } from "../services/api.js";
import { useToast } from "vue-toastification";

export default {
  name: "CreateStaffView",
  data() {
    return {
      form: {
        nombre: "",
        email: "",
        password: "",
        rol: ""
      },
      showPassword: false,
      loading: false,
      toast: useToast()
    };
  },
  methods: {
    async handleRegisterStaff() {
      this.loading = true;
      try {
        await registerStaff(
          this.form.email, 
          this.form.password, 
          this.form.nombre, 
          this.form.rol
        );
        
        this.toast.success(`¡Éxito! ${this.form.nombre} ha sido registrado.`);
        
        // Limpiamos el form
        this.form = { nombre: "", email: "", password: "", rol: "" };
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Error al crear staff";
        this.toast.error(errorMsg);
      } finally {
        this.loading = false;
      }
    }
  }
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
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>