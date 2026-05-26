<template>
  <BaseTicketChatModal
    :ticket="ticket"
    show-refresh
    :author-is-support="false"
    empty-message="Aun no hay respuestas. El equipo de soporte te contactara pronto."
    closed-message="Este ticket esta cerrado. Si necesitas mas ayuda, abre uno nuevo."
    input-placeholder="Escribe un mensaje..."
    load-error-message="No se pudieron cargar los mensajes."
    send-error-message="Error al enviar el mensaje. Intentalo de nuevo."
    own-label="Tu"
    support-label="Equipo FocusFlow"
    user-label="Tu"
    @close="$emit('close')"
    @status-updated="$emit('status-updated', $event)"
  />
</template>

<script>
import BaseTicketChatModal from "./BaseTicketChatModal.vue";

export default {
  name: "SupportChatModal",
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
