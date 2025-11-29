from fastapi import FastAPI
from tasks.story_task import generate_story
from app.celery_app import celery

app = FastAPI()

# WHY trigger Celery tasks via API:
# ---------------------------------
# Story generation (AI calls) can take several seconds.
# Instead of blocking the HTTP request, we push the job to Celery,
# return immediately, and let the background worker handle heavy work.
#
# This keeps the API:
# - fast
# - responsive
# - scalable under load
@app.get("/create-story")
def create_story(name: str):
    # Using .delay() sends the task to the Celery worker immediately.
    # Client receives a task ID and can check progress later.
    task = generate_story.delay(name)
    return {"task_id": task.id}


@app.get("/check-status")
def check_status(task_id: str):
    # WHY AsyncResult:
    # ----------------
    # Allows us to query:
    # - current task state (PENDING / STARTED / SUCCESS / FAILURE)
    # - final returned result from the worker
    #
    # This creates a clean polling-based workflow for the frontend.
    result = celery.AsyncResult(task_id)
    return {
        "status": result.status,   # tells frontend whether story is ready
        "result": result.result    # final story text after task completes
    }
