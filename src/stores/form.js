import { defineStore } from 'pinia';
import { submitForm } from '@/services/api';
import { ERROR_MESSAGES } from '@/constants/messages';

export const useFormStore = defineStore('form', {
  state: () => ({
    loading: false,
    error: null,
    success: false
  }),

  actions: {
    async submitFormData(formData) {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        await submitForm(formData);
        this.success = true;
      } catch (error) {
        this.error = error.message || ERROR_MESSAGES.FORM_SUBMISSION;
      } finally {
        this.loading = false;
      }
    }
  }
});
