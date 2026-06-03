from __future__ import annotations

import mimetypes
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from mutagen import File as MutagenFile
from mutagen.flac import FLAC
from mutagen.id3 import APIC
from mutagen.mp3 import MP3
from mutagen.mp4 import MP4
from sqlalchemy.orm import Session

from ..models import Album, Artist, Song


SUPPORTED_EXTENSIONS = {".mp3", ".flac", ".wav", ".m4a"}
MUSIC_DIR = Path(os.getenv("LOOP_MUSIC_DIR", "/music"))


@dataclass(slots=True)
class ExtractedTrack:
    title: str
    artist_name: str
    album_title: str
    duration_seconds: int | None
    artwork_data: bytes | None
    artwork_mime_type: str | None
    mime_type: str


def _first_text(value: Any) -> str | None:
    if not value:
        return None
    if isinstance(value, (list, tuple)):
        first = value[0]
    else:
        first = value
    text = str(first).strip()
    return text or None


def _guess_mime_type(path: Path) -> str:
    guessed, _ = mimetypes.guess_type(path.name)
    return guessed or {
        ".mp3": "audio/mpeg",
        ".flac": "audio/flac",
        ".wav": "audio/wav",
        ".m4a": "audio/mp4",
    }.get(path.suffix.lower(), "application/octet-stream")


def _extract_mp3_tags(audio: MP3, path: Path) -> ExtractedTrack:
    title = _first_text(audio.tags.get("TIT2")) if audio.tags else None
    artist_name = _first_text(audio.tags.get("TPE1")) if audio.tags else None
    album_title = _first_text(audio.tags.get("TALB")) if audio.tags else None
    apic = audio.tags.getall("APIC")[0] if audio.tags and audio.tags.getall("APIC") else None
    artwork_data = apic.data if isinstance(apic, APIC) else None
    artwork_mime_type = apic.mime if isinstance(apic, APIC) else None

    return ExtractedTrack(
        title=title or path.stem,
        artist_name=artist_name or "Unknown Artist",
        album_title=album_title or "Unknown Album",
        duration_seconds=int(audio.info.length) if audio.info and audio.info.length else None,
        artwork_data=artwork_data,
        artwork_mime_type=artwork_mime_type,
        mime_type=_guess_mime_type(path),
    )


def _extract_flac_tags(audio: FLAC, path: Path) -> ExtractedTrack:
    picture = audio.pictures[0] if audio.pictures else None
    return ExtractedTrack(
        title=_first_text(audio.get("title")) or path.stem,
        artist_name=_first_text(audio.get("artist")) or "Unknown Artist",
        album_title=_first_text(audio.get("album")) or "Unknown Album",
        duration_seconds=int(audio.info.length) if audio.info and audio.info.length else None,
        artwork_data=picture.data if picture else None,
        artwork_mime_type=picture.mime if picture else None,
        mime_type=_guess_mime_type(path),
    )


def _extract_mp4_tags(audio: MP4, path: Path) -> ExtractedTrack:
    cover_data = None
    cover_mime = None
    covr = audio.tags.get("covr") if audio.tags else None
    if covr:
        cover_data = bytes(covr[0])
        cover_mime = "image/jpeg"

    return ExtractedTrack(
        title=_first_text(audio.tags.get("\xa9nam")) if audio.tags else None or path.stem,
        artist_name=_first_text(audio.tags.get("\xa9ART")) if audio.tags else None or "Unknown Artist",
        album_title=_first_text(audio.tags.get("\xa9alb")) if audio.tags else None or "Unknown Album",
        duration_seconds=int(audio.info.length) if audio.info and audio.info.length else None,
        artwork_data=cover_data,
        artwork_mime_type=cover_mime,
        mime_type=_guess_mime_type(path),
    )


def extract_track(path: Path) -> ExtractedTrack:
    audio = MutagenFile(path)
    if isinstance(audio, MP3):
        return _extract_mp3_tags(audio, path)
    if isinstance(audio, FLAC):
        return _extract_flac_tags(audio, path)
    if isinstance(audio, MP4):
        return _extract_mp4_tags(audio, path)

    duration_seconds = None
    if audio is not None and getattr(audio, "info", None) and getattr(audio.info, "length", None):
        duration_seconds = int(audio.info.length)

    return ExtractedTrack(
        title=path.stem,
        artist_name="Unknown Artist",
        album_title="Unknown Album",
        duration_seconds=duration_seconds,
        artwork_data=None,
        artwork_mime_type=None,
        mime_type=_guess_mime_type(path),
    )


def _get_or_create_artist(db: Session, name: str) -> Artist:
    artist = db.query(Artist).filter(Artist.name == name).one_or_none()
    if artist is None:
        artist = Artist(name=name)
        db.add(artist)
        db.flush()
    return artist


def _get_or_create_album(
    db: Session,
    artist: Artist,
    title: str,
    artwork_data: bytes | None,
    artwork_mime_type: str | None,
) -> Album:
    album = (
        db.query(Album)
        .filter(Album.artist_id == artist.id, Album.title == title)
        .one_or_none()
    )
    if album is None:
        album = Album(title=title, artist_id=artist.id)
        db.add(album)
        db.flush()

    if artwork_data and not album.artwork_data:
        album.artwork_data = artwork_data
        album.artwork_mime_type = artwork_mime_type or "image/jpeg"

    return album


def sync_library(db: Session) -> dict[str, int]:
    if not MUSIC_DIR.exists():
        return {"songs": 0, "albums": 0, "artists": 0}

    seen_paths: set[str] = set()

    for path in sorted(MUSIC_DIR.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        resolved_path = str(path.resolve())
        seen_paths.add(resolved_path)
        track = extract_track(path)
        artist = _get_or_create_artist(db, track.artist_name)
        album = _get_or_create_album(db, artist, track.album_title, track.artwork_data, track.artwork_mime_type)

        song = db.query(Song).filter(Song.file_path == resolved_path).one_or_none()
        if song is None:
            song = Song(file_path=resolved_path, mime_type=track.mime_type, title=track.title, artist_id=artist.id)
            db.add(song)

        song.title = track.title
        song.artist_id = artist.id
        song.album_id = album.id
        song.duration_seconds = track.duration_seconds
        song.mime_type = track.mime_type

    if seen_paths:
        stale_songs = db.query(Song).filter(~Song.file_path.in_(seen_paths)).all()
        for stale_song in stale_songs:
            db.delete(stale_song)

    db.commit()

    return {
        "songs": db.query(Song).count(),
        "albums": db.query(Album).count(),
        "artists": db.query(Artist).count(),
    }
