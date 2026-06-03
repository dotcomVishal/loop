import { formatDuration, useMusicLibrary } from "../hooks/useMusicLibrary";

export function PlayerBar() {
  const {
    currentSong,
    currentTime,
    duration,
    isPlaying,
    next,
    pause,
    playSong,
    previous,
    queue,
    queueIndex,
    seek,
    songs,
    togglePlay,
    volume,
    setVolume
  } = useMusicLibrary();

  const nextTrack = queueIndex >= 0 ? queue[queueIndex + 1] : null;

  return (
    <section className="fixed inset-x-2 bottom-20 z-50 rounded-3xl border border-[#6d52a8]/40 bg-[#100d18]/95 px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.7),0_0_30px_rgba(173,122,255,0.18)] backdrop-blur md:bottom-6 md:left-[19rem] md:right-6">
      <div className="grid gap-4 md:grid-cols-[auto,1fr,auto] md:items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-[#6d52a8]/40 bg-[#1a1527]">
            {currentSong?.artwork_url ? (
              <img src={currentSong.artwork_url} alt={currentSong.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,_rgba(184,148,255,0.15),_rgba(0,0,0,0.35))] text-[10px] uppercase tracking-[0.35em] text-[#caa8ff]">
                LP
              </div>
            )}
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-[#b894ff]">Now Playing</div>
            <div className="mt-1 text-sm text-white">{currentSong?.title ?? "No track selected"}</div>
            <div className="mt-1 text-xs text-[#ccbce6]">
              {currentSong ? `${currentSong.artist_name}${currentSong.album_name ? ` • ${currentSong.album_name}` : ""}` : "Pick a song to start the queue"}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || currentTime)}
            onChange={(event) => seek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#251a37] accent-[#c59cff]"
          />

          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-[#a884db]">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              className="rounded-xl border border-[#6d52a8]/40 bg-[#1b1428] px-3 py-2 text-xs uppercase tracking-[0.3em] text-white"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-xl border border-[#b894ff]/60 bg-[#27163f] px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-xl border border-[#6d52a8]/40 bg-[#1b1428] px-3 py-2 text-xs uppercase tracking-[0.3em] text-white"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#d1c4ea]">
            <span>Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-2 w-32 cursor-pointer appearance-none rounded-full bg-[#251a37] accent-[#c59cff]"
            />
          </div>

          <div className="text-[11px] uppercase tracking-[0.3em] text-[#a884db]">
            Queue {queue.length > 0 ? `${queueIndex + 1}/${queue.length}` : "empty"}
            {nextTrack ? ` • Next: ${nextTrack.title}` : ""}
          </div>
        </div>
      </div>

      {currentSong ? (
        <div className="mt-3 flex items-center justify-between border-t border-[#6d52a8]/20 pt-3 text-[11px] uppercase tracking-[0.3em] text-[#9079bf]">
          <button
            type="button"
            onClick={() => playSong(currentSong, queue.length > 0 ? queue : songs)}
            className="text-left"
          >
            Restart current track
          </button>
          <button type="button" onClick={pause} className="text-right">
            Stop
          </button>
        </div>
      ) : null}
    </section>
  );
}
