import time
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["storyspark-ai"]
collection = db["knowledge_base"]

base_url = "https://kids.kiddle.co/"

topic_slugs = [
    # Animals
    "Tiger", "Lion", "Elephant", "Giraffe", "Zebra", "Monkey", "Panda", "Fox", "Wolf", "Cow",
    "Horse", "Rabbit", "Dog", "Cat", "Dolphin", "Whale", "Shark", "Penguin", "Bear", "Kangaroo",

    # Birds
    "Eagle", "Parrot", "Peacock", "Owl", "Sparrow", "Flamingo",

    # Space
    "Mars", "Moon", "Rocket", "Astronaut", "Galaxy", "Black_hole", "Milky_Way",

    # Nature / Environment
    "Mountain", "Waterfall", "Rainbow", "Volcano", "Desert", "Forest", "Ocean", "River", "Island",

    # Objects / Inventions
    "Car", "Robot", "Airplane", "Train", "Ship", "Bicycle", "Computer", "Mobile_phone", "Camera",

    # Food
    "Pizza", "Cake", "Chocolate", "Ice_cream", "Burger",

    # Professions
    "Doctor", "Pilot", "Engineer", "Teacher", "Police", "Firefighter",

    # Characters / Fantasy
    "Princess", "Superhero", "Ghost", "Dragon", "Unicorn", "Mermaid", "Fairy", "Wizard", "Ninja",

    # Dinosaurs
    "Dinosaur", "Tyrannosaurus", "Triceratops", "Velociraptor",

    # Emotions / Concepts
    "Happiness", "Friendship", "Courage", "Kindness", "Adventure"
]


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
        "description": " ".join(paragraphs),
        "images": images,
        "facts": facts,
        "source_url": url,
        "scraped_at": time.time()
    }

    return doc

for slug in topic_slugs:
    print("Scraping:", slug)
    doc = scrape_slug(slug)
    if doc:
        collection.update_one(
            {"slug": doc["slug"]},
            {"$set": doc},
            upsert=True
        )
    time.sleep(2)  # be polite

print("Scraping done.")
