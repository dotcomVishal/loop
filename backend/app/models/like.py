from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func

from ..database.session import Base


class Like(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "song_id", name="uq_like_user_song"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
