import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, resumeAPI } from '../services/api';

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
        setLoading(true);
        setError('');

        const [interviewData, resumeRes] = await Promise.all([
          interviewAPI.getUserInterviews(100),
          resumeAPI.getAllResumes()
        ]);

        setInterviews(interviewData || []);
        setResumes(resumeRes?.data?.resumes || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const interviewStats = useMemo(() => {
    const total = interviews.length;
    const avg = total ? Math.round(interviews.reduce((sum, i) => sum + (i.averageScore || 0), 0) / total) : 0;
    const best = total ? Math.max(...interviews.map(i => i.averageScore || 0)) : 0;
    return { total, avg, best };
  }, [interviews]);

  const resumeStats = useMemo(() => {
    const total = resumes.length;
    const analyzed = resumes.filter(r => r.hasAnalysis).length;
    const avg = analyzed
      ? Math.round(
          resumes
            .filter(r => r.hasAnalysis)
            .reduce((sum, r) => sum + (r.overallScore || 0), 0) / analyzed
        )
      : 0;
    return { total, analyzed, avg };
  }, [resumes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">History</h1>
            <p className="text-slate-600 mt-1">Review your past interviews and resume analysis results.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <p className="text-sm text-slate-500">Interviews Completed</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{interviewStats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Avg Score: {interviewStats.avg}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <p className="text-sm text-slate-500">Resumes Uploaded</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{resumeStats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Analyzed: {resumeStats.analyzed}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
            <p className="text-sm text-slate-500">Best Metrics</p>
            <p className="text-lg font-semibold text-emerald-600 mt-2">Interview: {interviewStats.best}%</p>
            <p className="text-xs text-slate-500 mt-1">Resume Avg: {resumeStats.avg}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 inline-flex mb-6">
          <button
            onClick={() => setTab('interviews')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'interviews' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Interviews
          </button>
          <button
            onClick={() => setTab('resumes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'resumes' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Past Resume Analysis
          </button>
        </div>

        {tab === 'interviews' ? (
          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                No past interviews yet.
              </div>
            ) : (
              interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{interview.role}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Difficulty: <span className="capitalize font-medium">{interview.difficulty}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {interview.totalQuestions} questions, {interview.answeredQuestions} answered
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Score</p>
                    <p className="text-3xl font-bold text-blue-600">{interview.averageScore}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                No past resume analysis yet.
              </div>
            ) : (
              resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Resume #{resume.id}</h3>
                    <p className="text-sm mt-1">
                      {resume.hasAnalysis ? (
                        <span className="text-emerald-600 font-medium">Analyzed</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending Analysis</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Score</p>
                    <p className="text-3xl font-bold text-indigo-600">{resume.overallScore || 0}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
