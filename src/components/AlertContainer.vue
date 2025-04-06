<template>
  <div class="alert-container">
    <AlertMessage
      v-for="alert in alerts"
      :key="alert.id"
      :show="true"
      :message="alert.message"
      :type="alert.type"
      @close="removeAlert(alert.id)"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/stores/alertStore';
import AlertMessage from './AlertMessage.vue';

const alertStore = useAlertStore();
const { alerts } = storeToRefs(alertStore);
const { removeAlert } = alertStore;
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-width: 90vw;
}
</style>
