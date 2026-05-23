<template>
  <div
    class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col relative"
  >
    <header
      class="sticky top-0 z-10 flex h-16 items-center border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark/95 px-4"
    >
      <button
        @click="$router.back()"
        class="flex size-10 shrink-0 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary hover:bg-primary/10 transition-colors"
      >
        <span class="material-symbols-outlined text-2xl">arrow_back</span>
      </button>
      <h1
        class="flex-1 text-center text-lg font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary pr-10"
      >
        Soporte y PQRs
      </h1>
    </header>

    <main class="flex-1 px-4 py-8 max-w-5xl mx-auto w-full space-y-6">
      <section
        class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-3xl shadow-lg p-6 grid gap-4 sm:grid-cols-[1.7fr_auto] items-start"
      >
        <div class="flex items-center gap-4">
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
              class="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1 max-w-xl"
            >
              Administra y da seguimiento a todos los tickets del sistema de
              forma rápida y ordenada.
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:items-end gap-3">
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-text-light-primary shadow-sm border border-border-light dark:border-border-dark"
          >
            <span class="material-symbols-outlined text-base">refresh</span>
            Actualizar
          </div>
          <div
            class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-text-light-primary shadow-sm border border-border-light dark:border-border-dark"
          >
            <span class="material-symbols-outlined text-base">filter_alt</span>
            Filtrar
          </div>
          <div
            class="rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-white text-sm font-bold shadow-sm"
          >
            {{ tickets.length }} Total
          </div>
        </div>
      </section>

      <section
        class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-3xl shadow-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="grid place-items-center rounded-2xl bg-primary/10 text-primary w-12 h-12"
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
              Última vez: 10:36:54 p. m.
            </p>
          </div>
        </div>
        <button
          v-if="!showForm"
          @click="showForm = true"
          class="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg font-bold transition-transform active:scale-95 inline-flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-base">add_circle</span>
          Nuevo Ticket
        </button>
      </section>

      <div
        v-if="showForm"
        class="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-3xl shadow-lg p-5 animate-fade-in"
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-primary"
              >edit_document</span
            >
            Crear Solicitud
          </h3>
          <button
            @click="showForm = false"
            class="text-text-light-secondary hover:text-red-500 transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmitTicket" class="space-y-4">
          <div class="space-y-1">
            <label
              class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
              >Asunto</label
            >
            <input
              type="text"
              v-model="form.asunto"
              required
              maxlength="100"
              placeholder="Ej. Problema con el temporizador"
              class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <p
              class="text-right text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1"
            >
              {{ form.asunto.length }} / 100
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label
                class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                >Categoría</label
              >
              <select
                v-model="form.categoria"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
              >
                <option value="general">Consulta General</option>
                <option value="technical">Problema Técnico (Bug)</option>
                <option value="billing">Suscripción / Pagos</option>
                <option value="feature_request">Sugerencia de Mejora</option>
              </select>
            </div>
            <div class="space-y-1">
              <label
                class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
                >Prioridad</label
              >
              <select
                v-model="form.prioridad"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
              >
                <option value="low">Baja (No es urgente)</option>
                <option value="medium">Media (Me afecta un poco)</option>
                <option value="high">Alta (No puedo usar la app)</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label
              class="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary ml-1"
              >Descripción Detallada</label
            >
            <textarea
              v-model="form.descripcion"
              required
              rows="4"
              maxlength="500"
              placeholder="Explica tu problema o sugerencia de la forma más clara posible..."
              class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
            ></textarea>
            <div class="flex justify-between items-center mt-1">
              <span
                v-if="form.descripcion.length >= 480"
                class="text-xs text-red-500 font-bold flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[14px]"
                  >warning</span
                >
                Límite alcanzado
              </span>
              <span v-else></span>
              <span
                class="text-xs font-medium"
                :class="
                  form.descripcion.length >= 480
                    ? 'text-red-500'
                    : 'text-text-light-secondary dark:text-text-dark-secondary'
                "
              >
                {{ form.descripcion.length }} / 500
              </span>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showForm = false"
              :disabled="submitting"
              class="flex-1 py-3 rounded-lg font-bold text-text-light-secondary hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold transition-transform active:scale-95 flex justify-center items-center gap-2"
            >
              <span
                v-if="submitting"
                class="material-symbols-outlined animate-spin"
                >progress_activity</span
              >
              <span v-else class="material-symbols-outlined">send</span>
              {{ submitting ? "Enviando..." : "Enviar Ticket" }}
            </button>
          </div>
        </form>
      </div>

      <!-- HISTORIAL DE TICKETS -->
      <div v-else>
        <div v-if="loading" class="flex justify-center py-12">
          <span
            class="material-symbols-outlined text-primary text-4xl animate-spin"
            >progress_activity</span
          >
        </div>

        <div
          v-else-if="tickets.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center space-y-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <span class="material-symbols-outlined text-4xl">inbox</span>
          </div>
          <div>
            <h3
              class="text-lg font-bold text-text-light-primary dark:text-text-dark-primary"
            >
              No tienes tickets
            </h3>
            <p
              class="text-sm text-text-light-secondary dark:text-text-dark-secondary max-w-xs mt-1"
            >
              Si tienes algún problema o sugerencia, no dudes en escribirnos.
            </p>
          </div>
        </div>

        <div v-else class="space-y-3">
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
            class="ticket-card cursor-pointer"
            @click="openTicketModal(ticket)"
          >
            <div class="ticket-card-grid">
              <div class="ticket-card-left">
                <div
                  class="ticket-icon"
                  :class="getCategoryIconClass(ticket.categoria)"
                >
                  <span class="material-symbols-outlined text-lg">{{
                    getCategoryIcon(ticket.categoria)
                  }}</span>
                </div>
              </div>
              <div class="ticket-card-body">
                <div class="ticket-header">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-light-secondary dark:text-text-dark-secondary"
                      >#{{ ticket.idTicket }}</span
                    >
                    <h4
                      class="text-sm font-bold text-text-light-primary dark:text-text-dark-primary truncate"
                    >
                      {{ ticket.asunto }}
                    </h4>
                  </div>
                  <span
                    :class="getStatusClass(ticket.estado)"
                    class="status-pill text-[11px] font-bold uppercase tracking-[0.1em]"
                  >
                    {{ ticket.displayStatus }}
                  </span>
                </div>
                <p
                  class="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mt-2"
                >
                  {{ ticket.descripcion }}
                </p>
                <div class="ticket-card-footer">
                  <div class="meta-item">
                    <span class="material-symbols-outlined text-[14px]"
                      >sell</span
                    >
                    <span
                      class="text-[12px] text-text-light-secondary dark:text-text-dark-secondary"
                      >{{ ticket.displayCategory }}</span
                    >
                  </div>
                  <div class="meta-item">
                    <span class="material-symbols-outlined text-[14px]"
                      >calendar_today</span
                    >
                    <span
                      class="text-[12px] text-text-light-secondary dark:text-text-dark-secondary"
                      >{{ ticket.displayDate }}</span
                    >
                  </div>
                  <button
                    class="meta-action text-[12px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    Ver Detalles / Responder
                    <span class="material-symbols-outlined text-sm"
                      >chevron_right</span
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="visibleTickets.length < tickets.length"
            @click="visibleTicketCount += 10"
            class="w-full py-3 rounded-2xl border border-border-light dark:border-border-dark text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            Ver más tickets
          </button>
        </div>
      </div>
    </main>

    <SupportChatModal
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="closeTicketModal"
      @status-updated="handleTicketStatusUpdated"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { getMyTickets, createTicket } from "../services/api.js";
import { useToast } from "vue-toastification";

const userTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";
const TICKET_CACHE_KEY = "focusflow:support:tickets";
const INITIAL_VISIBLE_TICKETS = 10;

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
  name: "SupportView",
  components: {
    SupportChatModal: defineAsyncComponent(
      () => import("../components/support/SupportChatModal.vue"),
    ),
  },

  data() {
    return {
      tickets: [],
      loading: true,
      visibleTicketCount: INITIAL_VISIBLE_TICKETS,

      showForm: false,
      submitting: false,
      form: {
        asunto: "",
        categoria: "general",
        prioridad: "medium",
        descripcion: "",
      },

      selectedTicket: null,

      toast: useToast(),
    };
  },

  mounted() {
    this.hydrateTicketsFromCache();
    this.fetchTickets(this.tickets.length > 0);
  },

  computed: {
    visibleTickets() {
      return this.tickets.slice(0, this.visibleTicketCount);
    },
  },

  methods: {
    // ─── TICKETS Y FORMULARIOS ────────────────────────────────────────────────

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
        const tickets = await getMyTickets();
        this.tickets = tickets.map(this.normalizeTicket);
        sessionStorage.setItem(TICKET_CACHE_KEY, JSON.stringify(this.tickets));
      } catch {
        if (!silent) this.toast.error("Error al cargar tus tickets.");
      } finally {
        if (!silent) this.loading = false;
      }
    },

    async handleSubmitTicket() {
      this.submitting = true;
      try {
        await createTicket(this.form);
        this.toast.success("¡Ticket enviado correctamente!");
        this.form = {
          asunto: "",
          categoria: "general",
          prioridad: "medium",
          descripcion: "",
        };
        this.showForm = false;
        this.visibleTicketCount = INITIAL_VISIBLE_TICKETS;
        await this.fetchTickets();
      } catch {
        this.toast.error("Hubo un problema al enviar tu solicitud.");
      } finally {
        this.submitting = false;
      }
    },

    // ─── MODAL ───────────────────────────────────────────────────────────────

    openTicketModal(ticket) {
      this.selectedTicket = ticket;
    },

    closeTicketModal() {
      this.selectedTicket = null;
      this.fetchTickets(true);
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

    normalizeTicket(ticket) {
      return {
        ...ticket,
        displayStatus: this.translateStatus(ticket.estado),
        displayCategory: this.translateCategory(ticket.categoria),
        displayDate: this.formatDate(ticket.fechaCreacion),
      };
    },

    // ─── UTILIDADES ───────────────────────────────────────────────────────────

    formatDate(dateStr) {
      const date = parseUtcDateTime(dateStr);
      if (!date) return dateStr;
      return date.toLocaleDateString("es-CO", {
        timeZone: userTimeZone,
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    getStatusClass(status) {
      return (
        {
          open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          in_progress:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          resolved:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
          closed:
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        }[status] ??
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      );
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
          technical: "Bug / Técnico",
          billing: "Pagos",
          feature_request: "Sugerencia",
        }[cat] ?? cat
      );
    },

    getCategoryIcon(category) {
      return (
        {
          general: "description",
          technical: "build_circle",
          billing: "paid",
          feature_request: "lightbulb",
        }[category] || "description"
      );
    },

    getCategoryIconClass(category) {
      return (
        {
          general: "category-general",
          technical: "category-technical",
          billing: "category-billing",
          feature_request: "category-feature_request",
        }[category] || "category-general"
      );
    },
  },
};
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;
}

.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ticket-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 16px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.ticket-card-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: flex-start;
}

.ticket-card-left {
  display: grid;
  place-items: center;
}

.ticket-icon {
  min-width: 44px;
  min-height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.ticket-icon.category-technical {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.ticket-icon.category-general {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.ticket-icon.category-billing {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.ticket-icon.category-feature_request {
  background: rgba(168, 85, 247, 0.12);
  color: #7c3aed;
}

.status-pill {
  padding: 0.35rem 0.6rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ticket-card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.meta-item span:first-child {
  color: #64748b;
}

.meta-action {
  white-space: nowrap;
}

.ticket-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 16px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ticket-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.ticket-card-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ticket-icon {
  min-width: 44px;
  min-height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

.ticket-icon.category-technical {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.ticket-icon.category-general {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.ticket-icon.category-billing {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.ticket-icon.category-feature_request {
  background: rgba(168, 85, 247, 0.12);
  color: #7c3aed;
}

.status-pill {
  padding: 0.35rem 0.6rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ticket-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.meta-item span:first-child {
  color: #64748b;
}

.meta-action {
  white-space: nowrap;
}
</style>
