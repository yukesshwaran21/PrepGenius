import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import Badge from '../components/Badge';

const InterviewResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewId = location.state?.interviewId;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interviewId) { navigate('/interview-setup'); return; }
      try {
        const data = await interviewAPI.getInterviewResults(interviewId);
        setResults(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch results');
      } finally { setLoading(false); }
    };
    fetchResults();
  }, [interviewId, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p style={{ color: '#a1a1b5' }}>Loading your results...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
      <div className="p-8 rounded-2xl max-w-sm text-center" style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-white font-semibold mb-2">Something went wrong</p>
        <p className="text-sm mb-5" style={{ color: '#f87171' }}>{error}</p>
        <button onClick={() => navigate('/interview-setup')} className="btn-brand w-full py-2.5 text-sm">← Back to Setup</button>
      </div>
    </div>
  );

  if (!results) return null;

  const { summary, role, difficulty, requestedDifficulty, mode, setIndex, setCount, createdAt, detailedResults } = results;
  const diffLabels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  const tierGradients = {
    Excellent: 'linear-gradient(135deg,#059669,#10b981)',
    Good: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    Fair: 'linear-gradient(135deg,#d97706,#f59e0b)',
    'Needs Improvement': 'linear-gradient(135deg,#b91c1c,#ef4444)',
  };
  const getOptionText = (opts, id) => opts?.find(o => o.id === id)?.text || null;
  const scoreBadge = (s) => s >= 80 ? 'success' : s >= 60 ? 'info' : s >= 40 ? 'warning' : 'danger';

  const cardStyle = { background: '#13131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <div style={{ background: 'rgba(19,19,31,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-bold">Prep<span className="gradient-text">Genius</span></span>
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-3 py-1.5">Dashboard</button>
            <button onClick={() => navigate('/interview-setup')}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Try Again</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        {/* Hero Score Card */}
        <div className="rounded-2xl p-8 mb-6 text-white text-center overflow-hidden relative"
          style={{ background: tierGradients[summary.performanceTier] || tierGradients.Fair, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%), radial-gradient(circle at 70% 20%, white 0%, transparent 40%)' }} />
          <div className="relative">
            <p className="text-sm opacity-80 mb-1">🎉 Interview Complete</p>
            <p className="text-xs opacity-60 mb-4">{role} · {diffLabels[difficulty] || difficulty} · {new Date(createdAt).toLocaleDateString()}</p>
            <p className="text-7xl font-black mb-2">{summary.totalMarks}/{summary.totalQuestions}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-6"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              {summary.performanceTier}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Answered', value: `${summary.answeredQuestions}/${summary.totalQuestions}` },
                { label: 'Accuracy', value: `${summary.averageScore}%` },
                { label: 'Correct', value: summary.totalMarks },
                { label: 'Adaptive Avg', value: summary.averageAdaptiveScore },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xs opacity-70 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { icon: '📈', label: 'Highest', value: summary.maxScore, color: '#34d399' },
            { icon: '📊', label: 'Accuracy', value: `${summary.averageScore}%`, color: '#60a5fa' },
            { icon: '📉', label: 'Lowest', value: summary.minScore, color: '#f87171' },
            { icon: '⏱️', label: 'Avg Time/Q', value: `${summary.averageTimeSpentSeconds || 0}s`, color: '#c4b5fd' },
            { icon: '⌛', label: 'Timed Out', value: summary.timedOutCount || 0, color: '#fbbf24' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-2xl text-center" style={cardStyle}>
              <p className="text-2xl mb-1.5">{m.icon}</p>
              <p className="text-xs mb-1" style={{ color: '#6b6b8a' }}>{m.label}</p>
              <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Skill Breakdown */}
        {summary.perSkillSummary?.length > 0 && (
          <div className="p-6 mb-6" style={cardStyle}>
            <h2 className="text-lg font-bold text-white mb-4">🧭 Skill Breakdown</h2>
            <div className="space-y-4">
              {summary.perSkillSummary.map(skill => (
                <div key={skill.tag}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white">{skill.tag}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: '#6b6b8a' }}>{skill.correct}/{skill.total} correct</span>
                      <Badge variant={skill.accuracy >= 80 ? 'success' : skill.accuracy >= 60 ? 'info' : 'warning'}>{skill.accuracy}%</Badge>
                    </div>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${skill.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Breakdown Accordion */}
        <div className="mb-6" style={cardStyle}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h2 className="text-lg font-bold text-white">📋 Question Breakdown</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {detailedResults.map((result, idx) => (
              <div key={result.id}>
                <button onClick={() => setExpandedQuestion(expandedQuestion === result.id ? null : result.id)}
                  className="w-full px-6 py-4 flex items-start gap-3 text-left hover:bg-white/2 transition-colors">
                  <span className="text-xl mt-0.5 flex-shrink-0">
                    {result.answered ? (result.isCorrect ? '🟢' : '🔴') : '⚫'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      Q{idx + 1}: {result.questionText}
                      {result.isFollowUp && <Badge variant="warning" className="ml-2">Follow-up</Badge>}
                    </p>
                    {result.answered && (
                      <p className="text-xs mt-1" style={{ color: '#6b6b8a' }}>
                        Score: <span className="font-semibold text-white">{result.score}/1</span>
                        {result.timeSpentSeconds != null && ` · ${result.timeSpentSeconds}s`}
                        {result.timedOut && <span style={{ color: '#f87171' }}> · Timed out</span>}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs mt-1">{expandedQuestion === result.id ? '▼' : '▶'}</span>
                </button>

                {expandedQuestion === result.id && (
                  <div className="px-6 pb-5 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {result.answered ? (
                      <>
                        <div>
                          <p className="text-xs font-semibold mb-1.5" style={{ color: '#a1a1b5' }}>YOUR ANSWER</p>
                          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: '#e1e1f5' }}>
                            {result.userAnswer ? `${result.userAnswer}. ${getOptionText(result.options, result.userAnswer) || ''}` : 'No answer provided.'}
                          </div>
                        </div>
                        {!result.isCorrect && result.correctOptionId && (
                          <div>
                            <p className="text-xs font-semibold mb-1.5" style={{ color: '#34d399' }}>CORRECT ANSWER</p>
                            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#6ee7b7' }}>
                              {`${result.correctOptionId}. ${getOptionText(result.options, result.correctOptionId) || ''}`}
                            </div>
                          </div>
                        )}
                        {result.explanation && (
                          <div>
                            <p className="text-xs font-semibold mb-1.5" style={{ color: '#a1a1b5' }}>EXPLANATION</p>
                            <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: '#c1c1d5' }}>{result.explanation}</div>
                          </div>
                        )}
                        <div className={`p-3 rounded-xl text-sm ${result.isCorrect ? '' : ''}`}
                          style={result.isCorrect
                            ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#6ee7b7' }
                            : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                          {result.feedback}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm italic" style={{ color: '#6b6b8a' }}>❌ Not answered</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 mb-6 rounded-2xl" style={{ background: 'rgba(108,94,247,0.07)', border: '1px solid rgba(108,94,247,0.2)' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#8179fa' }}>💡 Recommendations</h3>
          <ul className="space-y-1.5 text-sm" style={{ color: '#c4b5fd' }}>
            {summary.performanceTier === 'Excellent' && <>
              <li>✅ Excellent! You're well-prepared for real interviews.</li>
              <li>🎯 Try advanced difficulty to challenge yourself further.</li>
              <li>📚 Review your strong areas to identify patterns.</li>
            </>}
            {summary.performanceTier === 'Good' && <>
              <li>👍 Good job! Solid understanding of the concepts.</li>
              <li>📈 Focus on lower-scoring areas to improve further.</li>
              <li>🎯 Try intermediate or advanced difficulty next.</li>
            </>}
            {summary.performanceTier === 'Fair' && <>
              <li>💪 Keep practicing! Consistency is key to improvement.</li>
              <li>📚 Review the feedback for each question carefully.</li>
              <li>🔄 Retry this role at beginner difficulty to build confidence.</li>
            </>}
            {summary.performanceTier === 'Needs Improvement' && <>
              <li>💡 Don't worry — every interview is a learning opportunity.</li>
              <li>📖 Review the topics and concepts for this role.</li>
              <li>🔄 Practice again at beginner difficulty to build fundamentals.</li>
            </>}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex-1 btn-ghost py-3 text-sm font-semibold">📊 Dashboard</button>
          <button onClick={() => navigate('/interview-setup')}
            className="flex-1 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>
            🎤 Try Another Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
