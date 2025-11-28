import json
import os
import re
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# 2. Configure the Standard V1 Library
if not API_KEY:
    print("⚠ Warning: GOOGLE_API_KEY not found.")
else:
    genai.configure(api_key=API_KEY)

def extract_clean_json(text):
    """
    Cleans Markdown code blocks to extract pure JSON.
    """
    text = text.strip()
    # Remove ```json and ``` wrappers
    match = re.search(r"```json(.*?)```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    else:
        # Sometimes it just uses ``` without json
        text = text.replace("```", "").strip()

    try:
        return json.loads(text)
    except Exception as e:
        print(f"❌ JSON parse error: {e}")
        return None

def detect_objects_from_drawing(image_path):
    """
    Uses Gemini Vision (Standard SDK) to analyze a child's drawing.
    """
    
    # --- PATH SAFETY FIX ---
    # If the path provided is relative, make it absolute based on THIS file's location
    if not os.path.isabs(image_path):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(base_dir, image_path)

    if not os.path.exists(image_path):
        print(f"❌ Error: Image file not found at {image_path}")
        return {"error": "image_not_found"}

    # Read image bytes
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    # Prompt
    prompt = """
    You are an expert at interpreting abstract kids' drawings.
    Look at this image and identify what is drawn.
    
    Return ONLY a valid JSON object with these exact keys:
    {
      "animals": ["list", "of", "animals"],
      "objects": ["list", "of", "objects"],
      "characters": ["list", "of", "characters"],
      "nature": ["sun", "trees", "etc"],
      "colors": ["dominant", "colors"]
    }
    """
 
    try:
        # Use Gemini 1.5 Flash (Fast & Multimodal)
        model = genai.GenerativeModel("gemini-2.5-pro")

        # Prepare the content correctly for V1 SDK
        # V1 accepts a list containing the prompt string and a dictionary for the image
        response = model.generate_content([
            prompt,
            {
                "mime_type": "image/jpeg", # Assumes jpeg/png. works for most.
                "data": image_bytes
            }
        ])

        return extract_clean_json(response.text)

    except Exception as e:
        print(f"❌ Gemini Vision Error: {e}")
        return {"error": str(e)}

# ---- TEST AREA ----
if __name__ == "__main__":
    # Make sure you actually have this file, or change the name to test!
    test_image = "sample_drawings/hand_draw.jpeg" 
    
    print(f"🎨 Analyzing {test_image}...")
    result = detect_objects_from_drawing(test_image)
    print(json.dumps(result, indent=2))