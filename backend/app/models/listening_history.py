from sqlalchemy import Column, DateTime, ForeignKey, Integer, func

from ..database.session import Base


class ListeningHistory(Base):
    __tablename__ = "listening_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False, index=True)
    listened_seconds = Column(Integer, nullable=False, default=0)
    listened_at = Column(DateTime, nullable=False, server_default=func.now())

