const express = require('express');
const router = express.Router();
const {
  getUserStats,
  getRecentInterviews,
  getRecentResumes
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authMiddleware);

// Get user stats and profile
router.get('/stats', getUserStats);

// Get recent interviews
router.get('/interviews', getRecentInterviews);

// Get recent resumes
router.get('/resumes', getRecentResumes);

module.exports = router;
