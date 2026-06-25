import { useState } from 'react';
import { login, register } from '../api';
import { User, Lock, Activity } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await login(username, password);
        localStorage.setItem('token', data.access_token);
        onLogin();
      } else {
        await register(username, password);
        const data = await login(username, password);
        localStorage.setItem('token', data.access_token);
        onLogin();
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Activity size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>{isLogin ? 'Welcome Back' : 'Join MedTracker'}</h2>
          <p className="text-muted text-sm">Securely manage your medications</p>
        </div>
        
        {error && <div style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
