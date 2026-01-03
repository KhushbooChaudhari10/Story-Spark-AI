# phase_5/tools/story_tools.py
import sys, os
import json

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from story_generator import generate_story

#@tool
def generate_story_text(prompt_data: dict) -> dict:
    """
    Generates a short, meaningful, child-friendly story based on either 
    the child's drawing or the audio/text prompt.
    """
    scene_count = int(prompt_data.get("scene_count", 5))  # default = 5
    scene_count = max(1, min(scene_count, 10))


    try:
        # --------- 1️⃣ PRIORITY: If drawing exists, make story about drawing ---------
        drawing = prompt_data.get("drawing_objects", {})

        if drawing and any(drawing.values()):
            animals = ", ".join(drawing.get("animals", [])) or None
            objects = ", ".join(drawing.get("objects", [])) or None
            colors = ", ".join(drawing.get("colors", [])) or None
            nature = ", ".join(drawing.get("nature", [])) or None

            drawing_prompt = (
                "You are a children's storyteller AI.\n\n"
                "Create a children's story as a LIST OF SCENES.\n"
                "Each scene represents EXACTLY ONE storybook page.\n\n"

                "Return STRICT JSON in this format ONLY:\n"
                "{\n"
                '  "scenes": [\n'
                "    {\n"
                '      "scene_id": 1,\n'
                '      "story_text": "...",\n'
                '      "setting": "...",\n'
                '      "mood": "...",\n'
                '      "visual_elements": ["...", "..."]\n'
                "    }\n"
                "  ]\n"
                "}\n\n"

                "Story rules:\n"
                f"- Create EXACTLY {scene_count} scenes\n"
                "- Language must be simple, warm, and child-friendly\n"
                "- One small problem and a happy ending\n"
                "- No scary or violent themes\n\n"

                f"Base the story on this child's drawing:\n"
                f"- Animals: {animals or 'none'}\n"
                f"- Objects: {objects or 'none'}\n"
                f"- Nature/Environment: {nature or 'none'}\n"
                f"- Colors: {colors or 'unknown'}\n"
            )

            raw = generate_story(drawing_prompt)
            return json.loads(raw)

        # --------- 2️⃣ If no drawing, fallback to structured speech/text prompt ---------
        character = prompt_data.get("character", "a friendly character")
        mood = prompt_data.get("mood", "happy")
        setting = prompt_data.get("setting", "a magical place")
        obj = prompt_data.get("object", "a special object")

        prompt = (
                        "You are a children's storyteller AI.\n\n"
                "Create a children's story as a LIST OF SCENES.\n"
                "Each scene represents EXACTLY ONE storybook page.\n\n"

                "Return STRICT JSON in this format ONLY:\n"
                "{\n"
                '  "scenes": [\n'
                "    {\n"
                '      "scene_id": 1,\n'
                '      "story_text": "...",\n'
                '      "setting": "...",\n'
                '      "mood": "...",\n'
                '      "visual_elements": ["...", "..."]\n'
                "    }\n"
                "  ]\n"
                "}\n\n"

                "Story rules:\n"
                f"- Create EXACTLY {scene_count} scenes\n"
                "- Language must be simple, warm, and child-friendly\n"
                "- One small problem and a happy ending\n"
                "- No scary or violent themes\n\n"

                f"Story details:\n"
                f"- Main character: {character}\n"
                f"- Mood: {mood}\n"
                f"- Setting: {setting}\n"
                f"- Important object: {obj}\n"

        )

        raw = generate_story(prompt)
        return json.loads(raw)

    except Exception as e:
        return f"Error generating story: {e}"
