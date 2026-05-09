import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) { setError('All fields are required'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const response = await authAPI.register(email, password, name);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen flex mesh-bg">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>P</div>
          <span className="text-white font-bold text-xl tracking-tight">
            Prep<span className="gradient-text">Genius</span>
          </span>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa', border: '1px solid rgba(108,94,247,0.25)' }}>
            🚀 Start for free — no credit card needed
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Your Interview<br />
            <span className="gradient-text">Journey Starts</span><br />
            Here
          </h1>
          <p className="text-lg mb-10" style={{ color: '#a1a1b5', lineHeight: 1.7 }}>
            Join thousands of developers who've leveled up their interview skills with PrepGenius.
          </p>
          <div className="space-y-4">
            {[
              { stat: '10,000+', label: 'Interview Questions' },
              { stat: '95%', label: 'Users feel more confident' },
              { stat: '5 Modes', label: 'of Interview Practice' },
            ].map(item => (
              <div key={item.stat} className="flex items-center gap-4">
                <div className="text-2xl font-bold gradient-text">{item.stat}</div>
                <div className="text-sm" style={{ color: '#a1a1b5' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm italic mb-3" style={{ color: '#a1a1b5' }}>
            "The coding interview simulator is incredibly realistic. I got my dream job after just 2 weeks of practice!"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>S</div>
            <span className="text-xs font-medium text-white">Sarah K. — Full Stack Developer</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>P</div>
            <span className="text-white font-bold text-xl">Prep<span className="gradient-text">Genius</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
            <p style={{ color: '#a1a1b5' }}>Start practicing interviews for free today</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="John Doe" className="input-dark" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-dark" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className="input-dark pr-12" required />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm">
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strengthLevel ? strengthColors[strengthLevel] : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColors[strengthLevel] }}>
                    {strengthLabels[strengthLevel]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••" className="input-dark" required />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 mt-2"
              style={loading
                ? { background: 'rgba(108,94,247,0.4)', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)', boxShadow: '0 8px 24px rgba(108,94,247,0.3)' }
              }>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: '#a1a1b5' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#8179fa' }}>
              Sign in →
            </Link>
          </p>

          <p className="text-center text-xs mt-8" style={{ color: '#6b6b8a' }}>
            © 2025 PrepGenius. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
