import asyncio
import os
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

load_dotenv("/app/backend/.env")
API_KEY = os.getenv("EMERGENT_LLM_KEY")
SRC = "/app/frontend/public/products"
OUT = "/app/frontend/public/products/hq"
os.makedirs(OUT, exist_ok=True)

STYLE = (
    "Using this product photo as reference, recreate the EXACT same product as a high-resolution "
    "professional e-commerce product photograph: {desc}. Studio soft daylight, clean minimal "
    "light-grey seamless background, sharp focus, premium export-catalogue quality. "
    "No text, no watermark, no people, no hands."
)

JOBS = [
    ("mk-12mm.jpg", "mk-12mm", "raw phool makhana (puffed lotus seeds / foxnuts), small 12mm white pops heaped in a dark ceramic bowl on a woven mat"),
    ("mk-15mm.jpg", "mk-15mm", "raw phool makhana (white puffed foxnuts), 15mm pops in a rustic wooden bowl on deep blue cloth"),
    ("mk-19mm.jpg", "mk-19mm", "extreme close-up pile of large 19mm white phool makhana pops (puffed lotus seeds) filling the frame"),
    ("mk-4sutta.jpg", "mk-4sutta", "raw phool makhana white pops in a dark grey ceramic bowl on a woven mat, warm side light"),
    ("mk-5sutta.jpg", "mk-5sutta", "raw phool makhana white puffed lotus seeds heaped in a woven cane basket, top-down light"),
    ("mk-6sutta.jpg", "mk-6sutta", "raw phool makhana white pops piled in a turned wooden bowl, moody dark backdrop"),
    ("cup-180ml.jpg", "cup-180ml", "stack of plain white 180ml disposable paper cups beside a filled cup of tea, on neutral background"),
    ("cup-710ml.jpg", "cup-710ml", "one tall plain white 710ml disposable paper cup with a roll of paper beside it, studio shot"),
    ("cup-double-wall.jpg", "cup-double-wall", "two kraft brown double-wall disposable paper coffee cups, one plain and one with subtle texture"),
    ("cup-plain.jpg", "cup-plain", "neat stack of plain white single-use paper cups on a dark charcoal background"),
    ("cup-printed.jpg", "cup-printed", "group of colorful custom-printed disposable paper cups with abstract geometric patterns"),
    ("cup-single-wall.jpg", "cup-single-wall", "tall stack of plain white single-wall paper cups, minimal studio lighting"),
    ("plate-round.jpg", "plate-round", "stack of round white sugarcane bagasse disposable plates on warm beige backdrop"),
    ("plate-square.jpg", "plate-square", "stack of square white sugarcane bagasse disposable plates with rounded corners"),
    ("plate-comp-round.jpg", "plate-comp-round", "stack of round white bagasse 3-compartment disposable plates on beige background"),
    ("plate-comp-square.jpg", "plate-comp-square", "stack of square white bagasse 3-compartment disposable plates on beige background"),
]


async def gen(ref_name, out_name, desc):
    ref_path = os.path.join(SRC, ref_name)
    with open(ref_path, "rb") as f:
        ref_b64 = base64.b64encode(f.read()).decode("utf-8")
    chat = LlmChat(api_key=API_KEY, session_id=f"img-{out_name}", system_message="You are a product photography AI.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=STYLE.format(desc=desc), file_contents=[ImageContent(ref_b64)])
    text, images = await chat.send_message_multimodal_response(msg)
    if images:
        with open(os.path.join(OUT, f"{out_name}.png"), "wb") as f:
            f.write(base64.b64decode(images[0]["data"]))
        print(f"OK {out_name}", flush=True)
    else:
        print(f"NOIMAGE {out_name}: {str(text)[:80]}", flush=True)


async def main():
    for ref, out, desc in JOBS:
        try:
            await gen(ref, out, desc)
        except Exception as e:
            print(f"FAIL {out}: {str(e)[:120]}", flush=True)

asyncio.run(main())
print("DONE", flush=True)
