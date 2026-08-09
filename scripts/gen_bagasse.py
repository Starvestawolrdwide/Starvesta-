import asyncio, os, base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.getenv("EMERGENT_LLM_KEY")
OUT = "/app/frontend/public/products/hq"

JOBS = [
    ("bag-plates", "professional e-commerce product photo: assortment of round white sugarcane bagasse disposable plates in different sizes fanned out, soft studio daylight, light-grey seamless background, premium catalogue quality, no text, no people"),
    ("bag-bowls", "professional e-commerce product photo: stack of white sugarcane bagasse disposable bowls in two sizes, soft studio light, light-grey seamless background, no text, no people"),
    ("bag-trays", "professional e-commerce product photo: white bagasse 5-compartment meal tray next to a 3-compartment tray, soft studio light, light-grey background, no text, no people"),
    ("bag-containers", "professional e-commerce product photo: white bagasse takeaway food containers with fitted lids, one open showing empty interior, studio light, light-grey background, no text, no people"),
    ("bag-cups", "professional e-commerce product photo: small white bagasse disposable cups stacked with one upright beside, soft studio light, light-grey background, no text, no people"),
    ("bag-mealbox", "professional e-commerce product photo: white bagasse meal box with secure hinged lid, one open and one closed, studio light, light-grey background, no text, no people"),
    ("bag-clamshell", "professional e-commerce product photo: white bagasse clamshell burger box, one open empty and one closed, studio light, light-grey background, no text, no people"),
]

async def gen(name, prompt):
    chat = LlmChat(api_key=API_KEY, session_id=f"img-{name}", system_message="You are a product photography AI.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if images:
        with open(os.path.join(OUT, f"{name}.png"), "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        print(f"OK {name}", flush=True)
    else:
        print(f"NOIMAGE {name}", flush=True)

async def main():
    for n, p in JOBS:
        try:
            await gen(n, p)
        except Exception as e:
            print(f"FAIL {n}: {str(e)[:100]}", flush=True)

asyncio.run(main())
print("DONE", flush=True)
