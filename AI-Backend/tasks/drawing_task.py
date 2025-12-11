# AI_Backend/tasks/drawing_task.py
import sys
import os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)
from AI_CORE.drawing_object_detector import detect_objects_from_drawing
from app.celery_app import celery

# Celery Task for Drawing Analysis
@celery.task(name="tasks.detect_drawing_task")
def detect_drawing_task(image_url: str):
    """
    Background task that takes an image URL,
    runs Gemini Vision object detection,
    and returns structured JSON.
    """
    return detect_objects_from_drawing(image_url)
