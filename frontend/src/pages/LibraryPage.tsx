import { useMusicLibrary } from "../hooks/useMusicLibrary";
import { RetroPanel } from "../components/RetroPanel";

export function LibraryPage() {
  const { albums, songs, playSong } = useMusicLibrary();

  return (
    <div className="grid gap-5">
      <RetroPanel title="Library" subtitle="Browse albums and songs from the scanned local library.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {albums.map((album) => (
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
          ))}
        </div>
      </RetroPanel>

      <RetroPanel title="All Songs" subtitle="Click any row to start playback.">
        <div className="space-y-3">
          {songs.map((song) => (
            <button
              key={song.id}
              type="button"
              onClick={() => playSong(song, songs)}
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
          ))}
        </div>
      </RetroPanel>
    </div>
  );
}