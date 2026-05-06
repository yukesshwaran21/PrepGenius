const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  listProblems,
  getProblemDetail,
  runCode,
  submitCode,
  listSubmissions
} = require('../controllers/codingController');

const router = express.Router();

router.get('/problems', listProblems);
router.get('/problems/:slug', getProblemDetail);

router.use(authMiddleware);

router.post('/run', runCode);
router.post('/submit', submitCode);
router.get('/submissions', listSubmissions);

module.exports = router;
