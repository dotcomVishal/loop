from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint, func

from ..database.session import Base


class PlaylistSong(Base):
    __tablename__ = "playlist_songs"
    __table_args__ = (
        UniqueConstraint("playlist_id", "song_id", name="uq_playlist_song"),
    )

    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False, index=True)
    position = Column(Integer, nullable=True)
    added_at = Column(DateTime, nullable=False, server_default=func.now())
