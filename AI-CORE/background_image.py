import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# Load environment variables so API keys aren't hard-coded in the script.
# This keeps the key secure and makes the project portable.
load_dotenv()
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# Fail early if token missing — avoids confusing API errors later.
if not HF_TOKEN:
    raise ValueError("❌ HF_TOKEN not found in .env file!")

# Creating a Nebius client because it's cheaper/faster for image generation
# compared to running the same model locally.
client = InferenceClient(
    provider="nebius",
    api_key=HF_TOKEN
)

# ------------------------------------------------------
# 1️⃣ Mood → Style mapping
# Instead of manually writing style strings everywhere,
# keep one central map so styles stay consistent across stories.
# This also makes it easier to expand or change the art style later.
# ------------------------------------------------------
def get_style_by_mood(mood):
    style_map = {
        "happy": "bright colorful watercolor storybook style, soft pastel tones, gentle lighting",
        "sad": "muted colors, soft watercolor wash, light shadows, calming tones",
        "angry": "strong contrast, bold strokes, dramatic lighting, comic-book style",
        "brave": "golden lighting, heroic dramatic background, vibrant colors",
        "funny": "cartoon doodle style, exaggerated shapes, playful colors",
        "scared": "cool dark colors, soft shadows, foggy storybook style",
        "excited": "vibrant neon tones, dynamic strokes, energetic cartoon style"
    }
    # Default style ensures the system never breaks on unknown moods.
    return style_map.get(mood, "soft pastel watercolor storybook style")

# ------------------------------------------------------
# 2️⃣ Setting → Background mapping
# Instead of writing long prompts manually for every scene,
# create reusable templates to maintain a consistent art direction.
# This helps story scenes feel like they belong to the same universe.
# ------------------------------------------------------
def get_background_by_setting(setting):
    setting_map = {
        "forest": "magical cartoon forest with tall trees, soft sunlight, butterflies, lush greenery",
        "city": "colorful cartoon city street with bright buildings, rainbow sky, balloons, playful details",
        "ocean": "underwater scene with coral reefs, bubbles, glowing fish, bright blue tones",
        "desert": "sunny desert with soft golden sand dunes and gentle sky gradient",
        "mountain": "storybook mountain valley with snow peaks and soft pastel sky",
        "space": "outer space with stars, planets, glowing galaxies, soft neon lighting",
        "school": "bright cheerful classroom with decorations and large windows",
        "village": "cute cartoon village with small houses, gardens and cobblestone paths",
        "park": "green park with trees, grass, flowers, blue sky"
    }
    # Default prevents blank outputs for rare or unexpected settings.
    return setting_map.get(setting, "soft abstract pastel background with gentle shapes and colors")

# ------------------------------------------------------
# 3️⃣ Add texture for realism
# Using a universal texture layer ensures the images look hand-drawn
# instead of digitally flat — gives a consistent “storybook” aesthetic.
# ------------------------------------------------------
def get_texture():
    return "light paper texture, soft grain, subtle crayon or watercolor patterns"

# ------------------------------------------------------
# 4️⃣ Build the final image prompt
# Breaking the prompt into mood + setting + texture makes the system modular.
# Each part can evolve independently without rewriting the whole prompt.
# ------------------------------------------------------
def build_background_prompt(setting, mood):
    style = get_style_by_mood(mood)
    background = get_background_by_setting(setting)
    texture = get_texture()

    # Final prompt combines all design decisions in a controlled way.
    final_prompt = (
        f"{background}, "
        f"{style}, "
        f"{texture}, "
        f"no characters, empty background only, high-quality storybook illustration"
    )
    return final_prompt

# ------------------------------------------------------
# Example: we manually simulate Whisper output.
# In real use, these will come from the child's narration.
# Having this section helps during development and debugging.
# ------------------------------------------------------
setting = "city"
mood = "happy"

final_prompt = build_background_prompt(setting, mood)
print("📌 FINAL BACKGROUND PROMPT:\n", final_prompt)

# ------------------------------------------------------
# 5️⃣ Generate the image
# Keeping generation separate makes the function reusable for future models.
# Also helps when you later swap to another API (OpenAI, Stability, Flux local).
# ------------------------------------------------------
print("\n🎨 Generating storybook background... please wait...\n")
image = client.text_to_image(
    final_prompt,
    model="black-forest-labs/FLUX.1-dev",
)

# Saving the image locally instead of returning a buffer
# makes debugging easier and also allows StorySpark to load
# the output directly into the UI.
output_path = "bg_images/storybook_background.png"
image.save(output_path)
print(f"✅ Background saved successfully as {output_path}")
