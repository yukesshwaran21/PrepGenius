const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET USER STATS & PROFILE INFO
const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Count resumes
    const resumeCount = await prisma.resume.count({
      where: { userId }
    });

    // Count interviews
    const interviewCount = await prisma.interview.count({
      where: { userId }
    });

    // Count total answers
    const answerCount = await prisma.answer.count({
      where: {
        question: {
          interview: {
            userId
          }
        }
      }
    });

    // Calculate average score
    const averageScoreResult = await prisma.answer.aggregate({
      where: {
        question: {
          interview: {
            userId
          }
        },
        score: { not: null }
      },
      _avg: {
        score: true
      }
    });

    const averageScore = averageScoreResult._avg.score || 0;

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      stats: {
        resumesUploaded: resumeCount,
        interviewsTaken: interviewCount,
        answersSubmitted: answerCount,
        averageScore: Math.round(averageScore)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// GET RECENT INTERVIEWS
const getRecentInterviews = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;

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

    // Format data
    const formattedInterviews = interviews.map(interview => {
      const totalQuestions = interview.questions.length;
      const totalAnswers = interview.questions.reduce(
        (sum, q) => sum + q.answers.length,
        0
      );
      const averageScore = interview.questions.length > 0
        ? Math.round(
            interview.questions.reduce((sum, q) => {
              const qScore = q.answers.length > 0
                ? Math.round(q.answers.reduce((s, a) => s + (a.score || 0), 0) / q.answers.length)
                : 0;
              return sum + qScore;
            }, 0) / interview.questions.length
          )
        : 0;

      return {
        id: interview.id,
        role: interview.role,
        difficulty: interview.difficulty,
        totalQuestions,
        answersSubmitted: totalAnswers,
        averageScore,
        createdAt: interview.createdAt
      };
    });

    res.status(200).json({
      interviews: formattedInterviews
    });
  } catch (error) {
    console.error('Get recent interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch recent interviews' });
  }
};

// GET RECENT RESUMES
const getRecentResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Format data
    const formattedResumes = resumes.map(resume => ({
      id: resume.id,
      fileUrl: resume.fileUrl,
      hasAnalysis: resume.analysisResult !== null,
      analysis: resume.analysisResult,
      createdAt: resume.createdAt
    }));

    res.status(200).json({
      resumes: formattedResumes
    });
  } catch (error) {
    console.error('Get recent resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch recent resumes' });
  }
};

module.exports = { getUserStats, getRecentInterviews, getRecentResumes };
