import { glassStyle } from '../theme'

export default function Sidebar({ 
  isExpanded, 
  setIsExpanded, 
  activeTab, 
  setActiveTab, 
  setSelectedArtist, 
  username, 
  handleLogout 
}) {
  const navItemStyle = (isActive) => ({
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: isActive ? '600' : '400',
    cursor: 'pointer',
    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    border: 'none',
    borderRadius: '12px',
    transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
    color: '#fff',
    width: '100%',
    display: 'block'
  })

  return (
    <div style={{ 
      ...glassStyle,
      width: isExpanded ? '240px' : '56px', 
      height: isExpanded ? 'calc(100vh - 32px)' : '56px',
      borderRadius: isExpanded ? '16px' : '28px',
      margin: '16px',
      padding: isExpanded ? '20px' : '0', 
      display: 'flex', 
      flexDirection: 'column', 
      transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
      willChange: 'width, height, border-radius, padding',
      flexShrink: 0, 
      overflow: 'hidden',
      alignItems: isExpanded ? 'stretch' : 'center',
      justifyContent: isExpanded ? 'flex-start' : 'center',
      zIndex: 100
    }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: '#fff', 
          fontSize: '20px', 
          cursor: 'pointer',
          width: isExpanded ? '100%' : '56px',
          height: isExpanded ? 'auto' : '56px',
          textAlign: isExpanded ? 'right' : 'center',
          marginBottom: isExpanded ? '24px' : '0',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-end' : 'center'
        }}
      >
        {isExpanded ? '<' : '≡'}
      </button>
      
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, opacity: 1, animation: 'fadeIn 0.4s ease-in', minWidth: '200px' }}>
          <h2 style={{ margin: '0 0 20px 8px', fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px' }}>Loop</h2>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <button onClick={() => { setActiveTab('home'); setSelectedArtist(null) }} style={navItemStyle(activeTab === 'home')}>Home</button>
            <button onClick={() => { setActiveTab('artists'); setSelectedArtist(null) }} style={navItemStyle(activeTab === 'artists')}>Artists</button>
            <button onClick={() => { setActiveTab('playlists'); setSelectedArtist(null) }} style={navItemStyle(activeTab === 'playlists')}>Playlists</button>
            <button onClick={() => { setActiveTab('about'); setSelectedArtist(null) }} style={navItemStyle(activeTab === 'about')}>About</button>
            {username === 'rabbit' && <button onClick={() => setActiveTab('upload')} style={navItemStyle(activeTab === 'upload')}>Upload</button>}
          </nav>

          <div style={{ marginTop: 'auto', padding: '8px' }}>
            <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '12px' }}>@{username}</div>
            <button onClick={handleLogout} style={{ ...navItemStyle(false), color: '#ff453a', background: 'rgba(255,69,58,0.15)' }}>Sign Out</button>
          </div>
        </div>
      )}
    </div>
  )
}