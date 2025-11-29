# from ultralytics import YOLO
# import json

# # (Old YOLO code removed)
# # YOLO works for real-world photos but performs poorly on kids’ abstract drawings.
# # That’s why we replaced it with Gemini vision, which interprets meaning rather than detecting literal objects.

import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os
import re

load_dotenv()

# Using API key from .env so sensitive credentials aren't hard-coded.
# This also allows easy switching across environments (local, staging, production).
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_clean_json(text):
    """
    WHY this exists:
    ----------------
    Large Language Models often wrap JSON in Markdown code blocks,
    or produce extra text around it.  
    If we directly attempt json.loads(), parsing breaks.

    This utility:
    - searches for a ```json...``` block if present
    - cleans stray backticks
    - attempts safe parsing
    - avoids entire program crashing due to formatting issues
    """
    text = text.strip()

    # Extract JSON inside code blocks,
    # because models frequently embed JSON inside markdown.
    match = re.search(r"```json(.*?)```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()

    # Safety cleanup for malformed markdown output.
    text = text.replace("```", "").strip()

    # Attempt parsing — failure handled gracefully instead of raising exception.
    try:
        return json.loads(text)
    except Exception as e:
        print("❌ JSON parse error:", e)
        return None


def detect_objects_from_drawing(image_path):
    """
    WHY this approach:
    -------------------
    - Kids' drawings are abstract; object detectors (YOLO, DETR) fail frequently.
    - Gemini Vision understands intent: "this blob is probably a lion" or
      "this shape looks like the sun."
    - We send the image + a structured JSON template so that the output stays predictable.

    This function:
    - Reads the drawing as raw bytes (fast + model-ready)
    - Sends image + instruction to Gemini
    - Forces structured categorization for consistency across projects
    """

    # Reading raw bytes instead of PIL image —
    # Gemini accepts raw bytes directly, saving a conversion step.
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    # Prompt engineered to force category-based structured thinking.
    # This reduces hallucination and keeps outputs standardized.
    prompt = """
    You are an expert at interpreting kids' drawings.

    Identify what the child tried to draw.
    Categories can include:
    - animals
    - characters
    - objects
    - nature
    - shapes

    Respond ONLY in clean JSON:
    {
      "animals": [],
      "objects": [],
      "characters": [],
      "nature": [],
      "others": []
    }
    """

    # Using Gemini multimodal capabilities to analyze the drawing.
    # Image is sent as bytes + prompt to encourage contextual understanding.
    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/png"
            ),
            prompt
        ]
    )

    raw = response.text

    # Extracting clean JSON from messy model output.
    parsed = extract_clean_json(raw)

    if parsed:
        return parsed
    else:
        # If formatting breaks, we still show raw output for debugging.
        print("\n⚠ JSON parsing failed. Raw model output:\n")
        print(raw)
        return None


# ---- RUN TEST ----
if __name__ == "__main__":
    # Running this helps during development instead of calling the function elsewhere.
    print("🎨 Analyzing child's drawing...\n")
    output = detect_objects_from_drawing("sample_drawings/hand_draw.jpeg")
    print(json.dumps(output, indent=4))
