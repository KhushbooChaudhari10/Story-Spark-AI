import os
import wave
from dotenv import load_dotenv
from supabase import create_client
from google import genai
from google.genai import types

import uuid

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# -----------------------------
# Supabase Setup (Optional)
# -----------------------------
supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# -----------------------------
# Configure Gemini Client
# -----------------------------
# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
VOICE_NAME = "Kore"


def save_wav(filename, pcm_data, channels=1, rate=24000, sample_width=2):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)


def generate_audio_from_story(story_text, filename=None):
    print(f"🎤 Generating Gemini narration for: {story_text[:50]}...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    audio_dir = os.path.join(base_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)

    if not filename:
        filename = f"{uuid.uuid4().hex}.wav"

    file_path = os.path.join(audio_dir, filename)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-tts",
            contents=story_text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=VOICE_NAME
                        )
                    )
                ),
            ),
        )

        audio_bytes = response.candidates[0].content.parts[0].inline_data.data

        save_wav(file_path, audio_bytes)

        print(f"✅ Audio saved at: {file_path}")
        return file_path

    except Exception as e:
        print(f"❌ Gemini TTS Error: {e}")
        return None
