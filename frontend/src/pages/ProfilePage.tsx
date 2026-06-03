import { RetroPanel } from "../components/RetroPanel";

export function ProfilePage() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <RetroPanel title="Profile" subtitle="Two users only. Authentication comes later.">
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] px-4 py-3 text-sm text-[#ece3fa]">User 1</div>
          <div className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] px-4 py-3 text-sm text-[#ece3fa]">User 2</div>
        </div>
      </RetroPanel>

      <RetroPanel title="Settings" subtitle="Reserved for future preferences and sync options.">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Theme",
            "Library visibility",
            "Download behavior",
            "Sync status"
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-[#5d477f] bg-[#0f0c16] p-4 text-sm text-[#ece3fa]">
              {item}
            </div>
          ))}
        </div>
      </RetroPanel>
    </div>
  );
}