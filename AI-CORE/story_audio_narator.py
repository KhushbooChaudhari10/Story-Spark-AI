from gtts import gTTS
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Keeping Supabase credentials in .env avoids hard-coding secrets
# and makes the system portable across different environments.
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Using Supabase because it gives an easy cloud DB + storage combo
# and integrates well with vector search used elsewhere in StorySpark.
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_latest_story():
    """
    WHY this function exists:
    -------------------------
    StorySpark often needs to narrate the most recently generated story.
    Instead of requiring the caller to pass story_id manually,
    we simply fetch the latest entry from the database.

    Sorting by `id DESC` gives the newest story,
    assuming `id` is an auto-increment primary key.
    """
    response = (
        supabase.table("stories")
        .select("*")
        .order("id", desc=True)   # ensures we always pick the newest generated story
        .limit(1)
        .execute()
    )
    return response.data[0]["story_text"]


def generate_audio_from_story(story_text):
    """
    WHY gTTS:
    ---------
    - Free
    - Fast
    - Good enough quality for children's narration
    - Zero API cost or rate-limits

    Keeping narration local avoids dependency on expensive cloud TTS services,
    which is helpful during prototyping and offline usage.

    The audio is saved to a static MP3 file because:
    - UI can easily load it
    - It can be uploaded to Supabase storage later
    """
    print("🎤 Generating gTTS audio narration...")

    tts = gTTS(text=story_text, lang="en")
    output_file = "audio/story_narration.mp3"

    # Saving to a predictable filename keeps UI integration simple.
    tts.save(output_file)

    print(f"✅ Audio saved as {output_file}")


# RUN PIPELINE
# This simple pipeline retrieves the latest story and narrates it.
# In the full system, this step will come after story generation + saving.
story = fetch_latest_story()
print("\n📘 Story fetched:\n", story)

generate_audio_from_story(story)
