import { useState, useRef } from "react";
import { RetroPanel } from "../components/RetroPanel";
import { useMusicLibrary } from "../hooks/useMusicLibrary";

export function ProfilePage() {
  const { refreshLibrary } = useMusicLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("loop_user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("loop_user");
    window.location.reload();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/library/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMessage(`Successfully uploaded ${file.name}`);
        await refreshLibrary();
      } else {
        setMessage("Upload failed");
      }
    } catch (err) {
      setMessage("Upload error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <RetroPanel title="Profile" subtitle={`Logged in as ${user.name || user.username || "Unknown"}`}>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-white flex items-center justify-between">
            <div>
              <div className="font-bold text-purple-500">Username</div>
              <div className="text-zinc-300 mt-1">{user.name || user.username || "User"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-500/20"
          >
            Log Out
          </button>
        </div>
      </RetroPanel>

      <RetroPanel title="Music Upload" subtitle="Add new songs to your server.">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 p-8 text-center bg-black/20">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".mp3,.flac,.wav,.m4a" 
            className="hidden" 
          />
          <div className="mb-4 text-sm text-zinc-400">
            Click below to upload audio files directly from your device.
          </div>
          <button 
            onClick={handleUploadClick}
            disabled={uploading}
            className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Select Audio File"}
          </button>
          {message && <div className="mt-4 text-sm text-purple-400 font-medium">{message}</div>}
        </div>
      </RetroPanel>
    </div>
  );
}