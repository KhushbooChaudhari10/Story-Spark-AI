import os
from pymongo import MongoClient
import json

# Adding FFmpeg path manually because Whisper relies on FFmpeg for audio decoding.
# This avoids "ffmpeg not found" errors on Windows systems.
os.environ["PATH"] = r"C:\ffmpeg\bin;" + os.environ.get("PATH", "")

import whisper

# Using Whisper base model:
# - Accurate enough for kid speech + noisy audio
# - Faster than medium/large models for real-time usage
model = whisper.load_model("base")
result = model.transcribe(r"audio\test2.wav")
print("TRANSCRIPT:", result["text"])


def parse_story_prompt_from_db(transcription):
    """
    WHY this function exists:
    -------------------------
    The goal is to convert a child’s spoken sentence into
    structured story inputs: character, mood, object, setting.

    Instead of using an LLM for extraction (costly + inconsistent),
    we rely on a controlled vocabulary stored in MongoDB.

    Benefits:
    - Guaranteed consistency across stories
    - Easily expandable knowledge base
    - Faster + cheaper than calling an LLM every time
    """

    # Case normalization avoids mismatched keyword detection.
    transcription = transcription.lower()

    # Using local Mongo because:
    # - Very fast lookups
    # - Easy to update categories dynamically from UI
    client = MongoClient("mongodb://localhost:27017/")
    db = client["storyspark-ai"]

    # Categories stored in MongoDB allow StorySpark to evolve:
    # You can add new animals, characters, objects, places anytime
    # without changing code.
    animals = [doc["slug"] for doc in db.knowledge_base.find({"category": "animal"})]
    characters = [doc["slug"] for doc in db.knowledge_base.find({"category": "character"})]
    professions = [doc["slug"] for doc in db.knowledge_base.find({"category": "profession"})]
    objects = [doc["slug"] for doc in db.knowledge_base.find({"category": "object"})]
    places = [doc["slug"] for doc in db.knowledge_base.find({"category": "place"})]

    # Mood list is kept directly in code because:
    # - Set is small
    # - Unlikely to change often
    mood_words = [
        "happy", "sad", "angry", "brave", "funny", "kind",
        "curious", "sleepy", "lonely", "excited", "scared", "shy"
    ]

    # Detect mood:
    # Using next() ensures we pick the FIRST matching mood.
    # Default = "neutral" so system never breaks.
    found_mood = next((m for m in mood_words if m in transcription), "neutral")

    # Detect character:
    # We check in order of importance:
    # animals → characters → professions.
    # This avoids conflicts like "lion king" being detected as "king".
    found_character = None
    for group in [animals, characters, professions]:
        found_character = next((x for x in group if x in transcription), None)
        if found_character:
            break

    # Detect objects and settings using direct keyword matches.
    # We pick only the first match to keep the prompt simple.
    found_object = next((o for o in objects if o in transcription), None)
    found_setting = next((p for p in places if p in transcription), None)

    # We return defaults to avoid breaking the story generator.
    result = {
        "character": found_character or "unknown",
        "mood": found_mood,
        "setting": found_setting or "unknown",
        "object": found_object or "none"
    }

    return result


# Example usage:
text = "tell a story about a brave astronaut on the moon with a robot friend"
prompt = parse_story_prompt_from_db(text)
print(json.dumps(prompt, indent=4))
