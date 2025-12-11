import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from app.celery_app import celery
from AI_CORE.AI_Storyteller.tools.storybook_tools import create_story_pages, StoryRequest


@celery.task(name="tasks.generate_storybook_task")
def generate_storybook_task(payload: dict):
    """
    Background task:
    - Uses full story text
    - Generates per-page background images
    - Generates per-page audio
    - Returns final storybook JSON
    """

    try:
        story_request = StoryRequest(
            prompt=payload["prompt"],
            full_story=payload["full_story"],
            story_id=payload["story_id"]
        )

        storybook = create_story_pages(story_request)

        return {
            "status": "success",
            "storybook": storybook.dict()
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
