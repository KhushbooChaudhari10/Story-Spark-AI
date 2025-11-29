import os
from supabase import create_client
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# We load credentials from .env so secrets are not hard-coded.
# This ensures security + easier deployment across dev/staging/production.
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Using Supabase client because it provides built-in vector store support
# and automatically handles JSON + embeddings — ideal for search + retrieval.
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Using MiniLM because it's:
# - lightweight (fast on CPU)
# - good for semantic similarity
# - cheap to run in local environments
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def store_story_in_supabase(story_text):
    """
    WHY this function exists:
    -------------------------
    We store each generated story along with its embedding so that later:
    - StorySpark can search for similar stories
    - RAG (retrieval-augmented generation) becomes possible
    - Recommendations based on past stories can be added
    - Avoid repeating stories for the same user

    The embedding is generated once and saved directly in Supabase
    so we don't recompute it every time during search.
    """

    # Encoding once here ensures consistent embeddings for all stories.
    embedding = embedder.encode(story_text).tolist()

    # Storing as a JSON + vector column in Supabase so the built-in
    # pgvector index can perform similarity search efficiently.
    response = supabase.table("stories").insert({
        "story_text": story_text,
        "embedding": embedding
    }).execute()

    print("Story saved in Supabase!")
    return response
