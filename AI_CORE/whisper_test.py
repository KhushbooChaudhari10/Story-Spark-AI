import os
from pymongo import MongoClient
import whisper
import re
import json
import google.generativeai as genai

# Add FFmpeg path
os.environ["PATH"] = r"C:\ffmpeg\bin;" + os.environ.get("PATH", "")

# Load Whisper model once
model = whisper.load_model("base")

def transcribe_audio(filepath: str) -> str:
    filepath = os.path.abspath(filepath)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Audio file not found at: {filepath}")
    result = model.transcribe(filepath)
    return result["text"]


def similar(a, b):
    """Fuzzy match helper for misheard words."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def best_animal_match(animals, text):
    best_label = None
    best_score = 0

    for w in text.split():
        for label in animals:
            score = SequenceMatcher(None, w.lower(), label.lower()).ratio()
            if score > best_score:
                best_score = score
                best_label = label

    # Require a minimum fuzzy score to avoid wrong detections
    return best_label if best_score >= 0.60 else None


def parse_story_prompt_from_db(transcription):
    prompt = f"""
    You are an expert at understanding children's speech.

    The child said: "{transcription}"

    Fix any misheard words (example: 'Arabic name Kuku' → 'a rabbit named Coco').

    Then extract structured story elements.

    Return ONLY valid JSON like this:
    {{
        "character": "",
        "setting": "",
        "objects": [],
        "mood": ""
    }}
    """
    
    model = genai.GenerativeModel("gemini-2.5-pro")

    response = model.generate_content(prompt)

    # Extract clean JSON even if formatted with code blocks
    text = response.text
    json_match = re.search(r"\{.*\}", text, re.DOTALL)

    if json_match:
        return json.loads(json_match.group())
    else:
        return {"character": "unknown", "setting": "unknown", "objects": [], "mood": "neutral"}

