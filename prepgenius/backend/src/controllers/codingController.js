const { PrismaClient } = require('@prisma/client');
const { prepareProgram, runTestCases } = require('../utils/codeRunner');
const { estimateComplexity } = require('../utils/complexityEstimator');
const { computeSimilarityScore } = require('../utils/similarity');

const prisma = new PrismaClient();

const getProblemByIdOrSlug = async (problemId, slug, includeHidden = false) => {
  const testCaseFilter = includeHidden ? {} : { where: { isHidden: false } };
  if (problemId) {
    return prisma.codingProblem.findUnique({
      where: { id: parseInt(problemId, 10) },
      include: { testCases: testCaseFilter }
    });
  }
  if (slug) {
    return prisma.codingProblem.findUnique({
      where: { slug },
      include: { testCases: testCaseFilter }
    });
  }
  return null;
};

const listProblems = async (req, res) => {
  try {
    const problems = await prisma.codingProblem.findMany({
      orderBy: { id: 'asc' },
      include: { testCases: { where: { isHidden: false } } }
    });

    res.status(200).json({
      problems: problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        timeLimitMs: problem.timeLimitMs,
        supportedLanguages: problem.supportedLanguages,
        sampleTests: problem.testCases.map((test) => ({
          input: test.input,
          expectedOutput: test.expectedOutput
        }))
      }))
    });
  } catch (error) {
    console.error('List problems error:', error);
    res.status(500).json({ error: 'Failed to fetch coding problems' });
  }
};

const getProblemDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await prisma.codingProblem.findUnique({
      where: { slug },
      include: { testCases: { where: { isHidden: false } } }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.status(200).json({
      problem: {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitMb: problem.memoryLimitMb,
        supportedLanguages: problem.supportedLanguages,
        starterCode: problem.starterCode,
        sampleTests: problem.testCases.map((test) => ({
          input: test.input,
          expectedOutput: test.expectedOutput
        }))
      }
    });
  } catch (error) {
    console.error('Get problem detail error:', error);
    res.status(500).json({ error: 'Failed to fetch coding problem' });
  }
};

const runCode = async (req, res) => {
  try {
    const { problemId, slug, language, sourceCode } = req.body;

    if (!language || !sourceCode) {
      return res.status(400).json({ error: 'Language and source code are required' });
    }

    const problem = await getProblemByIdOrSlug(problemId, slug, false);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const supported = problem.supportedLanguages || [];
    if (!supported.includes(language)) {
      return res.status(400).json({ error: 'Language not supported for this problem' });
    }

    const runner = prepareProgram(language, sourceCode, problem.timeLimitMs);
    if (runner.compileError) {
      runner.cleanup();
      return res.status(400).json({ error: runner.compileError });
    }

    const { results, totalRuntime } = runTestCases(runner, problem.testCases, problem.timeLimitMs);
    runner.cleanup();

    const passedTests = results.filter((result) => result.passed).length;

    res.status(200).json({
      status: passedTests === results.length ? 'passed' : 'failed',
      totalTests: results.length,
      passedTests,
      runtimeMs: totalRuntime,
      complexityEstimate: estimateComplexity(sourceCode),
      tests: results
    });
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ error: 'Failed to run code' });
  }
};

const submitCode = async (req, res) => {
  try {
    const { problemId, slug, language, sourceCode } = req.body;
    const userId = req.userId;

    if (!language || !sourceCode) {
      return res.status(400).json({ error: 'Language and source code are required' });
    }

    const problem = await getProblemByIdOrSlug(problemId, slug, true);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const supported = problem.supportedLanguages || [];
    if (!supported.includes(language)) {
      return res.status(400).json({ error: 'Language not supported for this problem' });
    }

    const allTests = problem.testCases;

    const runner = prepareProgram(language, sourceCode, problem.timeLimitMs);
    if (runner.compileError) {
      runner.cleanup();
      return res.status(400).json({ error: runner.compileError });
    }

    const { results, totalRuntime } = runTestCases(runner, allTests, problem.timeLimitMs);
    runner.cleanup();

    const passedTests = results.filter((result) => result.passed).length;
    const totalTests = results.length;
    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    const visibleResults = results.filter((result) => !result.isHidden);

    const lastSubmission = await prisma.codingSubmission.findFirst({
      where: { userId, problemId: problem.id },
      orderBy: { createdAt: 'desc' }
    });

    const similarityScore = lastSubmission
      ? computeSimilarityScore(sourceCode, lastSubmission.sourceCode)
      : 0;

    const submission = await prisma.codingSubmission.create({
      data: {
        userId,
        problemId: problem.id,
        language,
        sourceCode,
        status: passedTests === totalTests ? 'passed' : 'failed',
        runtimeMs: totalRuntime,
        totalTests,
        passedTests,
        score,
        similarityScore,
        complexityEstimate: estimateComplexity(sourceCode),
        executionLog: { tests: results }
      }
    });

    res.status(201).json({
      submissionId: submission.id,
      status: submission.status,
      score: Math.round(score),
      totalTests,
      passedTests,
      runtimeMs: totalRuntime,
      similarityScore,
      complexityEstimate: submission.complexityEstimate,
      tests: visibleResults
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ error: 'Failed to submit code' });
  }
};

const listSubmissions = async (req, res) => {
  try {
    const userId = req.userId;
    const { problemId } = req.query;

    const submissions = await prisma.codingSubmission.findMany({
      where: {
        userId,
        ...(problemId ? { problemId: parseInt(problemId, 10) } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      submissions: submissions.map((submission) => ({
        id: submission.id,
        problemId: submission.problemId,
        language: submission.language,
        status: submission.status,
        score: submission.score,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests,
        runtimeMs: submission.runtimeMs,
        similarityScore: submission.similarityScore,
        complexityEstimate: submission.complexityEstimate,
        createdAt: submission.createdAt
      }))
    });
  } catch (error) {
    console.error('List submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

module.exports = {
  listProblems,
  getProblemDetail,
  runCode,
  submitCode,
  listSubmissions
};
