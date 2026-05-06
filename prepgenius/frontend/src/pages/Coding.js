import React, { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { codingAPI } from '../services/api';

const languageOptions = [
  { label: 'C', value: 'c', monaco: 'c' },
  { label: 'Java', value: 'java', monaco: 'java' },
  { label: 'Python', value: 'python', monaco: 'python' }
];

const formatSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Coding = () => {
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
        sourceCode
      });
      setResults({ type: 'run', payload: response });
    } catch (error) {
      setResults({
        type: 'error',
        payload: { message: error.response?.data?.error || 'Run failed.' }
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
        sourceCode
      });
      setResults({ type: 'submit', payload: response });
    } catch (error) {
      setResults({
        type: 'error',
        payload: { message: error.response?.data?.error || 'Submission failed.' }
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading coding environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/3 bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Problems</h2>
              <span className="text-xs text-slate-500">Session {formatSeconds(sessionSeconds)}</span>
            </div>
            <div className="space-y-3">
              {problems.map((problem) => (
                <button
                  key={problem.slug}
                  onClick={() => setSelectedSlug(problem.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    selectedSlug === problem.slug
                      ? 'border-slate-800 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="font-semibold">{problem.title}</div>
                  <div className={`text-xs ${selectedSlug === problem.slug ? 'text-slate-200' : 'text-slate-500'}`}>
                    {problem.difficulty} • {problem.supportedLanguages.join(', ').toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{problemDetail?.title}</h2>
                  <p className="text-sm text-slate-500">{problemDetail?.difficulty} • Time limit {problemDetail?.timeLimitMs}ms</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
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
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-900 transition"
                  >
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="prose max-w-none text-slate-700 whitespace-pre-line mb-6">
                {problemDetail?.description}
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200">
                <Editor
                  height="360px"
                  language={monacoLanguage}
                  value={sourceCode}
                  onChange={(value) => setSourceCode(value || '')}
                  theme="vs"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Results</h3>
              {!results && <p className="text-slate-500">Run or submit to see output, test cases, and analysis.</p>}
              {results?.type === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {results.payload.message}
                </div>
              )}
              {(results?.type === 'run' || results?.type === 'submit') && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white">
                      {results.payload.status}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {results.payload.passedTests}/{results.payload.totalTests} tests
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {results.payload.runtimeMs} ms
                    </span>
                    {results.payload.score !== undefined && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        Score {Math.round(results.payload.score)}%
                      </span>
                    )}
                    {results.payload.similarityScore !== undefined && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                        Similarity {results.payload.similarityScore}%
                      </span>
                    )}
                    {results.payload.complexityEstimate && (
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                        {results.payload.complexityEstimate}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {results.payload.tests?.map((test, index) => (
                      <div
                        key={`${test.input}-${index}`}
                        className={`border rounded-lg p-3 ${test.passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}
                      >
                        <div className="flex justify-between text-sm font-medium">
                          <span>Test #{index + 1}</span>
                          <span>{test.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-600">
                          <div><strong>Input:</strong> {test.input}</div>
                          <div><strong>Expected:</strong> {test.expectedOutput}</div>
                          <div><strong>Output:</strong> {test.actualOutput}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Coding;
