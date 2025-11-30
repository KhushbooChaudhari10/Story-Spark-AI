import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
drawing_file = os.path.join(BASE_DIR, "sample_drawing", "hand_draw.jpeg")
# audio_file = os.path.join(BASE_DIR, "audio", "audio5.wav")

from agent.storyteller_agent import run_agent

if __name__ == "__main__":
    output = run_agent(
        "Create a storybook",
        audio_path=None,
        drawing_path=drawing_file
    )

    print("\n📚 FINAL RESULT:")
    print(output)
