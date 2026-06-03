import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Song = {
  id: number;
  title: string;
  artist_name: string;
  album_name: string | null;
  duration_seconds: number | null;
  file_path: string;
  stream_url: string;
  artwork_url: string | null;
};

export type Album = {
  id: number;
  title: string;
  artist_name: string;
  song_count: number;
  artwork_url: string | null;
};

type MusicContextValue = {
  songs: Song[];
  albums: Album[];
  loading: boolean;
  refreshLibrary: () => Promise<void>;
  queue: Song[];
  queueIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) {
    return "--:--";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const currentSong = queueIndex >= 0 ? queue[queueIndex] ?? null : null;

  const refreshLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const [songsResponse, albumsResponse] = await Promise.all([
        fetch("/api/songs"),
        fetch("/api/albums")
      ]);

      const [songsData, albumsData] = await Promise.all([songsResponse.json(), albumsResponse.json()]);
      setSongs(Array.isArray(songsData) ? songsData : []);
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
      setQueue((existingQueue) => (existingQueue.length > 0 ? existingQueue : Array.isArray(songsData) ? songsData : []));
      setQueueIndex((currentIndex) => (currentIndex >= 0 ? currentIndex : (Array.isArray(songsData) && songsData.length > 0 ? 0 : -1)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (queue.length > 0 && queueIndex < queue.length - 1) {
        setQueueIndex((index) => index + 1);
        setIsPlaying(true);
        return;
      }

      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [queue.length, queueIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!currentSong) {
      audio.removeAttribute("src");
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    audio.src = currentSong.stream_url;
    audio.load();

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying && currentSong) {
      void audio.play().catch(() => setIsPlaying(false));
      return;
    }

    audio.pause();
  }, [currentSong, isPlaying]);

  const playSong = useCallback(
    (song: Song, nextQueue: Song[] = songs) => {
      const resolvedQueue = nextQueue.length > 0 ? nextQueue : [song];
      const index = resolvedQueue.findIndex((item) => item.id === song.id);
      setQueue(resolvedQueue);
      setQueueIndex(index >= 0 ? index : 0);
      setIsPlaying(true);
    },
    [songs]
  );

  const togglePlay = useCallback(() => {
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0], songs);
      }
      return;
    }

    setIsPlaying((playing) => !playing);
  }, [currentSong, playSong, songs]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const next = useCallback(() => {
    if (queueIndex < queue.length - 1) {
      setQueueIndex((index) => index + 1);
      setIsPlaying(true);
    }
  }, [queue.length, queueIndex]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (queueIndex > 0) {
      setQueueIndex((index) => index - 1);
      setIsPlaying(true);
    }
  }, [queueIndex]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    setVolumeState(clamped);
  }, []);

  const value = useMemo<MusicContextValue>(
    () => ({
      songs,
      albums,
      loading,
      refreshLibrary,
      queue,
      queueIndex,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      playSong,
      togglePlay,
      pause,
      next,
      previous,
      seek,
      setVolume
    }),
    [
      albums,
      currentSong,
      currentTime,
      duration,
      isPlaying,
      loading,
      next,
      pause,
      playSong,
      previous,
      queue,
      queueIndex,
      refreshLibrary,
      seek,
      setVolume,
      songs,
      togglePlay,
      volume
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" aria-hidden="true" className="hidden" />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicLibrary() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusicLibrary must be used inside MusicProvider");
  }
  return context;
}
