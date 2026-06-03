from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database.session import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False, unique=True, index=True)
    mime_type = Column(String, nullable=False)
    title = Column(String, nullable=False, index=True)
    artist_id = Column(Integer, ForeignKey("artists.id"), nullable=False, index=True)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True, index=True)
    duration_seconds = Column(Integer, nullable=True)

    artist = relationship("Artist", back_populates="songs")
    album = relationship("Album", back_populates="songs")
