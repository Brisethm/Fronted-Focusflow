<script setup>
import { ref } from "vue";
import { register, login, getProfile } from "../services/api";

const email = ref("");
const password = ref("");
const name = ref("");
const result = ref("");

async function handleRegister() {
  try {
    result.value = await register(email.value, password.value, name.value);
  } catch (err) {
    result.value = { error: err.response?.data || err.message };
  }
}


async function handleLogin() {
  try {
    result.value = await login(email.value, password.value);
  } catch (err) {
    result.value = { error: err.message };
  }
}

async function handleProfile() {
  try {
    result.value = await getProfile();
  } catch (err) {
    result.value = { error: err.message };
  }
}
</script>

<template>
  <div class="auth-form">
    <h2>Autenticación</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="name" placeholder="Name" />
    <div class="buttons">
      <button @click="handleRegister">Registrar</button>
      <button @click="handleLogin">Login</button>
      <button @click="handleProfile">Ver Perfil</button>
    </div>
    <pre>{{ result }}</pre>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.buttons {
  display: flex;
  gap: 5px;
}
</style>
