# Hotel Management Backend API

A production-ready **Node.js + Express** REST API powered by **PostgreSQL** using **native SQL queries** (no ORM). Features multipart image uploads with **Multer**, disk file cleanup on updates/deletions, robust input validation, dynamic filtering, sorting, and pagination.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4)
- **Database:** PostgreSQL 18 (Native SQL via `pg` connection pool)
- **File Uploads:** Multer (MIME-type filtering & 5MB file size limit)
- **Environment Management:** `dotenv`
- **CORS:** `cors` (Configured for `http://localhost:5173`)

---

## 📁 Architecture & Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool & automatic table creation
│   ├── controllers/
│   │   └── hotelController.js  # Business logic for all hotel CRUD & filter endpoints
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error & 404 handler
│   │   ├── upload.js           # Multer configuration for image files (5MB max)
│   │   └── validate.js         # Input validation & bad-upload cleanup
│   ├── routes/
│   │   └── hotelRoutes.js      # RESTful route definitions
│   ├── scripts/
│   │   └── seed.js             # Database seeding script with 7 sample hotels
│   ├── utils/
│   │   └── fileHelper.js       # Safe disk file deletion utility
│   └── server.js               # Express application entry point
├── uploads/                    # Directory where uploaded images are saved
├── .env.example                # Environment variable template
├── .env                        # Local environment variables
├── package.json
└── README.md
```

---

## 🗄️ Database Setup (PostgreSQL 18 + pgAdmin 4)

### 1. Local PostgreSQL Setup
1. Ensure PostgreSQL 18 service is running on port `5432`.
2. Connect using **pgAdmin 4** or PowerShell `psql`:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **User:** `postgres`
   - **Password:** `postgres`
3. Create the database (if not already created):
   ```sql
   CREATE DATABASE hotel_db;
   ```
4. On startup, the backend will automatically execute native SQL to create the `hotels` table and indices if they do not exist:
   ```sql
   CREATE TABLE IF NOT EXISTS hotels (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT NOT NULL,
     latitude NUMERIC(10, 6) NOT NULL,
     longitude NUMERIC(10, 6) NOT NULL,
     price NUMERIC(10, 2) NOT NULL,
     image VARCHAR(500) NOT NULL,
     rating NUMERIC(3, 2) DEFAULT 4.70,
     reviews INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels (LOWER(title));
   CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels (price);
   ```

---

## ⚙️ Environment Configuration

Create or update `backend/.env`:

```ini
# Server Port
PORT=5000
NODE_ENV=development

# PostgreSQL Connection Credentials
PGHOST=localhost
PGPORT=5432
PGDATABASE=hotel_db
PGUSER=postgres
PGPASSWORD=postgres

# Alternatively, single connection URL:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hotel_db

# Frontend Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Running

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed Sample Hotels (Optional)
Inserts 7 pre-configured sample properties into `hotel_db`:
```bash
npm run seed
```

### 3. Start the Server
- **Development mode (with auto-reload via nodemon):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

Once running, the API will be available at:
- Base API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`
- Uploaded files: `http://localhost:5000/uploads`

---

## 📡 API Endpoints Reference

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies server runtime and database connection status.
- **Response (`200 OK`):**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-13T15:00:00.000Z",
    "database": "connected"
  }
  ```

---

### 2. Create Hotel Record (With File Upload & Validation)
- **Endpoint:** `POST /api/hotels`
- **Content-Type:** `multipart/form-data`
- **Fields:**
  | Field | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `title` | Text | Yes | Hotel name (3 to 150 characters) |
  | `description` | Text | Yes | Property description (minimum 10 characters) |
  | `latitude` | Number | Yes | Coordinate between -90 and 90 |
  | `longitude` | Number | Yes | Coordinate between -180 and 180 |
  | `price` | Number | Yes | Positive number greater than 0 |
  | `image` | File or URL | Yes | Uploaded file (JPG, PNG, WEBP, GIF ≤ 5MB) or image URL string |
  | `rating` | Number | No | Rating from 1.0 to 5.0 (default: 4.7) |
  | `reviews` | Number | No | Review count (default: 1) |
- **Behavior:** The uploaded file is saved to `backend/uploads/` with a unique timestamp filename. The stored path `/uploads/filename.jpg` is saved in PostgreSQL.
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Hotel record created successfully.",
    "data": {
      "id": 8,
      "title": "Azure Coastal Haven",
      "description": "Breathtaking beachfront resort with luxury rooms...",
      "latitude": "15.498900",
      "longitude": "73.827800",
      "price": "5600.00",
      "image": "/uploads/hotel-azure-1712345678.jpg",
      "rating": "4.70",
      "reviews": 1,
      "created_at": "2026-10-13T15:05:00.000Z",
      "updated_at": "2026-10-13T15:05:00.000Z"
    }
  }
  ```

---

### 3. Update Existing Hotel
- **Endpoint:** `PUT /api/hotels/:id`
- **Content-Type:** `multipart/form-data` or `application/json`
- **URL Parameter:** `id` (Integer)
- **Behavior:** Updates any of the provided fields. If a new image file is uploaded, the old uploaded image is automatically deleted from disk via [`fileHelper.js`](src/utils/fileHelper.js).
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Hotel record updated successfully.",
    "data": {
      "id": 8,
      "title": "Azure Coastal Haven & Spa",
      "price": "5900.00",
      "image": "/uploads/hotel-new-1712345999.jpg"
    }
  }
  ```

---

### 4. Delete Hotel Record
- **Endpoint:** `DELETE /api/hotels/:id`
- **URL Parameter:** `id` (Integer)
- **Query Parameter:** `deleteImage` (Boolean, optional, default: `true`)
- **Behavior:** Deletes the record from PostgreSQL and removes the associated uploaded image file from the server disk.
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Hotel record deleted successfully.",
    "deletedId": 8,
    "imageDeleted": true,
    "deletedImage": "/uploads/hotel-azure-1712345678.jpg"
  }
  ```

---

### 5. Fetch Hotels with Filters & Pagination
- **Endpoint:** `GET /api/hotels`
- **Query Parameters:**
  | Parameter | Type | Default | Description |
  | :--- | :--- | :--- | :--- |
  | `title` | String | - | Case-insensitive title search (`ILIKE`) |
  | `minPrice` | Number | - | Minimum price boundary |
  | `maxPrice` | Number | - | Maximum price boundary |
  | `limit` | Number | `10` | Items per page (max: 100) |
  | `offset` | Number | `0` | Number of items to skip |
  | `page` | Number | `1` | Page number alternative (`offset = (page - 1) * limit`) |
  | `sortBy` | String | `latest` | `latest` \| `price-low` \| `price-high` \| `title` \| `oldest` |
- **Example Request:**
  ```http
  GET /api/hotels?title=retreat&minPrice=3000&maxPrice=6000&limit=5&page=1
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "pagination": {
      "total": 1,
      "limit": 5,
      "offset": 0,
      "page": 1,
      "totalPages": 1,
      "hasPrevPage": false,
      "hasNextPage": false
    },
    "filters": {
      "title": "retreat",
      "minPrice": 3000,
      "maxPrice": 6000,
      "sortBy": "latest"
    },
    "data": [
      {
        "id": 1,
        "title": "The Palm Retreat",
        "description": "Relax in a tropical luxury resort...",
        "latitude": "13.082700",
        "longitude": "80.270700",
        "price": "4500.00",
        "image": "https://images.unsplash.com/...",
        "rating": "4.80",
        "reviews": 142
      }
    ]
  }
  ```

---

### 6. Fetch Single Hotel by ID
- **Endpoint:** `GET /api/hotels/:id`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "The Palm Retreat",
      "description": "...",
      "price": "4500.00",
      "latitude": "13.082700",
      "longitude": "80.270700",
      "image": "https://images.unsplash.com/..."
    }
  }
  ```

---

## 🔒 Security & Best Practices

- **Native Parameterized Queries:** Avoids SQL injection vulnerabilities by using parameter placeholders (`$1`, `$2`, ...).
- **Directory Traversal Protection:** File deletion validates that paths cannot escape the `backend/uploads/` directory.
- **MIME & Size Validation:** Multer rejects non-image files and enforces a 5MB maximum file size limit.
- **Disk Cleanup on Failure:** If database insertion fails after a file is uploaded, the uploaded file is automatically unlinked to avoid disk space waste.
- **Graceful Error Handling:** Centralized error handling returns descriptive JSON error messages with appropriate HTTP status codes (400, 404, 500, 503).
