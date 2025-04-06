import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAlertStore } from './alertStore';

export const useFormStore = defineStore('form', {
  state: () => ({
    loading: false,
    error: null,
    success: false
  }),

  actions: {
    async submitForm(formData) {
      const alertStore = useAlertStore();
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        // Asegurarse de que se envía con el Content-Type correcto para FormData
        const response = await api.post('/submissions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.success = true;
        alertStore.success('Formulario enviado correctamente');
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al enviar el formulario';
        this.error = errorMessage;
        alertStore.error(errorMessage);
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    }
  }
});
