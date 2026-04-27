import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const profileRes = await authAPI.getProfile();
        setUser(profileRes.data.user);

        // Fetch stats
        const statsRes = await dashboardAPI.getStats();
        setStats(statsRes.data.stats);

        // Fetch recent interviews
        const interviewsRes = await dashboardAPI.getRecentInterviews(5);
        setRecentInterviews(interviewsRes.data.interviews);

        // Fetch recent resumes
        const resumesRes = await dashboardAPI.getRecentResumes(5);
        setRecentResumes(resumesRes.data.resumes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">PrepGenius</h1>
            <p className="text-xs text-gray-500">AI-Powered Interview Preparation</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Here's your interview preparation progress. Keep practicing to improve your skills!
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Resumes Uploaded */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Resumes Uploaded</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.resumesUploaded}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
            </div>

            {/* Interviews Taken */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Interviews Taken</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{stats.interviewsTaken}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <span className="text-2xl">🎤</span>
                </div>
              </div>
            </div>

            {/* Answers Submitted */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Answers Submitted</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.answersSubmitted}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Score</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.averageScore}%</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Resume */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white hover:shadow-xl transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">Upload Resume</h4>
                  <p className="text-blue-100 text-sm">
                    Get AI-powered feedback on your resume
                  </p>
                </div>
                <span className="text-4xl">📤</span>
              </div>
              <button
                onClick={() => navigate('/resume-analyzer')}
                className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Upload Now
              </button>
            </div>

            {/* Start Interview */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-8 text-white hover:shadow-xl transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">Start Mock Interview</h4>
                  <p className="text-purple-100 text-sm">
                    Practice with AI-generated interview questions
                  </p>
                </div>
                <span className="text-4xl">🎙️</span>
              </div>
              <button
                onClick={() => navigate('/interview-setup')}
                className="mt-4 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Interviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span> Recent Interviews
            </h3>
            {recentInterviews.length > 0 ? (
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{interview.role}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Difficulty: <span className="capitalize font-medium">{interview.difficulty}</span>
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {interview.averageScore}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      {interview.totalQuestions} questions • {interview.answersSubmitted} answered
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No interviews yet. Start your first one!</p>
            )}
            {recentInterviews.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition"
              >
                View Full History →
              </button>
            )}
          </div>

          {/* Recent Resumes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📄</span> Recent Resumes
            </h3>
            {recentResumes.length > 0 ? (
              <div className="space-y-4">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">Resume {resume.id}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {resume.hasAnalysis ? (
                            <span className="text-green-600 font-medium">✓ Analyzed</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">⚠ Pending Analysis</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No resumes yet. Upload your first resume!</p>
            )}
            {recentResumes.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="mt-4 w-full text-center text-indigo-600 hover:text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 transition"
              >
                View Full History →
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
