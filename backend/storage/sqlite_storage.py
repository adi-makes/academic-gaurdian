import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
import json

DB_PATH = Path(__file__).parent / "state.db"


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = _connect()
    cur = conn.cursor()

    # Tasks
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        task_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        due_date TEXT NOT NULL,              -- YYYY-MM-DD
        estimated_minutes INTEGER NOT NULL,
        priority INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)

    # Daily plans
    cur.execute("""
    CREATE TABLE IF NOT EXISTS daily_plans (
        date TEXT PRIMARY KEY               -- YYYY-MM-DD
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS plan_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        task_id TEXT,
        title TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY(date) REFERENCES daily_plans(date)
    )
    """)

    # Progress logs
    cur.execute("""
    CREATE TABLE IF NOT EXISTS progress_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id TEXT NOT NULL,
        status TEXT NOT NULL,
        minutes_spent INTEGER NOT NULL,
        reason TEXT,
        logged_at TEXT NOT NULL
    )
    """)

    # Agent actions
    cur.execute("""
    CREATE TABLE IF NOT EXISTS agent_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        action_type TEXT NOT NULL,
        rationale TEXT NOT NULL,
        diff TEXT
    )
    """)

    conn.commit()
    conn.close()


# Call init on import (hackathon-safe)
init_db()


# ---------- TASKS ----------

def add_task(title, task_type, due_date, estimated_minutes, priority):
    conn = _connect()
    cur = conn.cursor()

    task_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    status = "todo"

    cur.execute("""
    INSERT INTO tasks(task_id, title, type, due_date, estimated_minutes, priority, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (task_id, title, task_type, due_date, int(estimated_minutes), int(priority), status, created_at))

    conn.commit()
    conn.close()

    return {
        "task_id": task_id,
        "title": title,
        "type": task_type,
        "due_date": due_date,
        "estimated_minutes": int(estimated_minutes),
        "priority": int(priority),
        "status": status,
        "created_at": created_at
    }


def update_task_status(task_id, status):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("UPDATE tasks SET status=? WHERE task_id=?", (status, task_id))
    conn.commit()
    conn.close()


def get_tasks():
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tasks")
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ---------- DAILY PLAN ----------

def save_daily_plan(date, plan_items):
    """
    plan_items format:
    [{task_id, title, duration_minutes, note}, ...]
    """
    conn = _connect()
    cur = conn.cursor()

    # Upsert date
    cur.execute("INSERT OR IGNORE INTO daily_plans(date) VALUES (?)", (date,))

    # Replace items for that date
    cur.execute("DELETE FROM plan_items WHERE date=?", (date,))

    for item in plan_items:
        cur.execute("""
        INSERT INTO plan_items(date, task_id, title, duration_minutes, note)
        VALUES (?, ?, ?, ?, ?)
        """, (
            date,
            item.get("task_id"),
            item.get("title", ""),
            int(item.get("duration_minutes", 60)),
            item.get("note")
        ))

    conn.commit()
    conn.close()


def get_daily_plan(date):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT task_id, title, duration_minutes, note FROM plan_items WHERE date=? ORDER BY id ASC", (date,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ---------- PROGRESS ----------

def log_progress(task_id, status, minutes_spent, reason=None):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO progress_logs(task_id, status, minutes_spent, reason, logged_at)
    VALUES (?, ?, ?, ?, ?)
    """, (task_id, status, int(minutes_spent), reason, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()


# ---------- AGENT ACTIONS ----------

def log_agent_action(action_type, rationale, diff=None):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO agent_actions(timestamp, action_type, rationale, diff)
    VALUES (?, ?, ?, ?)
    """, (datetime.utcnow().isoformat(), action_type, rationale, diff))
    conn.commit()
    conn.close()


# ---------- Optional: compact "state" read for /actions or debugging ----------
def load_state():
    """
    Keeps compatibility with your backend usage:
    returns dict containing tasks + actions (minimum).
    """
    return {
        "tasks": get_tasks(),
        "agent_actions": get_agent_actions()
    }


def get_agent_actions(limit=200):
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT timestamp, action_type, rationale, diff FROM agent_actions ORDER BY id DESC LIMIT ?", (limit,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]
