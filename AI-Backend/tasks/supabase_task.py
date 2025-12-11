import sys
import os

# Add project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.AI_Storyteller.tools.storage_tools import store_story_in_supabase


@celery.task(name="tasks.store_story_task")
def store_story_task(story_text: str):
    """
    Stores a story + embedding into Supabase asynchronously.
    Ensures the task returns only JSON-safe objects.
    """
    try:
        response = store_story_in_supabase(story_text)

        # Supabase returns APIResponse object → convert to dict
        safe_response = {
            "data": response.data if hasattr(response, "data") else None,
            "status_code": response.status_code if hasattr(response, "status_code") else None
        }

        return {"status": "success", "supabase": safe_response}

    except Exception as e:
        return {"status": "error", "message": str(e)}
