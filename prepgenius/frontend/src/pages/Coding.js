import React, { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { codingAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const languageOptions = [
  { label: 'C', value: 'c', monaco: 'c' },
  { label: 'Java', value: 'java', monaco: 'java' },
  { label: 'Python', value: 'python', monaco: 'python' },
];

const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Coding = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [problemDetail, setProblemDetail] = useState(null);
  const [language, setLanguage] = useState('c');
  const [sourceCode, setSourceCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((value) => value + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await codingAPI.listProblems();
        const problemList = data.problems || [];
        setProblems(problemList);
        if (problemList.length > 0) {
          setSelectedSlug(problemList[0].slug);
        }
      } catch (error) {
        console.error('Failed to load coding problems:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  useEffect(() => {
    const loadProblemDetail = async () => {
      if (!selectedSlug) {
        return;
      }
      try {
        const data = await codingAPI.getProblemDetail(selectedSlug);
        setProblemDetail(data.problem);
      } catch (error) {
        console.error('Failed to load problem detail:', error);
      }
    };

    loadProblemDetail();
  }, [selectedSlug]);

  useEffect(() => {
    if (!problemDetail) {
      return;
    }
    const starter = problemDetail.starterCode?.[language] || '';
    setSourceCode(starter);
    setResults(null);
  }, [problemDetail, language]);

  const monacoLanguage = useMemo(() => {
    const match = languageOptions.find((option) => option.value === language);
    return match?.monaco || 'plaintext';
  }, [language]);

  const handleRun = async () => {
    if (!problemDetail || !sourceCode.trim()) {
      return;
    }
    setRunning(true);
    setResults(null);
    try {
      const response = await codingAPI.runCode({
        slug: problemDetail.slug,
        language,
        sourceCode,
      });
      setResults({ type: 'run', payload: response });
    } catch (error) {
      setResults({
        type: 'error',
        payload: { message: error.response?.data?.error || 'Run failed.' },
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problemDetail || !sourceCode.trim()) {
      return;
    }
    setRunning(true);
    setResults(null);
    try {
      const response = await codingAPI.submitCode({
        slug: problemDetail.slug,
        language,
        sourceCode,
      });
      setResults({ type: 'submit', payload: response });
    } catch (error) {
      setResults({
        type: 'error',
        payload: { message: error.response?.data?.error || 'Submission failed.' },
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a12' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p style={{ color: '#a1a1b5' }}>Loading coding environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a12' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 h-14 flex items-center justify-between px-6"
        style={{ background: 'rgba(19,19,31,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg,#6c5ef7,#4f46e5)' }}>P</div>
            <span className="text-white font-semibold text-sm">Prep<span className="gradient-text">Genius</span></span>
          </button>
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: '#a1a1b5' }}>
            Coding Practice
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono" style={{ color: '#a1a1b5' }}>{formatSeconds(sessionSeconds)}</span>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-xs px-3 py-1.5">← Dashboard</button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar — Problem List */}
        <aside className="w-64 flex-shrink-0 p-3 overflow-y-auto space-y-2 border-r"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0f0f1a' }}>
          <p className="text-xs font-semibold px-2 pt-1 pb-2" style={{ color: '#6b6b8a' }}>PROBLEMS</p>
          {problems.map((problem) => (
            <button
              key={problem.slug}
              onClick={() => setSelectedSlug(problem.slug)}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm"
              style={selectedSlug === problem.slug
                ? { background: 'rgba(108,94,247,0.2)', border: '1px solid rgba(108,94,247,0.4)', color: '#c4bbff' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#a1a1b5' }}
            >
              <div className="font-semibold truncate">{problem.title}</div>
              <div className="text-xs mt-0.5 opacity-60">
                {problem.difficulty} • {problem.supportedLanguages.join(', ').toUpperCase()}
              </div>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Header + Controls */}
          <div className="px-6 py-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0f0f1a' }}>
            <div>
              <h2 className="text-lg font-bold text-white">{problemDetail?.title}</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>
                {problemDetail?.difficulty} • Time limit {problemDetail?.timeLimitMs}ms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: '#1c1c30', border: '1px solid rgba(255,255,255,0.1)', color: '#e1e1f5' }}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRun}
                disabled={running}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Description Panel */}
            <div className="w-80 flex-shrink-0 overflow-y-auto p-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#c1c1d5' }}>
                {problemDetail?.description}
              </p>
            </div>

            {/* Editor + Results */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={monacoLanguage}
                  value={sourceCode}
                  onChange={(value) => setSourceCode(value || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>

              {/* Results Panel */}
              <div className="h-48 overflow-y-auto p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0a0a12' }}>
                <h3 className="text-sm font-semibold text-white mb-3">Results</h3>
                {!results && <p className="text-sm" style={{ color: '#6b6b8a' }}>Run or submit to see output, test cases, and analysis.</p>}
                {results?.type === 'error' && (
                  <div className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                    {results.payload.message}
                  </div>
                )}
                {(results?.type === 'run' || results?.type === 'submit') && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        { label: results.payload.status, style: { background: '#6c5ef7', color: 'white' } },
                        { label: `${results.payload.passedTests}/${results.payload.totalTests} tests`, style: { background: 'rgba(255,255,255,0.08)', color: '#a1a1b5' } },
                        { label: `${results.payload.runtimeMs}ms`, style: { background: 'rgba(255,255,255,0.08)', color: '#a1a1b5' } },
                        ...(results.payload.score !== undefined ? [{ label: `${Math.round(results.payload.score)}%`, style: { background: 'rgba(16,185,129,0.15)', color: '#34d399' } }] : []),
                        ...(results.payload.similarityScore !== undefined ? [{ label: `Sim ${results.payload.similarityScore}%`, style: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' } }] : []),
                        ...(results.payload.complexityEstimate ? [{ label: results.payload.complexityEstimate, style: { background: 'rgba(108,94,247,0.15)', color: '#8179fa' } }] : []),
                      ].map((b, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={b.style}>{b.label}</span>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {results.payload.tests?.map((test, index) => (
                        <div
                          key={`${test.input}-${index}`}
                          className="px-3 py-2 rounded-lg text-xs flex items-center gap-3"
                          style={test.passed
                            ? { background: 'rgba(16,185,129,0.1)', color: '#6ee7b7' }
                            : { background: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}
                        >
                          <span>{test.passed ? '✓' : '✗'} Test #{index + 1}</span>
                          <span style={{ opacity: 0.7 }}>
                            in: {test.input} | expected: {test.expectedOutput} | out: {test.actualOutput}
                          </span>
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
    </div>
  );
};

export default Coding;
