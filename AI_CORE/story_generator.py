import os
from dotenv import load_dotenv
from groq import Groq

# 1️⃣ Load environment variables
load_dotenv()

# 2️⃣ Get Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in .env file")

# 3️⃣ Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

def generate_story(prompt_text: str) -> str:
    """
    Generates a story using Groq LLaMA 3.3 70B model.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a children's storyteller."},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0.7,
            max_tokens=1200
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error generating story: {e}"


if __name__ == "__main__":
    print(generate_story("Write a one-sentence story about a robot."))
