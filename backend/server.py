from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

IMG_RICE = "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHByZW1pdW18ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85"
IMG_BAGASSE = "https://images.unsplash.com/photo-1727021024931-90c226e8448d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhZ2Fzc2UlMjBwbGF0ZXMlMjBzdWdhcmNhbmV8ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85"
IMG_MAKHANA = "https://images.unsplash.com/photo-1710421576768-ff985fa63b60?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHx3YXRlciUyMGxpbHklMjBzZWVkcyUyMGZveG51dCUyMG1ha2hhbmF8ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85"

def img(base, w=900, crop="entropy"):
    return f"{base}&w={w}&fit=crop&crop={crop}"

PRODUCTS = [
    # ---- RICE ----
    {"id": "1121-basmati-rice", "name": "1121 Basmati Rice", "category": "rice", "featured": True,
     "tagline": "World's longest grain basmati, aged for unmatched aroma and elongation.",
     "image": img(IMG_RICE, 900, "entropy"),
     "badges": ["Export Quality", "Aged 12+ Months"],
     "specs": {"Average Grain Length": "8.35 mm", "Moisture": "12.5% Max", "Broken": "1% Max", "Purity": "95% Min", "Admixture": "5% Max", "Chalky Grains": "2% Max"},
     "packaging": ["25 kg PP woven bags", "50 kg jute bags", "1/5 kg retail pouches", "Customized private labelling"],
     "moq": "25 MT (1 x 20ft FCL)", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI", "APEDA", "ISO 22000"], "availability": "Ready stock"},
    {"id": "1509-basmati-rice", "name": "1509 Basmati Rice", "category": "rice", "featured": True,
     "tagline": "Early-maturing basmati with exceptional cooking length at a competitive export price.",
     "image": img(IMG_RICE, 901, "top"),
     "badges": ["Export Quality"],
     "specs": {"Average Grain Length": "8.40 mm", "Moisture": "12.5% Max", "Broken": "1% Max", "Purity": "95% Min", "Admixture": "5% Max"},
     "packaging": ["25 kg PP woven bags", "50 kg jute bags", "Customized private labelling"],
     "moq": "25 MT (1 x 20ft FCL)", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI", "APEDA"], "availability": "Ready stock"},
    {"id": "traditional-basmati-rice", "name": "Traditional Basmati Rice", "category": "rice", "featured": False,
     "tagline": "The original heritage basmati — delicate fragrance prized by connoisseurs.",
     "image": img(IMG_RICE, 902, "bottom"),
     "badges": ["Heritage Variety"],
     "specs": {"Average Grain Length": "7.30 mm", "Moisture": "12.5% Max", "Broken": "1% Max", "Purity": "95% Min"},
     "packaging": ["25 kg PP woven bags", "50 kg jute bags"],
     "moq": "25 MT", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI", "APEDA"], "availability": "On order"},
    {"id": "sella-basmati-rice", "name": "Sella Basmati Rice (Parboiled)", "category": "rice", "featured": False,
     "tagline": "Parboiled basmati with firm, separate grains — ideal for catering and biryani.",
     "image": img(IMG_RICE, 903, "faces"),
     "badges": ["Parboiled"],
     "specs": {"Average Grain Length": "8.30 mm", "Moisture": "12.5% Max", "Broken": "1% Max", "Purity": "95% Min", "Colour": "Creamy white"},
     "packaging": ["25/50 kg PP bags", "Customized"],
     "moq": "25 MT", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI", "APEDA", "ISO 22000"], "availability": "Ready stock"},
    {"id": "golden-sella-basmati-rice", "name": "Golden Sella Basmati Rice", "category": "rice", "featured": True,
     "tagline": "Golden-hued parboiled basmati, the first choice of Gulf and African markets.",
     "image": img(IMG_RICE, 904, "edges"),
     "badges": ["Gulf Market Favourite"],
     "specs": {"Average Grain Length": "8.35 mm", "Moisture": "12.5% Max", "Broken": "1% Max", "Purity": "95% Min", "Colour": "Golden"},
     "packaging": ["25/50 kg PP bags", "Customized"],
     "moq": "25 MT", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI", "APEDA"], "availability": "Ready stock"},
    {"id": "ir64-non-basmati-rice", "name": "IR64 Non-Basmati Long Grain Rice", "category": "rice", "featured": False,
     "tagline": "High-volume long grain rice for staple food programs and wholesale markets.",
     "image": img(IMG_RICE, 905, "entropy"),
     "badges": ["High Volume"],
     "specs": {"Average Grain Length": "6.00 mm", "Moisture": "13% Max", "Broken": "5% / 25% options", "Purity": "93% Min"},
     "packaging": ["25/50 kg PP bags", "Bulk container lining"],
     "moq": "50 MT", "hsn": "1006.30", "origin": "India",
     "certifications": ["FSSAI"], "availability": "Ready stock"},
    {"id": "broken-rice", "name": "Broken Rice (5% – 100%)", "category": "rice", "featured": False,
     "tagline": "Economical broken rice for food processing, brewing and animal feed industries.",
     "image": img(IMG_RICE, 906, "top"),
     "badges": ["Industrial Grade"],
     "specs": {"Broken": "5% to 100% as required", "Moisture": "13% Max", "Purity": "90% Min"},
     "packaging": ["50 kg PP bags", "Bulk"],
     "moq": "50 MT", "hsn": "1006.40", "origin": "India",
     "certifications": ["FSSAI"], "availability": "Ready stock"},
    # ---- BAGASSE ----
    {"id": "bagasse-plates", "name": "Bagasse Plates (6\" – 12\")", "category": "bagasse", "featured": True,
     "tagline": "Sturdy, compostable plates pressed from sugarcane fibre — plastic-free dining.",
     "image": img(IMG_BAGASSE, 900, "entropy"),
     "badges": ["Eco-Friendly", "Compostable", "Food Grade"],
     "specs": {"Sizes": "6\", 7\", 9\", 10\", 11\", 12\" round & square", "Material": "100% Sugarcane Bagasse", "Microwave Safe": "Yes", "Oil & Water Resistant": "Yes", "Compostability": "90 days (industrial)"},
     "packaging": ["50 pcs / shrink pack", "1000 pcs / carton", "Custom retail packs"],
     "moq": "50,000 pcs (mixed sizes)", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)", "ISO 9001"], "availability": "Made to order"},
    {"id": "bagasse-bowls", "name": "Bagasse Bowls (180 – 500 ml)", "category": "bagasse", "featured": False,
     "tagline": "Leak-resistant bowls for curries, salads and desserts — hot or cold.",
     "image": img(IMG_BAGASSE, 901, "top"),
     "badges": ["Eco-Friendly", "Compostable", "Food Grade"],
     "specs": {"Capacities": "180 / 240 / 340 / 500 ml", "Material": "100% Sugarcane Bagasse", "Microwave Safe": "Yes", "Temperature Range": "-20°C to 120°C"},
     "packaging": ["50 pcs / pack", "1000 pcs / carton"],
     "moq": "50,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)"], "availability": "Made to order"},
    {"id": "bagasse-compartment-trays", "name": "Bagasse Compartment Trays", "category": "bagasse", "featured": False,
     "tagline": "2, 3 and 5-compartment meal trays for thali service, airlines and institutions.",
     "image": img(IMG_BAGASSE, 902, "bottom"),
     "badges": ["Eco-Friendly", "Compostable"],
     "specs": {"Types": "2 / 3 / 5 compartments", "Material": "100% Sugarcane Bagasse", "Lid Options": "Bagasse / PET / PLA", "Microwave Safe": "Yes"},
     "packaging": ["25–50 pcs / pack", "500–1000 pcs / carton"],
     "moq": "50,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)"], "availability": "Made to order"},
    {"id": "bagasse-food-containers", "name": "Bagasse Food Containers", "category": "bagasse", "featured": False,
     "tagline": "Hinged and lidded containers for takeaway, delivery and cloud kitchens.",
     "image": img(IMG_BAGASSE, 903, "faces"),
     "badges": ["Eco-Friendly", "Compostable", "Food Grade"],
     "specs": {"Sizes": "450 / 600 / 750 / 1000 ml", "Material": "100% Sugarcane Bagasse", "Leak Resistant": "Yes", "Freezer Safe": "Yes"},
     "packaging": ["50 pcs / sleeve", "500 pcs / carton"],
     "moq": "50,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)"], "availability": "Made to order"},
    {"id": "bagasse-cups", "name": "Bagasse Cups", "category": "bagasse", "featured": False,
     "tagline": "Compostable hot-beverage cups — the sustainable answer to single-use plastic.",
     "image": img(IMG_BAGASSE, 904, "edges"),
     "badges": ["Eco-Friendly", "Compostable"],
     "specs": {"Capacities": "110 / 150 / 250 ml", "Material": "100% Sugarcane Bagasse", "Heat Resistance": "Up to 100°C"},
     "packaging": ["50 pcs / sleeve", "2000 pcs / carton"],
     "moq": "100,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)"], "availability": "Made to order"},
    {"id": "bagasse-meal-boxes", "name": "Bagasse Meal Boxes", "category": "bagasse", "featured": True,
     "tagline": "Full-meal boxes with secure locking — built for delivery that travels well.",
     "image": img(IMG_BAGASSE, 905, "entropy"),
     "badges": ["Eco-Friendly", "Compostable", "Food Grade"],
     "specs": {"Sizes": "500 / 750 / 1000 ml", "Material": "100% Sugarcane Bagasse", "Locking": "Secure 4-tab closure", "Microwave Safe": "Yes"},
     "packaging": ["50 pcs / sleeve", "500 pcs / carton"],
     "moq": "50,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)", "ISO 9001"], "availability": "Made to order"},
    {"id": "bagasse-clamshell-boxes", "name": "Bagasse Clamshell Boxes", "category": "bagasse", "featured": False,
     "tagline": "Burger and wrap clamshells that keep food crisp and the planet clean.",
     "image": img(IMG_BAGASSE, 906, "top"),
     "badges": ["Eco-Friendly", "Compostable"],
     "specs": {"Sizes": "6\" x 6\" / 8\" x 8\" / 9\" x 6\"", "Material": "100% Sugarcane Bagasse", "Grease Resistant": "Yes"},
     "packaging": ["50 pcs / sleeve", "500 pcs / carton"],
     "moq": "50,000 pcs", "hsn": "4823.70", "origin": "India",
     "certifications": ["Food Grade", "Compostable (EN 13432)"], "availability": "Made to order"},
    # ---- MAKHANA ----
    {"id": "makhana-4-suta", "name": "4 Suta Makhana (12–14 mm)", "category": "makhana", "featured": False,
     "tagline": "Compact, crunchy foxnuts — excellent value for snack manufacturing.",
     "image": img(IMG_MAKHANA, 900, "entropy"),
     "badges": ["Hand-Popped"],
     "specs": {"Size": "12–14 mm (4 Suta)", "Moisture": "8% Max", "Puff Rate": "95% Min", "Purity": "99% Min"},
     "packaging": ["10 kg PP bags", "20 kg cartons", "Nitrogen-flushed retail packs"],
     "moq": "500 kg", "hsn": "1904.10", "origin": "India (Mithila belt)",
     "certifications": ["FSSAI"], "availability": "Ready stock"},
    {"id": "makhana-5-suta", "name": "5 Suta Makhana (14–16 mm)", "category": "makhana", "featured": True,
     "tagline": "The most traded grade — balanced size, crunch and price for retail brands.",
     "image": img(IMG_MAKHANA, 901, "top"),
     "badges": ["Best Seller", "Hand-Popped"],
     "specs": {"Size": "14–16 mm (5 Suta)", "Moisture": "8% Max", "Puff Rate": "95% Min", "Purity": "99% Min"},
     "packaging": ["10 kg PP bags", "20 kg cartons", "Retail pouches 100g–1kg"],
     "moq": "500 kg", "hsn": "1904.10", "origin": "India (Mithila belt)",
     "certifications": ["FSSAI"], "availability": "Ready stock"},
    {"id": "makhana-6-suta", "name": "6 Suta Makhana (16–18 mm)", "category": "makhana", "featured": False,
     "tagline": "Large, snow-white pops for premium snack lines and gifting packs.",
     "image": img(IMG_MAKHANA, 902, "bottom"),
     "badges": ["Premium Grade"],
     "specs": {"Size": "16–18 mm (6 Suta)", "Moisture": "8% Max", "Puff Rate": "95% Min", "Purity": "99% Min"},
     "packaging": ["10 kg PP bags", "20 kg cartons", "Retail pouches"],
     "moq": "500 kg", "hsn": "1904.10", "origin": "India (Mithila belt)",
     "certifications": ["FSSAI"], "availability": "Ready stock"},
    {"id": "premium-phool-makhana", "name": "Premium Phool Makhana", "category": "makhana", "featured": True,
     "tagline": "Top-graded phool makhana — uniform, bright and export-sorted by hand.",
     "image": img(IMG_MAKHANA, 903, "faces"),
     "badges": ["Export Sorted", "Premium Grade"],
     "specs": {"Size": "14–18 mm graded", "Moisture": "8% Max", "Puff Rate": "97% Min", "Discoloured": "1% Max"},
     "packaging": ["10 kg PP bags", "20 kg cartons", "Private label retail"],
     "moq": "500 kg", "hsn": "1904.10", "origin": "India (Mithila belt)",
     "certifications": ["FSSAI", "ISO 22000"], "availability": "Ready stock"},
    {"id": "jumbo-makhana", "name": "Jumbo Makhana (18 mm+)", "category": "makhana", "featured": False,
     "tagline": "Rare jumbo pops — the showpiece grade for luxury retail and gifting.",
     "image": img(IMG_MAKHANA, 904, "edges"),
     "badges": ["Rare Grade", "Limited Lots"],
     "specs": {"Size": "18 mm and above", "Moisture": "8% Max", "Puff Rate": "97% Min", "Purity": "99% Min"},
     "packaging": ["5/10 kg cartons", "Premium gift packaging"],
     "moq": "250 kg", "hsn": "1904.10", "origin": "India (Mithila belt)",
     "certifications": ["FSSAI"], "availability": "Seasonal"},
    {"id": "flavoured-makhana", "name": "Flavoured Makhana", "category": "makhana", "featured": False,
     "tagline": "Roasted and seasoned foxnuts — Peri Peri, Cheese, Pudina, Salt & Pepper and more.",
     "image": img(IMG_MAKHANA, 905, "entropy"),
     "badges": ["Ready to Eat", "Private Label"],
     "specs": {"Flavours": "Peri Peri / Cheese / Pudina / Salt & Pepper / Custom", "Moisture": "5% Max", "Shelf Life": "6–9 months"},
     "packaging": ["Nitrogen-flushed pouches 30g–250g", "Bulk 5 kg cartons"],
     "moq": "200 kg per flavour", "hsn": "2106.90", "origin": "India",
     "certifications": ["FSSAI"], "availability": "Made to order"},
]

class EnquiryCreate(BaseModel):
    type: str = "rfq"
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    quantity: Optional[str] = None
    incoterm: Optional[str] = None
    destination: Optional[str] = None
    message: Optional[str] = None
    items: Optional[List[dict]] = None

class BuyerCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    interest: Optional[str] = None
    volume: Optional[str] = None
    message: Optional[str] = None

@api_router.get("/")
async def root():
    return {"message": "Starvesta Worldwide API", "status": "ok"}

@api_router.get("/products")
async def list_products(category: Optional[str] = None, q: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    return await db.products.find(query, {"_id": 0}).to_list(200)

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return doc

@api_router.get("/categories")
async def categories():
    pipeline = [{"$group": {"_id": "$category", "count": {"$sum": 1}}}]
    rows = await db.products.aggregate(pipeline).to_list(10)
    return [{"category": r["_id"], "count": r["count"]} for r in rows]

@api_router.post("/enquiries")
async def create_enquiry(payload: EnquiryCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    await db.enquiries.insert_one(doc)
    return {"id": doc["id"], "status": "received", "message": "Thank you. Our export team will respond within 24 hours."}

@api_router.post("/buyers")
async def register_buyer(payload: BuyerCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.buyers.insert_one(doc)
    return {"id": doc["id"], "status": "registered", "message": "Registration received. Our team will share the buyer catalogue shortly."}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def seed_products():
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many(PRODUCTS)
        logging.info(f"Seeded {len(PRODUCTS)} products")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
