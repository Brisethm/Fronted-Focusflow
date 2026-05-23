<template>
  <div class="transactions-page">
    <header class="screen-header">
      <h1>{{ t('transactions.title') }}</h1>
    </header>

    <main class="page-body">
      <section class="section summary-section">
        <h2>{{ t('transactions.summary') }}</h2>
        
        <!-- NUEVO: Tarjeta de Balance Total -->
        <article class="balance-card">
          <p class="summary-label text-slate">{{ t('transactions.totalBalance') }}</p>
          <p :class="['balance-value', balanceTotal < 0 ? 'text-negative' : '']">
            {{ formatCurrency(balanceTotal) }}
          </p>
        </article>

        <div class="summary-grid">
          <article class="summary-card ingreso-card">
            <p class="summary-label">{{ t('transactions.incomes') }}</p>
            <p class="summary-value">{{ formatCurrency(totales.ingresos) }}</p>
          </article>

          <article class="summary-card gasto-card">
            <p class="summary-label">{{ t('transactions.expenses') }}</p>
            <p class="summary-value">{{ formatCurrency(totales.gastos) }}</p>
          </article>
        </div>
      </section>

      <section class="section transactions-section">
        <h2>{{ t('transactions.title') }}</h2>

        <div class="transactions-list">
          <div v-if="cargando" class="empty-state">
            {{ t('transactions.loading') }}
          </div>

          <template v-else-if="transacciones.length">
            <article
              v-for="transaccion in transacciones"
              :key="transaccion.idTransaccion"
              class="transaction-row"
            >
              <div class="transaction-icon-wrapper">
                <div
                  class="transaction-icon"
                  :class="transaccion.tipo === 'Ingreso' ? 'ingreso' : 'gasto'"
                >
                  <svg
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path
                      d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H40a8,8,0,0,1,0-16H204.69l-34.35-34.34a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66Z"
                    />
                  </svg>
                </div>
              </div>

              <div class="transaction-info">
                <p class="transaction-title">{{ transaccion.categoria }}</p>
                <p
                  :class="[
                    'transaction-subtitle',
                    transaccion.tipo === 'Gasto' ? 'subtitle-gasto' : '',
                  ]"
                >
                  {{ transaccion.tipo }}
                </p>
                <p v-if="transaccion.descripcion" class="transaction-note">
                  {{ transaccion.descripcion }}
                </p>
              </div>

              <div class="transaction-meta">
                <div
                  :class="[
                    'transaction-amount',
                    transaccion.tipo === 'Ingreso'
                      ? 'amount-positive'
                      : 'amount-negative',
                  ]"
                >
                  {{ transaccion.tipo === "Ingreso" ? "+" : "-"
                  }}{{ formatCurrency(transaccion.monto).slice(1) }}
                </div>
                <div class="transaction-actions">
                  <button
                    type="button"
                    class="action-button edit-button"
                    @click="editarTransaccion(transaccion.idTransaccion)"
                  >
                    {{ t('transactions.editTransaction') }}
                  </button>
                  <button
                    type="button"
                    class="action-button delete-button"
                    @click="borrarTransaccion(transaccion.idTransaccion)"
                  >
                    {{ t('transactions.deleteTransaction') }}
                  </button>
                </div>
              </div>
            </article>
          </template>

          <div v-else class="empty-state">
            {{ t('transactions.noTransactions') }}
          </div>
        </div>
      </section>
    </main>

    <button
      type="button"
      class="add-transaction-button"
      @click="mostrarFormularioNueva"
    >
      <span class="button-icon">+</span>
      {{ t('transactions.addTransaction') }}
    </button>

    <FooterNav />

    <div v-if="showForm" class="transaction-form-modal">
      <div class="transaction-card">
        <button
          type="button"
          class="close-button"
          @click="cerrarFormulario"
          aria-label="Cerrar formulario"
        >
          ×
        </button>

        <h2>{{ isEditing ? t('transactions.editTransaction') : t('transactions.newTransaction') }}</h2>

        <div class="amount-display">
          <span class="currency-symbol">$</span>
          <input
            type="number"
            inputmode="decimal"
            min="0"
            step="0.01"
            v-model="monto"
            placeholder="0.00"
            class="amount-input"
            required
          />
        </div>

        <div class="type-toggle">
          <button
            type="button"
            :class="['toggle-button', tipo === 'Ingreso' ? 'active' : '']"
            @click="setTipo('Ingreso')"
          >
            {{ t('transactions.incomeType') }}
          </button>
          <button
            type="button"
            :class="['toggle-button', tipo === 'Gasto' ? 'active' : '']"
            @click="setTipo('Gasto')"
          >
            {{ t('transactions.expenseType') }}
          </button>
        </div>

        <form class="transaction-form" @submit.prevent="guardarTransaccion">
          <div class="form-card">
            <label class="form-row">
              <div class="left-content">
                <div class="icon-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                    ></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <span class="label">{{ t('transactions.transactionLabel') }}</span>
              </div>
              <input
                type="text"
                v-model="categoria"
                :placeholder="t('transactions.categoryPlaceholder')"
                class="row-input"
                required
              />
            </label>

            <label class="form-row">
              <div class="left-content">
                <div class="icon-wrapper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <span class="label">{{ t('transactions.dateLabel') }}</span>
              </div>
              <input
                type="datetime-local"
                v-model="fecha"
                class="row-input"
                required
              />
            </label>
          </div>

          <div class="form-card note-card">
            <div class="note-input-wrapper">
              <div class="icon-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
              <input
                type="text"
                v-model="descripcion"
                :placeholder="t('transactions.notePlaceholder')"
                class="note-input"
              />
            </div>
          </div>

          <button type="submit" class="save-button" :disabled="guardando">
            {{ guardando ? t('transactions.saving') : t('transactions.saveButton') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import FooterNav from "../components/FooterNav.vue";
import { localeCode, t } from '../stores/locale'
import {
  getTransacciones,
  deleteTransaccion,
  createTransaccion,
  getTransaccionById,
  updateTransaccion,
} from "../services/api.js";

const router = useRouter();
const transacciones = ref([]);
const cargando = ref(false);
const showForm = ref(false);
const guardando = ref(false);

const monto = ref("");
const tipo = ref("Ingreso");
const categoria = ref("");
const descripcion = ref("");
const isEditing = ref(false);
const editingId = ref(null);

const obtenerFechaActual = () => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
};
const fecha = ref(obtenerFechaActual());

const totales = computed(() => {
  return transacciones.value.reduce(
    (acc, t) => {
      const valor = Number(t.monto) || 0;
      if (t.tipo === "Ingreso") acc.ingresos += valor;
      else if (t.tipo === "Gasto") acc.gastos += valor;
      return acc;
    },
    { ingresos: 0, gastos: 0 }
  );
});

// NUEVO: Propiedad calculada para el balance total
const balanceTotal = computed(() => totales.value.ingresos - totales.value.gastos);

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  const absolute = Math.abs(amount).toLocaleString(localeCode.value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return amount < 0 ? `-$${absolute}` : `$${absolute}`;
};

const setTipo = (newTipo) => {
  tipo.value = newTipo;
};

const cargarTransacciones = async () => {
  cargando.value = true;
  try {
    transacciones.value = await getTransacciones();
  } catch (error) {
    console.error("Error al cargar las transacciones:", error);
    alert(t('transactions.loadError'));
  } finally {
    cargando.value = false;
  }
};

const resetFormulario = () => {
  monto.value = "";
  tipo.value = "Ingreso";
  categoria.value = "";
  descripcion.value = "";
  fecha.value = obtenerFechaActual();
  guardando.value = false;
  isEditing.value = false;
  editingId.value = null;
};

const mostrarFormularioNueva = () => {
  resetFormulario();
  showForm.value = true;
};

const editarTransaccion = async (idTransaccion) => {
  try {
    const transaccion = await getTransaccionById(idTransaccion);
    monto.value = transaccion.monto;
    tipo.value = transaccion.tipo;
    categoria.value = transaccion.categoria || "";
    descripcion.value = transaccion.descripcion || "";
    fecha.value = transaccion.fecha
      ? new Date(transaccion.fecha).toISOString().slice(0, 16)
      : obtenerFechaActual();
    
    isEditing.value = true;
    editingId.value = idTransaccion;
    showForm.value = true;
  } catch (error) {
    console.error("Error cargando transacción:", error);
    alert(t('transactions.loadError'));
  }
};

const cerrarFormulario = () => {
  showForm.value = false;
  setTimeout(resetFormulario, 200);
};

const guardarTransaccion = async () => {
  const montoValue = Number(monto.value);
  if (
    Number.isNaN(montoValue) ||
    montoValue <= 0 ||
    !categoria.value.trim() ||
    !fecha.value
  ) {
    alert(t('transactions.completeFields'));
    return;
  }

  guardando.value = true;
  try {
    const payload = {
      monto: montoValue,
      tipo: tipo.value,
      categoria: categoria.value.trim(),
      descripcion: descripcion.value.trim(),
      fecha: new Date(fecha.value).toISOString(),
    };

    if (isEditing.value && editingId.value) {
      await updateTransaccion(editingId.value, payload);
    } else {
      await createTransaccion(payload);
    }

    await cargarTransacciones();
    cerrarFormulario();
  } catch (error) {
    console.error("Error guardando transacción:", error);
    alert(t('transactions.saveError'));
  } finally {
    guardando.value = false;
  }
};

const borrarTransaccion = async (idTransaccion) => {
  if (!confirm(t('transactions.deleteConfirm'))) return;
  
  try {
    await deleteTransaccion(idTransaccion);
    await cargarTransacciones();
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert(t('transactions.deleteError'));
  }
};

onMounted(() => {
  cargarTransacciones();
});
</script>

<style scoped>
.transactions-page {
  min-height: 100vh;
  padding-bottom: 180px;
  background: #f6f7f8;
  color: #0f172a;
  font-family: Manrope, Noto Sans, sans-serif;
}

.screen-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 18px 10px;
  background: #f6f7f8;
}

.screen-header h1 {
  flex: 1;
  margin: 0;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: "Segoe UI", "Inter", "Manrope", sans-serif;
  color: #111827;
}

.page-body {
  padding: 0 18px 0;
}

.section {
  margin-top: 18px;
}

.section h2 {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #334155;
  letter-spacing: -0.01em;
}

/* NUEVO: Estilos para la tarjeta de Balance Total */
.balance-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
}

.balance-card .summary-label {
  margin: 0 0 4px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.balance-value {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.balance-value.text-negative {
  color: #dc2626;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 14px 16px;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

.ingreso-card { background: #eff8ff; }
.gasto-card { background: #fff1f2; }

.summary-label {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
}

.ingreso-card .summary-label { color: #0ea5e9; }
.gasto-card .summary-label { color: #dc2626; }

.summary-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 900;
}

.transactions-section {
  margin-top: 24px;
}

.transactions-list {
  display: grid;
  gap: 10px;
}

.transaction-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.transaction-icon-wrapper { flex-shrink: 0; }

.transaction-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.transaction-icon.ingreso { background: #dbeafe; }
.transaction-icon.gasto { background: #fee2e2; }

.transaction-icon.ingreso svg {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
}

.transaction-icon.gasto svg {
  width: 20px;
  height: 20px;
  color: #ef4444;
  transform: rotate(180deg);
}

.transaction-info { flex: 1; }

.transaction-title {
  margin: 0 0 4px;
  font-size: 0.98rem;
  font-weight: 700;
}

.transaction-subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: #5b7a9f;
}

.subtitle-gasto { color: #dc2626; }

.transaction-note {
  margin: 6px 0 0;
  font-size: 0.8rem;
  color: #4b5563;
}

.transaction-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.transaction-amount {
  font-size: 0.96rem;
  font-weight: 800;
}

.transaction-actions {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 6px;
}

.action-button {
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 6px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.edit-button {
  background: #eff6ff;
  color: #0f172a;
  border-color: #bfdbfe;
}

.delete-button {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.amount-positive { color: #16a34a; }
.amount-negative { color: #dc2626; }

.empty-state, .loading {
  color: #475569;
  font-size: 0.98rem;
  text-align: center;
  padding: 20px;
}

.add-transaction-button {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100px;
  width: 240px;
  height: 52px;
  border: none;
  border-radius: 999px;
  background: #13a4ec;
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 18px 32px rgba(19, 164, 236, 0.22);
  cursor: pointer;
  z-index: 20;
}

.add-transaction-button:hover {
  filter: brightness(1.05);
}

.button-icon { font-size: 1.4rem; }

.transaction-form-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.26);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 18px;
  z-index: 100;
}

.transaction-card {
  width: 100%;
  max-width: 400px;
  border-radius: 32px;
  background: #ffffff;
  padding: 24px 20px 20px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.14);
  position: relative;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.05);
  color: #0f172a;
  font-size: 1.4rem;
  cursor: pointer;
}

.transaction-card h2 {
  margin: 0 0 18px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
}

.amount-display {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 22px;
}

.currency-symbol {
  font-size: 24px;
  color: #b0b4b8;
  font-weight: 500;
}

.amount-input {
  width: 100%;
  max-width: 220px;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: 48px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -1px;
  appearance: textfield;
  -moz-appearance: textfield;
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.type-toggle {
  background-color: #f0f2f5;
  border-radius: 20px;
  display: flex;
  padding: 4px;
  margin-bottom: 24px;
}

.toggle-button {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #8e8e93;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-button.active {
  background-color: #ffffff;
  color: #16a3fe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.transaction-form {
  display: grid;
  gap: 16px;
}

.form-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 0 16px;
  margin-bottom: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
}

.form-row:not(:last-child) {
  border-bottom: 1px solid #eaebed;
}

.left-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: #ebf6ff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #16a3fe;
}

.icon-wrapper svg {
  width: 18px;
  height: 18px;
}

.label {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.row-input {
  width: 130px;
  text-align: right;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #8e8e93;
  outline: none;
}

.note-card {
  padding: 0 16px 0;
}

.note-input-wrapper {
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
}

.note-input {
  border: none;
  outline: none;
  font-size: 15px;
  width: 100%;
  color: #1a1a1a;
  background: transparent;
}

.note-input::placeholder {
  color: #8e8e93;
}

.save-button {
  margin-top: 0;
  background-color: #16a3fe;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 12px rgba(22, 163, 254, 0.3);
}

.save-button:active {
  transform: scale(0.98);
}

.save-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>