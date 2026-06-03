from sqlalchemy import Column, ForeignKey, Integer, LargeBinary, String, UniqueConstraint
from sqlalchemy.orm import relationship

from ..database.session import Base


class Album(Base):
    __tablename__ = "albums"
    __table_args__ = (UniqueConstraint("artist_id", "title", name="uq_album_artist_title"),)

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    artist_id = Column(Integer, ForeignKey("artists.id"), nullable=False, index=True)
    artwork_data = Column(LargeBinary, nullable=True)
    artwork_mime_type = Column(String, nullable=True)

    artist = relationship("Artist", back_populates="albums")
    songs = relationship("Song", back_populates="album")
