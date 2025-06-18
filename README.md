# 📋 Sistema de Gestión de Clientes

Este es un sistema completo (CRUD) para la **gestión de clientes**, desarrollado con un **backend en Node.js (Express + Sequelize + SQLite)** y un **frontend en React.js**.

---

## ✨ Características

- ✅ **Gestión Completa de Clientes (CRUD)**: Crear, Leer, Actualizar y Eliminar registros de clientes.
- 🔍 **Autocompletado de Nombre por DNI**: Al ingresar un DNI válido, el nombre se autocompleta automáticamente desde una API externa de RENIEC (vía backend).

---

## ⚙️ Configuración y Ejecución

### 🔐 Clave API de RENIEC

1. En la carpeta del backend, crea un archivo `.env` con el siguiente contenido:
   ```
   RENIEC_API_KEY=apis-token-15954.0we3Ml0fqdabkvt1UXsxAZSlJqeqSZlW
   ```

---

### 🚀 Iniciar Backend

```bash
cd backend
npm install
npm run dev      

---

### 🚀 Iniciar Frontend

cd frontend
npm install
npm run dev
