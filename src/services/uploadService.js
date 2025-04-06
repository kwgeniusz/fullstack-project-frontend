import api from './api';

export const uploadPaymentProof = async (file) => {
  try {
    // Si ya es un FormData, usarlo directamente
    let formData;
    if (file instanceof FormData) {
      formData = file;
    } else {
      // Si es un archivo, crear nuevo FormData
      formData = new FormData();
      formData.append('file', file);
    }
    
    const response = await api.post('/upload/payment-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Verificar que la respuesta contenga los datos esperados
    if (!response.data || !response.data.url) {
      throw new Error('Respuesta del servidor incompleta');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en uploadPaymentProof:', error);
    throw new Error(error.response?.data?.message || 'Error al subir el archivo');
  }
};
