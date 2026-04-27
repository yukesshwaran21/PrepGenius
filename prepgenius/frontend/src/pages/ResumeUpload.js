import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';

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

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await resumeAPI.getTemplates();
        setTemplates(response.data.templates || []);
      } catch (err) {
        console.error('Failed to load templates:', err);
      }
    };

    loadTemplates();
  }, []);

  const isSupportedFile = (selectedFile) => {
    if (!selectedFile) {
      return false;
    }
    return (
      selectedFile.type === 'application/pdf' ||
      selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      selectedFile.type === 'text/plain'
    );
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];

    if (!isSupportedFile(droppedFile)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setError('');
    setFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!isSupportedFile(selectedFile)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (mode === 'file') {
        if (!file) {
          setError('Please select a file first');
          setLoading(false);
          return;
        }
        response = await resumeAPI.uploadResume(file, jdHints);
        setAnalysis(response.data.resume.analysis);
      } else {
        if (!resumeText || resumeText.trim().length < 50) {
          setError('Please paste at least 50 characters of resume text');
          setLoading(false);
          return;
        }
        response = await resumeAPI.analyzeText(resumeText, jdHints);
        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setAnalysis(null);
    setFile(null);
    setResumeText('');
    setJdHints('');
    setError('');
  };

  const scoreColor = (score) => {
    if (score >= 85) {
      return 'text-green-600';
    }
    if (score >= 70) {
      return 'text-blue-600';
    }
    if (score >= 55) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const breakdownItems = analysis?.sectionBreakdown
    ? [
        {
          label: 'Keyword Alignment',
          data: analysis.sectionBreakdown.keywordAlignment
        },
        {
          label: 'Structure & Parseability',
          data: analysis.sectionBreakdown.structureParseability
        },
        {
          label: 'Formatting Compatibility',
          data: analysis.sectionBreakdown.formattingCompatibility
        },
        {
          label: 'Dates & Consistency',
          data: analysis.sectionBreakdown.datesConsistency
        },
        {
          label: 'Readability',
          data: analysis.sectionBreakdown.readability
        }
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <h1 className="text-2xl font-bold text-slate-900">PrepGenius ATS</h1>
            <p className="text-xs text-slate-500">End-to-end ATS resume evaluation</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!analysis ? (
          <>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900 mb-2">ATS Resume Evaluator</h2>
              <p className="text-slate-600">
                Analyze a resume against ATS criteria with a weighted score, issue flags, keyword guidance, and template recommendations.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="mb-6 inline-flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setMode('file')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                    mode === 'file' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setMode('text')}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                    mode === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Paste Parsed Text
                </button>
              </div>

              {mode === 'file' ? (
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                    file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                  />

                  <p className="text-4xl mb-3">📄</p>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    {file ? file.name : 'Drop resume file here'}
                  </h3>
                  <p className="text-slate-600 mb-4">Supported formats: PDF, DOCX, TXT</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resume Parsed Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={14}
                    placeholder="Paste extracted resume text here..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Optional Job Description Hints</label>
                <textarea
                  value={jdHints}
                  onChange={(e) => setJdHints(e.target.value)}
                  rows={6}
                  placeholder="Paste the target JD or key requirements to improve keyword alignment scoring..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                    loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {loading ? 'Analyzing ATS compatibility...' : 'Run ATS Evaluation'}
                </button>
                <button
                  onClick={resetAnalyzer}
                  disabled={loading}
                  className="px-6 py-3 rounded-lg font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {templates.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">High-Score ATS Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-slate-900">{template.name}</h4>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          Score Potential {template.expectedAtsScoreRange}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Best for: {template.bestFor}</p>
                      <p className="text-sm font-medium text-slate-700 mb-1">Why ATS-friendly</p>
                      <ul className="text-sm text-slate-600 list-disc pl-5 mb-3">
                        {template.whyItScoresWell.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium text-slate-700 mb-1">Tailor to JD</p>
                      <ul className="text-sm text-slate-600 list-disc pl-5">
                        {template.tailoringInstructions.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={resetAnalyzer} className="text-emerald-700 hover:text-emerald-900 font-semibold mb-5">
              ← Analyze Another Resume
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">ATS Report</h2>
                  <p className="text-slate-600 mt-1">Workflow: {analysis.workflowVersion || 'ats-v1.0'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Overall ATS Score</p>
                  <p className={`text-5xl font-bold ${scoreColor(analysis.overallScore || 0)}`}>
                    {analysis.overallScore || 0}
                  </p>
                  <p className="text-slate-500">/100</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-slate-700">{analysis.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {breakdownItems.map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {item.data?.score || 0}
                      <span className="text-sm text-slate-500"> / {item.data?.max || 0}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                  <h3 className="font-semibold text-red-800 mb-3">Flagged ATS Issues</h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    {(analysis.flaggedIssues || []).length > 0 ? (
                      analysis.flaggedIssues.map((issue, idx) => <li key={idx}>• {issue}</li>)
                    ) : (
                      <li>No critical ATS issues found.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
                  <h3 className="font-semibold text-emerald-800 mb-3">Action Plan Checklist</h3>
                  <ul className="space-y-2 text-sm text-emerald-700">
                    {(analysis.remediationSteps || []).map((step, idx) => (
                      <li key={idx}>□ {step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="font-semibold text-blue-800 mb-3">Targeted Keyword Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.recommendations?.targetedKeywordSuggestions || []).map((kw) => (
                      <span key={kw} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
                  <h3 className="font-semibold text-indigo-800 mb-3">Template Fit Guidance</h3>
                  <p className="text-sm text-indigo-700">
                    {analysis.recommendations?.templateFitGuidance || 'Use ATS Classic Chronological by default.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex gap-3">
                <button
                  onClick={resetAnalyzer}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Analyze Another Resume
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-slate-200 text-slate-800 px-5 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            {analysis.templates?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready-to-Use ATS Templates</h3>
                <div className="space-y-5">
                  {analysis.templates.map((template) => (
                    <div key={template.id} className="border border-slate-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <h4 className="text-lg font-semibold text-slate-900">{template.name}</h4>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                          {template.expectedAtsScoreRange}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{template.bestFor}</p>
                      <p className="text-sm font-medium text-slate-700 mb-1">Template Content</p>
                      <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 overflow-auto whitespace-pre-wrap">
                        {template.templateText}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ResumeUpload;
