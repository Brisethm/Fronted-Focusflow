<template>
  <BaseTicketChatModal
    :ticket="ticket"
    author-is-support
    can-change-status
    empty-message="No hay respuestas aun. Escribe el primer mensaje."
    closed-message="Este ticket se encuentra cerrado. No se admiten mas respuestas."
    input-placeholder="Escribe una respuesta al usuario..."
    load-error-message="No se pudieron cargar las respuestas."
    send-error-message="Error al enviar la respuesta. Intentalo de nuevo."
    own-label="Equipo de Soporte"
    support-label="Equipo de Soporte"
    user-label="Usuario"
    include-date-time
    @close="$emit('close')"
    @status-updated="$emit('status-updated', $event)"
  />
</template>

<script>
import BaseTicketChatModal from "./BaseTicketChatModal.vue";

export default {
  name: "TicketsChatModal",
  components: {
    BaseTicketChatModal
  },
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "status-updated"]
};
</script>
