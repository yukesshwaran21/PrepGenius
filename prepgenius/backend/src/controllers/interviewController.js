const { PrismaClient } = require('@prisma/client');
const { getQuestions, generateFeedback } = require('../utils/questionGenerator');

const prisma = new PrismaClient();

// Start a new interview session
const startInterview = async (req, res) => {
  try {
    const { role, difficulty } = req.body;
    const userId = req.userId; // From auth middleware

    if (!role || !difficulty) {
      return res.status(400).json({ error: 'Role and difficulty are required' });
    }

    // Validate role and difficulty by trying to get questions
    try {
      getQuestions(role, difficulty, 5);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(`🎤 Starting interview for user ${userId}: ${role} (${difficulty})`);

    // Create interview session
    const interview = await prisma.interview.create({
      data: {
        userId,
        role,
        difficulty
      },
      include: {
        questions: true
      }
    });

    // Generate and save questions
    const questionTexts = getQuestions(role, difficulty, 5);
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
      difficulty,
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
      questions: interview.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        answered: q.answers.length > 0,
        answer: q.answers[0]?.userAnswer || null,
        feedback: q.answers[0]?.aiFeedback || null,
        score: q.answers[0]?.score || null
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
    const { questionId, userAnswer } = req.body;
    const userId = req.userId;

    if (!userAnswer || userAnswer.trim().length === 0) {
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
    const { score, feedback } = generateFeedback(question.questionText, userAnswer);

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
        userAnswer,
        aiFeedback: feedback,
        score
      }
    });

    res.status(201).json({
      answerId: answer.id,
      score,
      feedback
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
      createdAt: interview.createdAt,
      summary: {
        totalQuestions,
        answeredQuestions,
        averageScore,
        maxScore,
        minScore,
        performanceTier
      },
      detailedResults: interview.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        userAnswer: q.answers[0]?.userAnswer || null,
        feedback: q.answers[0]?.aiFeedback || null,
        score: q.answers[0]?.score || null,
        answered: q.answers.length > 0
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
        createdAt: interview.createdAt,
        totalQuestions: interview.questions.length,
        answeredQuestions: interview.questions.filter(q => q.answers.length > 0).length,
        averageScore
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
