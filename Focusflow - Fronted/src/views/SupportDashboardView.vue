<template>
    <div class="dashboard-container">
        <header class="dashboard-header">
            <h1>Hola, {{ supportName }} 👋</h1>
            <p>Bienvenida al centro de control de FocusFlow</p>
        </header>

        <div class="cards-grid">
            <!-- Tarjeta 1: Ir al Panel de Usuario -->
            <div class="card" @click="$router.push('/dashboard')">
                <div class="icon-circle user-bg">
                    <i class="fas fa-user"></i>
                </div>
                <h3>Mi Panel de Usuario</h3>
                <p>Gestiona tus propias tareas, pomodoros y registros de energía.</p>
                <button class="card-btn">Ir a mi dashboard</button>
            </div>

            <!-- Tarjeta 2: Atender PQRs -->
            <div class="card" @click="$router.push('/tickets')">
                <div class="icon-circle support-bg">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>Atender PQRs</h3>
                <p>Revisa y responde las inquietudes de los usuarios de FocusFlow.</p>
                <button class="card-btn">Ver tickets</button>
            </div>
        </div>
        <div class="pt-4">
            <button @click="logout"
                class="w-full rounded-lg bg-transparent px-4 py-2.5 text-center font-semibold text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10">
                Cerrar Sesión
            </button>
        </div>
    </div>
</template>

<script>
import { getProfile } from "../services/api.js";

export default {
    name: "SupportDashboard",
    data() {
        return {
            supportName: "",
        };
    },
     methods: {
        logout() {

            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            this.$router.push("/login");
        }
    },
    async mounted() {
        try {
            const profile = await getProfile();
            this.supportName = profile.nombre.split(' ')[0]; // Solo el primer nombre
        } catch (error) {
            console.error("Error al cargar el nombre");
        }
    }
};
</script>

<style scoped>
.dashboard-container {
    max-width: 1000px;
    margin: 60px auto;
    padding: 20px;
    text-align: center;
}

.dashboard-header {
    margin-bottom: 50px;
}

.dashboard-header h1 {
    font-size: 2.5rem;
    color: #1e293b;
}

.dashboard-header p {
    color: #64748b;
    font-size: 1.1rem;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    padding: 10px;
}

.card {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #f1f5f9;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.15);
}

.icon-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: white;
}

.user-bg {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.support-bg {
    background: linear-gradient(135deg, #10b981, #3b82f6);
}

.admin-bg {
    background: linear-gradient(135deg, #f59e0b, #ef4444);
}

.card h3 {
    margin-bottom: 15px;
    color: #1e293b;
}

.card p {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 25px;
}

.card-btn {
    margin-top: auto;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    color: #475569;
    transition: all 0.2s;
}

.card:hover .card-btn {
    background-color: #6366f1;
    color: white;
    border-color: #6366f1;
}
</style>