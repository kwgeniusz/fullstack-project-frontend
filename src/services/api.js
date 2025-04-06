import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  }
});

export const submitForm = async (formData) => {
  try {
    const response = await api.post('/submissions', formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getSubmissions = async () => {
  try {
    const response = await api.get('/submissions', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export default api;
