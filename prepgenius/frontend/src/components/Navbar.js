import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
    { label: 'History', path: '/history', icon: '📋' },
    { label: 'Resume', path: '/resume-analyzer', icon: '📄' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50" style={{
      background: 'rgba(10, 10, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}>
              P
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Prep<span className="gradient-text">Genius</span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={isActive(link.path) ? {
                  background: 'rgba(108, 94, 247, 0.15)',
                  color: '#8179fa',
                } : {}}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-3">
            {/* Interview CTA */}
            <button
              onClick={() => navigate('/interview-setup')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #6c5ef7, #4f46e5)' }}
            >
              <span>🎤</span> Practice
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 p-1.5 rounded-xl transition-all hover:bg-white/5"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #6c5ef7 0%, #7c3aed 100%)' }}>
                  {initials}
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden animate-slide-up"
                  style={{
                    background: '#1c1c30',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-white font-semibold text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{user?.email || ''}</p>
                  </div>
                  <div className="py-1.5">
                    {[
                      { label: 'Profile Settings', icon: '👤', path: '/profile' },
                      { label: 'Interview History', icon: '📋', path: '/history' },
                    ].map(item => (
                      <button key={item.path}
                        onClick={() => { navigate(item.path); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left">
                        <span>{item.icon}</span>{item.label}
                      </button>
                    ))}
                    <div className="mx-3 my-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                    <button
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left"
                      style={{ color: '#f87171' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>↩</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t animate-slide-up" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-violet-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.icon} {link.label}
              </button>
            ))}
            <button
              onClick={() => { navigate('/interview-setup'); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 text-sm font-semibold text-violet-400"
            >
              🎤 Start Interview
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
