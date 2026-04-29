import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const AUTO_NEXT_DELAY_MS = 1800;

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedbackByQuestion, setFeedbackByQuestion] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interview?.questionTimeLimitSec || 60);
  const [questionStartAt, setQuestionStartAt] = useState(new Date());

  const autoNextRef = useRef(null);

  useEffect(() => {
    if (!interview) {
      navigate('/interview-setup');
    }

    return () => {
      if (autoNextRef.current) {
        clearTimeout(autoNextRef.current);
      }
    };
  }, [interview, navigate]);

  const hasInterview = Boolean(interview);
  const questions = interview?.questions || [];
  const totalQuestions = questions.length;
  const safeQuestionIndex = Math.min(currentQuestionIndex, Math.max(totalQuestions - 1, 0));
  const currentQuestion = questions[safeQuestionIndex] || null;
  const progress = ((currentQuestionIndex + 1) / Math.max(totalQuestions, 1)) * 100;
  const questionTimeLimitSec = interview?.questionTimeLimitSec || 60;

  const hasSubmittedCurrent = currentQuestion ? Boolean(submittedAnswers[currentQuestion.id]) : false;
  const feedback = currentQuestion ? (feedbackByQuestion[currentQuestion.id] || null) : null;
  const currentOptions = currentQuestion?.options || [];

  useEffect(() => {
    if (!hasInterview || !currentQuestion) {
      return;
    }

    setCurrentAnswer('');
    setShowFeedback(false);
    setTimeLeft(questionTimeLimitSec);
    setQuestionStartAt(new Date());

    if (autoNextRef.current) {
      clearTimeout(autoNextRef.current);
    }
  }, [
    hasInterview,
    currentQuestion,
    currentQuestionIndex,
    questionTimeLimitSec
  ]);

  const getTimeSpentSeconds = () => {
    const elapsed = questionTimeLimitSec - timeLeft;
    return Math.max(0, Math.min(questionTimeLimitSec, elapsed));
  };

  const moveToNextQuestion = () => {
    if (!hasInterview) {
      navigate('/interview-setup');
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    navigate('/interview-results', {
      state: { interviewId: interview.interviewId }
    });
  };

  const submitAnswer = async ({ timedOut = false } = {}) => {
    if (!currentQuestion || hasSubmittedCurrent || loading) {
      return;
    }

    if (!timedOut && !currentAnswer.trim()) {
      alert('Please select an answer');
      return;
    }

    const submittedAt = new Date();
    const answerToStore = timedOut && !currentAnswer.trim()
      ? ''
      : currentAnswer;

    setLoading(true);

    try {
      const response = await interviewAPI.submitAnswer(currentQuestion.id, answerToStore, {
        answerStartedAt: questionStartAt.toISOString(),
        answerSubmittedAt: submittedAt.toISOString(),
        timeSpentSeconds: getTimeSpentSeconds(),
        timedOut,
        autoSubmitted: timedOut
      });

      setSubmittedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          userAnswer: answerToStore,
          timedOut
        }
      }));

      setFeedbackByQuestion((prev) => ({
        ...prev,
        [currentQuestion.id]: response
      }));

      setShowFeedback(true);

      autoNextRef.current = setTimeout(() => {
        moveToNextQuestion();
      }, AUTO_NEXT_DELAY_MS);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInterview || !currentQuestion) {
      return;
    }

    if (showFeedback || hasSubmittedCurrent || loading) {
      return;
    }

    if (timeLeft === 0) {
      submitAnswer({ timedOut: true });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [hasInterview, currentQuestion, showFeedback, hasSubmittedCurrent, loading, timeLeft]);

  const timerColorClass = useMemo(() => {
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 20) return 'text-yellow-600';
    return 'text-emerald-600';
  }, [timeLeft]);

  const isInputLocked = showFeedback || loading || hasSubmittedCurrent || timeLeft === 0 || currentOptions.length === 0;

  if (!hasInterview || !currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview Simulation</h1>
              <p className="text-gray-600 mt-1">
                {interview.role} • {interview.difficulty.toUpperCase()} • Set {interview.setIndex || 1}/{interview.setCount || 3}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3 text-right shadow-sm">
              <p className="text-xs text-gray-500">Time Left</p>
              <p className={`text-3xl font-bold ${timerColorClass}`}>{timeLeft}s</p>
              <p className="text-xs text-gray-500">Per question: {questionTimeLimitSec}s</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            <p className="text-sm text-gray-600">Auto-advance enabled</p>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question {currentQuestionIndex + 1}</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">{currentQuestion.questionText}</p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose an Answer</label>
            <div className="space-y-3">
              {currentOptions.length === 0 && (
                <p className="text-sm text-red-600">Options are unavailable for this question.</p>
              )}
              {currentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    currentAnswer === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${isInputLocked ? 'opacity-70 cursor-not-allowed' : 'hover:border-blue-400'}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    disabled={isInputLocked}
                    checked={currentAnswer === option.id}
                    onChange={() => setCurrentAnswer(option.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{option.id}.</p>
                    <p className="text-gray-700">{option.text}</p>
                  </div>
                </label>
              ))}
            </div>
            {timeLeft <= 10 && !showFeedback && (
              <p className="text-sm text-red-600 font-semibold mt-2">Hurry up. Auto-submit imminent.</p>
            )}
          </div>

          {showFeedback && feedback && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">AI Feedback</h3>
                <div className="text-4xl font-bold text-blue-600">{feedback.score}/1</div>
              </div>
              <p className="text-gray-700 mb-3">{feedback.feedback}</p>

              <div className="text-sm text-gray-600">
                {feedback.timedOut ? 'Auto-submitted due to timeout.' : 'Submitted before timeout.'}
                {feedback.timeSpentSeconds !== null && feedback.timeSpentSeconds !== undefined && (
                  <span> Time spent: {feedback.timeSpentSeconds}s.</span>
                )}
              </div>

              <p className="text-sm text-indigo-700 mt-3 font-medium">Moving to next question automatically...</p>
            </div>
          )}

          {!showFeedback && (
            <button
              onClick={() => submitAnswer({ timedOut: false })}
              disabled={loading || timeLeft === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Submitting answer...' : 'Submit Answer'}
            </button>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Progress Tracker</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const done = Boolean(submittedAnswers[q.id]);

              return (
                <div
                  key={q.id}
                  className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : done
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {done ? '✓' : idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
