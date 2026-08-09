# PRD — Starvesta Worldwide Pvt. Ltd. Export Website

## Original Problem Statement
Build a premium B2B export + e-commerce website for Starvesta Worldwide Pvt. Ltd. (Barhalganj, Gorakhpur, UP, India) to sell three product lines internationally: Rice (Basmati 1121/1509, Sella, Golden Sella, Non-Basmati IR64, Broken), Sugarcane Bagasse disposables (plates, bowls, trays, containers, cups, meal boxes, clamshells), and Foxnut/Makhana (4/5/6 Suta, Phool, Jumbo, Flavoured). Tagline: "Premium Indian Products. Global Quality. Worldwide Supply." Pages: Home, Products, Rice, Bagasse, Foxnut, About, Export Markets, Certifications, Contact. Features: RFQ system, WhatsApp enquiry (+91 9214315956), enquiry basket (cart), wishlist, product search, buyer registration, EN/HI language toggle, USD/INR toggle. Prices hidden — "Get Best Price / Request a Quote" model (chosen by user). Contact: Mr. Suraj Panday & Mr. Prajapati Raviprakash Ramsuresh, +91 9214315956 / +91 7706005679, starvestaworldwide@gmail.com.

## User Choices (confirmed)
- Both: B2B RFQ catalog + e-commerce cart (cart = enquiry basket → bulk quote request)
- Languages: English + Hindi toggle (translation map in place, extensible to more)
- Product photos: stock placeholders for now; client will supply real photos later
- Pricing: Get Quote / RFQ only, no displayed prices
- Currency: USD + INR toggle

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll). Art direction "Eco Luxury & Harvest Gold" — Deep Forest Green (#0F291E), Warm Bone (#F4F1EC), Harvest Gold (#C89B3C); Cormorant Garamond headings + Manrope body. Files: src/App.js, context/StoreContext.jsx, data/translations.js, components/{Navbar,Footer,WhatsAppFloat,ProductCard,QuoteModal,CartDrawer,WishlistDrawer}.jsx, pages/{Home,Products,ProductDetail,CategoryPage,About,ExportMarkets,Certifications,Contact,Register}.jsx
- Backend: FastAPI (/app/backend/server.py) — MongoDB (motor), products auto-seeded on startup (20 products), endpoints: GET /api/products (?category, ?q, ?featured), GET /api/products/{id}, GET /api/categories, POST /api/enquiries (rfq / bulk_rfq / contact), POST /api/buyers.
- Enquiries stored in `enquiries` collection; buyer registrations in `buyers` collection. No auth (registration = lead capture, no passwords).

## User Personas
- International B2B buyer/importer (distributor, wholesaler, retail brand) requesting quotes in containers/MT
- HORECA / food-service buyer sourcing compostable bagasse tableware
- Health-snack brand sourcing graded/flavoured makhana
- Starvesta export team receiving structured enquiries

## Implemented (2026-07 / build date: Aug 2026)
- Kinetic hero with masked line-by-line reveal + parallax, editorial marquee of export markets, numbered manifesto chapters (01 Rice / 02 Bagasse / 03 Makhana)
- Full product catalog: 20 products with specs (grain size, moisture, broken %, suta sizes), packaging, MOQ, HSN, origin, certifications
- Product detail: sticky image, spec table, packaging & trade tabs, RFQ modal, WhatsApp deep link per product, related products
- Search + category filters on Products page; dedicated Rice / Bagasse / Makhana category landing pages
- Enquiry basket (cart) with bulk quote request submission; Wishlist drawer; both persisted in localStorage
- RFQ modal (per product), Contact form, Buyer Registration — all POST to backend and verified working
- EN/HI language toggle, USD/INR currency toggle in navbar
- WhatsApp floating button (+91 9214315956), Google Maps embed, WhatsApp QR code on Contact page
- About (founders, story), Export Markets (25+ countries, Incoterms, ports, payment terms), Certifications (FSSAI, APEDA, ISO 22000, HACCP, EN 13432, IEC/GST)
- Business profile mentions (ExportersIndia, IndianYellowPages) in footer
- Official company logo integrated (navbar, footer, favicon) — cropped from client image, transparent background
- Foreign-buyer trust layer: hero trust chips (FSSAI/APEDA/IEC/24h), animated stats strip (25+ countries, 500+ MT capacity), 6-step export process section, Buyer Assurance grid (QC, third-party inspection, private label, Incoterms, cargo insurance, dedicated manager), certifications pill strip, lead time + sampling info on product trade tab

## Backlog / Remaining
- P0: Replace stock placeholder photos with real product photos from client (photos currently MOCKED with stock images)
- P0: Connect real domain
- P1: Email notification to starvestaworldwide@gmail.com on each enquiry (Resend integration)
- P1: Admin dashboard to view enquiries/buyers, add/edit products
- P2: Secure online payment (Stripe) for retail/sample orders — user selected it, but deferred since pricing is quote-based
- P2: Order tracking (requires order management backend)
- P2: Additional languages beyond EN/HI
- P2: Live currency conversion rates for USD/INR toggle (currently display preference only — no prices shown)

## Next Tasks
1. Collect real product photos + logo from client and swap placeholders
2. Wire enquiry email notifications (Resend)
3. Lightweight admin panel for enquiries
4. SEO meta tags + sitemap before domain launch
