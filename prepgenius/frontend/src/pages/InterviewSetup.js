import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [roles] = useState([
    'React Developer',
    'Angular Developer',
    'Vue Developer',
    'Java Developer',
    'Python Developer',
    'Node.js Developer',
    'Full Stack Developer',
    'DevOps Engineer'
  ]);
  
  const [difficulties] = useState(['beginner', 'intermediate', 'advanced']);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interviewAPI.startInterview(selectedRole, selectedDifficulty);
      // Navigate to interview session with interview data
      navigate('/interview-session', { state: { interview: response } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎤 Mock Interview</h1>
          <p className="text-lg text-gray-600">Practice your interview skills with AI-powered questions</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 text-left rounded-lg border-2 transition ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-800">{role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Select Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-4 rounded-lg border-2 transition capitalize font-medium ${
                    selectedDifficulty === difficulty
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {difficulty === 'beginner' && '🌱'}
                  {difficulty === 'intermediate' && '🚀'}
                  {difficulty === 'advanced' && '⚡'}
                  <span className="ml-2">{difficulty}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              💡 Beginner: Basic concepts | Intermediate: Advanced topics | Advanced: Complex scenarios
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading || !selectedRole}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              loading || !selectedRole
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
            }`}
          >
            {loading ? '⏳ Starting Interview...' : '🚀 Start Interview'}
          </button>

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl">📝</p>
              <p className="text-sm text-gray-700 font-medium">5 Questions</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl">⏱️</p>
              <p className="text-sm text-gray-700 font-medium">Self-Paced</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl">📊</p>
              <p className="text-sm text-gray-700 font-medium">Instant Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
