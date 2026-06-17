import { inputStyle, glassStyle } from '../theme'

export default function Artists({ 
  songs, 
  selectedArtist, 
  setSelectedArtist, 
  searchArtist, 
  setSearchArtist, 
  startPlay, 
  currentSong, 
  isPlaying 
}) {
  
  const uniqueArtists = [...new Set(songs.map(s => s.artist))].filter(a => 
    a.toLowerCase().includes(searchArtist.toLowerCase())
  )

  const rowStyle = {
    padding: '16px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {selectedArtist ? (
        <div>
          <button 
            onClick={() => setSelectedArtist(null)}
            style={{ background: 'none', border: 'none', color: '#007aff', fontWeight: '500', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
          >
            Back
          </button>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px' }}>{selectedArtist}</h1>
          <div style={{ ...glassStyle, padding: '10px' }}>
            {songs.filter(s => s.artist === selectedArtist).map((s, idx, list) => {
              const isActive = currentSong?.id === s.id
              return (
                <div key={s.id} style={{ ...rowStyle, cursor: 'default' }}>
                  <span style={{ fontWeight: isActive ? '600' : '500' }}>{s.title}</span>
                  <button 
                    onClick={() => startPlay(list, idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', color: isActive ? '#007aff' : '#1d1d1f' }}
                  >
                    {isActive && isPlaying ? 'Playing' : 'Play'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px' }}>Artists</h1>
          <input 
            type="text" 
            placeholder="Filter artists" 
            value={searchArtist} 
            onChange={e => setSearchArtist(e.target.value)}
            style={{ ...inputStyle, borderRadius: '20px', padding: '16px 24px' }}
          />
          <div style={{ ...glassStyle, padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {uniqueArtists.map(a => (
              <div 
                key={a} 
                onClick={() => setSelectedArtist(a)} 
                style={{ ...glassStyle, padding: '20px', cursor: 'pointer', textAlign: 'center', fontWeight: '500' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
                onMouseOut={e => e.currentTarget.style.background = glassStyle.background}
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}