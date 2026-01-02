from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, date


class Preferences(BaseModel):
    hours_per_day: int
    sleep_start: str
    sleep_end: str


class User(BaseModel):
    user_id: str
    name: str
    preferences: Preferences


class Task(BaseModel):
    task_id: str
    title: str
    type: str
    due_date: date
    estimated_minutes: int
    priority: int
    status: str
    created_at: datetime


class DailyPlanItem(BaseModel):
    task_id: str
    title: str
    duration_minutes: int
    note: str


class ProgressLog(BaseModel):
    task_id: str
    status: str
    minutes_spent: int
    date: datetime
    reason: Optional[str] = None


class AgentAction(BaseModel):
    timestamp: datetime
    action_type: str
    rationale: str
    diff: str
