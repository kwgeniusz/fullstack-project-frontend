<template>
  <div class="submissions-container">
    <h2>Registros Guardados</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando registros...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchSubmissions" class="retry-button">Reintentar</button>
    </div>
    
    <div v-else-if="!submissions.length" class="empty-state">
      <p>No hay registros guardados todavía.</p>
      <router-link to="/" class="action-button">Crear nuevo registro</router-link>
    </div>
    
    <div v-else class="table-container">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo de Comprobante</th>
            <th>Método de Pago</th>
            <th>Mensaje</th>
            <th>Comprobante</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissions" :key="submission.id">
            <td>{{ submission.id }}</td>
            <td>{{ submission.nombre }}</td>
            <td>{{ submission.email }}</td>
            <td>{{ submission.tipo_comprobante }}</td>
            <td>{{ submission.metodo_pago }}</td>
            <td class="message-cell">
              <div class="message-content">{{ submission.mensaje }}</div>
            </td>
            <td>
              <a 
                v-if="submission.comprobante_pago" 
                :href="getImageUrl(submission.comprobante_pago)" 
                target="_blank" 
                class="view-proof"
              >
                <img 
                  v-if="isImageFile(submission.comprobante_pago)" 
                  :src="getImageUrl(submission.comprobante_pago)" 
                  alt="Comprobante" 
                  class="thumbnail"
                />
                <span v-else class="document-icon">📄</span>
                Ver
              </a>
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(submission.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="actions">
      <router-link to="/" class="action-button">Volver al formulario</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getSubmissions } from '@/services/api';
import { useAlertStore } from '@/stores/alertStore';

const alertStore = useAlertStore();
const submissions = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchSubmissions = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await getSubmissions();
    submissions.value = data.data || [];
  } catch (err) {
    error.value = err.message || 'Error al cargar los registros';
    alertStore.error(error.value);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const isImageFile = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

const getImageUrl = (relativePath) => {
  if (!relativePath) return '';
  // Si la ruta ya es una URL completa
  if (relativePath.startsWith('http')) return relativePath;
  
  // Si no, construye la URL completa
  const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000';
  // Quitamos /api/ si existe en la URL base
  const cleanBaseUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
  return `${cleanBaseUrl}/storage/${relativePath}`;
};

onMounted(() => {
  fetchSubmissions();
});
</script>

<style scoped>
.submissions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #ffebee;
  color: #b71c1c;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.submissions-table th,
.submissions-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.submissions-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.submissions-table tr:hover {
  background-color: #f5f5f5;
}

.message-cell {
  max-width: 200px;
}

.message-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 5px;
  vertical-align: middle;
}

.document-icon {
  font-size: 24px;
  margin-right: 5px;
  vertical-align: middle;
}

.view-proof {
  display: flex;
  align-items: center;
  color: #3498db;
  text-decoration: none;
}

.view-proof:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-button,
.retry-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.action-button:hover,
.retry-button:hover {
  background-color: #2980b9;
}
</style>
