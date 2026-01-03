# tts_tools.py
import os
import pyttsx3
from story_audio_narator import generate_audio_from_story
from utils.cloud_upload import upload_to_cloudinary  

def narrate_story_text(text: str, story_id: str, page: int = None) -> str:
    """
    Uses Gemini TTS (primary) with offline pyttsx3 fallback.
    Returns Cloudinary audio URL.
    """

    # Base directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    story_audio_dir = os.path.join(base_dir, "AI_Storyteller", "stories", story_id, "audio")
    os.makedirs(story_audio_dir, exist_ok=True)

    filename = f"page{page}.wav" if page else "full_story.wav"
    file_path = os.path.join(story_audio_dir, filename)

    # ---------------------------
    # 1️⃣ TRY GEMINI TTS
    # ---------------------------
    try:
        print("🎤 Using Gemini TTS...")
        audio_path = generate_audio_from_story(
            story_text=text,
            filename=filename
        )

        cloud_url = upload_to_cloudinary(
            audio_path,
            folder=f"stories/{story_id}/audio"
        )

        print(f"🌥 Gemini audio uploaded: {cloud_url}")
        return cloud_url

    except Exception as e:
        print(f"⚠️ Gemini TTS failed, falling back to offline TTS: {e}")

    # ---------------------------
    # 2️⃣ FALLBACK: OFFLINE TTS
    # ---------------------------
    engine = pyttsx3.init()
    engine.save_to_file(text, file_path)
    engine.runAndWait()

    print(f"✅ Offline audio saved at: {file_path}")

    cloud_url = upload_to_cloudinary(
        file_path,
        folder=f"stories/{story_id}/audio"
    )

    print(f"🌥 Offline audio uploaded: {cloud_url}")
    return cloud_url


