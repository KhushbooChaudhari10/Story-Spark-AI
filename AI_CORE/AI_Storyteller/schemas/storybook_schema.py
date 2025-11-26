from pydantic import BaseModel
from typing import List, Optional

class Illustration(BaseModel):
    description: str
    style: Optional[str] = None

class StoryPage(BaseModel):
    page: int
    text: str
    illustrations: List[Illustration]
    narration_url: Optional[str]

class Storybook(BaseModel):
    pages: List[StoryPage]
    song_url: Optional[str] = None
