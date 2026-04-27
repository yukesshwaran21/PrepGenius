const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Extract text from PDF file
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Extract text from DOCX file
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting DOCX text:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

// Extract text from TXT file
const extractTextFromTXT = async (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error extracting TXT text:', error);
    throw new Error('Failed to extract text from TXT');
  }
};

// Extract text from supported resume formats
const extractTextFromResumeFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.pdf') {
    return extractTextFromPDF(filePath);
  }

  if (extension === '.docx') {
    return extractTextFromDOCX(filePath);
  }

  if (extension === '.txt') {
    return extractTextFromTXT(filePath);
  }

  // Legacy .doc parsing is unreliable locally without external converters.
  // Ask user to upload DOCX, PDF, or TXT for deterministic parsing.
  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
};

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromTXT,
  extractTextFromResumeFile
};
