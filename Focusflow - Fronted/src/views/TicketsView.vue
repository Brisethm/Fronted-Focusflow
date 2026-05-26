<template>
  <div
    class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col relative"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/80 backdrop-blur-sm px-4"
    >
      <button
        @click="router.back()"
        class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary hover:bg-primary/10 transition-colors"
      >
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
      <h1
        class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10"
      >
        Gestión de Tickets
      </h1>
    </header>

    <main class="flex-1 px-4 py-8 max-w-5xl mx-auto w-full space-y-6">
      <section
        class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-[32px] shadow-lg p-6"
      >
        <div
          class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-14 h-14 rounded-3xl bg-primary/10 text-primary grid place-items-center shadow-sm"
            >
              <span class="material-symbols-outlined text-3xl"
                >support_agent</span
              >
            </div>
            <div>
              <h2
                class="text-2xl font-extrabold text-text-light-primary dark:text-text-dark-primary"
              >
                Gestión de Tickets
              </h2>
              <p
                class="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1 max-w-2xl"
              >
                Administra y da seguimiento a todos los tickets del sistema en
                una vista ordenada y compacta.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 justify-end">
            <button
              @click="fetchTickets(false)"
              class="inline-flex items-center gap-2 rounded-full border border-border-light bg-white/90 px-4 py-2 text-sm font-semibold text-text-light-primary shadow-sm hover:border-primary hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-base">refresh</span>
              Actualizar
            </button>
            <div class="relative inline-block text-left">
              <button
                @click="toggleFilter"
                class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <span class="material-symbols-outlined text-base"
                  >filter_list</span
                >
                {{ filterLabel }}
              </button>

              <div
                v-if="showFilter"
                class="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg border border-border-light z-20"
              >
                <div class="py-2">
                  <button
                    @click="setFilterPriority('')"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Todas
                  </button>
                  <button
                    @click="setFilterPriority('low')"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Baja
                  </button>
                  <button
                    @click="setFilterPriority('medium')"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Media
                  </button>
                  <button
                    @click="setFilterPriority('high')"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    Alta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div
            class="rounded-[28px] bg-white/90 dark:bg-slate-900/80 border border-border-light dark:border-border-dark p-4 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-2xl bg-primary/10 text-primary grid place-items-center"
              >
                <span class="material-symbols-outlined">autorenew</span>
              </div>
              <div>
                <p
                  class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary"
                >
                  Actualizando cada 60s mientras la ventana está abierta
                </p>
                <p
                  class="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5"
                >
                  Última vez {{ lastRefreshed || "—" }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="rounded-[28px] bg-gradient-to-r from-indigo-500 to-violet-500 p-4 text-white text-center font-bold shadow-sm"
          >
            {{ tickets.length }} Total
          </div>
        </div>
      </section>

      <section>
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-20 space-y-4"
        >
          <span
            class="material-symbols-outlined text-primary text-5xl animate-spin"
            >progress_activity</span
          >
          <p
            class="text-text-light-secondary dark:text-text-dark-secondary font-medium"
          >
            Cargando reportes...
          </p>
        </div>

        <div
          v-else-if="tickets.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center space-y-4"
        >
          <div
            class="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"
          >
            <span class="material-symbols-outlined text-5xl">task_alt</span>
          </div>
          <h2
            class="text-xl font-bold text-text-light-primary dark:text-text-dark-primary"
          >
            ¡Bandeja Limpia!
          </h2>
          <p class="text-text-light-secondary dark:text-text-dark-secondary">
            No hay tickets pendientes de soporte en este momento.
          </p>
        </div>

        <div
          v-else-if="filterPriority && filteredTickets.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center space-y-4"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          >
            <span class="material-symbols-outlined text-4xl">report</span>
          </div>
          <h2
            class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary"
          >
            No hay tickets
          </h2>
          <p class="text-text-light-secondary dark:text-text-dark-secondary">
            No hay tickets generados aún con esta prioridad.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="ticket in visibleTickets"
            :key="ticket.idTicket"
            v-memo="[
              ticket.idTicket,
              ticket.estado,
              ticket.asunto,
              ticket.descripcion,
              ticket.displayDate,
            ]"
            :class="[
              'ticket-card cursor-pointer',
              getPriorityCardClass(ticket.prioridad),
            ]"
            @click="openTicketModal(ticket)"
          >
            <div class="flex gap-4 items-start">
              <div
                :class="['ticket-icon', getCategoryIconClass(ticket.categoria)]"
              >
                <span class="material-symbols-outlined text-xl">{{
                  getCategoryIcon(ticket.categoria)
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3"
                >
                  <div class="min-w-0">
                    <p
                      class="text-[11px] uppercase tracking-[0.2em] text-text-light-secondary dark:text-text-dark-secondary mb-1"
                    >
                      #{{ ticket.idTicket }} • {{ ticket.displayCategory }}
                    </p>
                    <h3
                      class="text-base font-bold text-text-light-primary dark:text-text-dark-primary truncate"
                    >
                      {{ ticket.asunto }}
                    </h3>
                  </div>
                  <div
                    class="flex flex-wrap gap-2 justify-start sm:justify-end"
                  >
                    <span
                      :class="getPriorityClass(ticket.prioridad)"
                      class="badge text-[11px] font-semibold uppercase tracking-[0.1em]"
                    >
                      {{ ticket.displayPriority }}
                    </span>
                    <span
                      :class="getStatusClass(ticket.estado)"
                      class="badge text-[11px] font-semibold uppercase tracking-[0.1em]"
                    >
                      {{ ticket.displayStatus }}
                    </span>
                  </div>
                </div>
                <p
                  class="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mt-3"
                >
                  {{ ticket.descripcion }}
                </p>
                <div
                  class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text-light-secondary dark:text-text-dark-secondary"
                >
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]"
                      >calendar_today</span
                    >
                    <span>{{ ticket.displayDate }}</span>
                  </div>
                  <button
                    class="meta-action text-[12px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    Ver Detalles / Responder
                    <span class="material-symbols-outlined text-sm"
                      >arrow_forward</span
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="visibleTickets.length < tickets.length"
            @click="visibleTicketCount += 15"
            class="w-full py-3 rounded-2xl border border-border-light dark:border-border-dark text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            Ver más tickets
          </button>
        </div>
      </section>
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
import { useRouter } from "vue-router";
import {
  formatTicketDate,
  getTicketCategoryIcon,
  getTicketCategoryIconClass,
  normalizeTicket,
  translateTicketCategory,
  translateTicketPriority,
  translateTicketStatus,
} from "../utils/tickets.js";

const TICKET_POLL_MS = 60_000;
const TICKET_POLL_SECS = TICKET_POLL_MS / 1000;
const TICKET_CACHE_KEY = "focusflow:staff:tickets";
const INITIAL_VISIBLE_TICKETS = 15;

export default {
  name: "TicketsView",
  setup() {
    return {
      router: useRouter(),
    };
  },
  components: {
    TicketsChatModal: defineAsyncComponent(
      () => import("../components/support/TicketsChatModal.vue"),
    ),
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

      // filter state
      showFilter: false,
      filterPriority: "",
    };
  },

  mounted() {
    this.hydrateTicketsFromCache();
    this.fetchTickets(this.tickets.length > 0);
    this.startTicketPolling();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },

  async beforeUnmount() {
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );
    this.stopTicketPolling();
  },

  computed: {
    filteredTickets() {
      return this.filterPriority
        ? this.tickets.filter((t) => t.prioridad === this.filterPriority)
        : this.tickets;
    },

    visibleTickets() {
      return this.filteredTickets.slice(0, this.visibleTicketCount);
    },

    filterLabel() {
      if (!this.filterPriority) return "Filtrar";
      const map = { low: "Baja", medium: "Media", high: "Alta" };
      return `Filtrar: ${map[this.filterPriority] || this.filterPriority}`;
    },
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
          sessionStorage.setItem(
            TICKET_CACHE_KEY,
            JSON.stringify(this.tickets),
          );
        }
        this.lastRefreshed = new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
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
        estado: status,
      });
      this.tickets = this.tickets.map((ticket) =>
        ticket.idTicket === this.selectedTicket.idTicket
          ? this.selectedTicket
          : ticket,
      );
      sessionStorage.setItem(TICKET_CACHE_KEY, JSON.stringify(this.tickets));
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    setFilterPriority(priority) {
      this.filterPriority = priority;
      this.showFilter = false;
      // reset visible count so user sees top of filtered list
      this.visibleTicketCount = INITIAL_VISIBLE_TICKETS;
    },

    // ─── UTILIDADES ───────────────────────────────────────────────────────────

    formatDate(dateStr) {
      return formatTicketDate(dateStr, { includeTime: true });
    },

    translateStatus(status) {
      return (
        {
          open: "Abierto",
          in_progress: "En Revisión",
          resolved: "Resuelto",
          closed: "Cerrado",
        }[status] ?? status
      );
    },

    translateCategory(cat) {
      return (
        {
          general: "General",
          technical: "Técnico",
          billing: "Pagos",
          feature_request: "Sugerencia",
        }[cat] ?? cat
      );
    },

    translatePriority(prio) {
      return (
        { low: "Baja", medium: "Media", high: "Alta", urgent: "Urgente" }[
          prio
        ] ?? prio
      );
    },

    getStatusClass(status) {
      // Return no colored background classes so badges render neutral.
      return "";
    },

    getPriorityClass(priority) {
      // Return no colored background classes so badges render neutral.
      return "";
    },

    getPriorityCardClass(priority) {
      return (
        {
          low: "priority-card-low",
          medium: "priority-card-medium",
          high: "priority-card-high",
        }[priority] || "priority-card-low"
      );
    },

    getCategoryIcon(category) {
      return getTicketCategoryIcon(category);
    },

    getCategoryIconClass(category) {
      return getTicketCategoryIconClass(category);
    },

    normalizeTicket(ticket) {
      return normalizeTicket(ticket, {
        includeTime: true,
        includePriority: true,
      });
    },
  },
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.ticket-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 18px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.priority-card-low {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.18);
}

.priority-card-medium {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.18);
}

.priority-card-high {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.18);
}

.ticket-icon {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #eff6ff !important; /* Blue 50 */
  color: #1e40af !important;      /* Blue 800 */
}

.ticket-icon.category-technical {
  background: #ecfdf5 !important; /* Emerald 50 */
  color: #065f46 !important;      /* Emerald 800 */
}

.ticket-icon.category-general {
  background: #eff6ff !important; /* Blue 50 */
  color: #1d4ed8 !important;      /* Blue 700 */
}

.ticket-icon.category-billing {
  background: #fffbeb !important; /* Amber 50 */
  color: #9a3412 !important;      /* Amber 800 */
}

.ticket-icon.category-feature_request {
  background: #f5f3ff !important; /* Purple 50 */
  color: #5b21b6 !important;      /* Purple 800 */
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.8rem;
  border-radius: 9999px;
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.12);
  color: inherit;
}

.ticket-card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.meta-action {
  white-space: nowrap;
}
</style>
