import { RetroPanel } from "../components/RetroPanel";

export function LikedSongsPage() {
  return (
    <div className="grid gap-5">
      <RetroPanel title="Liked Songs" subtitle="Your favorite tracks from the library.">
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400">
          This feature is coming soon. You haven't liked any songs yet.
        </div>
      </RetroPanel>
    </div>
  );
}