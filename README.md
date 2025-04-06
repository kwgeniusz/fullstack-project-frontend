# Formulario de Contacto - Frontend

Este proyecto es una aplicación web desarrollada con Vue.js que implementa un formulario de contacto avanzado con validaciones y manejo de archivos.

## Características

- 📝 Formulario de contacto con múltiples campos
- ✅ Validaciones en tiempo real
- 📤 Subida de archivos para comprobantes de pago
- 💳 Múltiples métodos de pago
- 🎨 Interfaz de usuario moderna y responsive
- 🔒 Validaciones de seguridad para archivos

## Tecnologías Utilizadas

- Vue.js 3
- Pinia (manejo de estado)
- Axios (peticiones HTTP)
- Yup (validaciones de formulario)
- Vue CLI

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd fullstack-project-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env en la raíz del proyecto:
```env
VUE_APP_API_URL=http://localhost:8000/api
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run serve
```

La aplicación estará disponible en `http://localhost:8081`

## Uso del Formulario

El formulario incluye los siguientes campos:

1. **Nombre**
   - Obligatorio
   - Mínimo 2 caracteres
   - Máximo 50 caracteres

2. **Email**
   - Obligatorio
   - Debe ser un email válido

3. **Tipo de Documento**
   - Opciones: DNI, Pasaporte, Licencia de Conducir
   - Obligatorio

4. **Método de Pago**
   - Opciones: Efectivo, Transferencia, Tarjeta
   - Si selecciona "Transferencia", se habilita la subida del comprobante

5. **Comprobante de Pago** (solo para transferencias)
   - Formatos permitidos: PDF, JPEG, PNG
   - Tamaño máximo: 2MB

6. **Mensaje**
   - Obligatorio
   - Mínimo 10 caracteres
   - Máximo 500 caracteres

## Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos
│   └── styles/     # Archivos CSS
├── components/     # Componentes Vue reutilizables
├── services/       # Servicios para API y carga de archivos
├── stores/         # Stores de Pinia
├── validation/     # Esquemas de validación
└── views/          # Vistas principales
```

## Scripts Disponibles

- `npm run serve`: Inicia el servidor de desarrollo
- `npm run build`: Crea una build de producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta las pruebas unitarias

## Construcción para Producción

Para crear una build de producción:

```bash
npm run build
```

Los archivos compilados se encontrarán en el directorio `dist/`

## Notas de Seguridad

- Los archivos subidos están limitados a 2MB
- Solo se permiten formatos seguros (PDF, JPEG, PNG)
- Las validaciones se realizan tanto en el frontend como en el backend
- Los datos sensibles no se almacenan en el estado global

## Contribuir

1. Fork el proyecto
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request