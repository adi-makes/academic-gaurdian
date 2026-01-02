from fastapi import FastAPI
from routes import tasks, plans, progress, users

app = FastAPI(title="Agentic Student Planner")

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(plans.router)
app.include_router(progress.router)

