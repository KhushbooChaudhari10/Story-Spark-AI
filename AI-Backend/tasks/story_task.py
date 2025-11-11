from time import sleep
from app.celery_app import celery

@celery.task(name="tasks.story_task.generate_story")
def generate_story(name: str):
    sleep(30)  # simulate slow AI
    return f"Once upon a time, {name} became a hero!"
