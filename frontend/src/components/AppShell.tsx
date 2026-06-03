import type { PropsWithChildren } from "react";

import type { PageKey } from "../App";

type AppShellProps = PropsWithChildren<{
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  pageTitle: string;
  pageDescription: string;
}>;

const navItems: Array<{ key: PageKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "search", label: "Search" },
  { key: "library", label: "Library" },
  { key: "liked-songs", label: "Liked" },
  { key: "downloads", label: "Downloads" },
  { key: "profile", label: "Profile" }
];

export function AppShell({ activePage, onNavigate, pageTitle, pageDescription, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(195,162,255,0.16),_transparent_34%),linear-gradient(180deg,_#110f19_0%,_#09080f_100%)] text-[#f0eaff]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-0 lg:gap-6">
        <aside className="hidden w-72 shrink-0 border-r border-[#6d52a8]/35 bg-black/45 px-5 py-6 backdrop-blur md:flex md:flex-col">
          <div className="mb-10 rounded-2xl border border-[#6d52a8]/45 bg-[#14101f] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.7),0_0_24px_rgba(173,122,255,0.18)]">
            <div className="text-xs uppercase tracking-[0.45em] text-[#b894ff]">Loop</div>
            <div className="mt-3 font-['Press_Start_2P',monospace] text-xl leading-7 text-white">Private 8-bit listening</div>
            <p className="mt-4 text-sm leading-6 text-[#d1c5e8]">
              A minimal music space for exactly two users, shaped for web now and Capacitor later.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = item.key === activePage;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-[#b894ff] bg-[#27163f] text-white shadow-[0_0_0_1px_rgba(184,148,255,0.2)]"
                      : "border-transparent bg-transparent text-[#cbbce4] hover:border-[#6d52a8]/55 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`h-2 w-2 rounded-full ${active ? "bg-[#d8b9ff]" : "bg-[#5a4d72]"}`} />
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-[#6d52a8]/30 bg-[#120f1b] p-4 text-xs leading-5 text-[#bfaedc]">
            No playback yet. Layout only.
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col pb-80 md:pb-44">
          <header className="border-b border-[#6d52a8]/25 bg-black/25 px-4 py-5 backdrop-blur md:px-8 md:py-7">
            <div className="text-xs uppercase tracking-[0.45em] text-[#b894ff] md:hidden">Loop</div>
            <h1 className="mt-2 font-['Press_Start_2P',monospace] text-xl leading-8 text-white md:text-2xl">{pageTitle}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d7cbea]">{pageDescription}</p>
          </header>

          <div className="flex-1 px-4 py-5 md:px-8 md:py-8">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#6d52a8]/35 bg-[#09080f]/92 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {navItems.map((item) => {
            const active = item.key === activePage;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`rounded-xl border px-2 py-2 text-[11px] leading-4 transition ${
                  active
                    ? "border-[#b894ff] bg-[#27163f] text-white"
                    : "border-[#35264f] bg-black/30 text-[#c8b5e4]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}