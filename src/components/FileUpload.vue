<template>
  <div class="form-group">
    <label :for="id" class="form-label">{{ label }}</label>
    <div class="file-upload-wrapper">
      <input
        :id="id"
        type="file"
        class="file-input"
        :class="{ 'is-invalid': error }"
        @change="handleFileChange"
        accept="image/jpeg,image/png,application/pdf"
      >
      <div class="file-upload-info">
        <span v-if="selectedFile">{{ selectedFile.name }}</span>
        <span v-else>No file selected</span>
      </div>
    </div>
    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const selectedFile = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      emit('update:modelValue', null);
      selectedFile.value = null;
      return;
    }
    selectedFile.value = file;
    emit('update:modelValue', file);
  } else {
    selectedFile.value = null;
    emit('update:modelValue', null);
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.file-upload-wrapper {
  position: relative;
  padding: 1rem;
  border: 2px dashed #ced4da;
  border-radius: 0.25rem;
  text-align: center;
  transition: border-color 0.15s ease-in-out;
  cursor: pointer;
}

.file-upload-wrapper:hover {
  border-color: #86b7fe;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-upload-info {
  font-size: 0.9rem;
  color: #6c757d;
}

.is-invalid + .file-upload-info {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
