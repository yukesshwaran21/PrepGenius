import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">PrepGenius</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resume Analyzer Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-blue-500 text-4xl mb-4">📄</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Resume Analyzer</h2>
            <p className="text-gray-600 mb-4">
              Upload your resume and get AI-powered feedback
            </p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Analyze Resume
            </button>
          </div>

          {/* Mock Interview Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-purple-500 text-4xl mb-4">🎤</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mock Interview</h2>
            <p className="text-gray-600 mb-4">
              Practice with AI-generated interview questions
            </p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Start Interview
            </button>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-green-500 text-4xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">History</h2>
            <p className="text-gray-600 mb-4">
              View your past interviews and resume analyses
            </p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              View History
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
