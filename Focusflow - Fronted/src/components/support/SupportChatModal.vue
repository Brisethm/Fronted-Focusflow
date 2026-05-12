<template>
  <Transition name="modal">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      @click.self="requestClose"
    >
      <div class="bg-card-light dark:bg-card-dark w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div class="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-background-light dark:bg-background-dark shrink-0">
          <div>
            <h3 class="font-bold text-lg text-text-light-primary dark:text-text-dark-primary">
              Ticket #{{ ticket.idTicket }}
            </h3>
            <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary">
              Creado el {{ formatDate(ticket.fechaCreacion) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="loadResponses(false)"
              class="flex items-center justify-center p-1 rounded-full text-text-light-secondary hover:text-primary hover:bg-primary/10 transition-colors"
              title="Actualizar chat"
            >
              <span class="material-symbols-outlined text-[18px]">refresh</span>
            </button>

            <span v-if="isSignalRConnected" class="flex items-center gap-1 text-xs text-emerald-500 font-semibold mr-1">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En vivo
            </span>
            <span :class="getStatusClass(localTicket.estado)" class="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm shrink-0">
              {{ translateStatus(localTicket.estado) }}
            </span>
            <button
              @click="requestClose"
              class="text-text-light-secondary hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div ref="chatContainer" class="flex-1 overflow-y-auto p-5 space-y-6 chat-scroll bg-white">
          <div class="bg-primary/5 border border-primary/20 p-4 rounded-xl shadow-sm">
            <h4 class="font-extrabold text-gray-800 mb-2 text-lg">
              {{ localTicket.asunto }}
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">
              {{ localTicket.descripcion }}
            </p>
          </div>

          <hr class="border-gray-200" />

          <div class="space-y-4">
            <h4 class="font-bold text-sm text-gray-800 uppercase tracking-wider">
              Conversación
            </h4>

            <div v-if="loadingResponses" class="flex justify-center py-4">
              <span class="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>

            <div v-else-if="responses.length === 0" class="text-center text-sm text-gray-500 py-4">
              Aún no hay respuestas. El equipo de soporte te contactará pronto.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="resp in responses"
                :key="resp.idRespuesta"
                class="flex flex-col"
                :class="!resp.esSoporte ? 'items-end' : 'items-start'"
              >
                <span class="text-[10px] font-semibold text-gray-500 mb-1 px-1">
                  {{ !resp.esSoporte ? 'Tú' : 'Equipo FocusFlow' }} • {{ formatTime(resp.fecha) }}
                </span>
                <div
                  class="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm"
                  :class="!resp.esSoporte
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-sm'"
                >
                  {{ resp.mensaje }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shrink-0">
          <div
            v-if="localTicket.estado === 'closed'"
            class="text-center text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary py-2 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-lg">lock</span>
            Este ticket está cerrado. Si necesitas más ayuda, abre uno nuevo.
          </div>

          <form v-else @submit.prevent="handleSendResponse" class="flex gap-2">
            <input
              type="text"
              v-model="newMessage"
              required
              placeholder="Escribe un mensaje..."
              class="flex-1 px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              :disabled="sending || !newMessage.trim()"
              class="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-xl font-bold transition-transform active:scale-95 flex items-center justify-center"
            >
              <span v-if="sending" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import {
  getTicketResponses,
  sendTicketResponse,
  getAuthToken,
  getTicketHubUrl
} from "../../services/api.js";
import { useToast } from "vue-toastification";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";

const parseUtcDateTime = (dateString) => {
  if (!dateString) return null;
  const normalized = String(dateString).includes("T")
    ? String(dateString)
    : String(dateString).replace(" ", "T");
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const date = new Date(hasTimeZone ? normalized : `${normalized}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default {
  name: "SupportChatModal",
  props: {
    ticket: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "status-updated"],

  data() {
    return {
      localTicket: { ...this.ticket },
      responses: [],
      loadingResponses: true,
      newMessage: "",
      sending: false,
      connection: null,
      isSignalRConnected: false,
      signalRRequestId: 0,
      toast: useToast()
    };
  },

  mounted() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.loadResponses(false);
    this.setupSignalR(this.ticket.idTicket);
  },

  async beforeUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    await this.stopSignalR();
  },

  methods: {
    requestClose() {
      this.$emit("close");
    },

    async setupSignalR(ticketId) {
      await this.stopSignalR();
      const requestId = ++this.signalRRequestId;
      if (document.hidden) return;

      try {
        const { HubConnectionBuilder } = await import("@microsoft/signalr");
        if (requestId !== this.signalRRequestId || document.hidden) return;

        this.connection = new HubConnectionBuilder()
          .withUrl(getTicketHubUrl(), {
            accessTokenFactory: () => getAuthToken() ?? ""
          })
          .withAutomaticReconnect()
          .build();

        const receiveMessage = (...args) => this.handleRealtimeMessage(args);
        this.connection.on("ReceiveMessage", receiveMessage);
        this.connection.on("ReceiveTicketResponse", receiveMessage);
        this.connection.on("TicketResponseCreated", receiveMessage);
        this.connection.on("NewTicketResponse", receiveMessage);
        this.connection.onreconnecting(() => {
          this.isSignalRConnected = false;
        });
        this.connection.onreconnected(async () => {
          try {
            await this.connection?.invoke("JoinTicketGroup", ticketId.toString());
            this.isSignalRConnected = true;
          } catch (err) {
            console.error("Error al reingresar al grupo de SignalR:", err);
          }
        });
        this.connection.onclose(() => {
          this.isSignalRConnected = false;
        });
        this.connection.on("StatusUpdated", (data) => {
          if (Number(data.idTicket) === Number(this.localTicket.idTicket)) {
            this.localTicket.estado = data.nuevoEstado;
            this.$emit("status-updated", data.nuevoEstado);
          }
        });

        await this.connection.start();
        await this.connection.invoke("JoinTicketGroup", ticketId.toString());
        this.isSignalRConnected = true;
      } catch (err) {
        console.error("Error al conectar SignalR:", err);
        this.isSignalRConnected = false;
      }
    },

    async stopSignalR() {
      this.signalRRequestId += 1;
      if (!this.connection) return;

      const connection = this.connection;
      this.connection = null;
      this.isSignalRConnected = false;
      try {
        await connection.stop();
      } catch (err) {
        console.error("Error al detener SignalR:", err);
      }
    },

    async handleVisibilityChange() {
      if (document.hidden) {
        await this.stopSignalR();
        return;
      }

      await Promise.all([
        this.setupSignalR(this.localTicket.idTicket),
        this.loadResponses(true)
      ]);
    },

    async loadResponses(silent = false) {
      if (!silent) this.loadingResponses = true;

      try {
        const responses = await getTicketResponses(this.localTicket.idTicket);
        this.responses = responses.map(this.normalizeTicketMessage);
        await this.$nextTick();
        this.scrollToBottom();
      } catch {
        if (!silent) this.toast.error("No se pudieron cargar los mensajes.");
      } finally {
        if (!silent) this.loadingResponses = false;
      }
    },

    async handleSendResponse() {
      const text = this.newMessage.trim();
      if (!text || this.sending) return;

      this.sending = true;
      const optimisticMsg = {
        idRespuesta: `optimistic-${Date.now()}`,
        mensaje: text,
        esSoporte: false,
        fecha: new Date().toISOString()
      };

      this.responses.push(optimisticMsg);
      this.newMessage = "";
      await this.$nextTick();
      this.scrollToBottom();

      try {
        const confirmed = await sendTicketResponse(this.localTicket.idTicket, text);
        const idx = this.responses.findIndex(r => r.idRespuesta === optimisticMsg.idRespuesta);
        if (idx !== -1) {
          this.responses.splice(idx, 1, this.normalizeTicketMessage(confirmed));
        }
      } catch {
        this.responses = this.responses.filter(r => r.idRespuesta !== optimisticMsg.idRespuesta);
        this.newMessage = text;
        this.toast.error("Error al enviar el mensaje. Inténtalo de nuevo.");
      } finally {
        this.sending = false;
      }
    },

    handleRealtimeMessage(args) {
      const payload = args.find(item => item && typeof item === "object" && (item.mensaje || item.response || item.respuesta));
      const message = payload?.response ?? payload?.respuesta ?? payload;
      if (!message) return;

      const ticketId = message.idTicket ?? message.ticketId ?? payload?.idTicket ?? payload?.ticketId;
      if (ticketId && Number(ticketId) !== Number(this.localTicket.idTicket)) return;

      const normalized = this.normalizeTicketMessage(message);
      if (!normalized.mensaje) return;

      const optimisticIdx = this.responses.findIndex(r =>
        String(r.idRespuesta).startsWith("optimistic-") &&
        r.mensaje === normalized.mensaje &&
        r.esSoporte === normalized.esSoporte
      );

      if (optimisticIdx !== -1) {
        this.responses.splice(optimisticIdx, 1, normalized);
        this.$nextTick(() => this.scrollToBottom());
        return;
      }

      const duplicated = this.responses.some(r =>
        r.idRespuesta === normalized.idRespuesta ||
        (r.mensaje === normalized.mensaje && r.fecha === normalized.fecha && r.esSoporte === normalized.esSoporte)
      );

      if (!duplicated) {
        this.responses.push(normalized);
        this.$nextTick(() => this.scrollToBottom());
      }
    },

    normalizeTicketMessage(message) {
      return {
        ...message,
        idRespuesta: message.idRespuesta ?? message.id ?? message.idResponse ?? `live-${Date.now()}-${Math.random()}`,
        mensaje: message.mensaje ?? message.message ?? message.text ?? "",
        esSoporte: message.esSoporte ?? message.isSupport ?? message.esStaff ?? false,
        fecha: message.fecha ?? message.fechaRespuesta ?? message.createdAt ?? message.created_at ?? new Date().toISOString()
      };
    },

    scrollToBottom() {
      const el = this.$refs.chatContainer;
      if (el) el.scrollTop = el.scrollHeight;
    },

    formatDate(dateStr) {
      const date = parseUtcDateTime(dateStr);
      if (!date) return dateStr;
      return date.toLocaleDateString("es-CO", {
        timeZone: userTimeZone,
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    },

    formatTime(dateStr) {
      const date = parseUtcDateTime(dateStr);
      if (!date) return "";
      return date.toLocaleTimeString("es-CO", {
        timeZone: userTimeZone,
        hour: "2-digit",
        minute: "2-digit"
      });
    },

    getStatusClass(status) {
      return {
        open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      }[status] ?? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    },

    translateStatus(status) {
      return { open: "Abierto", in_progress: "En Revisión", resolved: "Resuelto", closed: "Cerrado" }[status] ?? status;
    }
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.chat-scroll::-webkit-scrollbar {
  width: 5px;
}
.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 10px;
}
.chat-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
