from fastapi import APIRouter
from datetime import datetime
from database import db

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("/")
def log_progress(task_id: str, status: str, minutes_spent: int, reason: str = None):
    log = {
        "task_id": task_id,
        "status": status,
        "minutes_spent": minutes_spent,
        "date": datetime.utcnow(),
        "reason": reason
    }

    db["progress_logs"].append(log)

    if status == "skipped":
        db["agent_actions"].append({
            "timestamp": datetime.utcnow(),
            "action_type": "replan",
            "rationale": "User skipped task",
            "diff": f"Task {task_id} marked for replan"
        })

    return log
