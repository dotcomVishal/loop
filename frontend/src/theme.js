export const glassStyle = {
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
  borderRadius: '16px',
  willChange: 'transform, backdrop-filter',
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)'
}

export const buttonStyle = {
  ...glassStyle,
  padding: '12px 24px',
  cursor: 'pointer',
  fontWeight: '500',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  color: '#1d1d1f',
  border: 'none',
  willChange: 'transform'
}

export const inputStyle = {
  ...glassStyle,
  padding: '14px 16px',
  width: '100%',
  outline: 'none',
  color: '#1d1d1f',
  marginBottom: '16px',
  border: 'none',
  fontSize: '15px'
}

export const containerStyle = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  background: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
  backgroundColor: '#0a0a0a',
  backgroundAttachment: 'fixed',
  color: '#f5f5f7',
  overflow: 'hidden'
}