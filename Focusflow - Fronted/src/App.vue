<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";

const router = useRouter();

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

onMounted(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
  const type = hashParams.get("type");

  if (type === "recovery" && accessToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: hashParams.get("refresh_token"),
    });

    router.push("/update-password");
  }
});
</script>

<template>
  <router-view />
</template>
