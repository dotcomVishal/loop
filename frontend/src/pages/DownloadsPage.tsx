import { RetroPanel } from "../components/RetroPanel";

export function DownloadsPage() {
  return (
    <RetroPanel title="Downloads" subtitle="Offline support can be added later without changing the shell.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-5">
          <div className="text-xs uppercase tracking-[0.35em] text-[#ab8de0]">Status</div>
          <p className="mt-3 text-sm leading-6 text-[#d5c8ed]">No downloads yet. This page is reserved for a future offline queue.</p>
        </div>
        <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-5">
          <div className="text-xs uppercase tracking-[0.35em] text-[#ab8de0]">Queue</div>
          <div className="mt-4 h-28 rounded-xl border border-dashed border-[#6f548e]" />
        </div>
      </div>
    </RetroPanel>
  );
}