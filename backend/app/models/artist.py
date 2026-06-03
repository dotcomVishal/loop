from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database.session import Base


class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    albums = relationship("Album", back_populates="artist")
    songs = relationship("Song", back_populates="artist")
