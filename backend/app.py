import sys
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR))

app = Flask(__name__)
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": "*"}})


from storage.sqlite_storage import (
    add_task,
    get_tasks,
    update_task_status,
    log_progress,
    log_agent_action,
    load_state,
    save_daily_plan,
    get_daily_plan,
    get_agent_actions
)




app = Flask(__name__)

@app.get("/")
def home():
    return jsonify({"message": "Agentic Academic Guardian API is running"})


# ---------- Health check ----------
@app.get("/health")
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


# ---------- Tasks ----------
@app.get("/tasks")
def tasks_list():
    return jsonify(get_tasks())


@app.post("/tasks")
def tasks_create():
    data = request.get_json(force=True)

    # Minimal required fields
    task = add_task(
        title=data["title"],
        task_type=data.get("type", "exam_topic"),
        due_date=data["due_date"],
        estimated_minutes=int(data.get("estimated_minutes", 60)),
        priority=int(data.get("priority", 3)),
    )

    return jsonify(task), 201


@app.patch("/tasks/<task_id>")
def tasks_update(task_id):
    data = request.get_json(force=True)
    status = data.get("status")
    if not status:
        return jsonify({"error": "status is required"}), 400

    update_task_status(task_id, status)
    return jsonify({"ok": True, "task_id": task_id, "status": status})


# ---------- Progress ----------
@app.post("/progress")
def progress_log_route():
    data = request.get_json(force=True)

    task_id = data["task_id"]
    status = data["status"]
    minutes_spent = int(data.get("minutes_spent", 0))
    reason = data.get("reason")

    log_progress(
        task_id=task_id,
        status=status,
        minutes_spent=minutes_spent,
        reason=reason,
    )

    # Update task status too (so planner excludes done tasks)
    update_task_status(task_id, status if status in ("done", "skipped", "doing") else "todo")

    replanned = None
    if _should_replan_on_progress(status, task_id):
        # For hackathon demo: replan TODAY (or pass date in body if you want)
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        replanned = _replan_for_date(
            today_str,
            reason=f"User {status} task {task_id}. Auto-replanning to protect deadlines."
        )

    return jsonify({"ok": True, "replanned": replanned is not None, "new_plan": replanned})



# ---------- Plans ----------
@app.get("/plan/<date>")
def plan_get(date):
    # date format: YYYY-MM-DD
    return jsonify({"date": date, "items": get_daily_plan(date)})

@app.after_request
def cors_fix(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return resp

@app.post("/plan/<date>")
def plan_save(date):
    data = request.get_json(force=True)
    items = data.get("items", [])
    save_daily_plan(date, items)
    return jsonify({"ok": True, "date": date, "count": len(items)})

@app.post("/agent/plan/<date>")
def agent_plan_route(date):
    return agent_plan(date)

@app.after_request
def add_headers(resp):
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return resp


# ---------- Agent actions (for UI log / demo) ----------
@app.get("/actions")
def actions_get():
    state = load_state()
    return jsonify(get_agent_actions())


from datetime import datetime

def _parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d")

def _sort_tasks_for_today(tasks, today_date):
    def score(t):
        due = _parse_date(t["due_date"])
        days_left = (due - today_date).days
        return (days_left, -int(t["priority"]))
    pending = [t for t in tasks if t["status"] in ("todo", "doing")]
    return sorted(pending, key=score)

def _build_simple_plan(tasks, focus_minutes=240):
    plan = []
    used = 0
    for t in tasks:
        if used >= focus_minutes:
            break
        dur = min(int(t.get("estimated_minutes", 60)), focus_minutes - used)
        plan.append({
            "task_id": t["task_id"],
            "title": t["title"],
            "duration_minutes": dur,
            "note": f"Focus block for {t['type']} (priority {t['priority']})"
        })
        used += dur
    return plan

def _replan_for_date(date, reason):
    """
    Re-generate plan for a date and log it as a REPLAN action.
    """
    today = _parse_date(date)
    tasks = get_tasks()
    ranked = _sort_tasks_for_today(tasks, today)
    plan_items = _build_simple_plan(ranked)
    reason=f"Detected risk: user skipped a task. Strategy changed: prioritize urgent items and compress schedule."


    save_daily_plan(date, plan_items)

    log_agent_action(
        action_type="replan",
        rationale=reason,
        diff=f"Replanned {date}: {len(plan_items)} focus blocks"
    )
    return plan_items


def _should_replan_on_progress(status, task_id):
    """
    Simple trigger rules:
    - If user SKIPS a task => replan
    - If user marks DOING but spends 0 minutes => treat as risk => replan (optional)
    """
    if status == "skipped":
        return True
    return False

@app.post("/agent/plan/<date>")
def agent_plan(date):
    today = _parse_date(date)
    tasks = get_tasks()
    ranked = _sort_tasks_for_today(tasks, today)
    plan_items = _build_simple_plan(ranked)

    save_daily_plan(date, plan_items)

    log_agent_action(
        action_type="suggest",
        rationale=f"Generated plan for {date} using urgency + priority ranking",
        diff=f"Planned {len(plan_items)} focus blocks"
    )

    return jsonify({"date": date, "items": plan_items})

@app.get("/routes")
def routes():
    return jsonify(sorted([str(r) for r in app.url_map.iter_rules()]))


if __name__ == "__main__":
    app.run(debug=True)

from datetime import datetime, timedelta

def _parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d")

def _sort_tasks_for_today(tasks, today_date):
    # sort by (due soon, priority high)
    def score(t):
        due = _parse_date(t["due_date"])
        days_left = (due - today_date).days
        # lower days_left is more urgent; higher priority is better
        return (days_left, -int(t["priority"]))
    # only tasks not done
    pending = [t for t in tasks if t["status"] in ("todo", "doing")]
    return sorted(pending, key=score)

def _build_simple_plan(tasks, start_time="09:00", focus_minutes=240):
    """
    Simple hackathon planner:
    allocate up to `focus_minutes` total for top tasks
    in chunks of each task's estimated_minutes (capped).
    """
    plan = []
    used = 0

    for t in tasks:
        if used >= focus_minutes:
            break

        dur = min(int(t.get("estimated_minutes", 60)), focus_minutes - used)
        plan.append({
            "task_id": t["task_id"],
            "title": t["title"],
            "duration_minutes": dur,
            "note": f"Focus block for {t['type']} (priority {t['priority']})"
        })
        used += dur

    return plan

@app.post("/agent/plan/<date>")
def agent_plan(date):
    """
    Generates a daily plan for the given date (YYYY-MM-DD)
    using rule-based logic (Gemini can replace later).
    """
    today = _parse_date(date)
    tasks = get_tasks()
    ranked = _sort_tasks_for_today(tasks, today)
    plan_items = _build_simple_plan(ranked)

    save_daily_plan(date, plan_items)

    log_agent_action(
        action_type="suggest",
        rationale=f"Generated plan for {date} using urgency + priority ranking",
        diff=f"Planned {len(plan_items)} focus blocks"
    )

    return jsonify({"date": date, "items": plan_items})
