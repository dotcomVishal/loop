import { glassStyle, buttonStyle } from '../theme'

export default function About() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', paddingBottom: '100px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '34px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-0.5px' }}>About the Creator</h1>
      
      <div style={{ ...glassStyle, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        
        <div style={{ 
          width: '160px', 
          height: '160px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.2)', 
          border: '4px solid rgba(255,255,255,0.4)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          <img 
  src="/profile.jpg" 
  alt="Creator" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
/>
        </div>
        
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Vishal</h2>
          <p style={{ fontSize: '15px', opacity: 0.8, lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
            Hello ,  I made this :)
          </p>
        </div>

        <a 
          href="https://github.com/dotcomvishal" 
          target="_blank" 
          rel="noreferrer"
          style={{ ...buttonStyle, textDecoration: 'none', background: 'rgba(255,255,255,0.9)', color: '#000', borderRadius: '24px', padding: '12px 32px', marginTop: '16px', display: 'inline-block' }}
        >
          View GitHub
        </a>
      </div>
    </div>
  )
}