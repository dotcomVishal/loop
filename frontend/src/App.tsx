import { useState, type ReactNode } from "react";

import { AppShell } from "./components/AppShell";
import { PlayerBar } from "./components/PlayerBar";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { LikedSongsPage } from "./pages/LikedSongsPage";
import { DownloadsPage } from "./pages/DownloadsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
import { MusicProvider } from "./hooks/useMusicLibrary";

export type PageKey =
  | "home"
  | "search"
  | "library"
  | "liked-songs"
  | "downloads"
  | "profile";

const pages: Record<PageKey, { title: string; description: string; render: () => ReactNode }> = {
  home: {
    title: "Home",
    description: "Your private retro listening hub with live playback.",
    render: () => <HomePage />
  },
  search: {
    title: "Search",
    description: "Find songs, artists, and albums.",
    render: () => <SearchPage />
  },
  library: {
    title: "Library",
    description: "Browse your saved collection.",
    render: () => <LibraryPage />
  },
  "liked-songs": {
    title: "Liked Songs",
    description: "Everything you have liked so far.",
    render: () => <LikedSongsPage />
  },
  downloads: {
    title: "Downloads",
    description: "Offline-ready items will appear here later.",
    render: () => <DownloadsPage />
  },
  profile: {
    title: "Profile",
    description: "Simple account view for the two-user setup.",
    render: () => <ProfilePage />
  }
};

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const currentPage = pages[activePage];

  return (
    <MusicProvider>
      <AppShell
        activePage={activePage}
        onNavigate={setActivePage}
        pageTitle={currentPage.title}
        pageDescription={currentPage.description}
      >
        {currentPage.render()}
      </AppShell>
      <PlayerBar />
    </MusicProvider>
  );
}