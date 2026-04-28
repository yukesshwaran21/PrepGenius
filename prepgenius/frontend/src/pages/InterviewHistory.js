import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const roles = [
    'React Developer',
    'Angular Developer',
    'Vue Developer',
    'Java Developer',
    'Python Developer',
    'Node.js Developer',
    'Full Stack Developer',
    'DevOps Engineer'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await interviewAPI.getUserInterviews(50);
        setInterviews(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(interview => {
      if (filterRole && interview.role !== filterRole) return false;
      if (filterDifficulty && interview.difficulty !== filterDifficulty) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'highest') {
        return b.averageScore - a.averageScore;
      } else if (sortBy === 'lowest') {
        return a.averageScore - b.averageScore;
      }
      return 0;
    });

  // Calculate overall stats
  const overallStats = {
    totalInterviews: interviews.length,
    averageScore: interviews.length > 0 
      ? Math.round(interviews.reduce((sum, i) => sum + i.averageScore, 0) / interviews.length)
      : 0,
    bestScore: interviews.length > 0 ? Math.max(...interviews.map(i => i.averageScore)) : 0,
    worstScore: interviews.length > 0 ? Math.min(...interviews.map(i => i.averageScore)) : 0,
  };

  // Role statistics
  const roleStats = {};
  interviews.forEach(interview => {
    if (!roleStats[interview.role]) {
      roleStats[interview.role] = { count: 0, totalScore: 0 };
    }
    roleStats[interview.role].count++;
    roleStats[interview.role].totalScore += interview.averageScore;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-blue-50';
    if (score >= 40) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  const difficultyLabels = {
    beginner: 'low',
    intermediate: 'medium',
    advanced: 'hard'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Interview History</h1>
          <p className="text-gray-600">Track your interview performance and progress over time</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Interviews</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{overallStats.totalInterviews}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{overallStats.averageScore}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Best Score</p>
            <p className="text-4xl font-bold text-emerald-600 mt-2">{overallStats.bestScore}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Questions</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {interviews.reduce((sum, i) => sum + i.totalQuestions, 0)}
            </p>
          </div>
        </div>

        {interviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-4xl mb-4">🎤</p>
            <p className="text-gray-600 mb-4">No interviews yet. Start your first mock interview!</p>
            <button
              onClick={() => navigate('/interview-setup')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <>
            {/* Filters and Sorting */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Filters & Sort</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Score</option>
                    <option value="lowest">Lowest Score</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{filteredInterviews.length}</p>
                </div>
              </div>
            </div>

            {/* Role Statistics */}
            {Object.keys(roleStats).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">📈 Performance by Role</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(roleStats)
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([role, stats]) => (
                      <div key={role} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{role}</h4>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Interviews: {stats.count}</p>
                            <p className={`text-lg font-bold mt-1 ${getScoreColor(Math.round(stats.totalScore / stats.count))}`}>
                              {Math.round(stats.totalScore / stats.count)}% avg
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Interviews List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">All Interviews</h3>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition hover:shadow-lg ${
                      selectedInterview?.id === interview.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{interview.role}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            interview.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            interview.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {difficultyLabels[interview.difficulty] || interview.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          📅 {new Date(interview.createdAt).toLocaleDateString()} at{' '}
                          {new Date(interview.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {` • Set ${interview.setIndex || 1}/${interview.setCount || 3}`}
                        </p>
                        <div className="flex gap-6 text-sm">
                          <span className="text-gray-600">
                            <span className="font-medium">📝 {interview.totalQuestions}</span> questions
                          </span>
                          <span className="text-gray-600">
                            <span className="font-medium">✅ {interview.answeredQuestions}</span> answered
                          </span>
                        </div>
                      </div>
                      <div className={`text-right ${getScoreBg(interview.averageScore)} px-6 py-4 rounded-lg`}>
                        <p className="text-sm text-gray-600 mb-1">Score</p>
                        <p className={`text-3xl font-bold ${getScoreColor(interview.averageScore)}`}>
                          {interview.averageScore}%
                        </p>
                      </div>
                    </div>

                    {/* Performance Tier */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs font-medium text-gray-600">
                        {interview.averageScore >= 80 && '⭐ Excellent'}
                        {interview.averageScore >= 60 && interview.averageScore < 80 && '👍 Good'}
                        {interview.averageScore >= 40 && interview.averageScore < 60 && '⚠️ Fair'}
                        {interview.averageScore < 40 && '💡 Needs Improvement'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">No interviews match your filters</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InterviewHistory;
