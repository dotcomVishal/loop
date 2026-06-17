import { buttonStyle, glassStyle, inputStyle } from '../theme'

export default function Upload({ handleUpload }) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '24px', letterSpacing: '-0.5px' }}>Upload Center</h1>
      
      <div style={{ ...glassStyle, padding: '40px', textAlign: 'center' }}>
        <p style={{ opacity: 0.6, marginBottom: '30px', fontSize: '15px' }}>
          Select audio files. AI will parse metadata automatically.
        </p>
        
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <input 
            type="file" 
            id="upFiles" 
            accept="audio/*" 
            multiple 
            required 
            style={{ 
              padding: '12px', 
              width: '100%', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          />
          
          <input 
            type="text" 
            id="upPlaylist" 
            placeholder="Save as Playlist (Optional)" 
            style={{ 
              ...inputStyle, 
              marginBottom: 0, 
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff'
            }}
          />
          
          <button 
            type="submit" 
            style={{ 
              ...buttonStyle, 
              background: 'rgba(255,255,255,0.9)', 
              color: '#000', 
              border: 'none', 
              borderRadius: '24px', 
              padding: '14px 32px', 
              width: '100%',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            Process Upload
          </button>
        </form>
      </div>
    </div>
  )
}