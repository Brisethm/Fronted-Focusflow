<template>
  <div class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col relative">

    <!-- Header -->
    <header class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/80 backdrop-blur-sm px-4">
      <button @click="$router.back()" class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary hover:bg-primary/10 transition-colors">
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
      <h1 class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10">
        Gestión de Tickets
      </h1>
    </header>

    <main class="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <span class="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
        <p class="text-text-light-secondary dark:text-text-dark-secondary font-medium">Cargando reportes...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500">
          <span class="material-symbols-outlined text-5xl">task_alt</span>
        </div>
        <h2 class="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">¡Bandeja Limpia!</h2>
        <p class="text-text-light-secondary dark:text-text-dark-secondary">No hay tickets pendientes de soporte en este momento.</p>
      </div>

      <!-- Tickets List -->
      <div v-else class="space-y-4">
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="text-xl font-extrabold text-text-light-primary dark:text-text-dark-primary">Tickets Recientes</h2>
            <!-- Indicador de auto-refresh y Botón manual (Para la lista de tickets) -->
            <div class="flex items-center gap-2 mt-1">
              <button @click="fetchTickets(false)" 
                class="flex items-center justify-center p-1 rounded-full text-text-light-secondary hover:text-primary hover:bg-primary/10 transition-colors" 
                title="Actualizar ahora">
                <span class="material-symbols-outlined text-[18px]">refresh</span>
              </button>
              <div class="flex items-center gap-1.5">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                  Actualizando cada {{ TICKET_POLL_SECS }}s mientras la ventana está abierta
                  <span v-if="lastRefreshed"> · Última vez {{ lastRefreshed }}</span>
                </span>
              </div>
            </div>
          </div>
          <span class="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {{ tickets.length }} Total
          </span>
        </div>

        <div v-for="ticket in visibleTickets" :key="ticket.idTicket"
          v-memo="[ticket.idTicket, ticket.estado, ticket.asunto, ticket.descripcion, ticket.displayDate]"
          class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">

          <!-- Fila Superior: Asunto y Badges -->
          <div class="flex justify-between items-start gap-4">
            <div>
              <p class="text-xs font-bold text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wider mb-1">
                #{{ ticket.idTicket }} • {{ ticket.displayCategory }}
              </p>
              <h3 class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary leading-tight">
                {{ ticket.asunto }}
              </h3>
            </div>
            <div class="flex gap-2 shrink-0 flex-wrap justify-end">
              <span :class="getPriorityClass(ticket.prioridad)"
                class="px-2.5 py-1 rounded-md text-xs font-bold capitalize flex items-center gap-1 shadow-sm">
                <span class="material-symbols-outlined text-[14px]">flag</span>
                {{ ticket.displayPriority }}
              </span>
              <span :class="getStatusClass(ticket.estado)"
                class="px-2.5 py-1 rounded-md text-xs font-bold capitalize shadow-sm">
                {{ ticket.displayStatus }}
              </span>
            </div>
          </div>

          <p class="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
            {{ ticket.descripcion }}
          </p>

          <hr class="border-border-light dark:border-border-dark" />

          <div class="flex items-center justify-between mt-1">
            <div class="flex items-center gap-2 text-xs text-text-light-secondary dark:text-text-dark-secondary">
              <span class="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Creado: {{ ticket.displayDate }}</span>
            </div>
            <button @click="openTicketModal(ticket)"
              class="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Ver Detalles / Responder
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        <button v-if="visibleTickets.length < tickets.length" @click="visibleTicketCount += 15"
          class="w-full py-3 rounded-lg border border-border-light dark:border-border-dark text-sm font-bold text-primary hover:bg-primary/10 transition-colors">
          Ver más tickets
        </button>
      </div>
    </main>

    <TicketsChatModal
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="closeTicketModal"
      @status-updated="handleTicketStatusUpdated"
    />

  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { getAllTickets } from "../services/api.js";
import { useToast } from "vue-toastification";

const TICKET_POLL_MS   = 60_000;
const TICKET_POLL_SECS = TICKET_POLL_MS / 1000;
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";
const TICKET_CACHE_KEY = "focusflow:staff:tickets";
const INITIAL_VISIBLE_TICKETS = 15;

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
  name: "TicketsView",
  components: {
    TicketsChatModal: defineAsyncComponent(() => import("../components/support/TicketsChatModal.vue"))
  },

  data() {
    return {
      TICKET_POLL_SECS,
      tickets: [],
      loading: true,
      visibleTicketCount: INITIAL_VISIBLE_TICKETS,
      lastRefreshed: null,
      selectedTicket: null,
      ticketPollInterval: null,
      toast: useToast(),
      pageVisible: !document.hidden,
    };
  },

  mounted() {
    this.hydrateTicketsFromCache();
    this.fetchTickets(this.tickets.length > 0);
    this.startTicketPolling();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },

  async beforeUnmount() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.stopTicketPolling();
  },

  computed: {
    visibleTickets() {
      return this.tickets.slice(0, this.visibleTicketCount);
    }
  },

  methods: {
    // ─── TICKETS Y LISTADO (Mantiene Polling) ────────────────────────────────

    hydrateTicketsFromCache() {
      try {
        const cached = sessionStorage.getItem(TICKET_CACHE_KEY);
        if (!cached) return;

        const tickets = JSON.parse(cached);
        if (!Array.isArray(tickets)) return;

        this.tickets = tickets.map(this.normalizeTicket);
        this.loading = false;
      } catch {
        sessionStorage.removeItem(TICKET_CACHE_KEY);
      }
    },

    async fetchTickets(silent = false) {
      if (!silent) this.loading = true;
      try {
        const fresh = await getAllTickets();
        const tickets = fresh.map(this.normalizeTicket);
        if (JSON.stringify(tickets) !== JSON.stringify(this.tickets)) {
          this.tickets = tickets;
          sessionStorage.setItem(TICKET_CACHE_KEY, JSON.stringify(this.tickets));
        }
        this.lastRefreshed = new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
      } catch {
        if (!silent) this.toast.error("Error al cargar los tickets.");
      } finally {
        if (!silent) this.loading = false;
      }
    },

    startTicketPolling() {
      this.stopTicketPolling();
      if (document.hidden) return;
      this.ticketPollInterval = setInterval(() => {
        // Refresca la lista general solo si el modal de chat no está abierto
        if (!document.hidden && !this.selectedTicket) this.fetchTickets(true);
      }, TICKET_POLL_MS);
    },

    stopTicketPolling() {
      if (this.ticketPollInterval) {
        clearInterval(this.ticketPollInterval);
        this.ticketPollInterval = null;
      }
    },

    // ─── MODAL ───────────────────────────────────────────────────────────────

    openTicketModal(ticket) {
      this.selectedTicket = { ...ticket }; 
    },

    closeTicketModal() {
      this.selectedTicket = null;
      this.fetchTickets(true);
    },

    async handleVisibilityChange() {
      this.pageVisible = !document.hidden;

      if (document.hidden) {
        this.stopTicketPolling();
        return;
      }

      this.startTicketPolling();
      if (!this.selectedTicket) {
        await this.fetchTickets(true);
      }
    },

    handleTicketStatusUpdated(status) {
      if (!this.selectedTicket) return;
      this.selectedTicket = this.normalizeTicket({
        ...this.selectedTicket,
        estado: status
      });
      this.tickets = this.tickets.map(ticket =>
        ticket.idTicket === this.selectedTicket.idTicket ? this.selectedTicket : ticket
      );
      sessionStorage.setItem(TICKET_CACHE_KEY, JSON.stringify(this.tickets));
    },

    // ─── UTILIDADES ───────────────────────────────────────────────────────────

    formatDate(dateStr) {
      const date = parseUtcDateTime(dateStr);
      if (!date) return dateStr;
      return date.toLocaleDateString("es-CO", {
        timeZone: userTimeZone,
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    },

    translateStatus(status) {
      return { open: "Abierto", in_progress: "En Revisión", resolved: "Resuelto", closed: "Cerrado" }[status] ?? status;
    },

    translateCategory(cat) {
      return { general: "General", technical: "Técnico", billing: "Pagos", feature_request: "Sugerencia" }[cat] ?? cat;
    },

    translatePriority(prio) {
      return { low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente" }[prio] ?? prio;
    },

    getStatusClass(status) {
      return {
        open:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        resolved:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        closed:      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      }[status] ?? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    },

    getPriorityClass(priority) {
      return {
        low:    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        high:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }[priority] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    },

    normalizeTicket(ticket) {
      return {
        ...ticket,
        displayDate: this.formatDate(ticket.fechaCreacion),
        displayStatus: this.translateStatus(ticket.estado),
        displayCategory: this.translateCategory(ticket.categoria),
        displayPriority: this.translatePriority(ticket.prioridad)
      };
    }
  }
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
