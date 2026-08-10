# Starvesta Worldwide Pvt. Ltd. — Export Website

Premium B2B export catalogue + sample store for Starvesta Worldwide Pvt. Ltd. (Gorakhpur, India).
Product lines: Basmati/Non-Basmati Rice, Sugarcane Bagasse disposables, Foxnut/Makhana, Paper Cups.

## Tech Stack
- **Frontend**: React 19 + Tailwind CSS + framer-motion + lenis (`/app/frontend`)
- **Backend**: FastAPI + MongoDB (motor) (`/app/backend`)
- **Payments**: Stripe Checkout (test mode) via `emergentintegrations` package
- **Emails**: Resend (enquiry/registration/order notifications)

## Project Structure
```
/app
├── backend/
│   ├── server.py          # FastAPI app: products, enquiries, buyers, sample checkout, webhook
│   ├── requirements.txt
│   └── .env               # backend secrets (never commit real values)
├── frontend/
│   ├── src/
│   │   ├── App.js         # routes + smooth scroll
│   │   ├── context/StoreContext.jsx  # cart, wishlist, language, currency
│   │   ├── data/translations.js      # EN/HI strings
│   │   ├── components/    # Navbar, Footer, ProductCard, QuoteModal, drawers...
│   │   └── pages/         # Home, Products, ProductDetail, CategoryPage, Samples, ...
│   ├── public/products/   # product images (HQ generated)
│   ├── public/certs/      # certificate documents
│   └── .env               # REACT_APP_BACKEND_URL
└── scripts/               # dev-only image generation scripts (not needed at runtime)
```

## Environment Variables

### backend/.env
| Key | Purpose |
|---|---|
| `MONGO_URL` | MongoDB connection string (e.g. MongoDB Atlas) |
| `DB_NAME` | Database name |
| `CORS_ORIGINS` | `*` or comma-separated frontend origins |
| `STRIPE_API_KEY` | Stripe secret key (test: sk_test_..., live: sk_live_...) |
| `RESEND_API_KEY` | Resend API key (re_...) |
| `SENDER_EMAIL` | Resend sender (onboarding@resend.dev in testing) |
| `NOTIFY_EMAIL` | Inbox that receives enquiry alerts |

### frontend/.env
| Key | Purpose |
|---|---|
| `REACT_APP_BACKEND_URL` | Public URL of the backend (no trailing slash) |

## Run Locally
```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd frontend && yarn install && yarn start
```
Products auto-seed into MongoDB on first backend start.

## Self-Hosting (free/cheap)

### Database — MongoDB Atlas (free tier)
1. Create free cluster at mongodb.com/atlas
2. Create DB user + allow network access (0.0.0.0/0 for serverless)
3. Copy connection string → `MONGO_URL`, set `DB_NAME=starvesta`

### Backend — Railway / Render (free or ~$5/mo)
- Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Set all backend env vars above. All API routes are prefixed `/api`.

### Frontend — Vercel (free)
- Root dir: `frontend`, build: `yarn build`, output: `build`
- Env: `REACT_APP_BACKEND_URL=https://<your-backend-url>`
- Add your custom domain in Vercel → Domains.

### Stripe (production)
Replace `STRIPE_API_KEY` with your own live key from stripe.com after KYC.
Webhook (optional): point to `https://<backend>/api/webhook/stripe`; the app also verifies
payments by polling `/api/samples/status/{session_id}` as fallback.

### Resend (production)
Verify your domain in Resend to send from a branded address and to any recipient.
Testing mode (`onboarding@resend.dev`) only delivers to the Resend account owner's email.

## Notes
- Product images in `frontend/public/products/hq/` are AI studio renders based on the
  owner's real brochure photos — replace with real photoshoot images anytime (same filenames).
- Certificates in `frontend/public/certs/` are the company's real documents.
- No user authentication — B2B enquiry flows only (enquiries, buyers, sample orders collections).
