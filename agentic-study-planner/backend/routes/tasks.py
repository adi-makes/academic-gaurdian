from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime
from database import db

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/")
def create_task(title: str, type: str, due_date: str, estimated_minutes: int, priority: int):
    task = {
        "task_id": str(uuid4()),
        "title": title,
        "type": type,
        "due_date": datetime.fromisoformat(due_date).date(),
        "estimated_minutes": estimated_minutes,
        "priority": priority,
        "status": "todo",
        "created_at": datetime.utcnow()
    }
    db["tasks"].append(task)
    return task


@router.get("/")
def list_tasks():
    return db["tasks"]
