# KisanHub — Integrated AgriTech Digital Platform

Full-stack web application for Indian farmers.  
**Stack:** Node.js + Express + MongoDB + React

---

## Quick Start (5 minutes)

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud DB, no install needed)
- Git (optional)

---

## Step 1 — Install MongoDB

**Option A: Local MongoDB**
1. Download MongoDB Community from the link above
2. Install and start the service:
   - Windows: MongoDB runs as a service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud, no install)**
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username + password)
4. Whitelist your IP: Network Access → Add IP → 0.0.0.0/0
5. Get connection string: Connect → Connect your application → Copy URI
6. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kisanhub`

---

## Step 2 — Configure Environment

Edit `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/kisanhub
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kisanhub

JWT_SECRET=kisanhub_your_secret_key_change_this
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Optional: Get free key at openweathermap.org/api
WEATHER_API_KEY=your_key_here
```

---

## Step 3 — Install Dependencies

Open terminal in the `kisanhub` folder:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Step 4 — Seed the Database

```bash
cd backend
node config/seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👤 Admin created — admin@example.com / password123
🌾 Farmer created — farmer@example.com / password123
📦 16 products created
📋 6 advisories created
🏛️  6 schemes created
📊 8 mandi prices created
✅ Database seeded successfully!
```

---

## Step 5 — Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# React app starts on http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Login Credentials

| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Admin   | admin@example.com    | password123 |
| Farmer  | farmer@example.com   | password123 |

---

## Features

### Farmer Portal
- Register / Login with JWT authentication
- Dashboard with weather, prices, advisories at a glance
- Shop: Browse 16+ products by category, add to cart
- Cart: Persistent cart saved to database, checkout creates real order
- Crop Advisory: View pest, fertilizer, irrigation advisories
- Weather: 7-day forecast (real API or mock data)
- Mandi Prices: Live prices from database, comparison table
- Government Schemes: Browse and apply (application saved to DB)
- My Orders: Order history with live tracking steps
- Profile: Edit personal info, change password

### Admin Panel
- Dashboard: KPI stats (farmers, revenue, orders, pending apps)
- Farmer Management: View all farmers, activate/deactivate
- Product Management: Full CRUD — add, edit, delete products
- Order Management: View all orders, advance order status
- Advisory Management: Create, edit, delete advisories
- Scheme Management: CRUD schemes + approve/reject applications
- Mandi Prices: Add, edit, delete price entries

---

## API Endpoints

| Method | Endpoint                        | Description                |
|--------|---------------------------------|----------------------------|
| POST   | /api/auth/register              | Farmer registration        |
| POST   | /api/auth/login                 | Login (farmer or admin)    |
| GET    | /api/auth/me                    | Get current user + cart    |
| PUT    | /api/auth/profile               | Update profile             |
| GET    | /api/products                   | List products              |
| POST   | /api/products                   | Create product (admin)     |
| PUT    | /api/products/:id               | Update product (admin)     |
| GET    | /api/cart                       | Get cart                   |
| POST   | /api/cart/add                   | Add to cart                |
| PUT    | /api/cart/update                | Update quantity            |
| POST   | /api/orders/checkout            | Place order from cart      |
| GET    | /api/orders/my                  | Farmer's orders            |
| GET    | /api/orders                     | All orders (admin)         |
| PUT    | /api/orders/:id/status          | Update status (admin)      |
| GET    | /api/advisory                   | List advisories            |
| POST   | /api/advisory                   | Create advisory (admin)    |
| GET    | /api/schemes                    | List schemes               |
| POST   | /api/schemes/:id/apply          | Apply for scheme           |
| GET    | /api/prices                     | Mandi prices               |
| GET    | /api/weather?city=Coimbatore    | Weather data               |
| GET    | /api/admin/stats                | Dashboard stats (admin)    |

---

## Deploy to Production

### Option 1: Render.com (Free)
1. Push code to GitHub
2. Create account at render.com
3. New → Web Service → connect your repo
4. Backend: Root Dir = `backend`, Build = `npm install`, Start = `node server.js`
5. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
6. Frontend: New → Static Site → Root Dir = `frontend`, Build = `npm run build`, Publish = `build`

### Option 2: Railway.app
1. Sign up at railway.app
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Set environment variables
5. Auto-deploys on every push

### Option 3: VPS (DigitalOcean / AWS EC2)
```bash
# On your server:
git clone your-repo
cd kisanhub
npm install
cd backend && npm install
cd ../frontend && npm install && npm run build
cd ..
# Set NODE_ENV=production in backend/.env
node backend/server.js
# Use PM2 for process management:
npm install -g pm2
pm2 start backend/server.js --name kisanhub
pm2 save && pm2 startup
```

---

## Folder Structure

```
kisanhub/
├── backend/
│   ├── config/
│   │   └── seed.js              # Database seeder
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── models/
│   │   ├── User.js              # Farmer/Admin model
│   │   ├── Product.js           # Product model
│   │   ├── Order.js             # Order model
│   │   ├── Advisory.js          # Advisory model
│   │   └── Scheme.js            # Scheme + MandiPrice models
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── products.js          # Product CRUD
│   │   ├── cart.js              # Cart management
│   │   ├── orders.js            # Order management
│   │   ├── advisory.js          # Advisory CRUD
│   │   ├── schemes.js           # Schemes + applications
│   │   ├── prices.js            # Mandi prices
│   │   ├── weather.js           # Weather API
│   │   ├── farmers.js           # Farmer listing
│   │   └── admin.js             # Admin stats
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── index.js         # Axios API client
        ├── components/
        │   ├── farmer/
        │   │   └── FarmerLayout.js   # Sidebar + Cart drawer
        │   └── admin/
        │       └── AdminLayout.js    # Admin sidebar
        ├── context/
        │   └── AuthContext.js   # Global auth + cart state
        ├── pages/
        │   ├── LandingPage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── farmer/
        │   │   ├── Dashboard.js
        │   │   ├── Shop.js
        │   │   ├── Advisory.js
        │   │   ├── Weather.js
        │   │   ├── Prices.js
        │   │   ├── Schemes.js
        │   │   ├── Orders.js
        │   │   └── Profile.js
        │   └── admin/
        │       ├── Dashboard.js
        │       ├── Farmers.js
        │       ├── Products.js
        │       ├── Orders.js
        │       ├── Advisory.js
        │       ├── Schemes.js
        │       └── Prices.js
        ├── App.js               # Router + guards
        ├── index.js
        └── index.css            # Global styles + CSS variables
```
