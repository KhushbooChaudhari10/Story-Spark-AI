from app.celery_app import celery

import sys
import os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from AI_CORE.AI_Storyteller.tools.story_tools import generate_story_text

@celery.task(name="tasks.generate_story_task")
def generate_story_task(prompt: dict) -> dict:
    """
    Background task:
    - Generates scene-based story JSON
    """
    return generate_story_text(prompt)
