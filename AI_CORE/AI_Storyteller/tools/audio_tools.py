# phase_5/tools/audio_tools.py
import sys, os

# Add the parent directory (AI_CORE) to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# from langchain.tools import tool
from whisper_test import transcribe_audio # your Phase 4 Whisper model

#@tool
def transcribe_audio_idea(audio_path: str) -> str:
    return transcribe_audio(audio_path)
