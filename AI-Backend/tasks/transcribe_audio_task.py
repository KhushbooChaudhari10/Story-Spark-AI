import sys, os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.whisper_test import transcribe_audio  # 🔹 Your Whisper module
from AI_CORE.AI_Storyteller.tools.prompt_tools import extract_prompt_from_transcription  # 🔹 Your prompt extractor

@celery.task(name="tasks.transcribe_audio_task")
def transcribe_audio_task(audio_url: str):
    """
    Background Celery task to:
    1) Transcribe child's speech
    2) Convert transcription → structured prompt dict
    """
    print(f"🎤 Transcribing audio from URL: {audio_url}")

    try:
        text = transcribe_audio(audio_url)  # 🔹 Your whisper logic
    except Exception as e:
        return {"error": f"Transcription failed: {str(e)}"}

    if not text or len(text.strip()) == 0:
        return {"error": "No speech detected"}

    print("🧠 Extracting structured prompt from transcription...")
    prompt_dict = extract_prompt_from_transcription(text)

    return {
        "transcription": text,
        "prompt": prompt_dict
    }
