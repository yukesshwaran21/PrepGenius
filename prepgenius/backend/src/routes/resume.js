const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
  uploadResume,
  analyzeResumeText,
  getAtsTemplates,
  getResumeAnalysis,
  getAllResumes,
  deleteResume
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

// All resume routes require authentication
router.use(authMiddleware);

// Upload and analyze resume
router.post('/upload', upload.single('file'), uploadResume);

// Analyze pasted/parsed resume text
router.post('/analyze-text', analyzeResumeText);

// ATS-optimized templates
router.get('/templates', getAtsTemplates);

// Get all resumes for user
router.get('/', getAllResumes);

// Get specific resume analysis
router.get('/:resumeId', getResumeAnalysis);

// Delete resume
router.delete('/:resumeId', deleteResume);

module.exports = router;
