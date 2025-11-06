from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class User(BaseModel):
    id: int
    name: str
    city: str

users: List[User] = []

@app.get("/")
def read_root():
    return {"message": "Hello Users"}

@app.get("/users")
def get_users():
    return users

@app.post("/users")
def create_user(user: User):
    users.append(user)
    return user