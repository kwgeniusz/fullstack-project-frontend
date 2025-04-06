<template>
  <transition name="fade">
    <div v-if="show" :class="['alert', `alert-${type}`]">
      <div class="alert-content">
        <span v-if="type === 'error'" class="alert-icon">⚠️</span>
        <span v-else-if="type === 'success'" class="alert-icon">✅</span>
        <span v-else class="alert-icon">ℹ️</span>
        <span class="alert-message">{{ message }}</span>
      </div>
      <button class="alert-close" @click="$emit('close')">&times;</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'error', 'warning'].includes(value)
  }
});

defineEmits(['close']);
</script>

<style scoped>
.alert {
  position: relative;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.alert-content {
  display: flex;
  align-items: center;
}

.alert-icon {
  margin-right: 10px;
  font-size: 18px;
}

.alert-message {
  font-size: 14px;
}

.alert-close {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  margin-left: 10px;
  opacity: 0.6;
}

.alert-close:hover {
  opacity: 1;
}

.alert-info {
  background-color: #e3f2fd;
  color: #0d47a1;
  border-left: 4px solid #2196f3;
}

.alert-success {
  background-color: #e8f5e9;
  color: #1b5e20;
  border-left: 4px solid #4caf50;
}

.alert-error {
  background-color: #ffebee;
  color: #b71c1c;
  border-left: 4px solid #f44336;
}

.alert-warning {
  background-color: #fff8e1;
  color: #ff6f00;
  border-left: 4px solid #ffc107;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
