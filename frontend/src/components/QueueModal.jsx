import { glassStyle } from '../theme'

export default function QueueModal({ 
  playbackList, 
  setPlaybackList, 
  currentIndex, 
  setCurrentIndex, 
  onClose,
  currentSong
}) {
  const moveItem = (idx, direction) => {
    if (idx === 0 && direction === -1) return
    if (idx === playbackList.length - 1 && direction === 1) return

    const newList = [...playbackList]
    const targetIdx = idx + direction
    // Swap items
    ;[newList[idx], newList[targetIdx]] = [newList[targetIdx], newList[idx]]

    // Track the currently playing song's index so playback doesn't jump
    let newCurrentIndex = currentIndex
    if (currentIndex === idx) newCurrentIndex = targetIdx
    else if (currentIndex === targetIdx) newCurrentIndex = idx

    setPlaybackList(newList)
    setCurrentIndex(newCurrentIndex)
  }

  const removeFromQueue = (idx) => {
    if (playbackList.length === 1) return // Don't remove the last song while playing
    
    const newList = [...playbackList]
    newList.splice(idx, 1)

    let newCurrentIndex = currentIndex
    if (idx < currentIndex) newCurrentIndex -= 1
    else if (idx === currentIndex) {
      // If we deleted the currently playing song, let it naturally move to the next
      if (newCurrentIndex >= newList.length) newCurrentIndex = newList.length - 1
    }

    setPlaybackList(newList)
    setCurrentIndex(newCurrentIndex)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ ...glassStyle, width: '400px', maxHeight: '70vh', padding: '24px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Up Next</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', opacity: 0.6 }}>×</button>
        </div>
        
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
          {playbackList.map((s, idx) => {
            const isPlaying = idx === currentIndex
            return (
              <div key={`${s.id}-${idx}`} style={{ 
                padding: '12px', 
                background: isPlaying ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                marginBottom: '8px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  <div style={{ fontWeight: isPlaying ? '600' : '500', fontSize: '14px', color: isPlaying ? '#fff' : 'rgba(255,255,255,0.8)' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '2px' }}>{s.artist}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#fff', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.2 : 0.7, fontSize: '12px', padding: '2px' }}>▲</button>
                    <button onClick={() => moveItem(idx, 1)} disabled={idx === playbackList.length - 1} style={{ background: 'none', border: 'none', color: '#fff', cursor: idx === playbackList.length - 1 ? 'default' : 'pointer', opacity: idx === playbackList.length - 1 ? 0.2 : 0.7, fontSize: '12px', padding: '2px' }}>▼</button>
                  </div>
                  <button onClick={() => removeFromQueue(idx)} style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer', opacity: 0.8, fontSize: '16px', padding: '4px', marginLeft: '4px' }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}