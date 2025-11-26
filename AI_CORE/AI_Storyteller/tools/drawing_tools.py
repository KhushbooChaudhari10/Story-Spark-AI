# phase_5/tools/drawing_tools.py
import sys, os

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from drawing_object_detector import detect_objects_from_drawing

#@tool
def analyze_child_drawing(image_path: str) -> dict:
    """
    Uses Gemini Vision to interpret a child's drawing and extract:
    animals, objects, characters, nature.
    """
    return detect_objects_from_drawing(image_path)
