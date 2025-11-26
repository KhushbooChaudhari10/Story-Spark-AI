# phase_5/tools/storage_tools.py
import sys, os

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from store_story import store_story_in_supabase

#@tool
def save_story_to_supabase(story_text: str) -> str:
    """
    Saves the complete story + embedding into Supabase.
    Returns success message.
    """
    store_story_in_supabase(story_text)
    return "Story saved in Supabase."
