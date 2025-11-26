# phase_5/tools/prompt_tools.py
import sys, os

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from whisper_test import parse_story_prompt_from_db

#@tool
def extract_prompt_from_transcription(transcription: str) -> dict:
    """
    Converts raw transcription into a structured prompt
    (character, mood, setting, object).
    """
    return parse_story_prompt_from_db(transcription)
