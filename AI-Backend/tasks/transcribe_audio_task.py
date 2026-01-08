import sys, os, requests, uuid, tempfile
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.whisper_test import transcribe_audio
from AI_CORE.AI_Storyteller.tools.prompt_tools import extract_prompt_from_transcription


def download_audio_from_url(audio_url: str) -> str:
    temp_path = os.path.join(
        tempfile.gettempdir(),
        f"{uuid.uuid4()}.webm"
    )

    response = requests.get(audio_url, timeout=20)
    response.raise_for_status()

    with open(temp_path, "wb") as f:
        f.write(response.content)

    return temp_path


@celery.task(name="tasks.transcribe_audio_task")
def transcribe_audio_task(audio_url: str):
    print(f"🎤 Downloading audio from: {audio_url}")

    try:
        local_audio_path = download_audio_from_url(audio_url)
        text = transcribe_audio(local_audio_path)
    except Exception as e:
        return {"error": f"Transcription failed: {str(e)}"}

    if not text or not text.strip():
        return {"error": "No speech detected"}

    print("🧠 Extracting structured prompt from transcription...")
    prompt_dict = extract_prompt_from_transcription(text)

    return {
        "transcription": text,
        "prompt": prompt_dict
    }
