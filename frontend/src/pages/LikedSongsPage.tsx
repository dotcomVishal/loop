import { RetroPanel } from "../components/RetroPanel";

export function LikedSongsPage() {
  return (
    <RetroPanel title="Liked Songs" subtitle="A dedicated view for the tracks you mark as favorites.">
      <div className="rounded-2xl border border-dashed border-[#6f548e] bg-[#0f0c16] p-6 text-sm leading-6 text-[#d6caeb]">
        Liked songs are not wired yet. The playback queue is live, and this page will become the favorites view next.
      </div>
    </RetroPanel>
  );
}