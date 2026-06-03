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
          <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-4">
            <SectionLabel>Library</SectionLabel>
            <div className="mt-3 font-['Press_Start_2P',monospace] text-sm text-white">{songs.length} tracks</div>
            <p className="mt-3 text-sm leading-6 text-[#d1c5e8]">Recursive scan from the local /music directory.</p>
          </div>
          <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-4">
            <SectionLabel>Albums</SectionLabel>
            <div className="mt-3 font-['Press_Start_2P',monospace] text-sm text-white">{albums.length} albums</div>
            <p className="mt-3 text-sm leading-6 text-[#d1c5e8]">Artwork is shown whenever embedded art is available.</p>
          </div>
          <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-4">
            <SectionLabel>Playback</SectionLabel>
            <div className="mt-3 font-['Press_Start_2P',monospace] text-sm text-white">Ready</div>
            <p className="mt-3 text-sm leading-6 text-[#d1c5e8]">Use the player bar to control play, seek, and queue state.</p>
          </div>
        </div>
      </RetroPanel>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <RetroPanel title="Featured albums" subtitle="Tap an album cover to preview its track list later.">
          {loading ? (
            <div className="rounded-2xl border border-dashed border-[#6f548e] bg-[#0f0c16] p-6 text-sm text-[#d6caeb]">Loading music library...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {featuredAlbums.length > 0 ? (
                featuredAlbums.map((album) => (
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
                <div className="rounded-2xl border border-dashed border-[#6f548e] bg-[#0f0c16] p-6 text-sm text-[#d6caeb] md:col-span-3">
                  No albums found. Put audio files in the music directory and restart the backend scan.
                </div>
              )}
            </div>
          )}
        </RetroPanel>

        <RetroPanel title="Activity" subtitle="A compact view for the two-person setup.">
          <div className="space-y-3">
            {recentSongs.length > 0 ? (
              recentSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => playSong(song, songs)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#5d477f] bg-[#0f0c16] px-3 py-3 text-left transition hover:border-[#b894ff]"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-xl border border-[#5d477f] bg-[#1b1428]">
                    {song.artwork_url ? (
                      <img src={song.artwork_url} alt={song.title} className="h-full w-full object-cover" />
                    ) : null}
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
              <div className="rounded-xl border border-[#5d477f] bg-[#0f0c16] px-4 py-3 text-sm text-[#d1c5e8]">
                No tracks scanned yet.
              </div>
            )}
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}