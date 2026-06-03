from sqlalchemy.orm import Session
from sqlalchemy import text

from ..models import User
from .session import Base, engine


DEFAULT_USERS = ("vishal", "payal")


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_schema_updates()


def _ensure_schema_updates() -> None:
    with engine.begin() as connection:
        columns = {row[1] for row in connection.exec_driver_sql("PRAGMA table_info(listening_history)").fetchall()}
        if "listened_seconds" not in columns and columns:
            connection.execute(text("ALTER TABLE listening_history ADD COLUMN listened_seconds INTEGER NOT NULL DEFAULT 0"))
            
        user_columns = {row[1] for row in connection.exec_driver_sql("PRAGMA table_info(users)").fetchall()}
        if "password_hash" not in user_columns and user_columns:
            import hashlib
            default_hash = hashlib.sha256(b"password123").hexdigest()
            connection.execute(text(f"ALTER TABLE users ADD COLUMN password_hash VARCHAR NOT NULL DEFAULT '{default_hash}'"))


import hashlib

def seed_default_users(db: Session) -> None:
    existing_names = {user.name for user in db.query(User).all()}
    changed = False

    default_password = "password123"
    hashed_password = hashlib.sha256(default_password.encode()).hexdigest()

    for name in DEFAULT_USERS:
        if name not in existing_names:
            db.add(User(name=name, password_hash=hashed_password))
            changed = True

    if changed:
        db.commit()
