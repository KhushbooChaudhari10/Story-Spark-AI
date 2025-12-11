import os
import sys
import random
from cloudinary.uploader import upload

# Add root path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from background_image import generate_background


def generate_background_image(prompt_data: dict, story_id: str, page: int = None) -> str:
    """
    Converts structured prompt into a dynamic background generation prompt.
    """
    
    # ---- 1️⃣ If user provided a drawing, use that to generate background ----
    drawing = prompt_data.get("drawing_objects", {})

    if drawing and any(drawing.values()):
        animals = ", ".join(drawing.get("animals", [])) or "nature"
        objects = ", ".join(drawing.get("objects", []))
        colors = ", ".join(drawing.get("colors", []))

        seed = random.randint(1000, 999999)

        drawing_prompt = (
            f"children's watercolor storybook scene, soft pastel colors, "
            f"features: {animals}, {objects}, "
            f"color palette of {colors}, "
            f"whimsical and gentle style, clean background, no characters, seed {seed}"
        )

        print("🎨 Using drawing-based prompt.")
        return generate_background(drawing_prompt, story_id, page)

    # ---- 2️⃣ If no drawing, fallback to audio/story prompt ----
    print("🎨 Using speech/text-based prompt.")

    character = prompt_data.get("character", "friend")
    mood = prompt_data.get("mood", "happy")
    setting = prompt_data.get("setting", "storybook world")
    obj = prompt_data.get("object", None)

    # Include object only if meaningful
    object_text = f", with hints of {obj}" if obj and obj != "none" else ""

    # Random seed helps get different images each run
    seed = random.randint(2000, 999999)

    prompt = (
        f"children's storybook background, watercolor, soft pastel colors, "
        f"{setting} environment where a {mood} {character} might live"
        f"{object_text}, whimsical, warm and friendly style, no characters, seed {seed}"
    )

    return generate_background(prompt, story_id, page)

def generate_background_from_paragraph(paragraph_text: str, story_id: str, page: int):
    """
    Generates a unique background image for each page using the paragraph text.
    """
    import random
    from background_image import generate_background

    # Avoid extremely long prompts
    desc = paragraph_text[:220]

    seed = random.randint(1000, 999999)

    prompt = (
        "children's watercolor storybook background, soft pastel, whimsical, "
        "gentle, no characters. Scene inspired by this part of the story: "
        f"'{desc}'. Seed {seed}"
    )

    return generate_background(prompt, story_id, page)
