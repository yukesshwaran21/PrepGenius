import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, resumeAPI } from '../services/api';
import Badge from '../components/Badge';

const History = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('interviews');
  const [interviews, setInterviews] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true); setError('');
        const [ivData, rRes] = await Promise.all([
          interviewAPI.getUserInterviews(100),
          resumeAPI.getAllResumes(),
        ]);
        setInterviews(ivData || []);
        setResumes(rRes?.data?.resumes || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load history');
      } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  const ivStats = useMemo(() => {
    const total = interviews.length;
    const avg = total ? Math.round(interviews.reduce((s, i) => s + (i.averageScore || 0), 0) / total) : 0;
    const best = total ? Math.max(...interviews.map(i => i.averageScore || 0)) : 0;
    return { total, avg, best };
  }, [interviews]);

  const rStats = useMemo(() => {
    const total = resumes.length;
    const analyzed = resumes.filter(r => r.hasAnalysis).length;
    const avg = analyzed ? Math.round(resumes.filter(r => r.hasAnalysis).reduce((s, r) => s + (r.overallScore || 0), 0) / analyzed) : 0;
    return { total, analyzed, avg };
  }, [resumes]);

  const scoreBadge = (s) => s >= 80 ? 'success' : s >= 60 ? 'info' : s >= 40 ? 'warning' : 'danger';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p style={{ color: '#a1a1b5' }}>Loading history...</p>
      </div>
    </div>
  );

  const cardStyle = { background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Activity History</h1>
          <p style={{ color: '#a1a1b5' }}>Review your past interviews and resume analyses.</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            ⚠ {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Interviews', value: ivStats.total, color: '#8179fa' },
            { label: 'Avg Interview Score', value: `${ivStats.avg}%`, color: '#60a5fa' },
            { label: 'Best Interview', value: `${ivStats.best}%`, color: '#34d399' },
            { label: 'Resumes Analyzed', value: rStats.analyzed, color: '#fbbf24' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-5" style={cardStyle}>
              <p className="text-xs mb-2" style={{ color: '#6b6b8a' }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'interviews', label: '🎤 Interviews' },
            { key: 'resumes', label: '📄 Resume Analysis' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={tab === t.key
                ? { background: '#6c5ef7', color: 'white' }
                : { color: '#a1a1b5' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Interview List */}
        {tab === 'interviews' && (
          <div className="space-y-3">
            {interviews.length === 0 ? (
              <div className="py-16 text-center rounded-2xl" style={cardStyle}>
                <p className="text-4xl mb-3">🎤</p>
                <p className="text-white font-medium mb-1">No interviews yet</p>
                <p className="text-sm mb-4" style={{ color: '#6b6b8a' }}>Start practicing to see your history here</p>
                <button onClick={() => navigate('/interview-setup')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Start Interview</button>
              </div>
            ) : interviews.map(iv => (
              <div key={iv.id} className="flex items-center justify-between px-5 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-200"
                style={cardStyle}>
                <div>
                  <h3 className="font-semibold text-white">{iv.role}</h3>
                  <p className="text-xs mt-1" style={{ color: '#6b6b8a' }}>
                    <span className="capitalize">{iv.difficulty}</span>
                    {' · '}{iv.totalQuestions} questions
                    {' · '}{iv.answeredQuestions} answered
                    {' · '}{new Date(iv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs mb-1" style={{ color: '#6b6b8a' }}>Score</p>
                  <Badge variant={scoreBadge(iv.averageScore)}>{iv.averageScore}%</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resume List */}
        {tab === 'resumes' && (
          <div className="space-y-3">
            {resumes.length === 0 ? (
              <div className="py-16 text-center rounded-2xl" style={cardStyle}>
                <p className="text-4xl mb-3">📄</p>
                <p className="text-white font-medium mb-1">No resumes yet</p>
                <p className="text-sm mb-4" style={{ color: '#6b6b8a' }}>Upload your resume for ATS analysis</p>
                <button onClick={() => navigate('/resume-analyzer')} className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Upload Resume</button>
              </div>
            ) : resumes.map(r => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-200"
                style={cardStyle}>
                <div>
                  <h3 className="font-semibold text-white">Resume #{r.id}</h3>
                  <p className="text-xs mt-1" style={{ color: '#6b6b8a' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={r.hasAnalysis ? 'success' : 'warning'}>
                    {r.hasAnalysis ? '✓ Analyzed' : '⏳ Pending'}
                  </Badge>
                  {r.hasAnalysis && r.overallScore !== undefined && (
                    <p className="text-lg font-bold mt-1" style={{ color: '#8179fa' }}>{r.overallScore}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
