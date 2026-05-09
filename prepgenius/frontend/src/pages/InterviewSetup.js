import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const ROLES = [
  { name: 'React Developer', icon: '⚛️' },
  { name: 'Angular Developer', icon: '🔺' },
  { name: 'Vue Developer', icon: '💚' },
  { name: 'Java Developer', icon: '☕' },
  { name: 'Python Developer', icon: '🐍' },
  { name: 'Node.js Developer', icon: '🟢' },
  { name: 'Full Stack Developer', icon: '🧱' },
  { name: 'DevOps Engineer', icon: '⚙️' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', sub: 'Fundamentals & basics', emoji: '🌱', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  { value: 'intermediate', label: 'Intermediate', sub: 'Applied concepts', emoji: '🚀', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  { value: 'advanced', label: 'Advanced', sub: 'Complex scenarios', emoji: '⚡', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
];

const MODES = [
  { value: 'standard', title: 'Standard', desc: 'Timed per question, auto-advance', icon: '⏱' },
  { value: 'timed', title: 'Timed Quiz', desc: 'Single countdown for full interview', icon: '⏳' },
  { value: 'review', title: 'Review Mode', desc: 'No timers, manual navigation', icon: '📖' },
  { value: 'live', title: 'Live Interviewer', desc: 'Follow-up questions on wrong answers', icon: '🎙️' },
  { value: 'coding', title: 'Coding Interview', desc: 'Solve 5 coding tasks with run & submit', icon: '💻' },
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0].name);
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [selectedMode, setSelectedMode] = useState('standard');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [adaptiveMix, setAdaptiveMix] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!selectedRole) { setError('Please select a role'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await interviewAPI.startInterview(selectedRole, selectedDifficulty, {
        shuffleQuestions, adaptiveMix, mode: selectedMode,
      });
      navigate('/interview-session', { state: { interview: response } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      {/* Header */}
      <div style={{ background: 'rgba(19,19,31,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-bold">Prep<span className="gradient-text">Genius</span></span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-3 py-1.5">← Dashboard</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa', border: '1px solid rgba(108,94,247,0.25)' }}>
            🎤 Mock Interview Setup
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Configure Your Interview</h1>
          <p style={{ color: '#a1a1b5' }}>Choose a role, difficulty, and mode to begin your AI-powered practice session.</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center gap-2 max-w-2xl mx-auto"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <span>⚠</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Role + Difficulty */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Selection */}
            <div className="rounded-2xl p-6" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#6c5ef7' }}>1</span>
                Select Your Role
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {ROLES.map(role => (
                  <button key={role.name} onClick={() => setSelectedRole(role.name)}
                    className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200"
                    style={selectedRole === role.name
                      ? { background: 'rgba(108,94,247,0.15)', border: '1.5px solid rgba(108,94,247,0.5)', color: '#c4bbff' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#a1a1b5' }
                    }>
                    <span className="text-xl">{role.icon}</span>
                    <span className="text-sm font-medium">{role.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="rounded-2xl p-6" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#6c5ef7' }}>2</span>
                Difficulty Level
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map(d => (
                  <button key={d.value} onClick={() => setSelectedDifficulty(d.value)}
                    className="flex flex-col items-center p-4 rounded-xl text-center transition-all duration-200"
                    style={selectedDifficulty === d.value
                      ? { background: d.bg, border: `1.5px solid ${d.border}` }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                    }>
                    <span className="text-2xl mb-1.5">{d.emoji}</span>
                    <span className="text-sm font-semibold" style={{ color: selectedDifficulty === d.value ? d.color : '#e1e1f5' }}>{d.label}</span>
                    <span className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="rounded-2xl p-6" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#6c5ef7' }}>3</span>
                Interview Mode
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MODES.map(mode => (
                  <button key={mode.value} onClick={() => setSelectedMode(mode.value)}
                    className="flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200"
                    style={selectedMode === mode.value
                      ? { background: 'rgba(108,94,247,0.12)', border: '1.5px solid rgba(108,94,247,0.4)' }
                      : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                    }>
                    <span className="text-xl mt-0.5">{mode.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: selectedMode === mode.value ? '#c4bbff' : '#e1e1f5' }}>{mode.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>{mode.desc}</p>
                    </div>
                    {selectedMode === mode.value && (
                      <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: '#6c5ef7' }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              {selectedMode !== 'coding' && (
                <div className="mt-4 space-y-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {[
                    { key: 'shuffle', label: 'Shuffle question order', value: shuffleQuestions, onChange: setShuffleQuestions },
                    { key: 'adaptive', label: 'Adaptive difficulty (auto-bump when scoring high)', value: adaptiveMix, onChange: setAdaptiveMix },
                  ].map(toggle => (
                    <label key={toggle.key} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative w-9 h-5 flex-shrink-0" onClick={() => toggle.onChange(v => !v)}>
                        <div className="w-9 h-5 rounded-full transition-all duration-200"
                          style={{ background: toggle.value ? '#6c5ef7' : 'rgba(255,255,255,0.1)' }} />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                          style={{ transform: toggle.value ? 'translateX(16px)' : 'translateX(0)' }} />
                      </div>
                      <span className="text-sm" style={{ color: '#a1a1b5' }}>{toggle.label}</span>
                    </label>
                  ))}
                </div>
              )}
              {selectedMode === 'coding' && (
                <p className="mt-4 text-xs pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', color: '#6b6b8a' }}>
                  💡 Coding mode runs 5 problems per difficulty and ignores MCQ settings.
                </p>
              )}
            </div>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5 sticky top-24" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-white mb-4">Session Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Role', value: selectedRole },
                  { label: 'Difficulty', value: DIFFICULTIES.find(d => d.value === selectedDifficulty)?.label },
                  { label: 'Mode', value: MODES.find(m => m.value === selectedMode)?.title },
                  { label: selectedMode === 'coding' ? 'Problems' : 'Questions', value: selectedMode === 'coding' ? '5' : '10' },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-2">
                    <span className="text-xs" style={{ color: '#6b6b8a' }}>{item.label}</span>
                    <span className="text-xs font-semibold text-white text-right">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="my-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: '📝', label: selectedMode === 'coding' ? '5 Problems' : '10 Questions' },
                  { icon: '⏱️', label: 'Self-Paced' },
                  { icon: '📊', label: '3 Sets' },
                ].map(info => (
                  <div key={info.label} className="flex flex-col items-center p-2.5 rounded-lg text-center"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-xs mt-1" style={{ color: '#a1a1b5' }}>{info.label}</span>
                  </div>
                ))}
              </div>

              <button onClick={handleStart} disabled={loading || !selectedRole}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200"
                style={(loading || !selectedRole)
                  ? { background: 'rgba(108,94,247,0.3)', cursor: 'not-allowed' }
                  : { background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)', boxShadow: '0 8px 20px rgba(108,94,247,0.35)' }
                }>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Starting...
                  </span>
                ) : '🚀 Start Interview'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
