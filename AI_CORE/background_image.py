import os
import uuid
import requests
from dotenv import load_dotenv
from utils.cloud_upload import upload_to_cloudinary
from PIL import Image
import io
import time

load_dotenv()

def generate_background(prompt_text: str, story_id: str, page: int = None) -> str:
    """
    Generates a background image using Pollinations and stores it inside:
    AI_CORE/stories/<story_id>/bg_images/
    """

    print(f"🎨 Pollinations Request Prompt: {prompt_text}")

    # --- Retry Pollinations if image invalid ---
    for attempt in range(3):
        try:
            url = f"https://image.pollinations.ai/prompt/{prompt_text}"
            response = requests.get(url, timeout=25)

            # 🎯 Try to open using PIL (validate image)
            img = Image.open(io.BytesIO(response.content))
            img.verify()  # Validate format

            # === If valid, save ===
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))
            story_dir = os.path.join(base_dir, "AI_Storyteller", "stories", story_id, "bg_images")
            os.makedirs(story_dir, exist_ok=True)

            filename = f"page{page}.jpg" if page else f"{uuid.uuid4().hex}.jpg"
            file_path = os.path.join(story_dir, filename)

            with open(file_path, "wb") as f:
                f.write(response.content)

            print(f"✅ Background saved: {file_path}")
            cloud_url = upload_to_cloudinary(file_path, folder=f"stories/{story_id}/bg")
            print(f"🌥 Uploaded background to Cloudinary: {cloud_url}")
            return cloud_url

        except Exception as e:
            print(f"❌ Invalid image on attempt {attempt+1}: {e}")
            time.sleep(2)

    # === FINAL FAIL SAFE ===
    print("⚠️ Pollinations failed 3 times — using fallback image")
    fallback_url = "https://m.media-amazon.com/images/I/716Bo-JErsL._AC_UF1000,1000_QL80_.jpg"  # 🎨 Replace with your own default BG
    cloud_url = upload_to_cloudinary(fallback_url, folder=f"stories/{story_id}/bg")

    return cloud_url
