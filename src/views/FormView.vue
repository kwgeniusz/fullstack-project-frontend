<template>
  <div class="form-container">
    <h2>Formulario de Contacto</h2>
    
    <form @submit.prevent="handleSubmit" class="contact-form">
      <FormInput
        id="name"
        label="Nombre"
        v-model="form.name"
        :error="errors.name"
      />
      
      <FormInput
        id="email"
        label="Email"
        type="email"
        v-model="form.email"
        :error="errors.email"
      />
      
      <FormSelect
        id="documentType"
        label="Tipo de Documento"
        v-model="form.documentType"
        :options="documentTypes"
        :error="errors.documentType"
      />
      
      <FormSelect
        id="paymentMethod"
        label="Método de Pago"
        v-model="form.paymentMethod"
        :options="paymentMethods"
        :error="errors.paymentMethod"
      />
      
      <FileUpload
        v-if="showPaymentProof"
        id="paymentProof"
        label="Comprobante de Pago"
        v-model="form.paymentProof"
        :error="errors.paymentProof"
      />
      
      <FormTextarea
        id="message"
        label="Mensaje"
        v-model="form.message"
        :error="errors.message"
      />
      
      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
        </button>
      </div>
      
      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormTextarea from '@/components/FormTextarea.vue';
import FileUpload from '@/components/FileUpload.vue';
import { useFormStore } from '@/stores/formStore';
import { uploadPaymentProof } from '@/services/uploadService';
import { formSchema } from '@/validation/formSchema';

const formStore = useFormStore();
const showPaymentProof = ref(false);
const isSubmitting = ref(false);
const submitError = ref('');

const form = reactive({
  name: '',
  email: '',
  message: '',
  documentType: '',
  paymentMethod: '',
  paymentProof: null,
  paymentProofUrl: ''
});

const errors = reactive({
  name: '',
  email: '',
  message: '',
  documentType: '',
  paymentMethod: '',
  paymentProof: ''
});

// Limpiar errores
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

// Validar formulario
const validateForm = async () => {
  try {
    await formSchema.validate(form, { abortEarly: false });
    clearErrors();
    return true;
  } catch (error) {
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return false;
  }
};

// Observar cambios en el método de pago
watch(() => form.paymentMethod, (newValue) => {
  showPaymentProof.value = newValue === 'transfer';
  if (newValue !== 'transfer') {
    form.paymentProof = null;
    errors.paymentProof = '';
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    submitError.value = '';
    
    // Validar el formulario
    const isValid = await validateForm();
    if (!isValid) {
      throw new Error('Por favor, corrija los errores en el formulario');
    }
    
    // Si es transferencia y hay comprobante, subir primero el archivo
    if (form.paymentMethod === 'transfer' && form.paymentProof) {
      const uploadResult = await uploadPaymentProof(form.paymentProof);
      form.paymentProofUrl = uploadResult.url;
    }
    
    // Enviar el formulario completo
    await formStore.submitForm({
      ...form,
      paymentProof: form.paymentProofUrl
    });
    
    // Limpiar el formulario después del éxito
    Object.keys(form).forEach(key => {
      form[key] = key === 'paymentProof' ? null : '';
    });
    form.paymentProofUrl = '';
    clearErrors();
    
  } catch (error) {
    if (!error.inner) { // Si no es un error de validación
      submitError.value = error.message || 'Error al enviar el formulario';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const documentTypes = [
  { value: 'dni', label: 'DNI' },
  { value: 'passport', label: 'Pasaporte' },
  { value: 'license', label: 'Licencia de Conducir' }
];

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'card', label: 'Tarjeta' }
];
</script>

<style>
@import '@/assets/styles/form.css';
</style>
