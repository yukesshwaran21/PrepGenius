const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { extractTextFromResumeFile } = require('../utils/openai');
const { analyzeResumeLocal } = require('../utils/localAnalyzer');
const { ATS_TEMPLATES } = require('../utils/resumeTemplates');

const prisma = new PrismaClient();

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

    res.status(200).json({
      message: 'Resume text analyzed successfully',
      analysis
    });
  } catch (error) {
    console.error('Analyze resume text error:', error);
    res.status(500).json({ error: 'Failed to analyze resume text' });
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
  getAtsTemplates,
  getResumeAnalysis,
  getAllResumes,
  deleteResume
};
