from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

# WHY use a Pydantic model:
# -------------------------
# - Ensures strong data validation (id must be int, name must be str)
# - Prevents malformed API input
# - Makes API documentation auto-generated in /docs
class User(BaseModel):
    id: int
    name: str
    city: str

# WHY store data in an in-memory list:
# ------------------------------------
# - Perfect for demos and learning FastAPI
# - No need to set up a database during early development
# - Data resets automatically on restart → avoids stale data issues
#
# (In production, this would be replaced with MongoDB / SQL / Supabase.)
users: List[User] = []

@app.get("/")
def read_root():
    # Keep root endpoint simple → helps test server is running.
    return {"message": "Hello Users"}

@app.get("/users")
def get_users():
    # Returning the in-memory user list as JSON.
    # FastAPI automatically converts Pydantic models → JSON.
    return users

@app.post("/users")
def create_user(user: User):
    # WHY append directly:
    # --------------------
    # - Fastest and simplest way to simulate a real DB insert
    # - Pydantic already guarantees user structure is valid
    users.append(user)
    return user
