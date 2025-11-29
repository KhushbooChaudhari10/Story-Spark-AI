from pydantic import BaseModel
from typing import List
from schemas.storybook_schema import StoryPage, Storybook
from tools.story_tools import generate_story_text
from tools.background_tools import generate_background_image
from tools.tts_tools import narrate_story_text
from tools.background_tools import generate_background_from_paragraph

class StoryRequest(BaseModel):
    prompt: dict
    full_story: str 
    # pages: int = 5
    story_id: str



def create_story_pages(data: StoryRequest) -> Storybook:
    """
    Creates a multipage storybook with per-page:
    - Text
    - Background image (saved inside story folder)
    - Narration (saved inside story folder)
    """

    prompt = data.prompt
    # total_pages = data.pages
    story_id = data.story_id

    pages: List[StoryPage] = []

    # 1) Generate full story
    # full_story = data.full_story
    story_chunks = [p.strip() for p in data.full_story.split("\n\n") if p.strip()]

    # # Pad if fewer paragraphs
    # while len(story_chunks) < total_pages:
    #     story_chunks.append("")

    # # 2) Generate each page
    # for i in range(total_pages):
    #     page_number = i + 1
    #     text = story_chunks[i].strip()

    #     # ---- Background per page ----
    #     bg = generate_background_image(prompt, story_id, page=page_number)

    #     # ---- Audio per page ----
    #     audio = narrate_story_text(text, story_id, page=page_number)

    #     # ---- Create page ----
    #     pages.append(
    #         StoryPage(
    #             page=page_number,
    #             text=text,
    #             illustrations=[
    #                 {
    #                     "description": "Background scene matching story",
    #                     "style": "watercolor"
    #                 }
    #             ],
    #             narration_url=audio
    #         )
    #     )
    # 2) Loop over paragraphs → dynamic pages
    for i, text in enumerate(story_chunks, start=1):

        bg = generate_background_from_paragraph(text, story_id, page=i)
        audio = narrate_story_text(text, story_id, page=i)

        pages.append(
            StoryPage(
                page=i,
                text=text,
                illustrations=[{
                    "description": "Background scene matching story",
                    "style": "watercolor"
                }],
                narration_url=audio
            )
        )

    return Storybook(pages=pages)
