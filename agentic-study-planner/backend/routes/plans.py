from fastapi import APIRouter
from datetime import date
from planner import generate_daily_plan

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.post("/{plan_date}")
def create_plan(plan_date: date):
    return generate_daily_plan(plan_date)


@router.get("/{plan_date}")
def get_plan(plan_date: str):
    return {"date": plan_date, "plan": []}
