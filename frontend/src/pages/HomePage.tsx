import { useMusicLibrary } from "../hooks/useMusicLibrary";
import { RetroPanel } from "../components/RetroPanel";
import { SectionLabel } from "../components/SectionLabel";

export function HomePage() {
  const { albums, songs, loading, playSong } = useMusicLibrary();
  const featuredAlbums = albums.slice(0, 3);
  const recentSongs = songs.slice(0, 6);

  return (
    <div className="grid gap-5">
      <RetroPanel title="Welcome back" subtitle="Loop is now connected to the local music library.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <SectionLabel>Library</SectionLabel>
            <div className="mt-3 font-bold text-lg text-white">{songs.length} tracks</div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Recursive scan from the local /music directory.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <SectionLabel>Albums</SectionLabel>
            <div className="mt-3 font-bold text-lg text-white">{albums.length} albums</div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Artwork is shown whenever embedded art is available.</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <SectionLabel>Playback</SectionLabel>
            <div className="mt-3 font-bold text-lg text-white">Ready</div>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Use the player bar to control play, seek, and queue state.</p>
          </div>
        </div>
      </RetroPanel>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <RetroPanel title="Featured albums" subtitle="Tap an album cover to preview its track list later.">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400">Loading music library...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {featuredAlbums.length > 0 ? (
                featuredAlbums.map((album) => (
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
                <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400 md:col-span-3">
                  No albums found. Put audio files in the music directory and restart the backend scan.
                </div>
              )}
            </div>
          )}
        </RetroPanel>

        <RetroPanel title="Activity" subtitle="A compact view for your recent plays.">
          <div className="space-y-3">
            {recentSongs.length > 0 ? (
              recentSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => playSong(song, songs)}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-left transition hover:border-purple-500"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-zinc-800 bg-black">
                    {song.artwork_url ? (
                      <img src={song.artwork_url} alt={song.title} className="h-full w-full object-cover" />
                    ) : null}
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
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
                No tracks scanned yet.
              </div>
            )}
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}