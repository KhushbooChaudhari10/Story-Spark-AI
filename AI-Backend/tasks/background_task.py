import sys
import os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.AI_Storyteller.tools.background_tools import generate_background_image

@celery.task(name="tasks.generate_background_task")
def generate_background_task(prompt_data: dict, story_id: str, page: int = None):
    """
    Background generation task.
    Takes prompt_data from drawing/audio and produces background image.
    """
    try:
        image_path = generate_background_image(prompt_data, story_id, page)
        return {"image_path": image_path}
    except Exception as e:
        return {"error": str(e)}
