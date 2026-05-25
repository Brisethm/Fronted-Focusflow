<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";
import { scheduleNotification } from './utils/notifier.js';
import * as api from './services/api.js'; 

const router = useRouter();

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

onMounted(async () => {
  const hashParams = new URLSearchParams(globalThis.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const type = hashParams.get("type");

  if (type === "recovery" && accessToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: hashParams.get("refresh_token"),
    });
    router.push("/update-password");
    return;
  }

  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (token) {
      const recordatorios = await api.getRecordatorios();
      recordatorios.forEach(rec => {
        if (rec.activo) {
          scheduleNotification(rec, async (id) => {
            await api.updateRecordatorio(id, { ...rec, activo: false });
            console.log(`Recordatorio ${id} completado.`);
          });
        }
      });
    }
  } catch (error) {
    // CORREGIDO: Se maneja la variable 'error' correctamente dentro del log para evitar advertencias de SonarLint
    console.error("Error al inicializar y cargar los recordatorios de FocusFlow:", error);
  }
});
</script>