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
              Ticket #{{ localTicket.idTicket }}
            </h3>
            <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary">
              Creado el {{ formatDate(localTicket.fechaCreacion) }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              v-if="showRefresh"
              @click="loadResponses(false)"
              class="flex items-center justify-center p-1 rounded-full text-text-light-secondary hover:text-primary hover:bg-primary/10 transition-colors"
              title="Actualizar chat"
            >
              <span class="material-symbols-outlined text-[18px]">refresh</span>
            </button>

            <span v-if="isSignalRConnected" class="flex items-center gap-1 text-xs text-emerald-500 font-semibold">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              En vivo
            </span>

            <select
              v-if="canChangeStatus"
              v-model="localTicket.estado"
              @change="handleStatusChange"
              class="text-xs font-bold px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark outline-none cursor-pointer"
            >
              <option value="open">Abierto</option>
              <option value="in_progress">En Revision</option>
              <option value="resolved">Resuelto</option>
              <option value="closed">Cerrado</option>
            </select>
            <span
              v-else
              :class="getStatusClass(localTicket.estado)"
              class="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm shrink-0"
            >
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
              Conversacion
            </h4>

            <div v-if="loadingResponses" class="flex justify-center py-4">
              <span class="material-symbols-outlined text-primary animate-spin">progress_activity</span>
            </div>

            <div v-else-if="responses.length === 0" class="text-center text-sm text-gray-500 py-4">
              {{ emptyMessage }}
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="resp in responses"
                :key="resp.idRespuesta"
                class="flex flex-col"
                :class="isOwnMessage(resp) ? 'items-end' : 'items-start'"
              >
                <span class="text-[10px] font-semibold text-gray-500 mb-1 px-1">
                  {{ messageAuthorLabel(resp) }} - {{ formatTime(resp.fecha) }}
                </span>
                <div
                  class="max-w-[85%] p-3 rounded-2xl text-sm shadow-sm"
                  :class="isOwnMessage(resp)
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
            {{ closedMessage }}
          </div>

          <form v-else @submit.prevent="handleSendResponse" class="flex gap-2">
            <input
              type="text"
              v-model="newMessage"
              required
              :placeholder="inputPlaceholder"
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
  updateTicketStatus,
  getAuthToken,
  getTicketHubUrl
} from "../../services/api.js";
import { useToast } from "vue-toastification";
import {
  formatTicketDate,
  formatTicketTime,
  getTicketStatusClass,
  translateTicketStatus
} from "../../utils/tickets.js";

export default {
  name: "BaseTicketChatModal",
  props: {
    ticket: {
      type: Object,
      required: true
    },
    authorIsSupport: {
      type: Boolean,
      required: true
    },
    canChangeStatus: {
      type: Boolean,
      default: false
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    emptyMessage: {
      type: String,
      required: true
    },
    closedMessage: {
      type: String,
      required: true
    },
    inputPlaceholder: {
      type: String,
      required: true
    },
    loadErrorMessage: {
      type: String,
      required: true
    },
    sendErrorMessage: {
      type: String,
      required: true
    },
    ownLabel: {
      type: String,
      required: true
    },
    supportLabel: {
      type: String,
      required: true
    },
    userLabel: {
      type: String,
      required: true
    },
    includeDateTime: {
      type: Boolean,
      default: false
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
        if (!silent) this.toast.error(this.loadErrorMessage);
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
        esSoporte: this.authorIsSupport,
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

        if (this.authorIsSupport && this.localTicket.estado === "open") {
          this.localTicket.estado = "in_progress";
          this.$emit("status-updated", this.localTicket.estado);
        }
      } catch {
        this.responses = this.responses.filter(r => r.idRespuesta !== optimisticMsg.idRespuesta);
        this.newMessage = text;
        this.toast.error(this.sendErrorMessage);
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

    async handleStatusChange() {
      if (!this.canChangeStatus) return;

      try {
        await updateTicketStatus(this.localTicket.idTicket, this.localTicket.estado);
        this.toast.success(`Estado actualizado a "${this.translateStatus(this.localTicket.estado)}"`);
        this.$emit("status-updated", this.localTicket.estado);
      } catch {
        this.toast.error("Error al actualizar el estado.");
      }
    },

    normalizeTicketMessage(message) {
      return {
        ...message,
        idRespuesta: message.idRespuesta ?? message.id ?? message.idResponse ?? `live-${Date.now()}-${crypto.randomUUID()}`,
        mensaje: message.mensaje ?? message.message ?? message.text ?? "",
        esSoporte: message.esSoporte ?? message.isSupport ?? message.esStaff ?? false,
        fecha: message.fecha ?? message.fechaRespuesta ?? message.createdAt ?? message.created_at ?? new Date().toISOString()
      };
    },

    isOwnMessage(message) {
      return message.esSoporte === this.authorIsSupport;
    },

    messageAuthorLabel(message) {
      if (this.isOwnMessage(message)) return this.ownLabel;
      return message.esSoporte ? this.supportLabel : this.userLabel;
    },

    scrollToBottom() {
      const el = this.$refs.chatContainer;
      if (el) el.scrollTop = el.scrollHeight;
    },

    formatDate(dateStr) {
      return formatTicketDate(dateStr, { includeTime: this.includeDateTime });
    },

    formatTime(dateStr) {
      return formatTicketTime(dateStr);
    },

    getStatusClass(status) {
      return getTicketStatusClass(status);
    },

    translateStatus(status) {
      return translateTicketStatus(status);
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
