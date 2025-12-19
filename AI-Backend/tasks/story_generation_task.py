import sys
import os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)
from app.celery_app import celery
from AI_CORE.story_generator import generate_story   # your python file

@celery.task(name="tasks.generate_story_task")
def generate_story_task(prompt: dict) -> str:
    """
    Generates a short, meaningful, child-friendly story based on either 
    the child's drawing or the audio/text prompt.
    """

    try:
        # --------- 1️⃣ PRIORITY: If drawing exists, make story about drawing ---------
        drawing = prompt.get("drawing_objects", {})

        if drawing and any(drawing.values()):
            animals = ", ".join(drawing.get("animals", [])) or None
            objects = ", ".join(drawing.get("objects", [])) or None
            colors = ", ".join(drawing.get("colors", [])) or None
            nature = ", ".join(drawing.get("nature", [])) or None

            drawing_prompt = (
               f"""You are a warm and imaginative children's storyteller.

            First, create a short, meaningful TITLE for the story, inspired by the child’s drawing.
            - The title should feel magical, cute, or adventurous.
            - Keep it under 5 words.
            - Make it poetic and easy for a child to say.
            - Style it as if it will appear on the first page in a beautiful storybook font.

            After the title, write a SHORT story (4 paragraphs, each 3 lines max).

            The story should be based on this child's drawing:
            - Animals in drawing: {animals or 'none'}
            - Objects: {objects or 'none'}
            - Nature / Environment: {nature or 'none'}
            - Colors used: {colors or 'unknown'}

            Story Requirements:
            - Use simple, happy, child-friendly language.
            - Make the main character lovable and curious.
            - Introduce a tiny, gentle problem and a warm resolution.
            - Make the colors meaningful within the story.
            - Keep tone positive, imaginative, and comforting.
            - No fear, danger, or violence.
            - End with a sweet, heartwarming closing line.

            Output Format:
            1. Title on its own line (no quotes, no “Title:” label).
            2. Then a blank line.
            3. Then the story paragraphs."""

            )

            return generate_story(drawing_prompt)

        # --------- 2️⃣ If no drawing, fallback to structured speech/text prompt ---------
        character = prompt.get("character", "a friendly character")
        mood = prompt.get("mood", "happy")
        setting = prompt.get("setting", "a magical place")
        obj = prompt.get("object", "a special object")

        prompt_data = (
            "You are a children's storyteller. "
            "Write a SHORT, meaningful story (5–7 paragraphs, max 3–4 lines each).\n\n"
            "Story Requirements:\n"
            "- Keep language simple, warm, and child-friendly\n"
            "- Add one tiny problem and a gentle resolution\n"
            "- Create emotional connection\n"
            "- No scary or dark themes\n"
            "- Keep it cute, colorful, and imaginative\n\n"
            f"Story details:\n"
            f"- Main character: {character}\n"
            f"- Mood: {mood}\n"
            f"- Setting: {setting}\n"
            f"- Important object: {obj}\n"
            "End the story with a sweet, heartwarming message."
        )

        return generate_story(prompt_data)

    except Exception as e:
        return f"Error generating story: {e}"

