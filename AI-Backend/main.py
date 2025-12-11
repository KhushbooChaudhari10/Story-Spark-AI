from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import sys
import os

# Add parent folder (Story-Spark-AI) to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from AI_CORE.drawing_object_detector import detect_objects_from_drawing
from app.celery_app import celery

app = FastAPI()

# WHY use a Pydantic model:
# -------------------------
# - Ensures strong data validation (id must be int, name must be str)
# - Prevents malformed API input
# - Makes API documentation auto-generated in /docs

class DrawingRequest(BaseModel):
    image_url: str

@app.post("/detect-drawing")
def detect_drawing(req: DrawingRequest):
    task = celery.send_task(
        "tasks.detect_drawing_task",
        args=[req.image_url]
    )
    return {"task_id": task.id}