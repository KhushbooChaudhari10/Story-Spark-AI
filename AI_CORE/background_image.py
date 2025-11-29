import os
import uuid
import requests
from dotenv import load_dotenv

load_dotenv()

def generate_background(prompt_text: str, story_id: str, page: int = None) -> str:
    """
    Generates a background image using Pollinations and stores it inside:
    AI_CORE/stories/<story_id>/bg_images/
    """

    print(f"🎨 Pollinations Request Prompt: {prompt_text}")

    # Pollinations API URL
    url = f"https://image.pollinations.ai/prompt/{prompt_text.replace(' ', '%20')}"

    response = requests.get(url)

    # --- NEW: Create story-specific directory ---
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__))) # tools folder location
    story_dir = os.path.join(base_dir, "AI_Storyteller", "stories", story_id, "bg_images")

    os.makedirs(story_dir, exist_ok=True)

    # Filename
    if page:
        filename = f"page{page}.jpg"
    else:
        filename = f"{uuid.uuid4().hex}.jpg"
    file_path = os.path.join(story_dir, filename)

    # Save the image
    with open(file_path, "wb") as f:
        f.write(response.content)

    print(f"✅ Background saved: {file_path}")
    return file_path
