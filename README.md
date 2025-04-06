# Formulario de Pagos - Frontend

Este proyecto es una aplicación web desarrollada con Vue.js que implementa un formulario de Pagos avanzado con validaciones y manejo de archivos.

## Características

- 📝 Formulario de Pagos con múltiples campos
- ✅ Validaciones en tiempo real
- 📤 Subida de archivos para comprobantes de pago
- 💳 Múltiples métodos de pago
- 🎨 Interfaz de usuario moderna y responsive
- 🔒 Validaciones de seguridad para archivos
- 📊 Tabla de visualización de registros guardados
- 🔔 Sistema de notificaciones y alertas
- 🧭 Navegación entre vistas con Vue Router
- 🔑 Autenticación y autorización de usuarios

## Tecnologías Utilizadas

- Vue.js 3 - Framework progresivo para construir interfaces de usuario
- Pinia 3 - Biblioteca de gestión de estado para Vue 3
- Vue Router 4 - Enrutador oficial para Vue.js
- Axios 1 - Cliente HTTP basado en promesas para el navegador y Node.js
- VueUse 13 - Colección de composables para Vue
- Vue CLI 5 - Herramienta estándar para el desarrollo de Vue.js
- ESLint 7 - Herramienta de análisis de código estático para JavaScript

### Dependencias de desarrollo

```json
"devDependencies": {
  "@babel/core": "^7.12.16",
  "@babel/eslint-parser": "^7.12.16",
  "@vue/cli-plugin-babel": "~5.0.0",
  "@vue/cli-plugin-eslint": "~5.0.0",
  "@vue/cli-service": "~5.0.0",
  "eslint": "^7.32.0",
  "eslint-plugin-vue": "^8.0.3"
}
```

### Compatibilidad de navegadores

El proyecto está configurado para ser compatible con:
- Navegadores con más del 1% de uso global
- Las últimas 2 versiones de cada navegador principal
- No compatible con IE 11

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

## Ejecución

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

## Sistema de Navegación

La aplicación implementa un sistema de navegación completo utilizando Vue Router:

- **Barra de navegación superior**: Permite alternar entre el formulario y la tabla de registros
- **Enlaces contextuales**: Botones que facilitan la navegación entre vistas relacionadas
- **Rutas definidas**:
  - `/`: Vista principal del formulario de pagos
  - `/submissions`: Vista de la tabla de registros guardados

## Sistema de Alertas

La aplicación cuenta con un sistema de alertas para proporcionar feedback al usuario:

- **Tipos de alertas**:
  - Success: Operaciones completadas con éxito
  - Error: Errores en operaciones o validaciones
  - Info: Información general para el usuario
  - Warning: Advertencias sobre posibles problemas

- **Características**:
  - Aparecen en la esquina superior derecha
  - Se cierran automáticamente después de un tiempo
  - Pueden cerrarse manualmente
  - Múltiples alertas se apilan ordenadamente

## Tabla de Registros

La vista de registros muestra todos los pagos guardados en el sistema:

- **Columnas principales**:
  - Nombre del pagador
  - Email de contacto
  - Tipo de documento
  - Método de pago
  - Fecha de registro (formateada)
  - Comprobante de pago (con vista previa para imágenes)

- **Características**:
  - Vista previa de imágenes de comprobantes
  - Enlaces para ver comprobantes en tamaño completo
  - Formateo de fechas para mejor legibilidad
  - Diseño responsive que se adapta a diferentes tamaños de pantalla

## Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos
│   └── styles/     # Archivos CSS
├── components/     # Componentes Vue reutilizables
│   ├── AlertContainer.vue  # Contenedor para mostrar alertas
│   └── AlertMessage.vue    # Componente individual de alerta
├── router/         # Configuración de rutas
├── services/       # Servicios para API y carga de archivos
├── stores/         # Stores de Pinia
│   ├── alertStore.js       # Store para gestión de alertas
│   └── formStore.js        # Store para gestión del formulario
├── validation/     # Esquemas de validación
└── views/          # Vistas principales
    ├── FormView.vue        # Vista del formulario de pagos
    └── SubmissionsView.vue # Vista de la tabla de registros
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