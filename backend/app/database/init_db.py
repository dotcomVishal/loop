from sqlalchemy.orm import Session

from ..models import User
from .session import Base, engine


DEFAULT_USERS = ("User 1", "User 2")


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def seed_default_users(db: Session) -> None:
    existing_names = {user.name for user in db.query(User).all()}
    changed = False

    for name in DEFAULT_USERS:
        if name not in existing_names:
            db.add(User(name=name))
            changed = True

    if changed:
        db.commit()
