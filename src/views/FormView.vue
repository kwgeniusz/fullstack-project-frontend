<template>
  <div class="form-container">
    <h2>Formulario de Pago</h2>
    
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

// Limpiar todos los errores
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
};

// Función de validación nativa con JavaScript
const validateForm = () => {
  clearErrors();
  let isValid = true;
  
  // Validar nombre
  if (!form.name) {
    errors.name = 'El nombre es requerido';
    isValid = false;
  } else if (form.name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (form.name.length > 50) {
    errors.name = 'El nombre no puede tener más de 50 caracteres';
    isValid = false;
  }
  
  // Validar email
  if (!form.email) {
    errors.email = 'El email es requerido';
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = 'Ingrese un email válido';
      isValid = false;
    }
  }
  
  // Validar tipo de documento
  if (!form.documentType) {
    errors.documentType = 'El tipo de documento es requerido';
    isValid = false;
  } else if (!['dni', 'passport', 'license'].includes(form.documentType)) {
    errors.documentType = 'Seleccione un tipo de documento válido';
    isValid = false;
  }
  
  // Validar método de pago
  if (!form.paymentMethod) {
    errors.paymentMethod = 'El método de pago es requerido';
    isValid = false;
  } else if (!['cash', 'transfer', 'card'].includes(form.paymentMethod)) {
    errors.paymentMethod = 'Seleccione un método de pago válido';
    isValid = false;
  }
  
  // Validar comprobante de pago solo si es transferencia
  if (form.paymentMethod === 'transfer') {
    if (!form.paymentProof) {
      errors.paymentProof = 'El comprobante de pago es requerido';
      isValid = false;
    } else {
      // Validar tamaño del archivo (máximo 2MB)
      if (form.paymentProof.size > 2 * 1024 * 1024) {
        errors.paymentProof = 'El archivo no debe exceder 2MB';
        isValid = false;
      }
      
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(form.paymentProof.type)) {
        errors.paymentProof = 'Solo se permiten archivos PDF, JPEG o PNG';
        isValid = false;
      }
    }
  }
  
  // Validar mensaje
  if (!form.message) {
    errors.message = 'El mensaje es requerido';
    isValid = false;
  } else if (form.message.length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
    isValid = false;
  } else if (form.message.length > 500) {
    errors.message = 'El mensaje no puede tener más de 500 caracteres';
    isValid = false;
  }
  
  return isValid;
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
    const isValid = validateForm();
    
    // Si hay errores en algún campo, detener el envío
    const hasErrors = Object.values(errors).some(error => error !== '');
    console.log(isValid)
    console.log(errors)
    if (!isValid || hasErrors) {
      submitError.value = 'Por favor, corrija los errores en el formulario';
      return;
    }
    
    // Si es transferencia y hay comprobante, subir primero el archivo
    if (form.paymentMethod === 'transfer' && form.paymentProof) {
      try {
        const formData = new FormData();
        formData.append('file', form.paymentProof);
        
        const uploadResult = await uploadPaymentProof(formData);
        if (uploadResult && uploadResult.url) {
          form.paymentProofUrl = uploadResult.url;
        } else {
          submitError.value = 'Error: No se recibió URL del comprobante';
          return;
        }
      } catch (uploadError) {
        console.error('Error de carga:', uploadError);
        submitError.value = 'Error al subir el comprobante de pago';
        return;
      }
    }
    
    // Preparar datos para envío
    const formDataToSubmit = {
      name: form.name,
      email: form.email,
      message: form.message,
      documentType: form.documentType,
      paymentMethod: form.paymentMethod
    };
    
    // Solo incluir paymentProofUrl si es transferencia
    if (form.paymentMethod === 'transfer' && form.paymentProofUrl) {
      formDataToSubmit.paymentProof = form.paymentProofUrl;
    }
    
    // Enviar el formulario completo
    try {
      await formStore.submitForm(formDataToSubmit);
      
      // Mostrar mensaje de éxito
      submitError.value = '';
      alert('Formulario enviado con éxito');
      
      // Limpiar el formulario después del éxito
      Object.keys(form).forEach(key => {
        form[key] = key === 'paymentProof' ? null : '';
      });
      form.paymentProofUrl = '';
      clearErrors();
    } catch (submitError) {
      submitError.value = submitError.message || 'Error al enviar el formulario';
    }
  } catch (error) {
    // Este bloque catch ahora solo maneja errores generales
    // que no fueron capturados en los bloques try/catch específicos
    console.error('Error general:', error);
    submitError.value = 'Ha ocurrido un error inesperado';
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
