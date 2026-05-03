# 🐾 Pet Shelter — Full Stack Web App

> **React + Node.js + Express + MongoDB**  
> A complete pet adoption management system.

---

## 📁 Project Structure

```
pet-shelter/
├── backend/                  # Node.js + Express API
│   ├── Configuration/
│   │   └── connectDb.js      # MongoDB connection
│   ├── models/
│   │   ├── userModel.js
│   │   ├── petModel.js
│   │   ├── adoptionFormModel.js
│   │   └── contactFormModel.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── petController.js
│   │   ├── adoptionFormController.js
│   │   └── contactFormController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── petRoutes.js
│   │   ├── adoptionFormRoutes.js
│   │   └── contactFormRoutes.js
│   ├── uploads/              # Pet images stored here
│   ├── .env                  # Environment variables
│   ├── index.js              # Entry point
│   └── package.json
│
├── frontend/                 # React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── Images/
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── API.js        # Axios API helpers
│   │   │   ├── Home.js / Home.css
│   │   │   ├── Pets.js / Pets.css
│   │   │   ├── PetDetails.js / PetDetails.css
│   │   │   ├── Adopt.js / Adopt.css
│   │   │   ├── Admin.js / Admin.css
│   │   │   ├── Requests.js / Requests.css
│   │   │   ├── AboutUs.js / AboutUs.css
│   │   │   ├── ContactUs.js / ContactUs.css
│   │   │   ├── Login.js / Login.css
│   │   │   ├── SignUp.js
│   │   │   ├── AddPet.js
│   │   │   └── EditPet.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Run (Local Development)

### Prerequisites
- Node.js v16+
- npm v8+
- MongoDB (local via MongoDB Compass, or Atlas cloud)

---

### Step 1 — MongoDB Setup with MongoDB Compass

#### Option A: Local MongoDB (Recommended for Development)

1. **Download & Install MongoDB Community Server:**
   - https://www.mongodb.com/try/download/community

2. **Download & Install MongoDB Compass:**
   - https://www.mongodb.com/try/download/compass

3. **Start MongoDB service:**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Windows — start MongoDB service from Services panel
   # or run: net start MongoDB

   # Linux (Ubuntu)
   sudo systemctl start mongod
   ```

4. **Connect in Compass:**
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Click **Connect**
   - Use the existing `test` database, which already contains the shelter collections and data

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist your IP: `0.0.0.0/0` (for dev)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/test?retryWrites=true&w=majority
   ```
6. Paste it in `backend/.env` as `DB_URI`

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env` if needed:

```env
PORT=5000
DB_URI=mongodb://localhost:27017/test
JWT_SECRET=petshelter_jwt_super_secret_key_2024
ADMIN_EMAIL=admin@123.com
ADMIN_PASSWORD=admin123
```

Start the backend:

```bash
npm run dev      # with nodemon (auto-restart)
# OR
npm start        # without nodemon
```

You should see:
```
🚀 Pet Shelter Backend running on http://0.0.0.0:5000
✅ MongoDB Connected Successfully via Mongoose
✅ Admin user seeded: admin@hopesanctuary.local
```

---

### Step 3 — Frontend Setup

Open a **new terminal tab:**

```bash
cd frontend
npm install
npm start
```

The React app will open at: **http://localhost:3000**

Frontend environment variables:

```env
REACT_APP_API_ORIGIN=http://localhost:5000
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

For Vercel, set them to your Render backend URL, for example:

```env
REACT_APP_API_ORIGIN=https://your-render-backend.onrender.com
REACT_APP_API_BASE_URL=https://your-render-backend.onrender.com/api
```

---

## 🔑 Default Admin Credentials

| Field    | Value                          |
|----------|-------------------------------|
| Email    | admin@123.com                 |
| Password | admin123                      |

---

## 🌐 API Endpoints

### Users
| Method | Route                  | Access    |
|--------|------------------------|-----------|
| GET    | /api/users             | Admin     |
| GET    | /api/users/:id         | Auth      |
| POST   | /api/users/signup      | Public    |
| POST   | /api/users/login       | Public    |
| PUT    | /api/users/:id         | Auth      |
| DELETE | /api/users/:id         | Admin     |

### Pets
| Method | Route          | Access    |
|--------|----------------|-----------|
| GET    | /api/pets      | Public    |
| GET    | /api/pets/:id  | Public    |
| POST   | /api/pets      | Admin     |
| PUT    | /api/pets/:id  | Admin     |
| DELETE | /api/pets/:id  | Admin     |

### Adoption Forms
| Method | Route                    | Access    |
|--------|--------------------------|-----------|
| GET    | /api/adoption-forms      | Admin     |
| GET    | /api/adoption-forms/me   | Auth      |
| GET    | /api/adoption-forms/:id  | Auth      |
| POST   | /api/adoption-forms      | Auth      |
| PUT    | /api/adoption-forms/:id  | Admin     |
| DELETE | /api/adoption-forms/:id  | Admin     |

### Contact Forms
| Method | Route                    | Access    |
|--------|--------------------------|-----------|
| GET    | /api/contact-forms       | Admin     |
| GET    | /api/contact-forms/:id   | Auth      |
| POST   | /api/contact-forms       | Public    |
| PUT    | /api/contact-forms/:id   | Admin     |
| DELETE | /api/contact-forms/:id   | Admin     |

---

## 🎨 Color Palette

| Name               | Hex       |
|--------------------|-----------|
| Navbar Orange      | #ffb347   |
| Navbar Border      | #f39c12   |
| Accent Yellow      | #ffc107   |
| Yellow Hover       | #e0a800   |
| Light Blue BG      | #e6f7ff   |
| Blue Action        | #1675d3   |
| Bootstrap Blue     | #0d6efd   |
| Green Accent       | #44d49a   |
| Red Accent         | #e87272   |

---

## 🧩 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, React Router 6, Axios |
| Backend    | Node.js, Express 4      |
| Database   | MongoDB, Mongoose       |
| Auth       | JWT, bcryptjs           |
| Uploads    | Multer                  |
| Fonts      | Google Fonts (Lobster Two, Poppins) |

---

## 📌 Notes

- All file uploads are stored in `backend/uploads/`
- Images are served at `http://localhost:5000/uploads/<filename>`
- User sessions stored in `localStorage` under key `user`
- Admin is auto-seeded on backend startup
- The `/me` adoption route is defined **before** `/:id` to prevent route shadowing
