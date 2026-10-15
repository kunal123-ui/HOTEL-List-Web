# Hotel Management Web Application

A responsive Hotel Management and Discovery web application built with **React**, **Redux Toolkit**, and **Leaflet** on the frontend, with an optional **Node.js Express + PostgreSQL** REST backend.

---

## 🚀 Quick Start Guide

### Frontend Setup (Can run independently with dummy data)
1. Open a terminal and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at **http://localhost:5173**

> **Note**: The frontend works completely out-of-the-box with built-in dummy data and `localStorage` caching. You do not need to set up the backend database to test all the features!

---

### Backend Setup (Optional)
If you want to run the full-stack database connection:
1. Open a new terminal and navigate to `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Set up your PostgreSQL database (default `hotel_db` in `.env`):
   ```bash
   npm run seed      # Seeds sample hotels into PostgreSQL
   npm run dev       # Starts backend API on http://localhost:5000
   ```

---

## ✨ Features Implemented

### 1. Hotel List & Cards
- Responsive card view and grid view displaying hotel image, title, price, location coordinates, and short description.
- Formatted prices in Indian Rupees (`₹`).

### 2. Search, Filter & Sort
- **Search**: Real-time filtering by hotel name.
- **Price Filter**: Min and Max price inputs plus quick preset buttons (e.g. *Under ₹3,000*, *₹3,000–₹5,000*, *₹5,000–₹7,000*, *₹7,000+*).
- **Sort**: Sort by Recommended, Price (Low to High), Price (High to Low), and Name (A–Z).

### 3. Dynamic Pagination
- 4 hotels per page with navigation (Previous, Page Numbers, Next).

### 4. Reusable Add & Edit Hotel Form
- Single reusable form component for both adding and editing.
- **Local Image Upload**: Choose a file from your device with instant image preview (`FileReader`), or enter an image URL / pick sample photos.
- **Form Validation**: Validates title (min 3 chars), description (min 15 chars), coordinates (latitude -90 to 90, longitude -180 to 180), and price (> 0).
- **Geolocation Integration**: "Auto-Detect My Coordinates" button uses the browser's Geolocation API (`navigator.geolocation`) to fill latitude & longitude automatically.

### 5. Hotel Detail Page & Interactive Map
- Detailed page with high-res photo gallery/slider, amenities, room specifications, and simulated reservation box.
- **Leaflet OpenStreetMap**: Interactive map centered at the hotel's exact GPS coordinates.
- **Distance Calculator**: Measures your live distance (in km) to the hotel and estimated driving time using the browser Geolocation API and Haversine formula.

### 6. Delete Confirmation & Notifications
- Safe delete modal asking for confirmation before removing a hotel.
- Success notification toast for added, updated, or deleted hotels.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Redux Toolkit, React Router, Leaflet, Lucide Icons, Vanilla CSS
- **Backend (Optional)**: Node.js, Express, PostgreSQL, Multer (file upload)
