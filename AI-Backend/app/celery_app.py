from celery import Celery

# WHY we create a dedicated Celery instance:
# -----------------------------------------
# This acts as the central message orchestrator for all background tasks.
# By keeping Celery separate from FastAPI, we ensure:
# - API stays fast and does not block on slow AI operations
# - Tasks can run on worker machines or separate servers
# - The system scales easily as StorySpark grows
celery = Celery(
    "celery_app",

    # WHY Redis as a broker:
    # ----------------------
    # - Extremely fast and stable for message passing
    # - Perfect for short-lived task queues
    # - Easy to install locally and works great in production
    broker="redis://localhost:6379/0",

    # WHY Redis as a backend:
    # ------------------------
    # - Stores task results so you can fetch output later
    # - Enables FAST API → Celery → API response workflows
    # - Using a separate DB index keeps broker + results isolated
    backend="redis://localhost:6379/1",

    # WHY include list:
    # -----------------
    # - Celery automatically discovers all task modules here
    # - Keeps tasks organized in a clean, scalable folder structure
    include=["tasks.story_task",
             "tasks.transcribe_audio_task",
             "tasks.drawing_task",
             "tasks.story_generation_task",
             "tasks.background_task",
             "tasks.audio_task",
             "tasks.supabase_task",
             "tasks.storybook_task"]
)

celery.conf.update(
    task_acks_late=True,
    task_reject_on_worker_lost=True
)