from datetime import date, datetime
from database import db


def urgency_score(task):
    days_left = (task["due_date"] - date.today()).days
    return task["priority"] * max(1, 7 - days_left)


def generate_daily_plan(plan_date: date):
    tasks = [t for t in db["tasks"] if t["status"] == "todo"]

    tasks.sort(key=urgency_score, reverse=True)

    plan = []
    used_minutes = 0
    MAX_MINUTES = 6 * 60

    for task in tasks:
        if used_minutes + task["estimated_minutes"] <= MAX_MINUTES:
            plan.append({
                "task_id": task["task_id"],
                "title": task["title"],
                "duration_minutes": task["estimated_minutes"],
                "note": f"Focus block for {task['type']} (priority {task['priority']})"
            })
            used_minutes += task["estimated_minutes"]

    db["daily_plans"][str(plan_date)] = plan

    db["agent_actions"].append({
        "timestamp": datetime.utcnow(),
        "action_type": "suggest",
        "rationale": "Generated plan using urgency + priority ranking",
        "diff": f"Planned {len(plan)} focus blocks"
    })

    return plan
