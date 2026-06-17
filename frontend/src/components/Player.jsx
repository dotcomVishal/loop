import { glassStyle } from '../theme'

export default function Player({ 
  currentSong, 
  isPlaying, 
  setIsPlaying, 
  playNext, 
  playPrev, 
  currentIndex, 
  playbackList, 
  currentTime, 
  duration, 
  handleSeek, 
  onOpenQueue 
}) {
  if (!currentSong) return null

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00"
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    handleSeek(percent * duration)
  }

  const controlBtnStyle = { 
    background: 'transparent', 
    border: 'none', 
    cursor: 'pointer', 
    fontSize: '15px', 
    fontWeight: '600', 
    color: '#fff', 
    padding: '8px 16px', 
    transition: 'opacity 0.2s', 
    willChange: 'transform' 
  }

  return (
    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', ...glassStyle, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: '24px', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '30%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>{currentSong.title}</div>
          <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>{currentSong.artist}</div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', width: '40%' }}>
          <button onClick={playPrev} disabled={currentIndex === 0} style={{ ...controlBtnStyle, opacity: currentIndex === 0 ? 0.3 : 0.8 }}>Prev</button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ ...controlBtnStyle, background: 'rgba(255,255,255,0.9)', color: '#000', borderRadius: '50px', padding: '10px 28px', opacity: 1 }}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={playNext} disabled={currentIndex === playbackList.length - 1} style={{ ...controlBtnStyle, opacity: currentIndex === playbackList.length - 1 ? 0.3 : 0.8 }}>Next</button>
        </div>

        <div style={{ width: '30%', textAlign: 'right' }}>
          <button 
            onClick={onOpenQueue}
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              color: '#fff', 
              fontSize: '13px', 
              padding: '8px 16px', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              fontWeight: '500', 
              transition: 'background 0.2s',
              fontVariantNumeric: 'tabular-nums'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Queue: {currentIndex + 1} / {playbackList.length} ☰
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '12px', opacity: 0.6, width: '35px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatTime(currentTime)}</span>
        <div onClick={handleScrub} style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', cursor: 'pointer', position: 'relative' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: '#fff', borderRadius: '3px', transition: 'width 0.1s linear' }} />
          <div style={{ position: 'absolute', left: `${progressPercent}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'left 0.1s linear' }} />
        </div>
        <span style={{ fontSize: '12px', opacity: 0.6, width: '35px', textAlign: 'left', fontVariantNumeric: 'tabular-nums' }}>-{formatTime(duration - currentTime)}</span>
      </div>
    </div>
  )
}