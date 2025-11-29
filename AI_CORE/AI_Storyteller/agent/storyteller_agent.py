import os
import uuid
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel
from typing import Optional

# --- IMPORT YOUR TOOLS ---
from tools.audio_tools import transcribe_audio_idea
from tools.prompt_tools import extract_prompt_from_transcription
from tools.story_tools import generate_story_text
from tools.drawing_tools import analyze_child_drawing
from tools.background_tools import generate_background_image
from tools.tts_tools import narrate_story_text
from tools.storage_tools import save_story_to_supabase
from tools.storybook_tools import create_story_pages, StoryRequest


load_dotenv()


# ---------------------------
# STATE MODEL (Memory Layer)
# ---------------------------
class StoryState(BaseModel):
    story_id: Optional[str] = None
    audio_path: Optional[str] = None
    drawing_path: Optional[str] = None

    transcription: Optional[str] = None
    prompt: Optional[dict] = None
    story_text: Optional[str] = None
    background_image: Optional[str] = None
    narration: Optional[str] = None
    response: Optional[str] = None

    storybook: Optional[dict] = None

    response: Optional[str] = None


# ---------------------------
# Steps (Graph Nodes)
# ---------------------------

def step_transcribe(state: StoryState):
    if not state.audio_path:
        print("No audio provided. Skipping...")
        return {"transcription": ""}
    print("🎤 Transcribing audio...")
    text = transcribe_audio_idea(state.audio_path)
    return {"transcription": text}


def step_extract_prompt(state: StoryState):
    print("🧠 Extracting structured prompt...")
    prompt = extract_prompt_from_transcription(state.transcription)
    return {"prompt": prompt}


def step_analyze_drawing(state: StoryState):
    if not state.drawing_path:
        print("🖼️ No drawing provided. Skipping...")
        return {}
    print("👀 Analyzing child's drawing...")
    objects = analyze_child_drawing(state.drawing_path)
    state.prompt["drawing_objects"] = objects
    return {"prompt": state.prompt}


def step_story_text(state: StoryState):
    print("📖 Generating story text...")
    story = generate_story_text(state.prompt)
    return {"story_text": story}


def step_background(state: StoryState):
    print("🎨 Creating illustrated background...")
    img = generate_background_image(
        prompt_data=state.prompt,
        story_id=state.story_id,
    )
    return {"background_image": img}



def step_narration(state: StoryState):
    print("🔊 Creating narration audio...")
    narration = narrate_story_text(state.story_text, state.story_id)
    return {"narration": narration}


def step_save(state: StoryState):
    print("💾 Saving story to Supabase...")
    save_story_to_supabase(state.story_text)
    return {"response": "Storybook successfully generated and stored."}

def step_storybook(state: StoryState):
    print("📘 Creating multi-page storybook...")
    story_request = StoryRequest(prompt=state.prompt, full_story=state.story_text, story_id=state.story_id)
    storybook = create_story_pages(story_request)
    return {"storybook": storybook.dict()}


# ---------------------------
# Build the Graph
# ---------------------------
graph = StateGraph(StoryState)

graph.add_node("transcribe", step_transcribe)
graph.add_node("drawing_analysis", step_analyze_drawing)
graph.add_node("extract_prompt", step_extract_prompt)
graph.add_node("story", step_story_text)
graph.add_node("background", step_background)
graph.add_node("narration", step_narration)
graph.add_node("save", step_save)
graph.add_node("storybook", step_storybook)

graph.set_entry_point("transcribe")

graph.add_edge("transcribe", "extract_prompt")
graph.add_edge("extract_prompt", "drawing_analysis")
graph.add_edge("drawing_analysis", "story")
graph.add_edge("story", "background")
graph.add_edge("background", "narration")
graph.add_edge("narration", "save")
graph.add_edge("save", END)
graph.add_edge("narration", "storybook")
graph.add_edge("storybook", "save")

workflow = graph.compile()


# ---------------------------
# Run Function (Public API)
# ---------------------------
def run_agent(user_request: str, audio_path=None, drawing_path=None):
    print("🚀 StorySpark LangGraph Agent Starting...\n")

    story_id = uuid.uuid4().hex[:10]
    story_dir = os.path.join(os.path.dirname(__file__), "..", "stories", story_id)
    os.makedirs(story_dir, exist_ok=True)

    initial_state = StoryState(
        story_id=story_id,
        audio_path=audio_path,
        drawing_path=drawing_path,
    )

    result = workflow.invoke(initial_state)

    print("✨ Done!")
    return result
