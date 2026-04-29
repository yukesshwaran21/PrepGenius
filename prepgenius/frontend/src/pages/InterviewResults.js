import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const InterviewResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interviewId = location.state?.interviewId;

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interviewId) {
        navigate('/interview-setup');
        return;
      }

      try {
        const data = await interviewAPI.getInterviewResults(interviewId);
        setResults(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [interviewId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/interview-setup')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            ← Back to Setup
          </button>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const {
    summary,
    role,
    difficulty,
    requestedDifficulty,
    setIndex,
    setCount,
    createdAt,
    detailedResults
  } = results;
  const performanceColor = {
    'Excellent': 'from-green-500 to-emerald-600',
    'Good': 'from-blue-500 to-cyan-600',
    'Fair': 'from-yellow-500 to-orange-600',
    'Needs Improvement': 'from-red-500 to-pink-600'
  };
  const difficultyLabels = {
    beginner: 'low',
    intermediate: 'medium',
    advanced: 'hard'
  };
  const displayDifficulty = difficultyLabels[difficulty] || difficulty;
  const displayRequested = difficultyLabels[requestedDifficulty] || requestedDifficulty;

  const getOptionText = (options, optionId) => {
    const option = options.find((item) => item.id === optionId);
    return option ? option.text : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Interview Complete!</h1>
          <p className="text-gray-600">
            {new Date(createdAt).toLocaleDateString()} • {role} ({displayDifficulty})
            {requestedDifficulty && requestedDifficulty !== difficulty && (
              <span> • Requested: {displayRequested}</span>
            )}
            <span> • Set {setIndex || 1}/{setCount || 3}</span>
          </p>
        </div>

        {/* Score Card */}
        <div className={`bg-gradient-to-r ${performanceColor[summary.performanceTier]} rounded-lg shadow-2xl p-12 text-white mb-8`}>
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Your Performance</p>
            <p className="text-6xl font-bold mb-4">
              {summary.totalMarks}/{summary.totalQuestions}
            </p>
            <p className="text-2xl font-semibold mb-8">{summary.performanceTier}</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="opacity-90">Questions Answered</p>
                <p className="text-3xl font-bold">{summary.answeredQuestions}/{summary.totalQuestions}</p>
              </div>
              <div>
                <p className="opacity-90">Accuracy</p>
                <p className="text-3xl font-bold">{summary.averageScore}%</p>
              </div>
              <div>
                <p className="opacity-90">Correct Answers</p>
                <p className="text-3xl font-bold">{summary.totalMarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl mb-2">📈</p>
            <p className="text-sm text-gray-600">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">{summary.maxScore}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="text-2xl font-bold text-blue-600">{summary.averageScore}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl mb-2">📉</p>
            <p className="text-sm text-gray-600">Lowest Score</p>
            <p className="text-2xl font-bold text-orange-600">{summary.minScore}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl mb-2">⏱️</p>
            <p className="text-sm text-gray-600">Avg Time / Q</p>
            <p className="text-2xl font-bold text-indigo-600">{summary.averageTimeSpentSeconds || 0}s</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-3xl mb-2">⌛</p>
            <p className="text-sm text-gray-600">Timed Out</p>
            <p className="text-2xl font-bold text-red-600">{summary.timedOutCount || 0}</p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Question Breakdown</h2>
          <div className="space-y-4">
            {detailedResults.map((result, idx) => (
              <div key={result.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Question Header */}
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === result.id ? null : result.id)}
                  className="w-full p-4 hover:bg-gray-50 flex items-start justify-between transition"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {result.answered
                          ? (result.isCorrect ? '🟢' : '🔴')
                          : '⚫'
                        }
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-left">Q{idx + 1}: {result.questionText}</p>
                        {result.answered && (
                          <p className="text-sm text-gray-600 mt-1">
                            Score: <span className="font-bold">{result.score}/1</span>
                            {result.timeSpentSeconds !== null && result.timeSpentSeconds !== undefined && (
                              <span className="ml-2">• Time: {result.timeSpentSeconds}s</span>
                            )}
                            {result.timedOut && (
                              <span className="ml-2 text-red-600 font-medium">• Timed out</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 ml-4">
                    {expandedQuestion === result.id ? '▼' : '▶'}
                  </span>
                </button>

                {/* Expanded Details */}
                {expandedQuestion === result.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {result.answered ? (
                      <>
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Your Answer:</h4>
                          <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                            {result.userAnswer
                              ? `${result.userAnswer}. ${getOptionText(result.options, result.userAnswer) || 'No option text found.'}`
                              : 'No answer provided.'}
                          </p>
                        </div>
                        {result.answered && !result.isCorrect && result.correctOptionId && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Correct Answer:</h4>
                            <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                              {`${result.correctOptionId}. ${getOptionText(result.options, result.correctOptionId) || 'No option text found.'}`}
                            </p>
                          </div>
                        )}
                        {result.explanation && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Explanation:</h4>
                            <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                              {result.explanation}
                            </p>
                          </div>
                        )}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Feedback:</h4>
                          <div className={`p-3 rounded ${
                            result.isCorrect ? 'bg-green-50 text-green-700 border border-green-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {result.feedback}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 italic">❌ Not answered</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Recommendations</h3>
          <ul className="space-y-2 text-blue-800">
            {summary.performanceTier === 'Excellent' && (
              <>
                <li>✅ Excellent performance! You're well-prepared for interviews.</li>
                <li>🎯 Try advanced difficulty level to challenge yourself further.</li>
                <li>📚 Review answers to identify patterns in your strong areas.</li>
              </>
            )}
            {summary.performanceTier === 'Good' && (
              <>
                <li>👍 Good job! You have a solid understanding of the concepts.</li>
                <li>📈 Focus on areas with lower scores to improve further.</li>
                <li>🎯 Try intermediate or advanced difficulty to challenge yourself.</li>
              </>
            )}
            {summary.performanceTier === 'Fair' && (
              <>
                <li>💪 Keep practicing! Consistency is key to improvement.</li>
                <li>📚 Review the feedback for each question carefully.</li>
                <li>🔄 Retry this role or choose beginner difficulty to build confidence.</li>
              </>
            )}
            {summary.performanceTier === 'Needs Improvement' && (
              <>
                <li>💡 Don't worry! Every interview is a learning opportunity.</li>
                <li>📖 Review the topics and concepts for this role.</li>
                <li>🔄 Practice again with beginner difficulty to build fundamentals.</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            📊 Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/interview-setup')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition"
          >
            🎤 Try Another Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResults;
