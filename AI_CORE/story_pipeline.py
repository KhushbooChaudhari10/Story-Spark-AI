from story_generator import generate_story
from store_story import store_story_in_supabase

# Example structured prompt result
# WHY we use a structured dictionary:
# ----------------------------------
# The entire StorySpark pipeline depends on consistent fields
# (character, mood, setting, object). 
# Passing a clean dict makes:
# - LLM prompting predictable
# - Story quality more stable
# - Easy upgrades in future (e.g., adding age_group, theme, weather)
data = {
    "character": "lion",
    "mood": "happy",
    "setting": "city",
    "object": "car"
}

# 1) Generate story using Gemini
# WHY this step is isolated:
# --------------------------
# Keeping generation logic in its own module avoids repetition
# and makes it easy to switch models (Flash → Pro → Claude → LLaMA)
# without touching the rest of the codebase.
story = generate_story(data)
print("\n📘 GENERATED STORY:")
print(story)

# 2) Store story + embeddings in Supabase
# WHY store immediately after generation:
# ---------------------------------------
# - Ensures every story is logged for analytics and search.
# - Embeddings allow future features like recommendations, RAG,
#   "find similar stories", avoiding repetition for the child.
# - Keeps the app stateless — no need to store things in memory.
print("\n📥 Saving to Supabase...")
store_story_in_supabase(story)

print("\n✅ DONE! Story generated and stored successfully.")
