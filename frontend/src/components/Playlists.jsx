import { useState, useEffect } from 'react'
import axios from 'axios'
import { glassStyle, inputStyle, buttonStyle } from '../theme'

export default function Playlists({ token, playlists, fetchPlaylists, startPlay, currentSong, isPlaying }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlistSongs, setPlaylistSongs] = useState([])
  const [newPlaylistName, setNewPlaylistName] = useState('')

  useEffect(() => {
    if (selectedPlaylist) loadPlaylistSongs(selectedPlaylist.id)
  }, [selectedPlaylist])

  const loadPlaylistSongs = async (id) => {
    try {
      const res = await axios.get(`/api/playlists/${id}`, { headers: { Authorization: `Bearer ${token}` }})
      setPlaylistSongs(res.data.songs)
    } catch (e) { console.error(e) }
  }

  const createPlaylist = async (e) => {
    e.preventDefault()
    if (!newPlaylistName) return
    try {
      await axios.post('/api/playlists', { name: newPlaylistName }, { headers: { Authorization: `Bearer ${token}` }})
      setNewPlaylistName(''); fetchPlaylists()
    } catch (e) { console.error(e) }
  }

  const deletePlaylist = async (id) => {
    if(!confirm("Delete this playlist?")) return
    try {
      await axios.delete(`/api/playlists/${id}`, { headers: { Authorization: `Bearer ${token}` }})
      setSelectedPlaylist(null); fetchPlaylists()
    } catch (e) { console.error(e) }
  }

  const removeSong = async (songId) => {
    try {
      await axios.delete(`/api/playlists/${selectedPlaylist.id}/songs/${songId}`, { headers: { Authorization: `Bearer ${token}` }})
      loadPlaylistSongs(selectedPlaylist.id)
    } catch (e) { console.error(e) }
  }

  const rowStyle = { padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', borderRadius: '12px', cursor: 'pointer' }

  if (selectedPlaylist) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
        <button onClick={() => setSelectedPlaylist(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '700' }}>{selectedPlaylist.name}</h1>
          <button onClick={() => deletePlaylist(selectedPlaylist.id)} style={{ background: 'rgba(255,69,58,0.2)', color: '#ff453a', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Delete Playlist</button>
        </div>
        <div style={{ ...glassStyle, padding: '8px' }}>
          {playlistSongs.length === 0 ? <p style={{ padding: '20px', opacity: 0.6 }}>No songs yet.</p> : playlistSongs.map((s, idx) => {
            const isActive = currentSong?.id === s.id
            return (
              <div key={s.id} onClick={() => startPlay(playlistSongs, idx)} style={{ ...rowStyle, background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}>
                <div>
                  <div style={{ fontWeight: isActive ? '600' : '500', fontSize: '15px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>{s.artist}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {isActive && isPlaying && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Playing</span>}
                  <button onClick={(e) => { e.stopPropagation(); removeSong(s.id) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '24px' }}>Playlists</h1>
      <form onSubmit={createPlaylist} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input type="text" placeholder="New playlist name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} style={{ ...inputStyle, marginBottom: 0, borderRadius: '12px' }} />
        <button type="submit" style={{ ...buttonStyle, borderRadius: '12px', background: 'rgba(255,255,255,0.9)', border: 'none' }}>Create</button>
      </form>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {playlists.map(p => (
          <div key={p.id} onClick={() => setSelectedPlaylist(p)} style={{ ...glassStyle, padding: '24px', cursor: 'pointer', fontWeight: '600', fontSize: '18px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'} onMouseOut={e => e.currentTarget.style.background = glassStyle.background}>
            {p.name}
          </div>
        ))}
      </div>
    </div>
  )
}
