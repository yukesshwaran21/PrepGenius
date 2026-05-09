import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, dashboardAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const ActionCard = ({ title, description, icon, gradient, buttonLabel, onClick, delay = 0 }) => (
  <div
    className="relative rounded-2xl p-6 overflow-hidden cursor-pointer group animate-slide-up hover:-translate-y-1 transition-all duration-300"
    style={{ background: gradient, animationDelay: `${delay}ms`, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
    onClick={onClick}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ background: 'rgba(255,255,255,0.05)' }} />
    <div className="flex items-start justify-between mb-4">
      <div>
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{description}</p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl ml-4"
        style={{ background: 'rgba(255,255,255,0.15)' }}>{icon}</div>
    </div>
    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold group-hover:gap-3 transition-all"
      style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
      {buttonLabel} <span className="transition-transform group-hover:translate-x-1">→</span>
    </button>
  </div>
);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const profileRes = await authAPI.getProfile();
        setUser(profileRes.data.user);
        const statsRes = await dashboardAPI.getStats();
        setStats(statsRes.data.stats);
        const ivRes = await dashboardAPI.getRecentInterviews(5);
        setRecentInterviews(ivRes.data.interviews);
        const rRes = await dashboardAPI.getRecentResumes(5);
        setRecentResumes(rRes.data.resumes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p style={{ color: '#a1a1b5' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const scoreBadge = (s) => s >= 80 ? 'success' : s >= 60 ? 'info' : s >= 40 ? 'warning' : 'danger';

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#a1a1b5' }}>Active Session</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h2>
          <p style={{ color: '#a1a1b5' }}>Your interview preparation overview. Keep pushing!</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Resumes Uploaded" value={stats.resumesUploaded} icon="📄"
              gradient="linear-gradient(135deg,rgba(59,130,246,0.3),rgba(37,99,235,0.2))" delay={0} />
            <StatCard label="Interviews Taken" value={stats.interviewsTaken} icon="🎤"
              gradient="linear-gradient(135deg,rgba(168,85,247,0.3),rgba(124,58,237,0.2))" delay={100} />
            <StatCard label="Answers Submitted" value={stats.answersSubmitted} icon="✅"
              gradient="linear-gradient(135deg,rgba(16,185,129,0.3),rgba(5,150,105,0.2))" delay={200} />
            <StatCard label="Average Score" value={`${stats.averageScore}%`} icon="⭐"
              gradient="linear-gradient(135deg,rgba(245,158,11,0.3),rgba(217,119,6,0.2))" delay={300} />
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <ActionCard title="Upload & Analyze Resume"
            description="Get AI-powered ATS score, keyword suggestions, and actionable feedback."
            icon="📤" gradient="linear-gradient(135deg,#1d4ed8,#3b82f6)"
            buttonLabel="Analyze Resume" onClick={() => navigate('/resume-analyzer')} delay={0} />
          <ActionCard title="Start Mock Interview"
            description="Practice with AI-generated questions across 8 roles and 3 difficulty levels."
            icon="🎙️" gradient="linear-gradient(135deg,#6c5ef7,#8b5cf6)"
            buttonLabel="Start Interview" onClick={() => navigate('/interview-setup')} delay={100} />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interviews */}
          <div className="rounded-2xl" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span>📋</span>
                <h3 className="font-semibold text-white">Recent Interviews</h3>
              </div>
              {recentInterviews.length > 0 && (
                <button onClick={() => navigate('/history')} className="text-xs hover:underline" style={{ color: '#8179fa' }}>View all →</button>
              )}
            </div>
            <div className="p-4">
              {recentInterviews.length > 0 ? (
                <div className="space-y-2">
                  {recentInterviews.map(iv => (
                    <div key={iv.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-sm font-semibold text-white">{iv.role}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>
                          <span className="capitalize">{iv.difficulty}</span> · {iv.totalQuestions}Q · {new Date(iv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={scoreBadge(iv.averageScore)}>{iv.averageScore}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-4xl mb-3">🎤</p>
                  <p className="text-sm font-medium text-white mb-1">No interviews yet</p>
                  <p className="text-xs mb-4" style={{ color: '#6b6b8a' }}>Start your first mock interview now</p>
                  <button onClick={() => navigate('/interview-setup')} className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'rgba(108,94,247,0.2)', border: '1px solid rgba(108,94,247,0.3)' }}>
                    Start Interview →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resumes */}
          <div className="rounded-2xl" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span>📄</span>
                <h3 className="font-semibold text-white">Recent Resumes</h3>
              </div>
              {recentResumes.length > 0 && (
                <button onClick={() => navigate('/history')} className="text-xs hover:underline" style={{ color: '#8179fa' }}>View all →</button>
              )}
            </div>
            <div className="p-4">
              {recentResumes.length > 0 ? (
                <div className="space-y-2">
                  {recentResumes.map(r => (
                    <div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-sm font-semibold text-white">Resume #{r.id}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={r.hasAnalysis ? 'success' : 'warning'}>
                        {r.hasAnalysis ? '✓ Analyzed' : '⏳ Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-4xl mb-3">📄</p>
                  <p className="text-sm font-medium text-white mb-1">No resumes yet</p>
                  <p className="text-xs mb-4" style={{ color: '#6b6b8a' }}>Upload your resume for ATS analysis</p>
                  <button onClick={() => navigate('/resume-analyzer')} className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                    Upload Resume →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
