from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# -----------------------------
# In-memory "database"
# -----------------------------
tasks = []

# -----------------------------
# Data models (shape of JSON)
# -----------------------------
class Task(BaseModel):
    title: str
    date: str
    duration_minutes: int | None = None

class ChatRequest(BaseModel):
    text: str

# -----------------------------
# Health check
# -----------------------------
@app.get("/")
def home():
    return {"status": "Backend is running"}

# -----------------------------
# Add a task
# -----------------------------
@app.post("/add-task")
def add_task(task: Task):
    task_data = task.dict()
    task_data["created_at"] = datetime.now().isoformat()
    tasks.append(task_data)
    return {
        "message": "Task added successfully",
        "task": task_data
    }

# -----------------------------
# Get all tasks
# -----------------------------
@app.get("/tasks")
def get_tasks():
    return tasks

# -----------------------------
# AI Chat (FAKE for now)
# -----------------------------
@app.post("/chat")
def chat_with_ai(chat: ChatRequest):
    # Simulated AI response (replace with real AI later)
    ai_reply = f"I received your message: '{chat.text}'. I will help plan your tasks."

    return {
        "reply": ai_reply,
        "actions": []  # future AI actions (reschedule, add, etc.)
    }
