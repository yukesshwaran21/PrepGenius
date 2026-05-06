const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { extractTextFromResumeFile } = require('../utils/openai');
const { analyzeResumeLocal, RUBRIC } = require('../utils/localAnalyzer');
const { ATS_TEMPLATES } = require('../utils/resumeTemplates');
const { scoreResumeWithModel } = require('../utils/modelScorer');

const prisma = new PrismaClient();

const removeUploadedFile = (file) => {
  if (!file?.path) {
    return;
  }
  try {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

const buildMatchResponse = (analysis) => {
  const keywordScore = analysis?.sectionBreakdown?.keywordAlignment?.score || 0;
  const missingKeywords = analysis?.sectionBreakdown?.keywordAlignment?.missingKeywords || [];
  const matchScore = RUBRIC.keywordAlignment > 0
    ? Math.round((keywordScore / RUBRIC.keywordAlignment) * 100)
    : 0;

  return {
    match_score: matchScore,
    missing_keywords: missingKeywords,
    important_keywords_absent: missingKeywords,
    ats_compatibility: analysis?.overallScore || 0
  };
};

// UPLOAD RESUME AND ANALYZE
const uploadResume = async (req, res) => {
  try {
    const userId = req.userId;
    const jdHints = req.body?.jdHints || '';
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 Processing resume file:', req.file.filename);

    // Extract text from supported formats (pdf/docx/txt)
    const resumeText = await extractTextFromResumeFile(req.file.path);
    
    if (!resumeText || resumeText.trim().length === 0) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Could not extract text from PDF' });
    }

    console.log('✅ Text extracted, length:', resumeText.length);
    console.log('🤖 Analyzing resume locally...');

    // Analyze resume with local analyzer (NO API needed!)
    const analysis = analyzeResumeLocal(resumeText, { jdHints });
    const modelResult = scoreResumeWithModel(resumeText, jdHints);
    if (modelResult && typeof modelResult.score === 'number') {
      analysis.modelScore = modelResult.score;
      analysis.scoreSource = 'ml-model';
      analysis.overallScore = modelResult.score;
    }

    console.log('✅ Analysis complete:', analysis.overallScore);

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId,
        fileUrl: `/uploads/${req.file.filename}`,
        analysisResult: analysis
      }
    });

    res.status(201).json({
      message: 'Resume analyzed successfully',
      resume: {
        id: resume.id,
        fileUrl: resume.fileUrl,
        analysis: resume.analysisResult,
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    // Delete the uploaded file if analysis failed
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    console.error('❌ Upload resume error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload and analyze resume' });
  }
};

// ANALYZE PASTED/PARSED RESUME TEXT
const analyzeResumeText = async (req, res) => {
  try {
    const { resumeText, jdHints } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'resumeText is required and should be at least 50 characters' });
    }

    const analysis = analyzeResumeLocal(resumeText, { jdHints: jdHints || '' });
    const modelResult = scoreResumeWithModel(resumeText, jdHints || '');
    if (modelResult && typeof modelResult.score === 'number') {
      analysis.modelScore = modelResult.score;
      analysis.scoreSource = 'ml-model';
      analysis.overallScore = modelResult.score;
    }

    res.status(200).json({
      message: 'Resume text analyzed successfully',
      analysis
    });
  } catch (error) {
    console.error('Analyze resume text error:', error);
    res.status(500).json({ error: 'Failed to analyze resume text' });
  }
};

// MATCH RESUME AGAINST JOB DESCRIPTION (TEXT INPUT)
const matchResumeToJobDescriptionText = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'resumeText is required and should be at least 50 characters' });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 30) {
      return res.status(400).json({ error: 'jobDescription is required and should be at least 30 characters' });
    }

    const analysis = analyzeResumeLocal(resumeText, { jdHints: jobDescription });
    const match = buildMatchResponse(analysis);

    res.status(200).json({
      match,
      ats_breakdown: analysis.sectionBreakdown
    });
  } catch (error) {
    console.error('Match resume text error:', error);
    res.status(500).json({ error: 'Failed to match resume to job description' });
  }
};

// MATCH RESUME AGAINST JOB DESCRIPTION (FILE UPLOAD)
const matchResumeToJobDescriptionUpload = async (req, res) => {
  const resumeFile = req.files?.resume?.[0] || null;
  const jdFile = req.files?.jobDescription?.[0] || null;

  try {
    const jdText = req.body?.jobDescriptionText || '';

    if (!resumeFile) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const resumeText = await extractTextFromResumeFile(resumeFile.path);
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract sufficient text from resume file' });
    }

    let jobDescription = jdText;
    if (jdFile) {
      jobDescription = await extractTextFromResumeFile(jdFile.path);
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ error: 'Job description text or file is required' });
    }

    const analysis = analyzeResumeLocal(resumeText, { jdHints: jobDescription });
    const match = buildMatchResponse(analysis);

    res.status(200).json({
      match,
      ats_breakdown: analysis.sectionBreakdown
    });
  } catch (error) {
    console.error('Match resume upload error:', error);
    res.status(500).json({ error: 'Failed to match resume to job description' });
  } finally {
    removeUploadedFile(resumeFile);
    removeUploadedFile(jdFile);
  }
};

// GET ATS TEMPLATES
const getAtsTemplates = async (req, res) => {
  try {
    res.status(200).json({ templates: ATS_TEMPLATES });
  } catch (error) {
    console.error('Get ATS templates error:', error);
    res.status(500).json({ error: 'Failed to fetch ATS templates' });
  }
};

// GET RESUME ANALYSIS
const getResumeAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.userId;

    const resume = await prisma.resume.findFirst({
      where: {
        id: parseInt(resumeId),
        userId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.status(200).json({
      resume: {
        id: resume.id,
        fileUrl: resume.fileUrl,
        analysis: resume.analysisResult,
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    console.error('Get resume analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch resume analysis' });
  }
};

// GET ALL RESUMES
const getAllResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedResumes = resumes.map(resume => ({
      id: resume.id,
      fileUrl: resume.fileUrl,
      hasAnalysis: resume.analysisResult !== null,
      overallScore: resume.analysisResult?.overallScore || 0,
      createdAt: resume.createdAt
    }));

    res.status(200).json({
      resumes: formattedResumes
    });
  } catch (error) {
    console.error('Get all resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

// DELETE RESUME
const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.userId;

    const resume = await prisma.resume.findFirst({
      where: {
        id: parseInt(resumeId),
        userId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '../../..', resume.fileUrl);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id: parseInt(resumeId) }
    });

    res.status(200).json({
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

module.exports = {
  uploadResume,
  analyzeResumeText,
  matchResumeToJobDescriptionText,
  matchResumeToJobDescriptionUpload,
  getAtsTemplates,
  getResumeAnalysis,
  getAllResumes,
  deleteResume
};
