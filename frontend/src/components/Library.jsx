import { inputStyle, glassStyle } from '../theme'

export default function Library({ 
  songs, 
  searchHome, 
  setSearchHome, 
  startPlay, 
  currentSong, 
  isPlaying, 
  openModal, 
  deleteGlobalSong, 
  username 
}) {
  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(searchHome.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchHome.toLowerCase())
  )

  const rowStyle = { 
    padding: '16px 20px', 
    borderBottom: '1px solid rgba(255,255,255,0.05)', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    transition: 'background 0.2s', 
    borderRadius: '12px', 
    cursor: 'pointer' 
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '24px', letterSpacing: '-0.5px' }}>Library</h1>
      
      <input 
        type="text" 
        placeholder="Search your music..." 
        value={searchHome} 
        onChange={e => setSearchHome(e.target.value)} 
        style={{ 
          ...inputStyle, 
          borderRadius: '24px', 
          padding: '16px 24px', 
          background: 'rgba(255,255,255,0.15)', 
          color: '#fff' 
        }} 
      />
      
      <div style={{ ...glassStyle, padding: '8px' }}>
        {filteredSongs.length === 0 ? (
          <p style={{ padding: '20px', opacity: 0.6, textAlign: 'center' }}>No songs found.</p>
        ) : (
          filteredSongs.map((s, idx) => {
            const isActive = currentSong?.id === s.id
            return (
              <div 
                key={s.id} 
                onClick={() => startPlay(filteredSongs, idx)} 
                style={{ ...rowStyle, background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' }} 
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} 
                onMouseOut={e => e.currentTarget.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: isActive ? '600' : '500', fontSize: '15px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>{s.artist}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {isActive && isPlaying && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Playing</span>}
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); openModal(s) }} 
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', opacity: 0.7, padding: '0 8px' }}
                  >
                    ⋮
                  </button>
                  
                  {username === 'rabbit' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteGlobalSong(s.id) }} 
                      style={{ background: 'none', border: 'none', color: '#ff453a', fontSize: '16px', cursor: 'pointer', padding: '0 8px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}