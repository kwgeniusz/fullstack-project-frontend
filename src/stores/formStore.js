import { defineStore } from 'pinia';
import api from '@/services/api';

export const useFormStore = defineStore('form', {
  state: () => ({
    loading: false,
    error: null,
    success: false
  }),

  actions: {
    async submitForm(formData) {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        await api.post('/submit-form', formData);
        this.success = true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al enviar el formulario';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    }
  }
});
