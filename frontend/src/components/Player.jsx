import { useState } from 'react'
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
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)

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
    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', 
    color: '#fff', padding: '8px 16px', transition: 'opacity 0.2s', willChange: 'transform' 
  }

  return (
    <>
      {/* =========================================
          DESKTOP PLAYER (Your exact original code)
          ========================================= */}
      <div className="desktop-player-wrapper">
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
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '13px', padding: '8px 16px', borderRadius: '16px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s', fontVariantNumeric: 'tabular-nums' }}
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
      </div>

      {/* =========================================
          MOBILE PLAYER (Two-state pull-up sheet)
          ========================================= */}
      <div className="mobile-player-wrapper">
        
        {/* STATE A: Always-visible sticky mini-bar */}
        {!isMobileExpanded && (
          <div 
            onClick={() => setIsMobileExpanded(true)}
            style={{ position: 'fixed', bottom: '60px', left: 0, width: '100%', height: '64px', background: 'rgba(30, 30, 30, 0.95)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', zIndex: 50 }}
          >
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #444, #222)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px', opacity: 0.5 }}>🎵</span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#fff' }}>{currentSong.title}</div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>{currentSong.artist}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', padding: '10px' }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        )}

        {/* STATE B: Full Screen Expanded Player */}
        {isMobileExpanded && (
          <div style={{ position: 'fixed', inset: 0, background: '#121212', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '24px', paddingTop: 'max(24px, env(safe-area-inset-top))' }}>
            
            {/* Top Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
               <button onClick={() => setIsMobileExpanded(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '28px', padding: '10px' }}>⌄</button>
               <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', fontWeight: '600' }}>Now Playing</span>
               <button onClick={() => { setIsMobileExpanded(false); onOpenQueue(); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', padding: '10px' }}>☰</button>
            </div>

            {/* Massive Album Art Placeholder */}
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'linear-gradient(135deg, #333, #111)', borderRadius: '16px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
               <span style={{ fontSize: '80px', opacity: 0.2 }}>🎵</span>
            </div>

            {/* Track Info */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h2>
              <h3 style={{ fontSize: '18px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist}</h3>
            </div>

            {/* Mobile Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <span style={{ fontSize: '12px', color: '#aaa', width: '35px', fontVariantNumeric: 'tabular-nums' }}>{formatTime(currentTime)}</span>
              <div onClick={handleScrub} style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', position: 'relative' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#fff', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', left: `${progressPercent}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#aaa', width: '35px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>-{formatTime(duration - currentTime)}</span>
            </div>

            {/* Big Touch Targets */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <button onClick={playPrev} disabled={currentIndex === 0} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '36px', opacity: currentIndex === 0 ? 0.3 : 1 }}>⏮</button>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: '#fff', color: '#000', border: 'none', width: '80px', height: '80px', borderRadius: '50%', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(255,255,255,0.2)' }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={playNext} disabled={currentIndex === playbackList.length - 1} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '36px', opacity: currentIndex === playbackList.length - 1 ? 0.3 : 1 }}>⏭</button>
            </div>

          </div>
        )}
      </div>
    </>
  )
}