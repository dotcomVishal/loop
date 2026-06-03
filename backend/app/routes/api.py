from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models import Album, Artist, Like, ListeningHistory, Playlist, PlaylistSong, Song, User
from ..schemas import (
    AlbumUpdate,
    ArtistCreate,
    ArtistRead,
    ArtistUpdate,
    LikeCreate,
    LikeRead,
    LikeUpdate,
    ListeningHistoryCreate,
    ListeningHistoryRead,
    ListeningHistoryUpdate,
    PlaylistCreate,
    PlaylistRead,
    PlaylistSongCreate,
    PlaylistSongRead,
    PlaylistSongUpdate,
    PlaylistUpdate,
    AlbumLibraryRead,
    LibrarySyncRead,
    SongLibraryRead,
    SongUpdate,
    UserCreate,
    UserRead,
    UserUpdate,
)
from ..services import CRUDService, UserService
from ..services.library import sync_library


def build_router(
    prefix: str,
    tags: list[str],
    service: CRUDService,
    create_schema,
    read_schema,
    update_schema,
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=tags)

    @router.get("/", response_model=list[read_schema])
    def list_items(db: Session = Depends(get_db)):
        return service.list(db)

    @router.post("/", response_model=read_schema, status_code=status.HTTP_201_CREATED)
    def create_item(payload: create_schema, db: Session = Depends(get_db)):
        return service.create(db, payload)

    @router.get("/{item_id}", response_model=read_schema)
    def get_item(item_id: int, db: Session = Depends(get_db)):
        item = service.get(db, item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        return item

    @router.patch("/{item_id}", response_model=read_schema)
    def update_item(item_id: int, payload: update_schema, db: Session = Depends(get_db)):
        item = service.get(db, item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        return service.update(db, item, payload)

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: int, db: Session = Depends(get_db)):
        item = service.get(db, item_id)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        service.delete(db, item)

    return router


api_router = APIRouter(prefix="/api")

api_router.add_api_route(
    "/health",
    lambda: {"status": "ok"},
    methods=["GET"],
    tags=["health"],
)


def _song_stream_url(song_id: int) -> str:
    return f"/api/songs/{song_id}/stream"


def _album_artwork_url(album_id: int) -> str:
    return f"/api/albums/{album_id}/artwork"


def serialize_song(song: Song) -> dict[str, object]:
    return {
        "id": song.id,
        "title": song.title,
        "artist_name": song.artist.name if song.artist else "Unknown Artist",
        "album_name": song.album.title if song.album else None,
        "duration_seconds": song.duration_seconds,
        "file_path": song.file_path,
        "stream_url": _song_stream_url(song.id),
        "artwork_url": _album_artwork_url(song.album_id) if song.album and song.album.artwork_data else None,
    }


def serialize_album(album: Album) -> dict[str, object]:
    return {
        "id": album.id,
        "title": album.title,
        "artist_name": album.artist.name if album.artist else "Unknown Artist",
        "song_count": len(album.songs) if album.songs is not None else 0,
        "artwork_url": _album_artwork_url(album.id) if album.artwork_data else None,
    }


def _serve_file_range(request: Request, file_path: Path, media_type: str):
    range_header = request.headers.get("range")
    if not range_header:
        return FileResponse(file_path, media_type=media_type)

    file_size = file_path.stat().st_size
    start_text, _, end_text = range_header.removeprefix("bytes=").partition("-")
    start = int(start_text) if start_text else 0
    end = int(end_text) if end_text else file_size - 1
    end = min(end, file_size - 1)
    length = end - start + 1

    def iterator():
        with file_path.open("rb") as file_handle:
            file_handle.seek(start)
            remaining = length
            while remaining > 0:
                chunk = file_handle.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                remaining -= len(chunk)
                yield chunk

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(length),
    }
    return StreamingResponse(iterator(), status_code=206, media_type=media_type, headers=headers)


@api_router.post("/library/rescan", response_model=LibrarySyncRead, tags=["library"])
def rescan_library(db: Session = Depends(get_db)):
    return sync_library(db)


@api_router.get("/songs", response_model=list[SongLibraryRead], tags=["songs"])
def list_songs(db: Session = Depends(get_db)):
    songs = (
        db.query(Song)
        .join(Song.artist)
        .outerjoin(Song.album)
        .order_by(Artist.name, Album.title, Song.title)
        .all()
    )
    return [serialize_song(song) for song in songs]


@api_router.get("/songs/{song_id}", response_model=SongLibraryRead, tags=["songs"])
def get_song(song_id: int, db: Session = Depends(get_db)):
    song = (
        db.query(Song)
        .join(Song.artist)
        .outerjoin(Song.album)
        .filter(Song.id == song_id)
        .one_or_none()
    )
    if song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")
    return serialize_song(song)


@api_router.get("/songs/{song_id}/stream", tags=["songs"])
def stream_song(song_id: int, request: Request, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).one_or_none()
    if song is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Song not found")

    file_path = Path(song.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio file not found")

    return _serve_file_range(request, file_path, song.mime_type)


@api_router.get("/albums", response_model=list[AlbumLibraryRead], tags=["albums"])
def list_albums(db: Session = Depends(get_db)):
    albums = db.query(Album).join(Album.artist).order_by(Artist.name, Album.title).all()
    return [serialize_album(album) for album in albums]


@api_router.get("/albums/{album_id}", response_model=AlbumLibraryRead, tags=["albums"])
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).join(Album.artist).filter(Album.id == album_id).one_or_none()
    if album is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    return serialize_album(album)


@api_router.get("/albums/{album_id}/songs", response_model=list[SongLibraryRead], tags=["albums"])
def list_album_songs(album_id: int, db: Session = Depends(get_db)):
    songs = (
        db.query(Song)
        .join(Song.artist)
        .outerjoin(Song.album)
        .filter(Song.album_id == album_id)
        .order_by(Song.title)
        .all()
    )
    return [serialize_song(song) for song in songs]


@api_router.get("/albums/{album_id}/artwork", tags=["albums"])
def get_album_artwork(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).one_or_none()
    if album is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Album not found")
    if not album.artwork_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artwork not found")
    return Response(content=album.artwork_data, media_type=album.artwork_mime_type or "image/jpeg")

api_router.include_router(
    build_router(
        "/users",
        ["users"],
        UserService(User),
        UserCreate,
        UserRead,
        UserUpdate,
    )
)
api_router.include_router(
    build_router(
        "/artists",
        ["artists"],
        CRUDService(Artist),
        ArtistCreate,
        ArtistRead,
        ArtistUpdate,
    )
)
api_router.include_router(
    build_router(
        "/listening-history",
        ["listening-history"],
        CRUDService(ListeningHistory),
        ListeningHistoryCreate,
        ListeningHistoryRead,
        ListeningHistoryUpdate,
    )
)
api_router.include_router(
    build_router(
        "/likes",
        ["likes"],
        CRUDService(Like),
        LikeCreate,
        LikeRead,
        LikeUpdate,
    )
)
api_router.include_router(
    build_router(
        "/playlists",
        ["playlists"],
        CRUDService(Playlist),
        PlaylistCreate,
        PlaylistRead,
        PlaylistUpdate,
    )
)
api_router.include_router(
    build_router(
        "/playlist-songs",
        ["playlist-songs"],
        CRUDService(PlaylistSong),
        PlaylistSongCreate,
        PlaylistSongRead,
        PlaylistSongUpdate,
    )
)
