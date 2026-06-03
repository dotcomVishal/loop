import { useState, useEffect, type ReactNode } from "react";

import { AppShell } from "./components/AppShell";
import { PlayerBar } from "./components/PlayerBar";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { LikedSongsPage } from "./pages/LikedSongsPage";
import { DownloadsPage } from "./pages/DownloadsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
import { LoginPage } from "./pages/LoginPage";
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
    description: "Your personal music server with live playback.",
    render: () => <HomePage />
  },
  search: {
    title: "Search",
    description: "Find songs, artists, and albums in your library.",
    render: () => <SearchPage />
  },
  library: {
    title: "Library",
    description: "Browse your complete music collection.",
    render: () => <LibraryPage />
  },
  "liked-songs": {
    title: "Liked Songs",
    description: "Everything you have liked so far.",
    render: () => <LikedSongsPage />
  },
  downloads: {
    title: "Downloads",
    description: "Music downloaded for offline playback.",
    render: () => <DownloadsPage />
  },
  profile: {
    title: "Profile",
    description: "Manage your account and upload new music.",
    render: () => <ProfilePage />
  }
};

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem("loop_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("loop_user");
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("loop_user", JSON.stringify(userData));
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

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