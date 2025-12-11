import sys
import os

# Fix path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.AI_Storyteller.tools.tts_tools import narrate_story_text


@celery.task(name="tasks.generate_audio_task")
def generate_audio_task(text: str, story_id: str, page: int = None):
    """
    Celery task that generates audio for a given page or full story.
    Uses offline pyttsx3 TTS.
    """
    try:
        file_path = narrate_story_text(text, story_id, page)
        return {"audio_path": file_path}

    except Exception as e:
        return {"error": str(e)}
