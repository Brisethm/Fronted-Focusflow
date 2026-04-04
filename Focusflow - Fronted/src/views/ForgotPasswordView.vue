<template>
    <div class="bg-background-light dark:bg-background-dark font-display h-screen flex overflow-hidden">
        <div class="flex flex-col items-center w-full md:w-1/2 px-4 md:px-8 lg:px-16 overflow-y-auto py-4">
            <div class="flex flex-col items-center text-center mb-6 w-full max-w-sm mt-2">
                <div class="w-32 h-24 mb-2">
                    <svg aria-hidden="true" class="w-24 h-24" fill="none" viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="petalGradientPurple" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#C4B5FD"></stop>
                                <stop offset="100%" stop-color="#8B5CF6"></stop>
                            </linearGradient>
                            <linearGradient id="centerGradientYellow" x1="0.5" x2="0.5" y1="0" y2="1">
                                <stop offset="0%" stop-color="#FDE047"></stop>
                                <stop offset="100%" stop-color="#FBBF24"></stop>
                            </linearGradient>
                        </defs>
                        <g transform="translate(50,50)">
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientPurple)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientPurple)" transform="rotate(72)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientPurple)" transform="rotate(144)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientPurple)" transform="rotate(216)"></path>
                            <path d="M0 -45 C 25 -45, 25 -15, 0 -15 C -25 -15, -25 -45, 0 -45 Z"
                                fill="url(#petalGradientPurple)" transform="rotate(288)"></path>
                        </g>
                        <circle cx="50" cy="50" fill="url(#centerGradientYellow)" r="12"></circle>
                    </svg>


                </div>
                <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Restablece tu contraseña
                </h1>
                <p class="text-base text-gray-600 dark:text-gray-300">
                    Ingresa tu correo electrónico y si el correo existe, recibirás un enlacete un enlace para crear una
                    nueva contraseña.
                </p>
            </div>

            <!-- Formulario de reset -->
            <form class="w-full max-w-sm text-left mb-4" @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="email" class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                        Correo Electrónico
                    </label>
                    <input id="email" name="email" type="email" maxlength="255" v-model="form.email"
                        @blur="validateField('email')" :class="[
                            'w-full h-12 px-4 rounded-lg bg-white dark:bg-gray-800 border focus:outline-none focus:ring-2 focus:ring-primary dark:text-white',
                            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
                        ]" placeholder="Ingresa tu correo electrónico" />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">
                        {{ errors.email }}
                    </p>
                </div>

                <button type="submit"
                    class="w-full h-12 px-5 rounded-lg bg-primary text-white font-bold tracking-wide hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center"
                    :disabled="loading">
                    <span v-if="!loading">Enviar enlace</span>
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
                    Regresar al
                    <router-link to="/login" class="font-medium text-primary hover:underline">
                        Inicio de sesión
                    </router-link>
                </p>
            </div>
        </div>

        <div class="hidden md:flex w-1/2 items-center justify-center bg-gray-100 dark:bg-gray-900 h-full">
            <img :src="forgotPasswordIllustration" alt="Imagen de Freepik" class="max-w-full h-auto" />
        </div>
    </div>
</template>


<script>
import { useToast } from "vue-toastification"
import forgotPasswordIllustration from "../assets/forgot-password-illustration.svg";
import { resetPassword } from "../services/api";

export default {
    name: "ResetPasswordView",
    data() {
        return {
            forgotPasswordIllustration,
            form: {
                email: "",
            },
            errors: {
                email: ""
            },
            loading: false,
            submitted: false,
        };
    },
    methods: {
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
            const toast = useToast()

            this.submitted = true;
            const isValid = this.validateForm();
            if (!isValid) return;

            this.loading = true;

            try {
                await resetPassword(this.form.email);
                this.loading = false;

                toast.success("Si el correo existe, recibirás un enlace en breve con los pasos para restablecer tu contraseña.");
                timeout: 6000
                this.$router.push("/login");
            } catch (error) {
                this.loading = false;

                toast.error(
                    "Error al enviar el correo: " +
                    (error.response?.data || error.message)
                );
                timeout: 6000
            }
        }
    },
};
</script>
