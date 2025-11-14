import os
import time
from dotenv import load_dotenv
from google import genai

load_dotenv()

# Keeping API credentials in .env prevents hard-coding secrets
# and helps switch between dev/test/production environments easily.
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)


def generate_story(data):
    """
    WHY this function exists:
    -------------------------
    Central story generator for StorySpark.
    Takes structured inputs (character, mood, setting, object)
    so the story always aligns with the child’s drawing + narration.

    Using a controlled prompt ensures:
    - Consistency in style (child-friendly, simple)
    - Predictable story length (5–7 sentences)
    - Easy future upgrades (e.g., adding themes, age level)
    """

    character = data["character"]
    mood = data["mood"]
    setting = data["setting"]
    obj = data["object"]

    # The prompt keeps everything simple and well-structured.
    # This avoids hallucinations and makes rewriting/improvements easy.
    prompt = f"""
    Write a short children's story (5–7 sentences).
    Story details:
    - Main character: {character}
    - Mood: {mood}
    - Setting: {setting}
    - Object included: {obj}

    Make it cute, simple, positive, and easy for kids.
    """

    # LLM APIs occasionally fail due to rate limits or load.
    # Instead of instantly failing, we retry a few times to make
    # the system feel stable and smooth for the user.
    for _ in range(3):  # retry 3 times
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",  # fast + cheap, perfect for short stories
                contents=prompt
            )
            return response.text
        except Exception as e:
            print("Model overloaded, retrying...", e)
            time.sleep(2)  # short wait increases success chances

    # If all retries fail, we raise a clear error instead of silent failure.
    raise RuntimeError("Gemini failed after 3 retries.")
