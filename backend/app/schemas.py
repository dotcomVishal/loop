from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    name: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: str | None = None


class UserRead(ORMBaseModel, UserBase):
    id: int


class ArtistBase(BaseModel):
    name: str


class ArtistCreate(ArtistBase):
    pass


class ArtistUpdate(BaseModel):
    name: str | None = None


class ArtistRead(ORMBaseModel, ArtistBase):
    id: int


class AlbumBase(BaseModel):
    title: str
    artist_id: int


class AlbumCreate(AlbumBase):
    pass


class AlbumUpdate(BaseModel):
    title: str | None = None
    artist_id: int | None = None


class AlbumRead(ORMBaseModel, AlbumBase):
    id: int
    artwork_url: str | None = None
    song_count: int = 0
    artist_name: str | None = None


class AlbumLibraryRead(ORMBaseModel):
    id: int
    title: str
    artist_name: str
    song_count: int
    artwork_url: str | None = None


class SongBase(BaseModel):
    file_path: str
    mime_type: str
    title: str
    artist_id: int
    album_id: int | None = None
    duration_seconds: int | None = None


class SongCreate(SongBase):
    pass


class SongUpdate(BaseModel):
    title: str | None = None
    artist_id: int | None = None
    album_id: int | None = None
    duration_seconds: int | None = None


class SongRead(ORMBaseModel, SongBase):
    id: int
    stream_url: str | None = None
    artwork_url: str | None = None
    artist_name: str | None = None
    album_title: str | None = None


class SongLibraryRead(ORMBaseModel):
    id: int
    title: str
    artist_name: str
    album_name: str | None = None
    duration_seconds: int | None = None
    file_path: str
    stream_url: str
    artwork_url: str | None = None


class LibrarySyncRead(BaseModel):
    songs: int
    albums: int
    artists: int


class ListeningHistoryBase(BaseModel):
    user_id: int
    song_id: int
    listened_at: datetime | None = None


class ListeningHistoryCreate(ListeningHistoryBase):
    pass


class ListeningHistoryUpdate(BaseModel):
    user_id: int | None = None
    song_id: int | None = None
    listened_at: datetime | None = None


class ListeningHistoryRead(ORMBaseModel, ListeningHistoryBase):
    id: int


class LikeBase(BaseModel):
    user_id: int
    song_id: int


class LikeCreate(LikeBase):
    pass


class LikeUpdate(BaseModel):
    user_id: int | None = None
    song_id: int | None = None


class LikeRead(ORMBaseModel, LikeBase):
    id: int
    created_at: datetime


class PlaylistBase(BaseModel):
    user_id: int
    name: str


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistUpdate(BaseModel):
    user_id: int | None = None
    name: str | None = None


class PlaylistRead(ORMBaseModel, PlaylistBase):
    id: int
    created_at: datetime


class PlaylistSongBase(BaseModel):
    playlist_id: int
    song_id: int
    position: int | None = None


class PlaylistSongCreate(PlaylistSongBase):
    pass


class PlaylistSongUpdate(BaseModel):
    playlist_id: int | None = None
    song_id: int | None = None
    position: int | None = None


class PlaylistSongRead(ORMBaseModel, PlaylistSongBase):
    id: int
    added_at: datetime
