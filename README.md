# Hotel Management Web Application (Full-Stack)

A complete, responsive, full-stack **Hotel Management & Discovery Application** built with **React 19 + Redux Toolkit** on the frontend, and **Node.js + Express + PostgreSQL** on the backend.

---

## 📁 Repository Overview

This repository is split into two independent, modular directories:

| Directory | Stack | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **[`frontend/`](./frontend)** | React 19, Redux Toolkit, Leaflet, Vite | `5173` | Responsive SPA client with CRUD form, search/filter, map, pagination & SEO |
| **[`backend/`](./backend)** | Node.js, Express, PostgreSQL 18, Multer | `5000` | REST API with native SQL queries, file uploads, filtering & validation |

Detailed guides are available in their respective directories:
- **[Frontend Documentation](./frontend/README.md)**
- **[Backend API Documentation](./backend/README.md)**

---

## ⚡ Quick Start Guide

### 1. Database Setup
1. Ensure **PostgreSQL 18** is running locally on port `5432`.
2. Connect with **pgAdmin 4** or `psql` and create the database:
   ```sql
   CREATE DATABASE hotel_db;
   ```

### 2. Start the Backend API
In your first terminal:
```bash
cd backend
npm install
npm run seed      # (Optional) Pre-loads 7 luxury hotel properties
npm run dev       # Starts Express API at http://localhost:5000
```

### 3. Start the Frontend App
In your second terminal:
```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server at http://localhost:5173
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 🌟 Key Application Features

- **CRUD Operations:** Create, Read, Update, and Delete hotel listings with instant synchronization to PostgreSQL.
- **Image Upload & Storage:** Local file uploads handled via Multer and saved on the server disk (`backend/uploads/`) with real-time preview in the form.
- **Search & Filters:** Real-time keyword search, min/max price sliders, quick preset buttons, and sorting options.
- **Interactive Maps & Geolocation:** Detailed map view powered by Leaflet and OpenStreetMap, with distance calculation using the browser's Geolocation API.
- **SEO Optimized:** Dynamic meta tags, OpenGraph previews, and Schema.org JSON-LD structured data powered by `react-helmet-async`.
