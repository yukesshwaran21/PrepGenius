import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!interview) {
      navigate('/interview-setup');
    }
  }, [interview, navigate]);

  if (!interview) return null;

  const currentQuestion = interview.questions[currentQuestionIndex];
  const totalQuestions = interview.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer');
      return;
    }

    setLoading(true);
    try {
      const response = await interviewAPI.submitAnswer(currentQuestion.id, currentAnswer);
      
      setAnswers({
        ...answers,
        [currentQuestion.id]: currentAnswer
      });
      
      setFeedback(response);
      setShowFeedback(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(answers[interview.questions[currentQuestionIndex + 1].id] || '');
      setShowFeedback(false);
      setFeedback(null);
    } else {
      // Interview complete
      navigate('/interview-results', { 
        state: { interviewId: interview.interviewId } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[interview.questions[currentQuestionIndex - 1].id] || '');
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = currentQuestion.id in answers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎤 Interview Session</h1>
              <p className="text-gray-600 mt-1">
                {interview.role} • {interview.difficulty.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{currentQuestionIndex + 1}/{totalQuestions}</p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📌 Question {currentQuestionIndex + 1}
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            {currentQuestion.questionText}
          </p>

          {/* Answer Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={showFeedback}
              rows="6"
              placeholder="Type your answer here. Be thorough and provide examples when possible..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Word count: {currentAnswer.split(/\s+/).filter(w => w.length > 0).length}
            </p>
          </div>

          {/* Feedback Section */}
          {showFeedback && feedback && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">📊 Feedback</h3>
                <div className="text-4xl font-bold text-blue-600">{feedback.score}/100</div>
              </div>
              <p className="text-gray-700">{feedback.feedback}</p>
              
              {/* Score Interpretation */}
              <div className="mt-4 p-3 bg-white rounded">
                {feedback.score >= 80 && <p className="text-green-700">✅ Excellent answer!</p>}
                {feedback.score >= 60 && feedback.score < 80 && <p className="text-yellow-700">👍 Good effort! Consider adding more details.</p>}
                {feedback.score < 60 && <p className="text-red-700">💡 Try to provide more technical depth and examples.</p>}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!showFeedback && (
            <button
              onClick={handleSubmitAnswer}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Evaluating...' : '✅ Submit Answer'}
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        {showFeedback && (
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1 bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition"
            >
              {isLastQuestion ? '🎉 See Results' : 'Next →'}
            </button>
          </div>
        )}

        {/* Question Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">📋 Questions Summary</h3>
          <div className="flex flex-wrap gap-2">
            {interview.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setCurrentAnswer(answers[q.id] || '');
                  setShowFeedback(false);
                  setFeedback(null);
                }}
                className={`w-10 h-10 rounded-full font-semibold transition ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : q.id in answers
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {q.id in answers ? '✓' : idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
