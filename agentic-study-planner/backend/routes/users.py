from fastapi import APIRouter, HTTPException
from database import db

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/")
def create_user(
    user_id: str,
    name: str,
    hours_per_day: int,
    sleep_start: str,
    sleep_end: str
):
    # Prevent duplicates
    if any(u["user_id"] == user_id for u in db["users"]):
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "user_id": user_id,
        "name": name,
        "preferences": {
            "hours_per_day": hours_per_day,
            "sleep_start": sleep_start,
            "sleep_end": sleep_end
        }
    }

    db["users"].append(user)
    return user


@router.get("/")
def list_users():
    return db["users"]


@router.get("/{user_id}")
def get_user(user_id: str):
    for user in db["users"]:
        if user["user_id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")
