from fastapi import FastAPI
from app.celery_app import celery
from pydantic import BaseModel
from tasks.story_generation_task import generate_story_task
from tasks.background_task import generate_background_task
from tasks.audio_task import generate_audio_task
from tasks.supabase_task import store_story_task
from tasks.transcribe_audio_task import transcribe_audio_task


app = FastAPI()

# -------------------------
# 1) Create story from name
# -------------------------
@app.get("/create-story")
def create_story(name: str):
    task = generate_story_task.delay({"character": name})
    return {"task_id": task.id}


# -------------------------
# 2) Check Celery Task Status
# -------------------------
@app.get("/check-status")
def check_status(task_id: str):
    result = celery.AsyncResult(task_id)
    return {
        "status": result.status,
        "result": result.result
    }


# -------------------------
# 3) Drawing Detection
# -------------------------
class DrawingRequest(BaseModel):
    image_url: str

@app.post("/detect-drawing")
def detect_drawing(req: DrawingRequest):
    task = celery.send_task(
        "tasks.detect_drawing_task",
        args=[req.image_url]
    )
    return {"task_id": task.id}


# -------------------------
# 4) Generate Story from Prompt
# -------------------------
class StoryRequest(BaseModel):
    prompt: dict

@app.post("/generate-story")
def generate_story_api(req: StoryRequest):
    task = generate_story_task.delay(req.prompt)
    return {"task_id": task.id}


# -------------------------
# 5) Generate Background Image
# -------------------------

class BackgroundRequest(BaseModel):
    prompt: dict
    story_id: str
    page: int | None = None

@app.post("/generate-background")
def generate_background_api(req: BackgroundRequest):
    task = generate_background_task.delay(req.prompt, req.story_id, req.page)
    return {"task_id": task.id}

# -------------------------
# 6) Generate Audio
# -------------------------

class AudioRequest(BaseModel):
    text: str
    story_id: str
    page: int | None = None


@app.post("/generate-audio")
def generate_audio(req: AudioRequest):
    """
    Trigger Celery task for audio narration.
    """
    task = generate_audio_task.delay(req.text, req.story_id, req.page)
    return {"task_id": task.id}


# -------------------------
# 7) Store Story in Supabase
# -------------------------

class SupabaseStoryRequest(BaseModel):
    story: dict


@app.post("/save-story")
def save_story_api(req: SupabaseStoryRequest):
    task = store_story_task.delay(req.story)
    return {"task_id": task.id}


# -------------------------
# 8) Create Storybook
# -------------------------
class StorybookRequest(BaseModel):
    prompt: dict
    story: dict
    story_id: str


@app.post("/create-storybook")
def create_storybook_api(req: StorybookRequest):
    task = celery.send_task(
        "tasks.generate_storybook_task",
        args=[req.dict()]
    )
    return {"task_id": task.id}


# -------------------------
# 9) Transcribe Audio
# -------------------------

class AudioTranscribeRequest(BaseModel):
    audio_url: str

@app.post("/transcribe-audio")
def transcribe_audio_api(req: AudioTranscribeRequest):
    """
    1) Sends audio URL to Celery background Whisper task
    2) Returns task_id for polling /check-status
    """
    task = celery.send_task(
        "tasks.transcribe_audio_task",
        args=[req.audio_url]
    )
    return {"task_id": task.id}