<template>
    <div class="font-sans min-h-screen flex flex-col">
        <div
            class="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 dark:from-sky-900 dark:via-indigo-900 dark:to-purple-950">
            <main class="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center">
                <div
                    class="w-40 h-40 mb-8 flex items-center justify-center bg-white/70 dark:bg-white/10 rounded-full shadow-lg">
                    <span class="material-symbols-outlined text-8xl text-primary">
                        waving_hand
                    </span>
                </div>
                <h1 class="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
                    ¡Hola, {{ userName }}!
                </h1>
                <p class="text-lg text-gray-700 dark:text-gray-300 max-w-lg mb-8">
                    Queremos conocerte mejor para adaptar
                    <span class="font-bold text-primary">FocusFlow</span> a ti y acompañarte en tu camino hacia el
                    bienestar. Este cuestionario inicial nos ayudará a ofrecerte herramientas ajustadas a tus objetivos,
                    siempre respetando tu privacidad.
                </p>
                <a href="/onboarding-questionnaire"
                    class="inline-block w-full sm:w-auto px-8 py-4 rounded-lg bg-primary text-white font-bold tracking-wide shadow-lg hover:bg-primary/90 transition-all duration-300">
                    Iniciar cuestionario
                </a>
            </main>

            <footer class="px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>© 2026 FocusFlow. Todos los derechos reservados.</p>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: "WelcomeView",
    data() {
        return {
            userName: "",
        };
    },
    mounted() {
        this.userName = localStorage.getItem("userName") || "Usuario";
    },
};
</script>
