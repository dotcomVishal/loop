import { useMemo, useState } from "react";

import { RetroPanel } from "../components/RetroPanel";
import { useMusicLibrary } from "../hooks/useMusicLibrary";

export function SearchPage() {
  const { albums, songs, playSong } = useMusicLibrary();
  const [query, setQuery] = useState("");

  const filteredSongs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return songs;
    }

    return songs.filter((song) => {
      const haystack = `${song.title} ${song.artist_name} ${song.album_name ?? ""}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, songs]);

  const filteredAlbums = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return albums;
    }

    return albums.filter((album) => `${album.title} ${album.artist_name}`.toLowerCase().includes(normalized));
  }, [albums, query]);

  return (
    <div className="grid gap-5">
      <RetroPanel title="Search the vault" subtitle="A simple search surface for later data wiring.">
        <div className="rounded-2xl border border-[#5d477f] bg-black/30 p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search songs, artists, albums..."
            className="h-12 w-full rounded-xl border border-[#7d66a6] bg-[#0f0c16] px-4 text-sm text-[#f0eaff] outline-none placeholder:text-[#8f7aa8] focus:border-[#c59cff]"
          />
        </div>
      </RetroPanel>

      <div className="grid gap-5 md:grid-cols-2">
        <RetroPanel title="Albums" subtitle="Artwork appears here whenever embedded art exists.">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <div key={album.id} className="overflow-hidden rounded-2xl border border-[#5d477f] bg-[#0f0c16]">
                  <div className="aspect-square bg-[#1b1428]">
                    {album.artwork_url ? (
                      <img src={album.artwork_url} alt={album.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_rgba(184,148,255,0.12),_rgba(0,0,0,0.45))] text-[11px] uppercase tracking-[0.35em] text-[#caa8ff]">
                        No art
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-[#ac8ce0]">{album.artist_name}</div>
                    <div className="mt-2 font-['Press_Start_2P',monospace] text-xs text-white">{album.title}</div>
                    <div className="mt-3 text-sm text-[#ccbce6]">{album.song_count} tracks</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#6f548e] bg-[#0f0c16] p-6 text-sm text-[#d6caeb] sm:col-span-2">No albums match this search.</div>
            )}
          </div>
        </RetroPanel>

        <RetroPanel title="Songs" subtitle="Click a song to load it into the queue and start playback.">
          <div className="space-y-3">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => playSong(song, filteredSongs)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#5d477f] bg-[#0f0c16] px-3 py-3 text-left transition hover:border-[#b894ff]"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-[#5d477f] bg-[#1b1428]">
                    {song.artwork_url ? <img src={song.artwork_url} alt={song.title} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-white">{song.title}</div>
                    <div className="truncate text-xs uppercase tracking-[0.3em] text-[#ab8de0]">
                      {song.artist_name}{song.album_name ? ` • ${song.album_name}` : ""}
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-[#ab8de0]">Play</div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#6f548e] bg-[#0f0c16] p-6 text-sm text-[#d6caeb]">No songs match this search.</div>
            )}
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}