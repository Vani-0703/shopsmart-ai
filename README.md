# ShopSmart AI 🛍️✨

A premium, full-stack, AI-powered e-commerce web app — vibrant gradients, glassmorphism, dark/light
mode, Customer/Seller/Admin dashboards, Stripe checkout, and Gemini-powered product descriptions,
recommendations, and a shopping assistant chat.

**Stack:** React (Vite) + Tailwind CSS · Node.js + Express · MongoDB (Mongoose) · Firebase Auth ·
Cloudinary · Stripe (test mode) · Google Gemini AI

```
shopsmart-ai/
├── frontend/        # React (Vite) + Tailwind CSS
└── backend/         # Node.js + Express + MongoDB API
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A [Firebase](https://console.firebase.google.com) project with **Email/Password** and **Google**
  sign-in enabled (Authentication → Sign-in method)
- A [Cloudinary](https://cloudinary.com) account (free tier is fine)
- A [Stripe](https://dashboard.stripe.com/register) account in **test mode**
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key for Gemini

---

## 2. Local setup

### 2.1 Clone & install

```bash
git clone https://github.com/<your-username>/shopsmart-ai.git
cd shopsmart-ai

# Backend
cd backend
npm install
cp .env.example .env   # then fill in real values (see below)

# Frontend
cd ../frontend
npm install
cp .env.example .env   # then fill in real values (see below)
```

### 2.2 Fill in `backend/.env`

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Console → Project Settings → Service Accounts → **Generate new private key** (downloads a JSON — copy the 3 fields from it). Keep the `\n` characters in the private key as literal `\n` in the `.env` file. |
| `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Cloudinary Dashboard home page |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys (use the **test** `sk_test_...` key) |
| `STRIPE_WEBHOOK_SECRET` | See "Stripe webhooks" section below |
| `GEMINI_API_KEY` | Google AI Studio → Get API key |

### 2.3 Fill in `frontend/.env`

| Variable | Where to get it |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` for local dev |
| `VITE_FIREBASE_*` | Firebase Console → Project Settings → General → **Your apps** → Web app config |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys (the **test** `pk_test_...` key) |

### 2.4 Run locally

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open **http://localhost:5173**, register an account (choose "Sell" to get a seller account), and
you're in. Optionally seed a few demo products once you have a seller account:

```bash
cd backend
npm run seed
```

### 2.5 Stripe webhooks (local testing, optional)

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```
Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET` in `backend/.env`.

### 2.6 Test payments

Use Stripe's test card at checkout: **4242 4242 4242 4242**, any future expiry date, any CVC, any ZIP.

---

## 3. Push to GitHub

```bash
cd shopsmart-ai
git init
git add .
git commit -m "Initial commit: ShopSmart AI"
git branch -M main
git remote add origin https://github.com/<your-username>/shopsmart-ai.git
git push -u origin main
```

> Both `frontend/.env` and `backend/.env` are already git-ignored — only the `.env.example` files
> get committed. Never commit real API keys.

---

## 4. Deploy

### 4.1 Backend — Render (recommended)

Vercel's serverless functions don't support long-lived Socket.io connections, so for full real-time
notification support, deploy the backend to a persistent host like **Render** or **Railway**:

1. Go to [render.com](https://render.com) → **New Web Service** → connect your GitHub repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add all variables from `backend/.env.example` under **Environment**.
6. Set `CLIENT_URL` to your deployed frontend URL (see step 4.2) once you have it.
7. Deploy — you'll get a URL like `https://shopsmart-ai-api.onrender.com`.
8. Add a Stripe webhook endpoint pointing to `https://<your-backend-url>/api/webhooks/stripe`
   (Stripe Dashboard → Developers → Webhooks → Add endpoint, event: `payment_intent.succeeded`),
   then copy the new signing secret into `STRIPE_WEBHOOK_SECRET` on Render.

*(Alternative: `backend/vercel.json` is included if you'd rather deploy the REST API itself to
Vercel as serverless functions — real-time Socket.io notifications just won't work there.)*

### 4.2 Frontend — Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite (auto-detected)
4. **Build Command:** `npm run build` · **Output Directory:** `dist`
5. Add all variables from `frontend/.env.example` under **Environment Variables**, using your
   *real* Firebase/Stripe values and setting `VITE_API_URL` to your deployed backend
   (e.g. `https://shopsmart-ai-api.onrender.com/api`).
6. Deploy. Vercel will build with Vite and serve the SPA — `vercel.json` in `frontend/` already
   handles client-side routing rewrites so refreshing on any route (e.g. `/shop`) works correctly.

### 4.3 Post-deploy checklist

- [ ] In Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel
      domain (e.g. `shopsmart-ai.vercel.app`).
- [ ] Update `CLIENT_URL` on the backend host to your Vercel URL (for CORS).
- [ ] Update the Stripe webhook endpoint URL if your backend URL changed.
- [ ] Confirm `VITE_API_URL` on Vercel points to the live backend, not `localhost`.

---

## 5. Feature overview

- **Auth:** Firebase Auth (email/password + Google), synced to a MongoDB user profile with roles
  (`customer`, `seller`, `admin`)
- **Catalog:** search, category/price/rating filters, sorting, pagination
- **Cart & Wishlist:** persisted cart (localStorage), server-side wishlist
- **Checkout:** Stripe Payment Element (test mode), address form, order creation
- **Order tracking:** visual status timeline (placed → confirmed → processing → shipped →
  out for delivery → delivered)
- **Reviews:** star ratings, verified-purchase badge, seller replies
- **AI (Gemini):**
  - Seller product-description & tagline generator
  - Personalized "Picked for you" recommendations based on purchase/wishlist history
  - "You may also like" similar-products on product pages
  - Floating AI shopping assistant chat
- **Dashboards:**
  - **Customer:** order history, notifications, profile
  - **Seller:** analytics (revenue, top products), product CRUD with image upload (Cloudinary) +
    AI description generation, order status management
  - **Admin:** platform-wide analytics, user/role management
- **UI:** Tailwind CSS with a custom sunset-gradient theme, glassmorphism cards, animated blobs,
  dark/light mode, fully responsive mobile-first layout

---

## 6. Troubleshooting

- **"Not authorized, token invalid"** — make sure `FIREBASE_PRIVATE_KEY` in `backend/.env` keeps
  its `\n` sequences (wrap the whole value in quotes).
- **CORS errors** — check `CLIENT_URL` on the backend matches your frontend's exact origin.
- **Images fail to upload** — verify all three `CLOUDINARY_*` variables are set correctly.
- **Stripe payment fails silently** — confirm you're using `pk_test_...` / `sk_test_...` keys
  (not live keys) and the test card `4242 4242 4242 4242`.
- **AI features return fallback text** — check `GEMINI_API_KEY` is valid; the app gracefully
  degrades to non-AI fallback content if Gemini is unreachable so the demo never breaks.

---

Built as a full-stack demo project. Stripe is wired for **test mode only** — do not use real card
details.
