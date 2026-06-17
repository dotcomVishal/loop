import { useState } from 'react'
import { glassStyle, inputStyle, buttonStyle } from '../theme'

export default function Auth({ handleLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div style={{ ...glassStyle, padding: '40px', width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600', textAlign: 'center' }}>Loop</h1>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={inputStyle}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={inputStyle}
          />
          <button 
            type="submit" 
            style={{ ...buttonStyle, background: 'rgba(0, 0, 0, 0.8)', color: '#fff', border: 'none', marginTop: '10px' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}