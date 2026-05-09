import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import Badge from '../components/Badge';

const ROLES = ['React Developer','Angular Developer','Vue Developer','Java Developer','Python Developer','Node.js Developer','Full Stack Developer','DevOps Engineer'];
const DIFFICULTIES = ['beginner','intermediate','advanced'];
const S = { background:'#13131f', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16 };
const selectStyle = { background:'#1c1c30', border:'1px solid rgba(255,255,255,0.1)', color:'#e1e1f5', borderRadius:10, padding:'0.5rem 0.75rem', width:'100%', fontSize:'0.875rem' };

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    interviewAPI.getUserInterviews(50)
      .then(data => setInterviews(data))
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch interviews'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = interviews
    .filter(iv => (!filterRole || iv.role === filterRole) && (!filterDifficulty || iv.difficulty === filterDifficulty))
    .sort((a,b) => sortBy==='highest' ? b.averageScore-a.averageScore : sortBy==='lowest' ? a.averageScore-b.averageScore : new Date(b.createdAt)-new Date(a.createdAt));

  const stats = {
    total: interviews.length,
    avg: interviews.length ? Math.round(interviews.reduce((s,i)=>s+i.averageScore,0)/interviews.length) : 0,
    best: interviews.length ? Math.max(...interviews.map(i=>i.averageScore)) : 0,
    totalQ: interviews.reduce((s,i)=>s+i.totalQuestions,0),
  };

  const roleStats = {};
  interviews.forEach(iv => {
    if (!roleStats[iv.role]) roleStats[iv.role] = { count:0, total:0 };
    roleStats[iv.role].count++; roleStats[iv.role].total += iv.averageScore;
  });

  const scoreBadge = (s) => s>=80?'success':s>=60?'info':s>=40?'warning':'danger';
  const diffLabel = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced' };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#0a0a12' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p style={{ color:'#a1a1b5' }}>Loading interview history...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background:'#0a0a12' }}>
      <div style={{ background:'rgba(19,19,31,0.9)', borderBottom:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(20px)' }} className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background:'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-bold">Prep<span className="gradient-text">Genius</span></span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-3 py-1.5">← Dashboard</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Interview History</h1>
          <p style={{ color:'#a1a1b5' }}>Track your performance and progress over time.</p>
        </div>

        {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171' }}>⚠ {error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total Interviews', value:stats.total, color:'#8179fa' },
            { label:'Average Score', value:`${stats.avg}%`, color:'#34d399' },
            { label:'Best Score', value:`${stats.best}%`, color:'#60a5fa' },
            { label:'Total Questions', value:stats.totalQ, color:'#fbbf24' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={S}>
              <p className="text-xs mb-2" style={{ color:'#6b6b8a' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {interviews.length === 0 ? (
          <div className="py-16 text-center rounded-2xl" style={S}>
            <p className="text-4xl mb-3">🎤</p>
            <p className="text-white font-medium mb-1">No interviews yet</p>
            <p className="text-sm mb-4" style={{ color:'#6b6b8a' }}>Start your first mock interview</p>
            <button onClick={() => navigate('/interview-setup')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background:'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Start Interview</button>
          </div>
        ) : (
          <>
            {/* Role Breakdown */}
            {Object.keys(roleStats).length > 0 && (
              <div className="p-6 mb-6 rounded-2xl" style={S}>
                <h3 className="text-sm font-semibold text-white mb-4">📈 Performance by Role</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(roleStats).sort((a,b)=>b[1].count-a[1].count).map(([role, rs]) => {
                    const avg = Math.round(rs.total/rs.count);
                    return (
                      <div key={role} className="p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
                        <p className="text-xs font-medium text-white truncate mb-1">{role}</p>
                        <p className="text-xs mb-1.5" style={{ color:'#6b6b8a' }}>{rs.count} interview{rs.count>1?'s':''}</p>
                        <Badge variant={scoreBadge(avg)}>{avg}% avg</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="p-5 mb-6 rounded-2xl" style={S}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'#a1a1b5' }}>Role</label>
                  <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={selectStyle}>
                    <option value="">All Roles</option>
                    {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'#a1a1b5' }}>Difficulty</label>
                  <select value={filterDifficulty} onChange={e=>setFilterDifficulty(e.target.value)} style={selectStyle}>
                    <option value="">All Levels</option>
                    {DIFFICULTIES.map(d=><option key={d} value={d}>{diffLabel[d]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color:'#a1a1b5' }}>Sort By</label>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={selectStyle}>
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Score</option>
                    <option value="lowest">Lowest Score</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs mb-1.5" style={{ color:'#a1a1b5' }}>Results</p>
                  <p className="text-xl font-bold" style={{ color:'#8179fa' }}>{filtered.length}</p>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="py-10 text-center rounded-2xl" style={S}>
                  <p className="text-white">No interviews match your filters</p>
                </div>
              ) : filtered.map(iv => (
                <div key={iv.id} className="flex items-center justify-between px-5 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-200" style={S}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{iv.role}</h3>
                      <Badge variant={iv.difficulty==='beginner'?'success':iv.difficulty==='intermediate'?'warning':'danger'}>
                        {diffLabel[iv.difficulty]||iv.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs" style={{ color:'#6b6b8a' }}>
                      {new Date(iv.createdAt).toLocaleDateString()} · {iv.totalQuestions} questions · {iv.answeredQuestions} answered · Set {iv.setIndex||1}/{iv.setCount||3}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs mb-1" style={{ color:'#6b6b8a' }}>Score</p>
                    <Badge variant={scoreBadge(iv.averageScore)} className="text-sm">{iv.averageScore}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
