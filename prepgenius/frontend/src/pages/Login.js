import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const FeatureBullet = ({ icon, text }) => (
  <div className="flex items-center gap-3 animate-slide-up">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
      style={{ background: 'rgba(108,94,247,0.2)', border: '1px solid rgba(108,94,247,0.3)' }}>
      {icon}
    </div>
    <span className="text-sm" style={{ color: '#a1a1b5' }}>{text}</span>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex mesh-bg">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>P</div>
          <span className="text-white font-bold text-xl tracking-tight">
            Prep<span className="gradient-text">Genius</span>
          </span>
        </div>

        {/* Hero */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa', border: '1px solid rgba(108,94,247,0.25)' }}>
            ✨ AI-Powered Interview Prep
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            Ace Your Next<br />
            <span className="gradient-text">Tech Interview</span>
          </h1>
          <p className="text-lg mb-10" style={{ color: '#a1a1b5', lineHeight: 1.7 }}>
            Practice with AI-generated questions, get real-time feedback, and analyze your resume — all in one platform.
          </p>
          <div className="space-y-3.5">
            <FeatureBullet icon="🎤" text="AI Mock Interviews with instant feedback" />
            <FeatureBullet icon="📄" text="ATS Resume Scorer & Analyzer" />
            <FeatureBullet icon="💻" text="Live Coding Interview Simulator" />
            <FeatureBullet icon="📊" text="Performance tracking & skill breakdown" />
          </div>
        </div>

        {/* Testimonial */}
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm italic mb-3" style={{ color: '#a1a1b5' }}>
            "PrepGenius helped me land a role at a top tech firm. The AI feedback was spot-on!"
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6c5ef7, #7c3aed)' }}>A</div>
            <span className="text-xs font-medium text-white">Alex T. — Software Engineer</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>P</div>
            <span className="text-white font-bold text-xl">Prep<span className="gradient-text">Genius</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p style={{ color: '#a1a1b5' }}>Sign in to continue your interview prep</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-dark"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: '#c1c1d5' }}>Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-dark pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 mt-2"
              style={loading
                ? { background: 'rgba(108,94,247,0.4)', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)', boxShadow: '0 8px 24px rgba(108,94,247,0.3)' }
              }
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs" style={{ color: '#6b6b8a' }}>New here?</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <p className="mt-5 text-center text-sm" style={{ color: '#a1a1b5' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline transition-colors" style={{ color: '#8179fa' }}>
              Create one free →
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

export default Login;
