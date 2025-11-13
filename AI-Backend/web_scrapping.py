import time
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["storyspark-ai"]
collection = db["knowledge_base"]

base_url = "https://kids.kiddle.co/"

# -----------------------------
# CATEGORY MAP
# -----------------------------
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
    url = base_url + slug
    resp = requests.get(url, timeout=15)
    if resp.status_code != 200:
        print(f"Skipping {slug} — status {resp.status_code}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("h1")
    title = title_tag.get_text().strip() if title_tag else slug

    paragraphs = [p.get_text().strip() for p in soup.find_all("p") if p.get_text().strip()]

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

    facts = [li.get_text().strip() for li in soup.find_all("li") if li.get_text().strip()]

    doc = {
        "slug": slug.lower(),
        "title": title,
        "category": CATEGORY_MAP.get(slug.lower(), "unknown"),
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
