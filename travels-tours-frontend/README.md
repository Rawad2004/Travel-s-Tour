#  Travels Tours - Frontend

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

Frontend de la aplicación web **Travels Tours**, una plataforma para la gestión y visualización de paquetes turísticos, blogs y reservas. Este proyecto consume la API REST desarrollada en Spring Boot.

---

##  Demo Rápida (Para probar en 5 minutos)

1. Clona este repositorio.
2. Clona y levanta el [backend](https://github.com/Syberiano/travels-tours-backend) (necesario para que el frontend funcione).
3. Ejecuta `npm install` y `npm run dev` en este frontend.
4. ¡Listo! Abre `http://localhost:5173` en tu navegador.

---

##  Tabla de Contenidos

- [Estado del Proyecto](#estado-del-proyecto)
- [Tecnologías Principales](#tecnologías-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Backend](#backend)

---

## Estado del Proyecto

El proyecto se encuentra en **fase de desarrollo activo**. Las funcionalidades principales están implementadas, y se están realizando mejoras y correcciones de manera continua.

---

## Tecnologías Principales

- **React 19.2.0** - Biblioteca para construir la interfaz de usuario.
- **Vite 8.0.12** - Bundler y entorno de desarrollo ultrarrápido.
- **React Router DOM 7.15.0** - Enrutamiento y navegación.
- **Zustand 5.0.8** - Manejo del estado global.
- **TanStack React Query 5.90.2** - Gestión de datos y caché del servidor.
- **Axios 1.12.2** - Cliente HTTP para consumir la API.
- **Bootstrap 5.3.8** + **React-Bootstrap 2.10.10** - Estilos y componentes UI.
- **Sass 1.93.3** - Preprocesador de CSS.

---

## Requisitos Previos

Asegúrate de tener instalado en tu máquina:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene con Node.js) o **yarn**
- **Git** - [Descargar aquí](https://git-scm.com/)

---

## Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Clona el repositorio

git clone https://github.com/INddestable/travels-tours-frontend.git
cd travels-tours-frontend

### 2. Instala las dependencias

npm install
# o
yarn install

### 3. Ejecuta

npm run dev
# o
yarn dev

La aplicación estará disponible en http://localhost:5173 (por defecto).

## Estructura del proyecto

travels-tours-frontend/

├── public/                 # Archivos estáticos (favicon, etc.)

├── src/

│   ├── app/                # Configuración principal de la app (Providers, etc.)

│   ├── components/         # Componentes reutilizables (Footer, Layout, etc.)

│   ├── constants/          # Constantes y configuraciones globales

│   ├── hooks/              # Hooks personalizados

│   ├── pages/              # Páginas de la aplicación

│   │   ├── admin/          # Panel de administración

│   │   ├── asesor/         # Panel de asesor

│   │   ├── ArticuloBlog.jsx

│   │   ├── Blog.jsx

│   │   ├── Catalogo.jsx

│   │   ├── Contacto.jsx

│   │   ├── DashboardPage.jsx

│   │   └── DetallePaquete.jsx

│   ├── router/             # Configuración de rutas y protección

│   ├── services/           # Servicios para consumir la API

│   ├── store/              # Estado global con Zustand

│   ├── styles/             # Archivos Sass y estilos globales

│   └── utils/              # Funciones y utilidades

├── .env                    # Variables de entorno (no subir a GitHub)

├── .env.example            # Ejemplo de variables de entorno

├── .gitignore

├── index.html

├── package.json

├── vite.config.js

└── README.md

## Backend
Este frontend está diseñado para consumir la API REST del backend de Travels Tours, desarrollado en Spring Boot.

Repositorio del backend: [travels-tours-backend](https://github.com/Syberiano/travels-tours-backend)

La documentación completa de la API está disponible en el repositorio del backend.
