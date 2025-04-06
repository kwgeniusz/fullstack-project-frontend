<template>
  <div class="form-container">
    <h2>Formulario de Pago</h2>
    
    <form @submit.prevent="handleSubmit" class="contact-form">
      <FormInput
        id="nombre"
        label="Nombre"
        v-model="form.nombre"
        :error="errors.nombre"
      />
      
      <FormInput
        id="email"
        label="Email"
        type="email"
        v-model="form.email"
        :error="errors.email"
      />
      
      <FormSelect
        id="tipo_comprobante"
        label="Tipo de Comprobante"
        v-model="form.tipo_comprobante"
        :options="documentTypes"
        :error="errors.tipo_comprobante"
      />
      
      <FormSelect
        id="metodo_pago"
        label="Método de Pago"
        v-model="form.metodo_pago"
        :options="paymentMethods"
        :error="errors.metodo_pago"
      />
      
      <FileUpload
        v-if="showPaymentProof"
        id="comprobante_pago"
        label="Comprobante de Pago"
        v-model="form.comprobante_pago"
        :error="errors.comprobante_pago"
      />
      
      <FormTextarea
        id="mensaje"
        label="Mensaje"
        v-model="form.mensaje"
        :error="errors.mensaje"
      />
      
      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
        </button>
        <router-link to="/submissions" class="view-submissions-button">
          Ver registros guardados
        </router-link>
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

const formStore = useFormStore();
const showPaymentProof = ref(false);
const isSubmitting = ref(false);
const submitError = ref('');

const form = reactive({
  nombre: '',
  email: '',
  mensaje: '',
  tipo_comprobante: '',
  metodo_pago: '',
  comprobante_pago: null,
  comprobante_pago_url: ''
});

const errors = reactive({
  nombre: '',
  email: '',
  mensaje: '',
  tipo_comprobante: '',
  metodo_pago: '',
  comprobante_pago: ''
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
  if (!form.nombre) {
    errors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (form.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (form.nombre.length > 50) {
    errors.nombre = 'El nombre no puede tener más de 50 caracteres';
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
  
  // Validar tipo de comprobante
  if (!form.tipo_comprobante) {
    errors.tipo_comprobante = 'El tipo de comprobante es requerido';
    isValid = false;
  } else if (!['Factura', 'CFF', 'Ticket'].includes(form.tipo_comprobante)) {
    errors.tipo_comprobante = 'Seleccione un tipo de comprobante válido';
    isValid = false;
  }
  
  // Validar método de pago
  if (!form.metodo_pago) {
    errors.metodo_pago = 'El método de pago es requerido';
    isValid = false;
  } else if (!['Efectivo', 'Transferencia', 'Tarjeta'].includes(form.metodo_pago)) {
    errors.metodo_pago = 'Seleccione un método de pago válido';
    isValid = false;
  }
  
  // Validar comprobante de pago solo si es transferencia
  if (form.metodo_pago === 'Transferencia') {
    if (!form.comprobante_pago) {
      errors.comprobante_pago = 'El comprobante de pago es requerido';
      isValid = false;
    } else {
      // Validar tamaño del archivo (máximo 2MB)
      if (form.comprobante_pago.size > 2 * 1024 * 1024) {
        errors.comprobante_pago = 'El archivo no debe exceder 2MB';
        isValid = false;
      }
      
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(form.comprobante_pago.type)) {
        errors.comprobante_pago = 'Solo se permiten archivos PDF, JPEG o PNG';
        isValid = false;
      }
    }
  }
  
  // Validar mensaje
  if (!form.mensaje) {
    errors.mensaje = 'El mensaje es requerido';
    isValid = false;
  } else if (form.mensaje.length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    isValid = false;
  } else if (form.mensaje.length > 500) {
    errors.mensaje = 'El mensaje no puede tener más de 500 caracteres';
    isValid = false;
  }
  
  return isValid;
};

// Observar cambios en el método de pago
watch(() => form.metodo_pago, (newValue) => {
  showPaymentProof.value = newValue === 'Transferencia';
  if (newValue !== 'Transferencia') {
    form.comprobante_pago = null;
    errors.comprobante_pago = '';
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
    // console.log(isValid)
    // console.log(errors)
    if (!isValid || hasErrors) {
      submitError.value = 'Por favor, corrija los errores en el formulario';
      return;
    }
    
    // Preparar datos para envío
    const formData = new FormData();
    
    // Agregar todos los campos de texto
    formData.append('nombre', form.nombre);
    formData.append('email', form.email);
    formData.append('mensaje', form.mensaje);
    formData.append('tipo_comprobante', form.tipo_comprobante);
    formData.append('metodo_pago', form.metodo_pago);
    
    // Agregar el archivo de comprobante si existe
    if (form.metodo_pago === 'Transferencia' && form.comprobante_pago) {
      formData.append('comprobante_pago', form.comprobante_pago);
    } else {
      // Enviar null si no hay comprobante
      formData.append('comprobante_pago', '');
    }
    
    // Enviar el formulario completo
    try {
      await formStore.submitForm(formData);
      
      // Mostrar mensaje de éxito
      submitError.value = '';
      alert('Formulario enviado con éxito');
      
      // Limpiar el formulario después del éxito
      Object.keys(form).forEach(key => {
        form[key] = key === 'comprobante_pago' ? null : '';
      });
      form.comprobante_pago_url = '';
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
  { value: 'Factura', label: 'Factura' },
  { value: 'CFF', label: 'CFF' },
  { value: 'Ticket', label: 'Ticket' }
];

const paymentMethods = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Transferencia', label: 'Transferencia' },
  { value: 'Tarjeta', label: 'Tarjeta' }
];
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.view-submissions-button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
}

.view-submissions-button:hover {
  background-color: #0b7dda;
}

.error-message {
  color: #f44336;
  margin-top: 10px;
  text-align: center;
}
</style>
