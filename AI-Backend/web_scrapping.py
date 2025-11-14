import time
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

# Using local MongoDB so our knowledge base stays modifiable,
# fast to read, and easy to extend without code changes.
client = MongoClient("mongodb://localhost:27017/")
db = client["storyspark-ai"]
collection = db["knowledge_base"]

# Kiddle is a kid-friendly encyclopedia → ideal for simple, safe descriptions.
base_url = "https://kids.kiddle.co/"

# -----------------------------
# CATEGORY MAP
# -----------------------------
# WHY we maintain a category map:
# -------------------------------
# - Ensures controlled vocabulary for story parsing (animal/object/place/etc.)
# - Allows StorySpark to reliably detect characters/settings from speech
# - Lets us update categories here instead of hardcoding logic in the parser
CATEGORY_MAP = {
    # Animals
    "tiger": "animal", "lion": "animal", "elephant": "animal", "giraffe": "animal",
    "zebra": "animal", "monkey": "animal", "panda": "animal", "fox": "animal",
    "wolf": "animal", "cow": "animal", "horse": "animal", "rabbit": "animal",
    "dog": "animal", "cat": "animal", "dolphin": "animal", "whale": "animal",
    "shark": "animal", "penguin": "animal", "bear": "animal", "kangaroo": "animal",

    # Birds
    "eagle": "animal", "parrot": "animal", "peacock": "animal",
    "owl": "animal", "sparrow": "animal", "flamingo": "animal",

    # Space
    "mars": "place", "moon": "place", "rocket": "object",
    "astronaut": "character", "galaxy": "place",
    "black_hole": "place", "milky_way": "place",

    # Nature
    "mountain": "place", "waterfall": "place", "rainbow": "place",
    "volcano": "place", "desert": "place", "forest": "place",
    "ocean": "place", "river": "place", "island": "place",

    # Objects
    "car": "object", "robot": "character", "airplane": "object",
    "train": "object", "ship": "object", "bicycle": "object",
    "computer": "object", "mobile_phone": "object", "camera": "object",

    # Food
    "pizza": "food", "cake": "food", "chocolate": "food",
    "ice_cream": "food", "burger": "food",

    # Professions
    "doctor": "profession", "pilot": "profession",
    "engineer": "profession", "teacher": "profession",
    "police": "profession", "firefighter": "profession",

    # Fantasy
    "princess": "character", "superhero": "character",
    "ghost": "character", "dragon": "character",
    "unicorn": "character", "mermaid": "character",
    "fairy": "character", "wizard": "character", "ninja": "character",

    # Dinosaurs
    "dinosaur": "animal", "tyrannosaurus": "animal",
    "triceratops": "animal", "velociraptor": "animal",

    # Emotions
    "happiness": "emotion", "friendship": "emotion",
    "courage": "emotion", "kindness": "emotion",
    "adventure": "emotion"
}

# -----------------------------
# TOPIC SLUGS
# -----------------------------
# WHY we use slugs:
# -----------------
# - They match exact pages on kids.kiddle.co
# - Consistent lowercase keys help MongoDB querying
# - Easy to pass into the scraper without complex URL logic
topic_slugs = [
    # Animals
    "Tiger", "Lion", "Elephant", "Giraffe", "Zebra", "Monkey", "Panda", "Fox", "Wolf", "Cow",
    "Horse", "Rabbit", "Dog", "Cat", "Dolphin", "Whale", "Shark", "Penguin", "Bear", "Kangaroo",

    # Birds
    "Eagle", "Parrot", "Peacock", "Owl", "Sparrow", "Flamingo",

    # Space
    "Mars", "Moon", "Rocket", "Astronaut", "Galaxy", "Black_hole", "Milky_Way",

    # Nature
    "Mountain", "Waterfall", "Rainbow", "Volcano", "Desert", "Forest",
    "Ocean", "River", "Island",

    # Objects
    "Car", "Robot", "Airplane", "Train", "Ship", "Bicycle",
    "Computer", "Mobile_phone", "Camera",

    # Food
    "Pizza", "Cake", "Chocolate", "Ice_cream", "Burger",

    # Professions
    "Doctor", "Pilot", "Engineer", "Teacher", "Police", "Firefighter",

    # Characters
    "Princess", "Superhero", "Ghost", "Dragon", "Unicorn",
    "Mermaid", "Fairy", "Wizard", "Ninja",

    # Dinosaurs
    "Dinosaur", "Tyrannosaurus", "Triceratops", "Velociraptor",

    # Emotions
    "Happiness", "Friendship", "Courage", "Kindness", "Adventure"
]

# -----------------------------
# SCRAPER FUNCTION
# -----------------------------
def scrape_slug(slug):
    """
    WHY this scraper:
    -----------------
    StorySpark needs simple definitions, facts, and images
    to help describe detected items (animals/places/objects).
    Kiddle's content is kid-friendly and clean, so ideal for this purpose.

    This function:
    - Fetches page
    - Extracts description + facts + images
    - Normalizes data into a MongoDB-friendly structure
    """

    url = base_url + slug
    resp = requests.get(url, timeout=15)

    # If page missing or blocked → skip instead of crashing pipeline.
    if resp.status_code != 200:
        print(f"Skipping {slug} — status {resp.status_code}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Kids encyclopedia pages usually have <h1> as title, but fallback kept.
    title_tag = soup.find("h1")
    title = title_tag.get_text().strip() if title_tag else slug

    # Clean paragraph text → used for child-friendly explanations.
    paragraphs = [p.get_text().strip() for p in soup.find_all("p") if p.get_text().strip()]

    # Image extraction logic handles relative and absolute URLs.
    images = []
    for img in soup.find_all("img"):
        src = img.get("src")
        if src:
            if src.startswith("/"):
                full = base_url.rstrip("/") + src
            elif src.startswith("http"):
                full = src
            else:
                full = base_url.rstrip("/") + "/" + src
            images.append(full)

    # Facts section helps add fun trivia for the knowledge base.
    facts = [li.get_text().strip() for li in soup.find_all("li") if li.get_text().strip()]

    doc = {
        "slug": slug.lower(),
        "title": title,
        "category": CATEGORY_MAP.get(slug.lower(), "unknown"),  # fallback prevents errors
        "description": " ".join(paragraphs),
        "images": images,
        "facts": facts,
        "source_url": url,
        "scraped_at": time.time()
    }

    return doc

# -----------------------------
# SCRAPE LOOP
# -----------------------------
# WHY a simple loop:
# ------------------
# - Easier to debug and monitor during long scraping jobs
# - `upsert=True` ensures the scraper can be safely re-run
#   without creating duplicates.
# - 2-second delay prevents hitting Kiddle too aggressively.
for slug in topic_slugs:
    print("Scraping:", slug)
    doc = scrape_slug(slug)
    if doc:
        collection.update_one(
            {"slug": doc["slug"]},
            {"$set": doc},
            upsert=True
        )
    time.sleep(2)

print("Scraping done.")
