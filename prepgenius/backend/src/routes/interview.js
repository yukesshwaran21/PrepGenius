const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  startInterview,
  getInterviewQuestions,
  submitAnswer,
  getInterviewResults,
  getUserInterviews
} = require('../controllers/interviewController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/interview/start - Start a new interview
router.post('/start', startInterview);

// GET /api/interview/:interviewId - Get interview questions
router.get('/:interviewId', getInterviewQuestions);

// POST /api/interview/answer - Submit an answer
router.post('/answer', submitAnswer);

// GET /api/interview/:interviewId/results - Get interview results
router.get('/:interviewId/results', getInterviewResults);

// GET /api/interview - Get all user interviews
router.get('/', getUserInterviews);

module.exports = router;
