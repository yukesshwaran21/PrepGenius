const { PrismaClient } = require('@prisma/client');
const { getQuestions, generateFeedback } = require('../utils/questionGenerator');

const prisma = new PrismaClient();

const QUESTION_COUNT = 10;
const SET_COUNT = 3;
const COOLDOWN_HOURS = Number(process.env.INTERVIEW_RETAKE_COOLDOWN_HOURS || 4);

const getQuestionTimeLimitByDifficulty = (difficulty) => {
  if (difficulty === 'beginner') return 75;
  if (difficulty === 'advanced') return 45;
  return 60;
};

const computeAverageScore = (interview) => {
  const scores = interview.questions
    .filter(q => q.answers.length > 0 && q.answers[0].score !== null)
    .map(q => q.answers[0].score);
  if (scores.length === 0) {
    return 0;
  }
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const bumpDifficulty = (difficulty) => {
  if (difficulty === 'beginner') return 'intermediate';
  if (difficulty === 'intermediate') return 'advanced';
  return 'advanced';
};

// Start a new interview session
const startInterview = async (req, res) => {
  try {
    const { role, difficulty, shuffleQuestions = true, adaptiveMix = true } = req.body;
    const userId = req.userId; // From auth middleware

    if (!role || !difficulty) {
      return res.status(400).json({ error: 'Role and difficulty are required' });
    }

    // Retake cooldown check
    if (COOLDOWN_HOURS > 0) {
      const recentInterview = await prisma.interview.findFirst({
        where: { userId, role, difficulty },
        orderBy: { createdAt: 'desc' }
      });

      if (recentInterview) {
        const hoursSinceLast = (Date.now() - new Date(recentInterview.createdAt).getTime()) / 3600000;
        if (hoursSinceLast < COOLDOWN_HOURS) {
          return res.status(429).json({
            error: `Please wait ${Math.ceil(COOLDOWN_HOURS - hoursSinceLast)} more hour(s) before retaking this session.`
          });
        }
      }
    }

    let effectiveDifficulty = difficulty;
    let requestedDifficulty = difficulty;

    if (adaptiveMix) {
      const lastInterview = await prisma.interview.findFirst({
        where: { userId, role },
        include: { questions: { include: { answers: true } } },
        orderBy: { createdAt: 'desc' }
      });

      if (lastInterview) {
        const lastAverage = computeAverageScore(lastInterview);
        if (lastAverage >= 80) {
          effectiveDifficulty = bumpDifficulty(difficulty);
        }
      }
    }

    // Validate role and difficulty by trying to get questions
    try {
      getQuestions(role, effectiveDifficulty, { count: 1, setIndex: 1, shuffle: true });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(`🎤 Starting interview for user ${userId}: ${role} (${effectiveDifficulty})`);

    const questionTimeLimitSec = getQuestionTimeLimitByDifficulty(effectiveDifficulty);

    const lastSetInterview = await prisma.interview.findFirst({
      where: { userId, role, difficulty: effectiveDifficulty },
      orderBy: { createdAt: 'desc' }
    });

    const setIndex = lastSetInterview
      ? (lastSetInterview.setIndex % SET_COUNT) + 1
      : 1;

    const recentInterviews = await prisma.interview.findMany({
      where: { userId, role, difficulty: effectiveDifficulty },
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
      take: 2
    });

    const excludedQuestions = recentInterviews.flatMap((session) =>
      session.questions.map((question) => question.questionText)
    );

    // Create interview session
    const interview = await prisma.interview.create({
      data: {
        userId,
        role,
        difficulty: effectiveDifficulty,
        requestedDifficulty,
        questionTimeLimitSec,
        setIndex,
        setCount: SET_COUNT,
        shuffleEnabled: Boolean(shuffleQuestions),
        adaptiveEnabled: Boolean(adaptiveMix)
      },
      include: {
        questions: true
      }
    });

    // Generate and save questions
    const questionTexts = getQuestions(role, effectiveDifficulty, {
      count: QUESTION_COUNT,
      setIndex,
      shuffle: Boolean(shuffleQuestions),
      excludedQuestions
    });
    const questionsWithData = [];

    for (const questionText of questionTexts) {
      const question = await prisma.question.create({
        data: {
          interviewId: interview.id,
          questionText
        }
      });
      questionsWithData.push(question);
    }

    console.log(`✅ Interview started with ${questionsWithData.length} questions`);

    res.status(201).json({
      interviewId: interview.id,
      role,
      difficulty: effectiveDifficulty,
      requestedDifficulty,
      setIndex,
      setCount: SET_COUNT,
      shuffleEnabled: Boolean(shuffleQuestions),
      adaptiveEnabled: Boolean(adaptiveMix),
      questionTimeLimitSec,
      totalQuestions: questionsWithData.length,
      questions: questionsWithData
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
};

// Get interview questions
const getInterviewQuestions = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;

    // Verify interview exists and belongs to user
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(interviewId) },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      interviewId: interview.id,
      role: interview.role,
      difficulty: interview.difficulty,
      requestedDifficulty: interview.requestedDifficulty || interview.difficulty,
      setIndex: interview.setIndex || 1,
      setCount: interview.setCount || 3,
      shuffleEnabled: interview.shuffleEnabled ?? true,
      adaptiveEnabled: interview.adaptiveEnabled ?? true,
      questionTimeLimitSec: interview.questionTimeLimitSec,
      questions: interview.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        answered: q.answers.length > 0,
        answer: q.answers[0]?.userAnswer || null,
        feedback: q.answers[0]?.aiFeedback || null,
        score: q.answers[0]?.score || null,
        timedOut: q.answers[0]?.timedOut || false,
        timeSpentSeconds: q.answers[0]?.timeSpentSeconds || null
      }))
    });
  } catch (error) {
    console.error('Error fetching interview questions:', error);
    res.status(500).json({ error: 'Failed to fetch interview questions' });
  }
};

// Submit answer to a question
const submitAnswer = async (req, res) => {
  try {
    const {
      questionId,
      userAnswer,
      answerStartedAt,
      answerSubmittedAt,
      timeSpentSeconds,
      timedOut,
      autoSubmitted
    } = req.body;
    const userId = req.userId;

    const normalizedAnswer = (userAnswer || '').trim();
    const isTimedOut = Boolean(timedOut);
    const isAutoSubmitted = Boolean(autoSubmitted);
    const parsedTimeSpent = Number(timeSpentSeconds);

    if (!normalizedAnswer && !isTimedOut) {
      return res.status(400).json({ error: 'Answer cannot be empty' });
    }

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
      include: {
        interview: true,
        answers: true
      }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Verify question belongs to user's interview
    if (question.interview.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Generate feedback and score
    const answerToEvaluate = normalizedAnswer || 'No response submitted before timeout.';

    const { score, feedback } = generateFeedback(question.questionText, answerToEvaluate);

    console.log(`📝 Answer submitted for question ${questionId}, score: ${score}`);

    // Delete existing answer if any
    if (question.answers.length > 0) {
      await prisma.answer.deleteMany({
        where: { questionId: parseInt(questionId) }
      });
    }

    // Save answer
    const answer = await prisma.answer.create({
      data: {
        questionId: parseInt(questionId),
        userAnswer: answerToEvaluate,
        aiFeedback: feedback,
        score,
        answerStartedAt: answerStartedAt ? new Date(answerStartedAt) : null,
        answerSubmittedAt: answerSubmittedAt ? new Date(answerSubmittedAt) : new Date(),
        timeSpentSeconds: Number.isFinite(parsedTimeSpent) ? Math.max(0, Math.round(parsedTimeSpent)) : null,
        timedOut: isTimedOut,
        autoSubmitted: isAutoSubmitted
      }
    });

    res.status(201).json({
      answerId: answer.id,
      score,
      feedback,
      timedOut: answer.timedOut,
      autoSubmitted: answer.autoSubmitted,
      timeSpentSeconds: answer.timeSpentSeconds
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

// Get interview results
const getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;

    // Get interview with all questions and answers
    const interview = await prisma.interview.findUnique({
      where: { id: parseInt(interviewId) },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      }
    });

    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    if (interview.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Calculate results
    const totalQuestions = interview.questions.length;
    const answeredQuestions = interview.questions.filter(q => q.answers.length > 0).length;
    const scores = interview.questions
      .filter(q => q.answers.length > 0 && q.answers[0].score !== null)
      .map(q => q.answers[0].score);

    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;
    const timedOutCount = interview.questions.filter(q => q.answers[0]?.timedOut).length;
    const answerTimes = interview.questions
      .filter(q => q.answers[0]?.timeSpentSeconds !== null && q.answers[0]?.timeSpentSeconds !== undefined)
      .map(q => q.answers[0].timeSpentSeconds);
    const averageTimeSpentSeconds = answerTimes.length > 0
      ? Math.round(answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length)
      : 0;

    // Performance tier
    let performanceTier = 'Needs Improvement';
    if (averageScore >= 80) performanceTier = 'Excellent';
    else if (averageScore >= 70) performanceTier = 'Good';
    else if (averageScore >= 60) performanceTier = 'Fair';
    else performanceTier = 'Needs Improvement';

    console.log(`✅ Interview ${interviewId} completed: ${averageScore}/100`);

    res.json({
      interviewId: interview.id,
      role: interview.role,
      difficulty: interview.difficulty,
      requestedDifficulty: interview.requestedDifficulty || interview.difficulty,
      setIndex: interview.setIndex || 1,
      setCount: interview.setCount || 3,
      shuffleEnabled: interview.shuffleEnabled ?? true,
      adaptiveEnabled: interview.adaptiveEnabled ?? true,
      questionTimeLimitSec: interview.questionTimeLimitSec,
      createdAt: interview.createdAt,
      summary: {
        totalQuestions,
        answeredQuestions,
        averageScore,
        maxScore,
        minScore,
        timedOutCount,
        averageTimeSpentSeconds,
        performanceTier
      },
      detailedResults: interview.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        userAnswer: q.answers[0]?.userAnswer || null,
        feedback: q.answers[0]?.aiFeedback || null,
        score: q.answers[0]?.score || null,
        answered: q.answers.length > 0,
        timedOut: q.answers[0]?.timedOut || false,
        autoSubmitted: q.answers[0]?.autoSubmitted || false,
        timeSpentSeconds: q.answers[0]?.timeSpentSeconds || null
      }))
    });
  } catch (error) {
    console.error('Error fetching interview results:', error);
    res.status(500).json({ error: 'Failed to fetch interview results' });
  }
};

// Get all interviews for a user
const getUserInterviews = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;

    const interviews = await prisma.interview.findMany({
      where: { userId },
      include: {
        questions: {
          include: {
            answers: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    const interviewsWithScores = interviews.map(interview => {
      const scores = interview.questions
        .filter(q => q.answers.length > 0 && q.answers[0].score !== null)
        .map(q => q.answers[0].score);

      const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      return {
        id: interview.id,
        role: interview.role,
        difficulty: interview.difficulty,
        requestedDifficulty: interview.requestedDifficulty || interview.difficulty,
        setIndex: interview.setIndex || 1,
        setCount: interview.setCount || 3,
        shuffleEnabled: interview.shuffleEnabled ?? true,
        adaptiveEnabled: interview.adaptiveEnabled ?? true,
        createdAt: interview.createdAt,
        questionTimeLimitSec: interview.questionTimeLimitSec,
        totalQuestions: interview.questions.length,
        answeredQuestions: interview.questions.filter(q => q.answers.length > 0).length,
        averageScore,
        timedOutCount: interview.questions.filter(q => q.answers[0]?.timedOut).length
      };
    });

    res.json(interviewsWithScores);
  } catch (error) {
    console.error('Error fetching user interviews:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
};

module.exports = {
  startInterview,
  getInterviewQuestions,
  submitAnswer,
  getInterviewResults,
  getUserInterviews
};
