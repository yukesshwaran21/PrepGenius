import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import Badge from '../components/Badge';

const ScoreRing = ({ score, size = 120 }) => {
  const r = 45; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#6c5ef7' : score >= 55 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="18" fontWeight="bold">{score}</text>
    </svg>
  );
};

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jdHints, setJdHints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    resumeAPI.getTemplates().then(r => setTemplates(r.data.templates || [])).catch(() => {});
  }, []);

  const isSupportedFile = (f) => f && (
    f.type === 'application/pdf' ||
    f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    f.type === 'text/plain'
  );

  const handleFileDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!isSupportedFile(f)) { setError('Please upload a PDF, DOCX, or TXT file'); return; }
    setError(''); setFile(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!isSupportedFile(f)) { setError('Please upload a PDF, DOCX, or TXT file'); return; }
    setError(''); setFile(f);
  };

  const handleAnalyze = async () => {
    setLoading(true); setError('');
    try {
      let response;
      if (mode === 'file') {
        if (!file) { setError('Please select a file first'); setLoading(false); return; }
        response = await resumeAPI.uploadResume(file, jdHints);
        setAnalysis(response.data.resume.analysis);
      } else {
        if (!resumeText || resumeText.trim().length < 50) { setError('Please paste at least 50 characters'); setLoading(false); return; }
        response = await resumeAPI.analyzeText(resumeText, jdHints);
        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally { setLoading(false); }
  };

  const resetAnalyzer = () => { setAnalysis(null); setFile(null); setResumeText(''); setJdHints(''); setError(''); };

  const breakdownItems = analysis?.sectionBreakdown ? [
    { label: 'Keyword Alignment', data: analysis.sectionBreakdown.keywordAlignment },
    { label: 'Structure', data: analysis.sectionBreakdown.structureParseability },
    { label: 'Formatting', data: analysis.sectionBreakdown.formattingCompatibility },
    { label: 'Dates', data: analysis.sectionBreakdown.datesConsistency },
    { label: 'Readability', data: analysis.sectionBreakdown.readability },
  ] : [];

  const cardStyle = { background: '#13131f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <div style={{ background: 'rgba(19,19,31,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-bold">Prep<span className="gradient-text">Genius</span> <span className="text-xs font-normal" style={{ color: '#6b6b8a' }}>ATS</span></span>
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-3 py-1.5">← Dashboard</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        {!analysis ? (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                📊 ATS Resume Evaluator
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">ATS Resume Evaluator</h1>
              <p style={{ color: '#a1a1b5' }}>Score your resume against ATS criteria with weighted analysis, keyword guidance, and templates.</p>
            </div>

            <div className="p-6 mb-6" style={cardStyle}>
              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  ⚠ {error}
                </div>
              )}

              {/* Mode Toggle */}
              <div className="flex gap-1.5 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[{ key: 'file', label: '📎 Upload File' }, { key: 'text', label: '📋 Paste Text' }].map(m => (
                  <button key={m.key} onClick={() => setMode(m.key)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={mode === m.key ? { background: '#6c5ef7', color: 'white' } : { color: '#a1a1b5' }}>
                    {m.label}
                  </button>
                ))}
              </div>

              {mode === 'file' ? (
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className="rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer"
                  style={{
                    border: `2px dashed ${dragOver ? '#6c5ef7' : file ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                    background: dragOver ? 'rgba(108,94,247,0.05)' : file ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.docx,.txt" className="hidden" />
                  <div className="text-4xl mb-3">{file ? '✅' : '📁'}</div>
                  <p className="font-semibold text-white mb-1">{file ? file.name : 'Drop your resume here'}</p>
                  <p className="text-sm mb-4" style={{ color: '#6b6b8a' }}>PDF, DOCX, or TXT supported</p>
                  <button className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    {file ? 'Change File' : 'Browse File'}
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>Resume Text</label>
                  <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={12}
                    placeholder="Paste your extracted resume text here..."
                    className="input-dark" style={{ resize: 'vertical' }} />
                </div>
              )}

              <div className="mt-5">
                <label className="block text-sm font-medium mb-2" style={{ color: '#c1c1d5' }}>
                  Job Description Hints <span style={{ color: '#6b6b8a' }}>(optional)</span>
                </label>
                <textarea value={jdHints} onChange={e => setJdHints(e.target.value)} rows={5}
                  placeholder="Paste the target job description or key requirements to improve keyword scoring..."
                  className="input-dark" style={{ resize: 'vertical' }} />
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={handleAnalyze} disabled={loading}
                  className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                  style={loading ? { background: 'rgba(16,185,129,0.3)', cursor: 'not-allowed' }
                    : { background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Analyzing...
                    </span>
                  ) : '🔍 Run ATS Evaluation'}
                </button>
                <button onClick={resetAnalyzer} disabled={loading} className="btn-ghost text-sm px-5 py-3">Reset</button>
              </div>
            </div>

            {templates.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">High-Score ATS Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(t => (
                    <div key={t.id} className="p-5" style={cardStyle}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-white">{t.name}</h4>
                        <Badge variant="success">{t.expectedAtsScoreRange}</Badge>
                      </div>
                      <p className="text-xs mb-3" style={{ color: '#a1a1b5' }}>Best for: {t.bestFor}</p>
                      <p className="text-xs font-semibold text-white mb-1">Why ATS-Friendly</p>
                      <ul className="text-xs space-y-0.5 mb-3" style={{ color: '#a1a1b5' }}>
                        {t.whyItScoresWell.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={resetAnalyzer} className="flex items-center gap-2 mb-6 text-sm font-medium hover:underline transition-colors"
              style={{ color: '#34d399' }}>← Analyze Another Resume</button>

            <div className="p-6 mb-5" style={cardStyle}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 mb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">ATS Report</h2>
                  <p className="text-sm" style={{ color: '#6b6b8a' }}>Workflow: {analysis.workflowVersion || 'ats-v1.0'}</p>
                </div>
                <div className="flex flex-col items-center">
                  <ScoreRing score={analysis.overallScore || 0} />
                  <p className="text-xs mt-1" style={{ color: '#6b6b8a' }}>Overall ATS Score</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: '#c1c1d5' }}>
                {analysis.summary}
              </div>

              {/* Section Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {breakdownItems.map(item => (
                  <div key={item.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-xs mb-1" style={{ color: '#6b6b8a' }}>{item.label}</p>
                    <p className="text-lg font-bold text-white">{item.data?.score || 0}
                      <span className="text-xs font-normal" style={{ color: '#6b6b8a' }}>/{item.data?.max || 0}</span>
                    </p>
                    <div className="progress-bar-track mt-2">
                      <div className="progress-bar-fill" style={{ width: `${((item.data?.score || 0) / (item.data?.max || 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Issues + Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: '#f87171' }}>⚠ Flagged ATS Issues</h3>
                  <ul className="space-y-1.5 text-xs" style={{ color: '#fca5a5' }}>
                    {(analysis.flaggedIssues || []).length > 0
                      ? analysis.flaggedIssues.map((issue, i) => <li key={i}>• {issue}</li>)
                      : <li>✓ No critical issues found.</li>}
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: '#34d399' }}>✅ Action Plan</h3>
                  <ul className="space-y-1.5 text-xs" style={{ color: '#6ee7b7' }}>
                    {(analysis.remediationSteps || []).map((s, i) => <li key={i}>□ {s}</li>)}
                  </ul>
                </div>
              </div>

              {/* Keywords + Template Guidance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(108,94,247,0.07)', border: '1px solid rgba(108,94,247,0.15)' }}>
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: '#8179fa' }}>🔑 Keyword Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.recommendations?.targetedKeywordSuggestions || []).map(kw => (
                      <Badge key={kw} variant="brand">{kw}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: '#60a5fa' }}>📋 Template Guidance</h3>
                  <p className="text-xs" style={{ color: '#93c5fd' }}>
                    {analysis.recommendations?.templateFitGuidance || 'Use ATS Classic Chronological by default.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button onClick={resetAnalyzer} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>Analyze Another</button>
                <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm px-5 py-2.5">← Dashboard</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
