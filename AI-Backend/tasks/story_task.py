# from time import sleep
# from app.celery_app import celery

# # WHY we use a Celery task:
# # -------------------------
# # - Story generation (AI models) can be slow → avoid blocking API requests.
# # - Celery runs heavy work in the background so the system stays fast.
# # - Perfect for long-running processes like:
# #     • LLM story generation
# #     • Image creation with FLUX/Gemini
# #     • Audio generation
# # - Allows scaling with multiple workers when traffic grows.
# @celery.task(name="tasks.story_task.generate_story")
# def generate_story(name: str):
#     # Using sleep here just simulates slow AI model work.
#     # In real use, this will call Gemini/LLaMA/OpenAI for story creation.
#     sleep(30)  

#     # Returning structured, predictable output to the API.
#     # Celery automatically stores this in the result backend (Redis/DB).
#     return f"Once upon a time, {name} became a hero!"
