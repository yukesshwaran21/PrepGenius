import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { interviewAPI, codingAPI } from '../services/api';

const AUTO_NEXT = 1800;
const LANGS = [
  { label: 'C', value: 'c', monaco: 'c' },
  { label: 'Java', value: 'java', monaco: 'java' },
  { label: 'Python', value: 'python', monaco: 'python' },
];
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const S = { background:'#13131f', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16 };

const CodingSession = ({ interview }) => {
  const navigate = useNavigate();
  const problems = interview?.codingProblems || [];
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState('c');
  const [code, setCode] = useState('');
  const [res, setRes] = useState(null);
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState({});
  const [secs, setSecs] = useState(0);
  const prob = problems[idx] || null;
  const done = Object.values(passed).filter(Boolean).length;
  const complete = done === problems.length && problems.length > 0;
  const monacoLang = useMemo(() => LANGS.find(l => l.value === lang)?.monaco || 'plaintext', [lang]);

  useEffect(() => { const t = setInterval(() => setSecs(v => v+1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (prob) { setCode(prob.starterCode?.[lang] || ''); setRes(null); } }, [prob, lang]);

  const run = async () => {
    if (!prob || !code.trim()) return;
    setRunning(true); setRes(null);
    try {
      const r = await codingAPI.runCode({ slug: prob.slug, language: lang, sourceCode: code });
      setRes({ type: 'run', payload: r });
    } catch (e) { setRes({ type: 'error', payload: { message: e.response?.data?.error || 'Run failed.' } }); }
    finally { setRunning(false); }
  };

  const submit = async () => {
    if (!prob || !code.trim()) return;
    setRunning(true); setRes(null);
    try {
      const r = await codingAPI.submitCode({ slug: prob.slug, language: lang, sourceCode: code });
      setRes({ type: 'submit', payload: r });
      if (r.status === 'passed' && r.passedTests === r.totalTests)
        setPassed(p => ({ ...p, [prob.slug]: true }));
    } catch (e) { setRes({ type: 'error', payload: { message: e.response?.data?.error || 'Submission failed.' } }); }
    finally { setRunning(false); }
  };

  if (!prob) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
      <div className="text-center p-8 rounded-2xl" style={S}>
        <p className="text-white mb-4">No coding problems available.</p>
        <button onClick={() => navigate('/interview-setup')} className="btn-brand px-4 py-2 text-sm">Back to Setup</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      <div className="sticky top-0 z-50 h-14 flex items-center justify-between px-6"
        style={{ background: 'rgba(19,19,31,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
          <span className="text-white font-semibold text-sm">Coding Interview</span>
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: '#a1a1b5' }}>
            {interview?.difficulty?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: '#a1a1b5' }}>{fmt(secs)}</span>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
            {done}/{problems.length} Passed
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 p-3 overflow-y-auto space-y-2 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0f0f1a' }}>
          {problems.map((p, i) => (
            <button key={p.slug} onClick={() => setIdx(i)}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm"
              style={i === idx
                ? { background: 'rgba(108,94,247,0.2)', border: '1px solid rgba(108,94,247,0.4)', color: '#c4bbff' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#a1a1b5' }}>
              <div className="font-semibold truncate">{p.title}</div>
              <div className="text-xs mt-0.5 opacity-60">{p.difficulty}</div>
            </button>
          ))}
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0f0f1a' }}>
            <div>
              <h2 className="text-lg font-bold text-white">{prob.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>
                Problem {idx+1} of {problems.length} · Time limit {prob.timeLimitMs}ms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border"
                style={{ background: '#1c1c30', border: '1px solid rgba(255,255,255,0.1)', color: '#e1e1f5' }}>
                {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <button onClick={run} disabled={running}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>Run</button>
              <button onClick={submit} disabled={running}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>Submit</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Description */}
            <div className="w-80 flex-shrink-0 overflow-y-auto p-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#c1c1d5', whiteSpace: 'pre-line' }}>{prob.description}</p>
              {prob.sampleTests?.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-white mb-2">Sample Tests</p>
                  {prob.sampleTests.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl mb-2 text-xs" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div style={{ color: '#a1a1b5' }}><strong className="text-white">In:</strong> {t.input}</div>
                      <div style={{ color: '#a1a1b5' }}><strong className="text-white">Out:</strong> {t.expectedOutput}</div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Editor + Results */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <Editor height="100%" language={monacoLang} value={code} onChange={v => setCode(v||'')}
                  theme="vs-dark" options={{ fontSize:14, minimap:{enabled:false}, scrollBeyondLastLine:false }} />
              </div>
              <div className="h-48 overflow-y-auto p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0a0a12' }}>
                {!res && <p className="text-sm" style={{ color: '#6b6b8a' }}>Run or submit to see results.</p>}
                {res?.type === 'error' && <p className="text-sm" style={{ color: '#f87171' }}>{res.payload.message}</p>}
                {(res?.type === 'run' || res?.type === 'submit') && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { label: res.payload.status, style: { background: '#6c5ef7', color: 'white' } },
                        { label: `${res.payload.passedTests}/${res.payload.totalTests} tests`, style: { background: 'rgba(255,255,255,0.08)', color: '#a1a1b5' } },
                        { label: `${res.payload.runtimeMs}ms`, style: { background: 'rgba(255,255,255,0.08)', color: '#a1a1b5' } },
                        ...(res.payload.score != null ? [{ label: `${Math.round(res.payload.score)}%`, style: { background: 'rgba(16,185,129,0.15)', color: '#34d399' } }] : []),
                      ].map((b, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={b.style}>{b.label}</span>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {res.payload.tests?.map((t, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg text-xs flex items-center gap-3"
                          style={t.passed ? { background: 'rgba(16,185,129,0.1)', color: '#6ee7b7' } : { background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>
                          <span>{t.passed ? '✓' : '✗'} Test #{i+1}</span>
                          <span style={{ color: 'inherit', opacity: 0.7 }}>in: {t.input} | out: {t.actualOutput}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {complete && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="p-8 rounded-2xl text-center max-w-sm w-full mx-4" style={S}>
            <p className="text-4xl mb-3">🎉</p>
            <h3 className="text-xl font-bold text-white mb-2">Session Complete!</h3>
            <p className="text-sm mb-5" style={{ color: '#a1a1b5' }}>You passed {done} of {problems.length} problems.</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interview?.questionTimeLimitSec || 60);
  const [totalTimeLeft, setTotalTimeLeft] = useState(interview?.totalTimeLimitSec || 0);
  const [qStart, setQStart] = useState(new Date());
  const [questions, setQuestions] = useState(interview?.questions || []);
  const autoRef = useRef(null);

  useEffect(() => { if (!interview) navigate('/interview-setup'); return () => { if (autoRef.current) clearTimeout(autoRef.current); }; }, [interview, navigate]);

  const mode = interview?.mode || 'standard';
  const total = questions.length;
  const safeIdx = Math.min(qIdx, Math.max(total-1, 0));
  const curQ = questions[safeIdx] || null;
  const progress = ((qIdx+1) / Math.max(total,1)) * 100;
  const qLimit = interview?.questionTimeLimitSec || 60;
  const totalLimit = interview?.totalTimeLimitSec || qLimit * total;
  const hasSub = curQ ? Boolean(submitted[curQ.id]) : false;
  const curFeedback = curQ ? (feedback[curQ.id] || null) : null;
  const options = curQ?.options || [];
  const locked = showFeedback || loading || hasSub || options.length === 0;

  useEffect(() => { if (!interview || !curQ) return; setAnswer(''); setShowFeedback(false); setTimeLeft(qLimit); setQStart(new Date()); if (autoRef.current) clearTimeout(autoRef.current); }, [interview, curQ, qIdx, qLimit]);

  const getSpent = () => { const e = Math.round((Date.now()-qStart.getTime())/1000); return (mode==='standard'||mode==='live') ? Math.min(qLimit, Math.max(0,e)) : Math.max(0,e); };

  const moveNext = () => {
    if (!interview) { navigate('/interview-setup'); return; }
    if (qIdx < total-1) { setQIdx(p => p+1); return; }
    navigate('/interview-results', { state: { interviewId: interview.interviewId } });
  };

  const submitAnswer = async ({ timedOut=false } = {}) => {
    if (!curQ || hasSub || loading) return;
    if (!timedOut && !answer.trim()) { alert('Please select an answer'); return; }
    const ans = timedOut && !answer.trim() ? '' : answer;
    setLoading(true);
    try {
      const r = await interviewAPI.submitAnswer(curQ.id, ans, {
        answerStartedAt: qStart.toISOString(), answerSubmittedAt: new Date().toISOString(),
        timeSpentSeconds: getSpent(), timedOut, autoSubmitted: timedOut,
      });
      setSubmitted(p => ({ ...p, [curQ.id]: { userAnswer: ans, timedOut } }));
      setFeedback(p => ({ ...p, [curQ.id]: r }));
      setShowFeedback(true);
      if (r.followUpQuestion) setQuestions(p => [...p, r.followUpQuestion]);
      if (mode==='standard'||mode==='live'||mode==='timed') autoRef.current = setTimeout(moveNext, AUTO_NEXT);
    } catch (e) { alert(e.response?.data?.error || 'Failed to submit answer'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!interview || !curQ || showFeedback || hasSub || loading || mode==='review' || mode==='timed') return;
    if (timeLeft === 0) { submitAnswer({ timedOut: true }); return; }
    const t = setInterval(() => setTimeLeft(p => Math.max(p-1,0)), 1000);
    return () => clearInterval(t);
  }, [interview, curQ, showFeedback, hasSub, loading, timeLeft]);

  useEffect(() => {
    if (!interview || mode!=='timed') return;
    setTotalTimeLeft(totalLimit);
    const t = setInterval(() => setTotalTimeLeft(p => Math.max(p-1,0)), 1000);
    return () => clearInterval(t);
  }, [interview, mode, totalLimit]);

  useEffect(() => {
    if (!interview || mode!=='timed' || totalTimeLeft!==0) return;
    submitAnswer({ timedOut: true });
    navigate('/interview-results', { state: { interviewId: interview.interviewId } });
  }, [totalTimeLeft]);

  const timerColor = useMemo(() => { const v = mode==='timed' ? totalTimeLeft : timeLeft; return v<=10 ? '#ef4444' : v<=20 ? '#f59e0b' : '#10b981'; }, [mode, timeLeft, totalTimeLeft]);

  if (interview?.mode === 'coding') return <CodingSession interview={interview} />;
  if (!interview || !curQ) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-50 h-14 px-4 sm:px-6 flex items-center justify-between"
        style={{ background: 'rgba(19,19,31,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        <div>
          <span className="text-sm font-semibold text-white">{interview.role}</span>
          <span className="text-xs ml-2 px-2 py-0.5 rounded-md" style={{ background: 'rgba(108,94,247,0.2)', color: '#8179fa' }}>{mode.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono font-bold" style={{ color: timerColor }}>
            {mode==='timed' ? `${totalTimeLeft}s` : `${timeLeft}s`}
          </span>
          <span className="text-xs" style={{ color: '#6b6b8a' }}>Q {qIdx+1}/{total}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-1 transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#6c5ef7,#a855f7)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Question Card */}
        <div className="p-6 mb-5 animate-slide-up" style={S}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa' }}>
              Question {qIdx+1}
            </span>
            <div className="flex gap-2">
              {curQ.isFollowUp && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>Follow-up</span>}
              {curQ.difficultyTag && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(108,94,247,0.15)', color: '#8179fa' }}>{curQ.difficultyTag}</span>}
            </div>
          </div>
          <p className="text-lg text-white leading-relaxed mb-6">{curQ.questionText}</p>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {options.length === 0 && <p className="text-sm" style={{ color: '#f87171' }}>Options unavailable for this question.</p>}
            {options.map(opt => (
              <label key={opt.id}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-150"
                style={locked
                  ? { cursor:'not-allowed', opacity:0.7, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }
                  : answer===opt.id
                    ? { background:'rgba(108,94,247,0.12)', border:'1.5px solid rgba(108,94,247,0.4)', cursor:'pointer' }
                    : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', cursor:'pointer' }
                }>
                <input type="radio" name={`q-${curQ.id}`} value={opt.id} disabled={locked}
                  checked={answer===opt.id} onChange={() => setAnswer(opt.id)} className="mt-1 accent-violet-500" />
                <div>
                  <span className="text-xs font-bold" style={{ color: '#6b6b8a' }}>{opt.id}.</span>
                  <span className="text-sm ml-1.5" style={{ color: '#e1e1f5' }}>{opt.text}</span>
                </div>
              </label>
            ))}
          </div>

          {timeLeft <= 10 && !showFeedback && (
            <p className="text-xs font-semibold mb-3 animate-pulse" style={{ color: '#ef4444' }}>⚠ Auto-submit imminent!</p>
          )}

          {/* Feedback */}
          {showFeedback && curFeedback && (
            <div className="p-5 rounded-xl mb-4 animate-slide-up" style={{ background: 'rgba(108,94,247,0.08)', border: '1px solid rgba(108,94,247,0.2)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: '#8179fa' }}>AI Feedback</span>
                <span className="text-2xl font-bold" style={{ color: '#8179fa' }}>{curFeedback.score}/1</span>
              </div>
              <p className="text-sm mb-2" style={{ color: '#c1c1d5' }}>{curFeedback.feedback}</p>
              <p className="text-xs" style={{ color: '#6b6b8a' }}>
                {curFeedback.timedOut ? 'Auto-submitted (timeout)' : 'Submitted in time'}
                {curFeedback.timeSpentSeconds != null && ` · ${curFeedback.timeSpentSeconds}s`}
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: '#8179fa' }}>Moving to next question...</p>
            </div>
          )}

          {!showFeedback && (
            <button onClick={() => submitAnswer({ timedOut:false })} disabled={loading||timeLeft===0}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all"
              style={loading||timeLeft===0 ? { background:'rgba(108,94,247,0.3)', cursor:'not-allowed' }
                : { background:'linear-gradient(135deg,#6c5ef7,#4f46e5)', boxShadow:'0 8px 20px rgba(108,94,247,0.3)' }}>
              {loading ? 'Submitting...' : 'Submit Answer →'}
            </button>
          )}
        </div>

        {/* Review Nav */}
        {mode === 'review' && (
          <div className="flex gap-3 mb-5">
            <button onClick={() => setQIdx(p => Math.max(p-1,0))} disabled={qIdx===0}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium btn-ghost disabled:opacity-40">← Previous</button>
            <button onClick={() => setQIdx(p => Math.min(p+1,total-1))} disabled={qIdx>=total-1}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium btn-ghost disabled:opacity-40">Next →</button>
            <button onClick={() => navigate('/interview-results',{state:{interviewId:interview.interviewId}})}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background:'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>Finish Review</button>
          </div>
        )}

        {/* Progress Dots */}
        <div className="p-5 rounded-2xl" style={S}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#6b6b8a' }}>PROGRESS</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const cur = i === qIdx;
              const done = Boolean(submitted[q.id]);
              return (
                <div key={q.id} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={cur ? { background:'#6c5ef7', color:'white', boxShadow:'0 0 12px rgba(108,94,247,0.5)' }
                    : done ? { background:'rgba(16,185,129,0.2)', color:'#34d399', border:'1px solid rgba(16,185,129,0.3)' }
                    : { background:'rgba(255,255,255,0.06)', color:'#6b6b8a' }}>
                  {done ? '✓' : i+1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
