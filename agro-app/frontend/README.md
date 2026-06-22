# AgroApp Frontend

Una aplicación agrícola moderna construida con React, TypeScript y Vite, que incluye características de identificación de semillas, diagnóstico de cultivos, recomendaciones agronómicas, monitor climático, calculadora de cosecha y chat con IA agrónomo.

## Características

- 🌱 Identificador de Semillas con IA (upload de imagen + análisis)
- 🔍 Diagnóstico de Cultivos con IA (detección de enfermedades)
- 📋 Recomendaciones Agronómicas personalizadas
- 🌤️ Monitor Climático en tiempo real
- 📊 Calculadora de Rendimiento Económico
- 💬 Chat con IA Agrónomo
- 🗺️ Mapas y Navegación al Campo
- 📱 Diseño Responsivo (móvil y escritorio)
- 🎨 Paleta de Colores Verde/Tierra

## Tecnologías Utilizadas

- React 18 + TypeScript
- Vite (bundler)
- Material-UI (MUI) (componentes UI)
- Firebase (base de datos y storage)
- React Router (navegación)

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase

## Configuración

1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd agro-app/frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database y Firebase Storage
   - Obtiene tu configuración de Firebase
   - Copia `.env.example` a `.env` y llena tus credenciales de Firebase:
     ```
     VITE_FIREBASE_API_KEY=your_api_key_here
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
     VITE_FIREBASE_PROJECT_ID=your_project_id_here
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
     VITE_FIREBASE_APP_ID=your_app_id_here
     ```

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción para Producción

Para construir la aplicación para producción:
```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`.

## Despliegue en GitHub Pages

Esta aplicación está configurada para desplegarse en GitHub Pages:

1. Asegúrate de tener configurado tu Firebase en las variables de entorno (como se describe arriba)

2. Construye la aplicación:
   ```bash
   npm run build
   ```

3. Despliega a GitHub Pages usando uno de estos métodos:

   **Método 1: Usando la rama gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```
   Luego agrega estos scripts a tu package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
   Y ejecuta:
   ```bash
   npm run deploy
   ```

   **Método 2: Manual**
   - Sube el contenido de la carpeta `dist/` a la rama `gh-pages` de tu repositorio
   - O si estás usando la rama principal para GitHub Pages, súbela allí

4. Después de desplegar, tu aplicación estará disponible en:
   `https://[tu-usuario].github.io/[nombre-del-repositorio]/`

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── layout/         # Componentes de layout (Header, Sidebar, etc.)
├── pages/          # Páginas de la aplicación
├── firebase.ts     # Configuración y servicios de Firebase
├── theme.ts        # Tema de Material-UI personalizado
├── App.tsx         # Componente raíz con rutas
└── main.tsx        # Punto de entrada
```

## Funcionalidades de IA

Nota: Las funcionalidades de IA actuales usan datos mock para demostración. Para implementar IA real:

1. **Identificador de Semillas**: Conectar a un servicio de visión por computadora (como Google Cloud Vision o AWS Rekognition) o entrenar un modelo personalizado
2. **Diagnóstico de Cultivos**: Integrar con un servicio de diagnóstico de enfermedades de plantas
3. **Chat IA Agrónomo**: Conectar a un modelo de lenguaje grande (LLM) especializado en agricultura

Estos servicios serían típicamente implementados en Firebase Cloud Functions o en un backend separado.

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing-feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.