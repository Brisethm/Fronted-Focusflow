<template>
    <div class="bg-background-light dark:bg-background-dark font-display h-screen flex overflow-hidden">
        <div class="flex flex-col items-center w-full md:w-1/2 px-4 md:px-8 lg:px-16 overflow-y-auto py-4">
            <div class="flex flex-col items-center text-center mb-6 w-full max-w-sm mt-2">
                <div class="w-32 h-24 mb-2">
                    <svg aria-hidden="true" class="w-24 h-24" fill="none" viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="petalGradientGreen" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#A7F3D0"></stop> <!-- verde menta pastel -->
                                <stop offset="100%" stop-color="#6EE7B7"></stop> <!-- verde suave pastel -->
                            </linearGradient>
                            <linearGradient id="centerGradientYellowPastel" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#FEF3C7"></stop> <!-- amarillo pastel -->
                                <stop offset="100%" stop-color="#FDE68A"></stop> <!-- amarillo un poco más intenso -->
                            </linearGradient>
                        </defs>
                        <g transform="translate(50,50)">
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientGreen)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientGreen)" transform="rotate(72)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientGreen)" transform="rotate(144)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientGreen)" transform="rotate(216)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientGreen)" transform="rotate(288)"></path>
                        </g>
                        <circle cx="50" cy="50" fill="url(#centerGradientYellowPastel)" r="12"></circle>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Crea una nueva contraseña
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-300">
                    Elige una contraseña segura y única, distinta de la anterior, para proteger mejor tu cuenta.
                </p>
            </div>
            <form class="w-full max-w-sm text-left mb-4" @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="password" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Nueva contraseña
                    </label>
                    <div class="relative">
                        <input id="password" name="password" :type="showPassword ? 'text' : 'password'" maxlength="20"
                            v-model="form.password" @blur="validateField('password')" :class="[
                                'w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary dark:text-white pr-10',
                                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                            ]" placeholder="Crea una contraseña segura" />
                        <button type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            @click="togglePassword">
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362m3.362-2.042A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-2.042 3.362M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>
                    <ul class="text-xs mt-2 space-y-1 text-gray-500">
                        <li :class="{ 'text-green-500': form.password.length >= 8 }">• Mínimo 8 caracteres</li>
                        <li :class="{ 'text-green-500': /[A-Z]/.test(form.password) }">• Una mayúscula</li>
                        <li :class="{ 'text-green-500': /[a-z]/.test(form.password) }">• Una minúscula</li>
                        <li :class="{ 'text-green-500': /\d/.test(form.password) }">• Un número</li>
                    </ul>
                    <p v-if="errors.password" class="text-red-500 text-xs mt-1">
                        {{ errors.password }}
                    </p>
                </div>

                <div class="mb-3">
                    <label for="confirmPassword" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Confirmación de contraseña
                    </label>
                    <div class="relative">
                        <input id="confirmPassword" name="confirmPassword" :type="showPassword ? 'text' : 'password'"
                            maxlength="20" v-model="form.confirmPassword" @blur="validateField('confirmPassword')"
                            :class="[
                                'w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary dark:text-white pr-10',
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                            ]" placeholder="Confirma tu contraseña" />
                        <button type="button"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                            @click="togglePassword">
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362m3.362-2.042A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-2.042 3.362M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                            </svg>
                        </button>
                    </div>

                    <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">
                        {{ errors.confirmPassword }}
                    </p>
                </div>

                <button type="submit"
                    class="w-full h-12 px-5 rounded-lg bg-primary text-white font-bold tracking-wide hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center"
                    :disabled="loading">
                    <span v-if="!loading">Cambiar contraseña</span>
                    <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
                        </path>
                    </svg>
                </button>
            </form>

            <div class="w-full max-w-sm text-center mt-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Volver al
                    <router-link to="/login" class="font-medium text-primary hover:underline">
                        Inicio de sesión
                    </router-link>
                </p>
            </div>

        </div>

        <div class="hidden md:flex w-1/2 items-center justify-center bg-gray-100 dark:bg-gray-900 h-full">
            <img :src="updatePasswordIllustration" alt="Tomado de Freepik" class="max-w-full h-auto" />
        </div>
    </div>
</template>
<script>
import updatePasswordIllustration from "../assets/update-password-illustration.svg";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "vue-toastification";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default {
    name: "UpdatePasswordView",
    data() {
        return {
            updatePasswordIllustration,
            form: {
                password: "",
                confirmPassword: "",
            },
            showPassword: false,
            errors: {
                password: "",
                confirmPassword: "",
            },
            loading: false,
            submitted: false,
        };
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        validatePassword() {
            const password = this.form.password;
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;

            if (!password) return "La contraseña es obligatoria";
            if (!regex.test(password)) {
                return "Debe tener 8-20 caracteres, mayúscula, minúscula y un número";
            }
            return "";
        },

        validateConfirmPassword() {
            if (!this.form.confirmPassword) return "Confirma tu contraseña";
            if (this.form.password !== this.form.confirmPassword) {
                return "Las contraseñas no coinciden";
            }
            return "";
        },

        validateField(field) {
            const validators = {
                password: this.validatePassword,
                confirmPassword: this.validateConfirmPassword,
            };
            this.errors[field] = validators[field]();
        },

        validateForm() {
            Object.keys(this.errors).forEach((field) => {
                this.validateField(field);
            });
            return !Object.values(this.errors).some((e) => e);
        },

        async handleSubmit() {
            const isValid = this.validateForm();
            if (!isValid) return;

            this.loading = true;

            try {
                const { error } = await supabase.auth.updateUser({
                    password: this.form.password,
                });

                if (error) {
                    this.toast.error("Error: " + error.message, { timeout: 6000 });
                } else {
                    this.toast.success(
                        "Contraseña actualizada correctamente",
                        { timeout: 3000 }
                    );
                    setTimeout(() => {
                        this.$router.push("/login");
                    }, 2000);
                }
            } catch (error) {
                console.error("Error actualizando contraseña:", error);
                this.toast.error(
                    "Error inesperado al actualizar la contraseña",
                    { timeout: 3000 }
                );
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>