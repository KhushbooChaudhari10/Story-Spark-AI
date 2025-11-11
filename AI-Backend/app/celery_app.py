from celery import Celery

celery = Celery(
    "celery_app",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["tasks.story_task"]
)

