import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.includes('word'))) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF or DOC file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.includes('word'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF or DOC file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await resumeAPI.uploadResume(file);
      setAnalysis(response.data.resume);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/dashboard')}>
            <h1 className="text-2xl font-bold text-blue-600">PrepGenius</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {!analysis ? (
          <>
            {/* Page Title */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">📄 Resume Analyzer</h2>
              <p className="text-gray-600 text-lg">
                Upload your resume to get AI-powered feedback and improvement suggestions
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-12 mb-8">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Drag and Drop Area */}
              <div
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                className={`border-3 border-dashed rounded-lg p-12 text-center transition ${
                  file
                    ? 'border-green-500 bg-green-50'
                    : 'border-blue-300 bg-blue-50 hover:border-blue-500'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />

                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {file ? file.name : 'Drag and drop your resume'}
                </h3>
                <p className="text-gray-600 mb-6">
                  or click the button below to select a file
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Select File
                </button>
              </div>

              {/* Upload Button */}
              {file && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {loading ? 'Analyzing... (This may take a minute)' : 'Analyze Resume'}
                  </button>
                  <button
                    onClick={() => {
                      setFile(null);
                      setError('');
                    }}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-bold text-gray-800 mb-2">Strengths</h3>
                <p className="text-gray-600 text-sm">
                  Discover what makes your resume stand out
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-gray-800 mb-2">Improvements</h3>
                <p className="text-gray-600 text-sm">
                  Get actionable feedback to enhance your resume
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-gray-800 mb-2">Score</h3>
                <p className="text-gray-600 text-sm">
                  See your overall resume quality rating
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Analysis Results */}
            <div className="mb-8">
              <button
                onClick={() => setAnalysis(null)}
                className="text-blue-600 hover:text-blue-800 font-semibold mb-6"
              >
                ← Upload Another Resume
              </button>

              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis</h2>
                    <p className="text-gray-600">
                      Uploaded on {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Overall Score</p>
                    <p className="text-5xl font-bold text-blue-600">
                      {analysis.analysis?.overallScore || 0}
                    </p>
                    <p className="text-gray-500">/100</p>
                  </div>
                </div>

                {/* Summary */}
                {analysis.analysis?.summary && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-gray-800 mb-3">📝 Summary</h3>
                    <p className="text-gray-700">{analysis.analysis.summary}</p>
                  </div>
                )}

                {/* Three Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Strengths */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-bold text-green-800 mb-4 text-lg">✨ Strengths</h3>
                    <ul className="space-y-3">
                      {analysis.analysis?.strengths?.map((strength, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-4 text-lg">⚠️ Improvements Needed</h3>
                    <ul className="space-y-3">
                      {analysis.analysis?.weaknesses?.map((weakness, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-yellow-600 font-bold">!</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-4 text-lg">💡 Suggestions</h3>
                    <ul className="space-y-3">
                      {analysis.analysis?.suggestions?.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-purple-600 font-bold">→</span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setAnalysis(null);
                      setFile(null);
                    }}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Analyze Another Resume
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ResumeUpload;
