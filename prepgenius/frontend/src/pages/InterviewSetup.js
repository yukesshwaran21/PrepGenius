import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const ROLES = [
  'React Developer',
  'Angular Developer',
  'Vue Developer',
  'Java Developer',
  'Python Developer',
  'Node.js Developer',
  'Full Stack Developer',
  'DevOps Engineer'
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'low', emoji: '🌱' },
  { value: 'intermediate', label: 'medium', emoji: '🚀' },
  { value: 'advanced', label: 'hard', emoji: '⚡' }
];

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [selectedMode, setSelectedMode] = useState('standard');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [adaptiveMix, setAdaptiveMix] = useState(true);
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
      const response = await interviewAPI.startInterview(selectedRole, selectedDifficulty, {
        shuffleQuestions,
        adaptiveMix,
        mode: selectedMode
      });
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
              {ROLES.map(role => (
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
              {DIFFICULTIES.map(difficulty => (
                <button
                  key={difficulty.value}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`p-4 rounded-lg border-2 transition capitalize font-medium ${
                    selectedDifficulty === difficulty.value
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {difficulty.emoji}
                  <span className="ml-2">{difficulty.label}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              💡 Low: Fundamentals | Medium: Applied topics | Hard: Complex scenarios
            </p>
          </div>

          {/* Session Options */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Session Options
            </label>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    value: 'standard',
                    title: 'Standard',
                    description: 'Timed per question, auto-advance.'
                  },
                  {
                    value: 'timed',
                    title: 'Timed Quiz',
                    description: 'Single countdown for the full interview.'
                  },
                  {
                    value: 'review',
                    title: 'Review Mode',
                    description: 'No timers, manual navigation.'
                  },
                  {
                    value: 'live',
                    title: 'Live Interviewer',
                    description: 'Follow-up questions on incorrect answers.'
                  },
                  {
                    value: 'coding',
                    title: 'Coding Interview',
                    description: 'Solve 5 coding tasks with run + submit.'
                  }
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setSelectedMode(mode.value)}
                    className={`p-4 text-left rounded-lg border-2 transition ${
                      selectedMode === mode.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{mode.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 ${selectedMode === 'coding' ? 'text-gray-400' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  disabled={selectedMode === 'coding'}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Shuffle question order
              </label>
              <label className={`flex items-center gap-3 ${selectedMode === 'coding' ? 'text-gray-400' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={adaptiveMix}
                  onChange={(e) => setAdaptiveMix(e.target.checked)}
                  disabled={selectedMode === 'coding'}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Adaptive mix (auto-bump difficulty when you score high)
              </label>
              {selectedMode === 'coding' && (
                <p className="text-sm text-gray-500">
                  Coding mode runs 5 problems per difficulty and ignores MCQ settings.
                </p>
              )}
            </div>
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
              <p className="text-sm text-gray-700 font-medium">
                {selectedMode === 'coding' ? '5 Problems' : '10 Questions'}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl">⏱️</p>
              <p className="text-sm text-gray-700 font-medium">Self-Paced</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl">📊</p>
              <p className="text-sm text-gray-700 font-medium">3 Rotating Sets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
