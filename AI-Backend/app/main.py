from fastapi import FastAPI
from tasks.story_task import generate_story
from app.celery_app import celery

app = FastAPI()

@app.get("/create-story")
def create_story(name: str):
    task = generate_story.delay(name)
    return {"task_id": task.id}

@app.get("/check-status")
def check_status(task_id: str):
    result = celery.AsyncResult(task_id)
    return {"status": result.status, "result": result.result}
