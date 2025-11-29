# phase_5/tools/story_tools.py
import sys, os

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from story_generator import generate_story

#@tool
def generate_story_text(prompt_data: dict) -> str:
    """
    Generates a short, meaningful, child-friendly story based on either 
    the child's drawing or the audio/text prompt.
    """

    try:
        # --------- 1️⃣ PRIORITY: If drawing exists, make story about drawing ---------
        drawing = prompt_data.get("drawing_objects", {})

        if drawing and any(drawing.values()):
            animals = ", ".join(drawing.get("animals", [])) or None
            objects = ", ".join(drawing.get("objects", [])) or None
            colors = ", ".join(drawing.get("colors", [])) or None
            nature = ", ".join(drawing.get("nature", [])) or None

            drawing_prompt = (
                "You are a children's storyteller. "
                "Write a SHORT and meaningful story (5–7 paragraphs, max 3–4 lines each). "
                "Make it warm, imaginative, and easy for a young child to understand.\n\n"
                f"The story should be based on this child's drawing:\n"
                f"- Animals: {animals or 'none'}\n"
                f"- Objects: {objects or 'none'}\n"
                f"- Nature/Environment: {nature or 'none'}\n"
                f"- Colors used: {colors or 'unknown'}\n\n"
                "Story Requirements:\n"
                "- Use simple, happy, child-friendly language\n"
                "- Make the main character lovable\n"
                "- The story should be positive and comforting\n"
                "- Add a tiny problem and a happy resolution\n"
                "- Keep paragraphs short\n"
                "- No violent themes\n"
                "- Make the colors meaningful in the story\n"
                "- End with a sweet or heartwarming line\n"
            )

            return generate_story(drawing_prompt)

        # --------- 2️⃣ If no drawing, fallback to structured speech/text prompt ---------
        character = prompt_data.get("character", "a friendly character")
        mood = prompt_data.get("mood", "happy")
        setting = prompt_data.get("setting", "a magical place")
        obj = prompt_data.get("object", "a special object")

        prompt = (
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

        return generate_story(prompt)

    except Exception as e:
        return f"Error generating story: {e}"
