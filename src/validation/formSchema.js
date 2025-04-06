import * as yup from 'yup';

export const formSchema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
    
  email: yup
    .string()
    .required('El email es requerido')
    .email('Ingrese un email válido'),
    
  documentType: yup
    .string()
    .required('El tipo de documento es requerido')
    .oneOf(['dni', 'passport', 'license'], 'Seleccione un tipo de documento válido'),
    
  paymentMethod: yup
    .string()
    .required('El método de pago es requerido')
    .oneOf(['cash', 'transfer', 'card'], 'Seleccione un método de pago válido'),
    
  paymentProof: yup
    .mixed()
    .when('paymentMethod', {
      is: 'transfer',
      then: yup
        .mixed()
        .required('El comprobante de pago es requerido')
        .test('fileSize', 'El archivo no debe exceder 2MB', value => {
          if (!value) return true;
          return value.size <= 2 * 1024 * 1024;
        })
        .test('fileType', 'Solo se permiten archivos PDF, JPEG o PNG', value => {
          if (!value) return true;
          return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
        })
    }),
    
  message: yup
    .string()
    .required('El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede tener más de 500 caracteres')
});
