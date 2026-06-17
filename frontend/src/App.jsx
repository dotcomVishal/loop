import './index.css'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { containerStyle } from './theme'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import Library from './components/Library'
import Artists from './components/Artists'
import Playlists from './components/Playlists'
import About from './components/About'
import Upload from './components/Upload'
import Player from './components/Player'
import ActionModal from './components/ActionModal'
import QueueModal from './components/QueueModal'

export default function App() {
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [token, setToken] = useState(localStorage.getItem('loop_token') || null)
  const [username, setUsername] = useState(localStorage.getItem('loop_username') || '')
  
  const [activeTab, setActiveTab] = useState('home') 
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [modalSong, setModalSong] = useState(null)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  
  const [searchHome, setSearchHome] = useState('')
  const [searchArtist, setSearchArtist] = useState('')

  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackList, setPlaybackList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const audioRef = useRef(null)

  useEffect(() => {
    if (token) { 
      fetchSongs()
      fetchPlaylists() 
    }
  }, [token]) 

  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = currentSong.file_path
    if (isPlaying) audioRef.current.play().catch(e => console.error(e))
  }, [currentSong])

  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    isPlaying ? audioRef.current.play().catch(e => console.error(e)) : audioRef.current.pause()
  }, [isPlaying])

  const fetchSongs = async () => {
    try {
      const res = await axios.get('/api/songs')
      setSongs(res.data.songs)
    } catch (e) { console.error("Error fetching songs:", e) }
  }

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get('/api/playlists', { headers: { Authorization: `Bearer ${token}` } })
      setPlaylists(res.data.playlists)
    } catch (e) { console.error("Error fetching playlists:", e) }
  }

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })
      setToken(res.data.token)
      setUsername(res.data.user.username)
      localStorage.setItem('loop_token', res.data.token)
      localStorage.setItem('loop_username', res.data.user.username)
    } catch (e) { alert("Login failed.") }
  }

  const handleLogout = () => {
    if (audioRef.current) audioRef.current.pause()
    setToken(null); setUsername(''); setSongs([]); setPlaylists([]); setCurrentSong(null); setIsPlaying(false); setCurrentTime(0); setDuration(0); setPlaybackList([]); setCurrentIndex(-1); setIsQueueOpen(false)
    localStorage.clear()
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const files = e.target.elements.upFiles.files
    const playlistName = e.target.elements.upPlaylist?.value
    if (!files.length) return

    try {
      let targetPlaylistId = null;
      
      if (playlistName) {
        const pRes = await axios.post('/api/playlists', { name: playlistName }, { headers: { Authorization: `Bearer ${token}` }})
        targetPlaylistId = pRes.data.playlist.id
        fetchPlaylists() 
      }

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('audio', files[i])
        
        const uploadRes = await axios.post('/api/songs/upload', formData, { headers: { Authorization: `Bearer ${token}` } })
        
        if (targetPlaylistId) {
          await axios.post('/api/playlists/add', { playlistId: targetPlaylistId, songId: uploadRes.data.song.id }, { headers: { Authorization: `Bearer ${token}` }})
        }
      }
      
      e.target.reset(); fetchSongs()
      alert(targetPlaylistId ? `Uploaded and saved to playlist: ${playlistName}` : "Upload complete")
    } catch (e) { alert("Upload failed") }
  }

  const deleteGlobalSong = async (id) => {
    if(!window.confirm("Permanently delete this song?")) return
    try { await axios.delete(`/api/songs/${id}`, { headers: { Authorization: `Bearer ${token}` }}); fetchSongs(); } catch (e) { console.error(e) }
  }

  const addToPlaylist = async (playlistId, songId) => {
    try { await axios.post('/api/playlists/add', { playlistId, songId }, { headers: { Authorization: `Bearer ${token}` }}); setModalSong(null); } catch (e) { alert(e.response?.data?.error || "Failed to add") }
  }

  const createAndAddToPlaylist = async (name, songId) => {
    if(!name) return
    try { const res = await axios.post('/api/playlists', { name }, { headers: { Authorization: `Bearer ${token}` }}); await addToPlaylist(res.data.playlist.id, songId); fetchPlaylists(); } catch (e) { console.error(e) }
  }

  // Playback & Queue Pipeline
  const startPlay = (list, index) => { 
    setPlaybackList(list); 
    setCurrentIndex(index); 
    setCurrentSong(list[index]); 
    setIsPlaying(true) 
  }
  
  const handleAddToQueue = (song) => {
    if (playbackList.length === 0) {
      startPlay([song], 0)
    } else {
      setPlaybackList([...playbackList, song])
    }
  }

  const playNext = () => { 
    if (currentIndex < playbackList.length - 1) { 
      setCurrentIndex(currentIndex + 1); 
      setCurrentSong(playbackList[currentIndex + 1]) 
    } else { 
      setIsPlaying(false) 
    }
  }
  
  const playPrev = () => { 
    if (currentIndex > 0) { 
      setCurrentIndex(currentIndex - 1); 
      setCurrentSong(playbackList[currentIndex - 1]) 
    } 
  }
  
  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime) }
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration) }
  const handleSeek = (time) => { if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time) } }

  if (!token) return <div style={containerStyle}><Auth handleLogin={handleLogin} /></div>

  return (
    <div style={containerStyle}>
      <audio 
        ref={audioRef} 
        onEnded={playNext} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata} 
      />

      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setSelectedArtist={setSelectedArtist} 
        username={username} 
        handleLogout={handleLogout} 
      />

      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', paddingBottom: currentSong ? '160px' : '32px' }}>
          
          {activeTab === 'home' && (
            <Library 
              songs={songs} 
              searchHome={searchHome} 
              setSearchHome={setSearchHome} 
              startPlay={startPlay} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
              openModal={setModalSong} 
              deleteGlobalSong={deleteGlobalSong} 
              username={username} 
            />
          )}
          
          {activeTab === 'artists' && (
            <Artists 
              songs={songs} 
              selectedArtist={selectedArtist} 
              setSelectedArtist={setSelectedArtist} 
              searchArtist={searchArtist} 
              setSearchArtist={setSearchArtist} 
              startPlay={startPlay} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
            />
          )}
          
          {activeTab === 'playlists' && (
            <Playlists 
              token={token} 
              playlists={playlists} 
              fetchPlaylists={fetchPlaylists} 
              startPlay={startPlay} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
            />
          )}
          
          {activeTab === 'about' && <About />}
          
          {activeTab === 'upload' && username === 'rabbit' && <Upload handleUpload={handleUpload} />}
        </div>

        <Player 
          currentSong={currentSong} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying} 
          playNext={playNext} 
          playPrev={playPrev} 
          currentIndex={currentIndex} 
          playbackList={playbackList} 
          currentTime={currentTime} 
          duration={duration} 
          handleSeek={handleSeek} 
          onOpenQueue={() => setIsQueueOpen(true)} 
        />
      </div>

      <ActionModal 
        song={modalSong} 
        playlists={playlists} 
        onClose={() => setModalSong(null)} 
        onAdd={addToPlaylist} 
        onCreateAndAdd={createAndAddToPlaylist} 
        onAddToQueue={handleAddToQueue} 
      />
      
      {isQueueOpen && (
        <QueueModal 
          playbackList={playbackList} 
          setPlaybackList={setPlaybackList} 
          currentIndex={currentIndex} 
          setCurrentIndex={setCurrentIndex} 
          onClose={() => setIsQueueOpen(false)} 
          currentSong={currentSong} 
        />
      )}
    </div>
  )
}