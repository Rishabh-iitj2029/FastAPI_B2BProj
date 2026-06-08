from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine,Base
from app.api import task, webhook


Base.metadata.create_all(bind = engine)

app = FastAPI(
    title="taskboard API",
    description="api for CRUD ops in tasks DB",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials= True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(task.router)
app.include_router(webhook.router)

