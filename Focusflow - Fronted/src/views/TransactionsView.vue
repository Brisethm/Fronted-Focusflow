<template>
  <div class="transacciones-container">
    <h1>Gestión de Transacciones</h1>

    <!-- Formulario para Crear / Editar -->
    <section class="form-section">
      <h2>{{ isEditing ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
      
      <form @submit.prevent="guardarTransaccion" class="transaccion-form">
        <div class="form-group">
          <label for="fecha">Fecha y Hora:</label>
          <input 
            type="datetime-local" 
            id="fecha" 
            v-model="form.fecha" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="monto">Monto:</label>
          <input 
            type="number" 
            id="monto" 
            v-model="form.monto" 
            required 
            placeholder="Ej. 150000"
          />
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <input 
            type="text" 
            id="descripcion" 
            v-model="form.descripcion" 
            required 
            placeholder="Ej. Pago de internet"
          />
        </div>

        <div class="form-group">
          <label for="categoria">Categoría:</label>
          <input 
            type="text" 
            id="categoria" 
            v-model="form.categoria" 
            required 
            placeholder="Ej. Alimentación, Transporte, etc."
          />
        </div>

        <div class="form-group">
          <label for="tipo">Tipo:</label>
          <select id="tipo" v-model="form.tipo" required>
            <option value="" disabled>Selecciona un tipo</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </button>
          <button type="button" v-if="isEditing" @click="cancelarEdicion" class="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </section>

    <!-- Lista de Transacciones -->
    <section class="list-section">
      <h2>Historial de Transacciones</h2>
      
      <div v-if="cargando" class="loading">Cargando transacciones...</div>
      
      <table v-else-if="transacciones.length > 0" class="transacciones-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transacciones" :key="t.idTransaccion">
            <td>{{ formatearFecha(t.fecha) }}</td>
            <td>{{ t.descripcion }}</td>
            <td>{{ t.categoria }}</td>
            <td :class="t.tipo === 'Ingreso' ? 'text-success' : 'text-danger'">
              ${{ t.monto }}
            </td>
            <td>{{ t.tipo }}</td>
            <td>
              <button @click="prepararEdicion(t)" class="btn-edit">Editar</button>
              <button @click="borrarTransaccion(t.idTransaccion)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p v-else class="empty-state">No hay transacciones registradas aún.</p>
    </section>
  </div>
  <FooterNav />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FooterNav from '../components/FooterNav.vue';
import { 
  getTransacciones, 
  createTransaccion, 
  updateTransaccion, 
  deleteTransaccion 
} from '../services/api.js'; 

// --- ESTADOS REACTIVOS ---
const transacciones = ref([]);
const cargando = ref(false);
const isEditing = ref(false);
const transaccionIdActiva = ref(null);

// --- TIMEZONE ---
const userTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Bogota";

// --- HELPERS DE FECHA ---
// Normaliza string → Date interpretado como UTC
const parseUtcDateTime = (dateString) => {
  if (!dateString) return null;
  const normalized = dateString.includes("T")
    ? dateString
    : dateString.replace(" ", "T");
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const date = new Date(hasTimeZone ? normalized : `${normalized}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Fecha local actual para input datetime-local
const obtenerFechaActual = () => {
  const now = new Date();
  return now.toLocaleString("en-CA", {
    timeZone: userTimeZone,
    hour12: false,
  }).slice(0,16); // YYYY-MM-DDTHH:mm
};

// Convierte UTC (DB) → formato local para input
const formatoLocalParaInput = (fechaUtc) => {
  const date = parseUtcDateTime(fechaUtc);
  if (!date) return obtenerFechaActual();
  return date.toLocaleString("en-CA", {
    timeZone: userTimeZone,
    hour12: false,
  }).slice(0,16);
};

// Convierte UTC (DB) → string bonito para tabla
const formatearFecha = (fechaIso) => {
  const date = parseUtcDateTime(fechaIso);
  if (!date) return '';
  return date.toLocaleString("es-CO", {
    timeZone: userTimeZone,
    dateStyle: "short",
    timeStyle: "short",
  });
};

// --- ESTADO DEL FORM ---
const form = ref({
  monto: '',
  descripcion: '',
  categoria: '',
  tipo: '',
  fecha: obtenerFechaActual()
});

// --- MÉTODOS ---
// 1. Leer (GET)
const cargarTransacciones = async () => {
  cargando.value = true;
  try {
    transacciones.value = await getTransacciones();
  } catch (error) {
    console.error("Error al cargar las transacciones:", error);
    alert("Hubo un error al cargar los datos.");
  } finally {
    cargando.value = false;
  }
};

// 2. Crear o Actualizar (POST / PUT)
const guardarTransaccion = async () => {
  try {
    const payload = {
      idTransaccion: isEditing.value ? transaccionIdActiva.value : 0,
      monto: Number(form.value.monto),
      tipo: form.value.tipo,
      categoria: form.value.categoria,
      descripcion: form.value.descripcion,
      // Siempre UTC en DB
      fecha: new Date(form.value.fecha).toISOString()
    };

    if (isEditing.value) {
      await updateTransaccion(transaccionIdActiva.value, payload);
    } else {
      await createTransaccion(payload);
    }

    await cargarTransacciones();
    cancelarEdicion(); 

  } catch (error) {
    console.error("Error al guardar la transacción:", error);
    alert("No se pudo guardar la transacción.");
  }
};

// 3. Preparar edición
const prepararEdicion = (transaccion) => {
  isEditing.value = true;
  transaccionIdActiva.value = transaccion.idTransaccion; 

  form.value = {
    monto: transaccion.monto,
    descripcion: transaccion.descripcion,
    categoria: transaccion.categoria || '',
    tipo: transaccion.tipo,
    // UTC → Local para input
    fecha: formatoLocalParaInput(transaccion.fecha)
  };
};

// 4. Cancelar edición
const cancelarEdicion = () => {
  isEditing.value = false;
  transaccionIdActiva.value = null;
  form.value = { 
    monto: '', 
    descripcion: '', 
    categoria: '', 
    tipo: '', 
    fecha: obtenerFechaActual() 
  };
};

// 5. Eliminar
const borrarTransaccion = async (idTransaccion) => {
  if (!confirm("¿Estás seguro de que deseas eliminar esta transacción?")) return;
  try {
    await deleteTransaccion(idTransaccion);
    await cargarTransacciones(); 
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar la transacción.");
  }
};

// --- CICLO DE VIDA ---
onMounted(() => {
  cargarTransacciones();
});
</script>



<style scoped>
.transacciones-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Manrope, sans-serif;
}

.form-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.transaccion-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input, .form-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-primary, .btn-secondary, .btn-edit, .btn-delete {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary { background: #4CAF50; color: white; }
.btn-primary:hover { background: #45a049; }

.btn-secondary { background: #9e9e9e; color: white; }
.btn-secondary:hover { background: #757575; }

.btn-edit { background: #2196F3; color: white; margin-right: 5px; }
.btn-edit:hover { background: #1976D2; }

.btn-delete { background: #f44336; color: white; }
.btn-delete:hover { background: #d32f2f; }

.transacciones-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.transacciones-table th, .transacciones-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.transacciones-table th {
  background-color: #f2f2f2;
  color: #333;
}

.transacciones-table tr:hover {
  background-color: #f9f9f9;
}

.text-success { color: #2e7d32; font-weight: bold; }
.text-danger { color: #c62828; font-weight: bold; }
.empty-state, .loading { text-align: center; color: #666; margin-top: 20px; font-size: 16px; }
</style>