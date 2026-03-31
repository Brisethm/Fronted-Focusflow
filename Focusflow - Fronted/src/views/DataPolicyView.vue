<!-- src/views/DataPolicy.vue -->
<template>
  <div class="data-policy">
    <h1>Política de Datos</h1>
    <p>
      En FocusFlow valoramos tu privacidad. Esta aplicación recopila y procesa
      datos únicamente para mejorar tu experiencia de productividad y bienestar.
    </p>

    <h2>Uso de la información</h2>
    <ul>
      <li>Los datos se usan para personalizar tu experiencia.</li>
      <li>No compartimos tu información con terceros sin tu consentimiento.</li>
      <li>Puedes solicitar la eliminación de tus datos en cualquier momento.</li>
    </ul>

    <h2>Consentimiento</h2>
    <p>
      Al registrarte, aceptas nuestra política de tratamiento de datos conforme
      a la Ley 1581 de 2012 y demás normas aplicables en Colombia.
    </p>
  </div>
</template>

<script setup>
// No necesitas lógica compleja aquí, es solo un view estático
</script>

<style scoped>
.data-policy {
  max-width: 800px;
  margin: 2rem auto;
  line-height: 1.6;
}
h1, h2 {
  color: #2c3e50;
}
</style>
