<template>
    <div class="bg-background-light dark:bg-background-dark font-display h-screen flex overflow-hidden">
        <div class="flex flex-col items-center w-full md:w-1/2 px-4 md:px-8 lg:px-16 overflow-y-auto py-4">
            <div class="flex flex-col items-center text-center mb-6 w-full max-w-sm mt-2">
                <div class="w-32 h-24 mb-2">
                    <svg aria-hidden="true" class="w-24 h-24" fill="none" viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="petalGradientBlue" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#93C5FD"></stop>
                                <stop offset="100%" stop-color="#3B82F6"></stop>
                            </linearGradient>
                            <linearGradient id="centerGradientYellow" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#FDE047"></stop>
                                <stop offset="100%" stop-color="#FBBF24"></stop>
                            </linearGradient>
                        </defs>
                        <g transform="translate(50,50)">
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientBlue)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientBlue)" transform="rotate(72)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientBlue)" transform="rotate(144)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientBlue)" transform="rotate(216)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientBlue)" transform="rotate(288)"></path>
                        </g>
                        <circle cx="50" cy="50" fill="url(#centerGradientYellow)" r="12"></circle>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    ¡Hola de nuevo!
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-300">
                    Inicia sesión para continuar tu viaje hacia el bienestar y la productividad.
                </p>
            </div>
            <form class="w-full max-w-sm text-left mb-4" @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="email" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Correo
                        Electrónico</label>
                    <input id="email" name="email" type="email" maxlength="255" v-model="form.email"
                        @blur="validateField('email')" :class="[
                            'w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary dark:text-white',
                            errors.email
                                ? 'border-red-500'
                                : 'border-gray-300 dark:border-gray-600',
                        ]" placeholder="Ingresa tu correo electrónico" />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">
                        {{ errors.email }}
                    </p>
                </div>

                <div class="mb-3">
                    <label for="password" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Contraseña
                    </label>
                    <div class="relative">
                        <input id="password" name="password" :type="showPassword ? 'text' : 'password'" maxlength="20"
                            v-model="form.password" @blur="validateField('password')" :class="[
                                'w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary dark:text-white pr-10',
                                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                            ]" placeholder="Ingresa tu contraseña" />
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

                    <p v-if="errors.password" class="text-red-500 text-xs mt-1">
                        {{ errors.password }}
                    </p>
                </div>



                <div class="mb-6">
                    <div class="flex items-center">
                        <input id="rememberMe" type="checkbox" v-model="form.rememberMe"
                            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label for="rememberMe"
                            class="ml-2 flex items-center text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
                            <span>Recuérdame</span>
                        </label>
                    </div>
                </div>



                <button type="submit"
                    class="w-full h-12 px-5 rounded-lg bg-primary text-white font-bold tracking-wide hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center">
                    Iniciar Sesión
                </button>
            </form>

            <div class="w-full max-w-sm text-center mt-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes cuenta?
                    <router-link to="/register" class="font-medium text-primary hover:underline">
                        Regístrate
                    </router-link>
                </p>
            </div>

        </div>

        <div class="hidden md:flex w-1/2 items-center justify-center bg-gray-100 dark:bg-gray-900 h-full">
            <img :src="loginIllustration" alt="Imagen de Freepik" class="max-w-full h-auto" />
        </div>
    </div>
</template>

<script>
import loginIllustration from "../assets/login-illustration.svg";
import { login } from "../services/api";

export default {
    name: "LoginView",
    data() {
        return {
            loginIllustration,
            form: {
                email: "",
                password: "",
                rememberMe: false,
            },
            showPassword: false,
            errors: {
                email: "",
                password: ""
            },
            loading: false,
            submitted: false,
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        validateEmail() {
            const email = this.form.email.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) return "El correo es obligatorio";
            if (email.includes(" ")) return "El correo no debe contener espacios";
            if (!email.includes("@")) return "Debe incluir un '@'";
            if (!emailRegex.test(email)) return "Ejemplo válido: usuario@correo.com";

            return "";
        },
        validateField(field) {
            const validators = {
                email: this.validateEmail,
                password: this.validatePassword
            };

            this.errors[field] = validators[field]();
        },
        validatePassword() {
            const password = this.form.password.trim();
            if (!password) return "La contraseña es obligatoria";
            return "";
        },
        validateForm() {
            Object.keys(this.errors).forEach((field) => {
                this.validateField(field);
            });

            return !Object.values(this.errors).some((e) => e);
        },

        async handleSubmit() {
            this.submitted = true;

            const isValid = this.validateForm();
            if (!isValid) return;

            this.loading = true;

            try {
                const response = await login(this.form.email, this.form.password);

                // 👇 Si el usuario marcó "Recuérdame", guardamos en localStorage
                if (this.form.rememberMe) {
                    localStorage.setItem("token", response.token);
                } else {
                    sessionStorage.setItem("token", response.token);
                }

                this.loading = false;
                alert("Login exitoso: " + JSON.stringify(response));
                // Aquí puedes redirigir al dashboard con Vue Router
                this.$router.push("/dashboard");
            } catch (error) {
                this.loading = false;
                alert("Error en el login: " + (error.response?.data || error.message));
            }
        }



    },
};
</script>

<style src="../styles/login.css"></style>