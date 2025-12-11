# tts_tools.py
import os
import pyttsx3
from utils.cloud_upload import upload_to_cloudinary  # 👈 add

def narrate_story_text(text: str, story_id: str, page: int = None) -> str:
    """
    Uses pyttsx3 (offline TTS) to convert text → mp3 narration.
    Saves inside: stories/<story_id>/audio/
    """

    # Base directory for this tool
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    # Create story-specific audio folder
    story_audio_dir = os.path.join(base_dir, "stories", story_id, "audio")
    os.makedirs(story_audio_dir, exist_ok=True)

    # Filename
    filename = f"page{page}.mp3" if page else "full_story.mp3"
    file_path = os.path.join(story_audio_dir, filename)

    # Initialize offline TTS engine
    engine = pyttsx3.init()

    # You can adjust voice, speed, volume here if you want:
    # engine.setProperty("rate", 170)  # speed
    # engine.setProperty("volume", 1.0)
    # voices = engine.getProperty('voices')
    # engine.setProperty("voice", voices[1].id)  # choose female/male voice

    # Create narration
    engine.save_to_file(text, file_path)
    engine.runAndWait()

    print(f"✅ Offline Audio saved at: {file_path}")

    cloud_url = upload_to_cloudinary(file_path, folder=f"stories/{story_id}/audio")
    print(f"🌥 Uploaded audio to Cloudinary: {cloud_url}")   
    return cloud_url


