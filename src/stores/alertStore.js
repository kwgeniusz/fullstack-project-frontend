import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    alerts: []
  }),

  actions: {
    addAlert(message, type = 'info', timeout = 5000) {
      const id = Date.now();
      this.alerts.push({ id, message, type });
      
      if (timeout > 0) {
        setTimeout(() => {
          this.removeAlert(id);
        }, timeout);
      }
      
      return id;
    },
    
    removeAlert(id) {
      const index = this.alerts.findIndex(alert => alert.id === id);
      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },
    
    success(message, timeout = 5000) {
      return this.addAlert(message, 'success', timeout);
    },
    
    error(message, timeout = 8000) {
      return this.addAlert(message, 'error', timeout);
    },
    
    warning(message, timeout = 6000) {
      return this.addAlert(message, 'warning', timeout);
    },
    
    info(message, timeout = 4000) {
      return this.addAlert(message, 'info', timeout);
    },
    
    clearAll() {
      this.alerts = [];
    }
  }
});
