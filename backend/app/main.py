from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.init_db import init_db, seed_default_users
from .database.session import SessionLocal
from .routes import api_router
from .services.library import sync_library


app = FastAPI(title="Loop")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(api_router)


@app.on_event("startup")
def on_startup() -> None:
	init_db()
	with SessionLocal() as db:
		seed_default_users(db)
		sync_library(db)