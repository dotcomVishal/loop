import { useState } from "react";
import { useMusicLibrary } from "../hooks/useMusicLibrary";
import { RetroPanel } from "../components/RetroPanel";

export function SearchPage() {
  const { albums, songs, playSong } = useMusicLibrary();
  const [query, setQuery] = useState("");

  const lowerQuery = query.toLowerCase();
  const filteredAlbums = query.length > 1 ? albums.filter(
    (a) => a.title.toLowerCase().includes(lowerQuery) || a.artist_name.toLowerCase().includes(lowerQuery)
  ) : [];
  
  const filteredSongs = query.length > 1 ? songs.filter(
    (s) => s.title.toLowerCase().includes(lowerQuery) || s.artist_name.toLowerCase().includes(lowerQuery)
  ) : [];

  return (
    <div className="grid gap-5">
      <RetroPanel title="Search" subtitle="Find songs or albums in your library.">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search songs, artists, albums..."
            className="h-12 w-full rounded-xl border border-zinc-700 bg-black px-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-purple-500 transition-colors"
          />
        </div>
      </RetroPanel>

      <div className="grid gap-5 md:grid-cols-2">
        <RetroPanel title="Albums" subtitle="Artwork appears here whenever embedded art exists.">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredAlbums.length > 0 ? (
               filteredAlbums.map((album) => (
                <div key={album.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                  <div className="aspect-square bg-black">
                    {album.artwork_url ? (
                      <img src={album.artwork_url} alt={album.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-zinc-600">
                        No art
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-widest font-bold text-purple-500">{album.artist_name}</div>
                    <div className="mt-2 text-sm font-bold text-white">{album.title}</div>
                    <div className="mt-2 text-sm text-zinc-400">{album.song_count} tracks</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400 sm:col-span-2">No albums match this search.</div>
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
                  className="flex w-full items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-left transition hover:border-purple-500"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-zinc-800 bg-black">
                    {song.artwork_url ? <img src={song.artwork_url} alt={song.title} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-white">{song.title}</div>
                    <div className="truncate text-xs text-zinc-400 mt-1">
                      {song.artist_name}{song.album_name ? ` • ${song.album_name}` : ""}
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-wider font-bold text-purple-500">Play</div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400">No songs match this search.</div>
            )}
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}