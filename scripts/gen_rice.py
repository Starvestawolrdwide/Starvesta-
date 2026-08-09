import asyncio, os, base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.getenv("EMERGENT_LLM_KEY")
OUT = "/app/frontend/public/products/hq"

JOBS = [
    ("rice-1121", "professional e-commerce product photo: extra-long grain white 1121 basmati rice heaped in a dark ceramic bowl on a woven mat, a few grains scattered, studio soft daylight, light-grey seamless background, premium export catalogue quality, no text, no people"),
    ("rice-1509", "professional e-commerce product photo: long grain white 1509 basmati rice in a rustic wooden scoop on neutral background, grains spilling, studio lighting, premium catalogue quality, no text, no people"),
    ("rice-traditional", "professional e-commerce product photo: traditional basmati rice grains in a small jute sack with grains spilling out, warm soft light, light-grey background, no text, no people"),
    ("rice-sella", "professional e-commerce product photo: creamy-white parboiled sella basmati rice in a white ceramic bowl, soft studio light, light-grey seamless background, no text, no people"),
    ("rice-golden-sella", "professional e-commerce product photo: golden-yellow parboiled golden sella basmati rice heaped in a dark bowl, rich golden grains, studio lighting, light background, no text, no people"),
    ("rice-ir64", "professional e-commerce product photo: medium long grain white IR64 non-basmati rice in a metal measuring bowl, clean studio light, light-grey background, no text, no people"),
    ("rice-broken", "professional e-commerce product photo: broken white rice grains in a small hessian pouch, top-down soft light, light-grey background, no text, no people"),
    ("mk-jumbo", "professional e-commerce product photo: rare jumbo-size white phool makhana pops (puffed lotus seeds) arranged in a premium gift box, soft daylight, light background, no text, no people"),
    ("mk-flavoured", "professional e-commerce product photo: roasted flavoured makhana (foxnuts) dusted with red peri-peri spice in a black bowl, a few red chilli flakes scattered, studio light, no text, no people"),
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
