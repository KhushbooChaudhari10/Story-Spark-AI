import os
import google.generativeai as genai
from dotenv import load_dotenv
from groq import Groq


# 1. Load environment variables
load_dotenv()

# 2. Get API Key (Make sure you have a .env file with GOOGLE_API_KEY=...)
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    # Fallback for testing only - Replace with your actual key if .env fails
    print("Warning: GOOGLE_API_KEY not found in .env") 
    # API_KEY = "AIzaSy..." 

# 3. Configure the library (The V1 way)
genai.configure(api_key=API_KEY)

def generate_story(prompt_text):
    """
    Generates a story using the standard Google Generative AI SDK.
    """
    try:
        # Use 'gemini-pro' or 'gemini-1.5-flash'
        model = genai.GenerativeModel("gemini-2.5-flash") 
        
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        return f"Error generating story: {e}"

if __name__ == "__main__":
    print(generate_story("Write a one-sentence story about a robot."))