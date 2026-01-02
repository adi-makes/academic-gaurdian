# storage/storage.py
import json
import uuid
from datetime import datetime
from pathlib import Path

STATE_FILE = Path(__file__).parent / "state.json"


def load_state():
    with open(STATE_FILE, "r") as f:
        return json.load(f)


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


# ---------- TASKS ----------

def add_task(title, task_type, due_date, estimated_minutes, priority):
    state = load_state()
    task = {
        "task_id": str(uuid.uuid4()),
        "title": title,
        "type": task_type,  # exam_topic | assignment | revision
        "due_date": due_date,
        "estimated_minutes": estimated_minutes,
        "priority": priority,
        "status": "todo",
        "created_at": datetime.utcnow().isoformat()
    }
    state["tasks"].append(task)
    save_state(state)
    return task


def update_task_status(task_id, status):
    state = load_state()
    for task in state["tasks"]:
        if task["task_id"] == task_id:
            task["status"] = status
            break
    save_state(state)


def get_tasks():
    return load_state()["tasks"]


# ---------- DAILY PLAN ----------

def save_daily_plan(date, plan_items):
    state = load_state()
    state["daily_plans"][date] = plan_items
    save_state(state)


def get_daily_plan(date):
    return load_state()["daily_plans"].get(date, [])


# ---------- PROGRESS ----------

def log_progress(task_id, status, minutes_spent, reason=None):
    state = load_state()
    log = {
        "task_id": task_id,
        "status": status,
        "minutes_spent": minutes_spent,
        "date": datetime.utcnow().isoformat(),
        "reason": reason
    }
    state["progress_logs"].append(log)
    save_state(state)


# ---------- AGENT ACTIONS (VERY IMPORTANT) ----------

def log_agent_action(action_type, rationale, diff=None):
    state = load_state()
    action = {
        "timestamp": datetime.utcnow().isoformat(),
        "action_type": action_type,  # replan | escalate | suggest
        "rationale": rationale,
        "diff": diff
    }
    state["agent_actions"].append(action)
    save_state(state)
def check_and_replan_if_needed():
    """
    Simple agent rule:
    If a high-priority task is skipped and due within 3 days,
    trigger a replan action.
    """
    from datetime import datetime, timedelta

    state = load_state()
    now = datetime.utcnow()

    for task in state["tasks"]:
        if task["priority"] >= 4 and task["status"] == "todo":
            due = datetime.fromisoformat(task["due_date"])
            if (due - now).days <= 3:
                log_agent_action(
                    action_type="replan",
                    rationale=f"High priority task '{task['title']}' due soon",
                    diff="Moved task to next available high-focus slot"
                )
