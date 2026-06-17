import { useState } from 'react'
import { glassStyle, inputStyle, buttonStyle } from '../theme'

export default function ActionModal({ song, playlists, onClose, onAdd, onCreateAndAdd, onAddToQueue }) {
  const [newPlaylistName, setNewPlaylistName] = useState('')

  if (!song) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }} onClick={onClose}>
      <div style={{ ...glassStyle, width: '320px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: '600', fontSize: '18px', lineHeight: '1.3' }}>Options for<br/>"{song.title}"</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', opacity: 0.6, marginTop: '-4px' }}>×</button>
        </div>
        
        {/* Add to Queue Button */}
        <button 
          onClick={() => { onAddToQueue(song); onClose() }} 
          style={{ ...buttonStyle, width: '100%', background: 'rgba(255,255,255,0.9)', color: '#000', borderRadius: '12px', marginBottom: '20px' }}
        >
          ▶ Add to Queue
        </button>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 -24px 20px -24px' }} />

        <h4 style={{ fontSize: '14px', fontWeight: '600', opacity: 0.7, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Add to Playlist</h4>
        <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
          {playlists.map(p => (
            <button key={p.id} onClick={() => onAdd(p.id, song.id)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', marginBottom: '8px', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: '15px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              + {p.name}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
          <input type="text" placeholder="New Playlist Name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} style={{ ...inputStyle, marginBottom: '12px', padding: '12px 16px', borderRadius: '12px' }} />
          <button onClick={() => onCreateAndAdd(newPlaylistName, song.id)} style={{ ...buttonStyle, width: '100%', padding: '12px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: '#fff' }}>Create & Add</button>
        </div>
      </div>
    </div>
  )
}