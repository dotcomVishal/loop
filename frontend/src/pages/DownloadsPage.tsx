import { RetroPanel } from "../components/RetroPanel";

export function DownloadsPage() {
  return (
    <div className="grid gap-5">
      <RetroPanel title="Downloads" subtitle="Songs cached for offline playback.">
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-400">
          No songs downloaded yet. Offline support is coming soon.
        </div>
      </RetroPanel>
    </div>
  );
}