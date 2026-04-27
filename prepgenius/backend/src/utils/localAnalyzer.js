// Local Resume Analyzer - No API needed!

const analyzeResumeLocal = (resumeText) => {
  const text = resumeText.toLowerCase();
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);

  // Keywords for different categories
  const technicalKeywords = {
    programming: ['python', 'javascript', 'java', 'c++', 'react', 'nodejs', 'sql', 'html', 'css', 'typescript', '.net', 'php', 'ruby', 'golang', 'rust'],
    tools: ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'gitlab', 'github', 'jira', 'linux', 'windows'],
    database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'dynamodb', 'cassandra', 'firebase']
  };

  const actionVerbs = [
    'developed', 'implemented', 'designed', 'created', 'built', 'engineered',
    'led', 'managed', 'coordinated', 'improved', 'optimized', 'enhanced',
    'increased', 'reduced', 'achieved', 'delivered', 'deployed', 'launched'
  ];

  // Analysis functions
  const hasContactInfo = () => {
    return /email|phone|linkedin|github|website/.test(text);
  };

  const hasMetrics = () => {
    return /\d+%|\$\d+|increased|decreased|improved|reduced/.test(text);
  };

  const hasActionVerbs = () => {
    let count = 0;
    actionVerbs.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      count += (text.match(regex) || []).length;
    });
    return count;
  };

  const findTechnicalKeywords = () => {
    const found = new Set();
    Object.values(technicalKeywords).forEach(keywords => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          found.add(keyword);
        }
      });
    });
    return Array.from(found);
  };

  const getEducationSection = () => {
    return /bachelor|master|phd|diploma|certification|graduate|university|college|school/.test(text);
  };

  const hasExperienceSection = () => {
    return /experience|employment|work history|professional|previous|current role/.test(text);
  };

  const hasSummary = () => {
    const hasObjective = /objective|summary|professional summary|about/.test(text);
    const firstFewLines = lines.slice(0, 5).join(' ').toLowerCase();
    return hasObjective || (firstFewLines.length > 100 && firstFewLines.match(/i|my|expert|skilled/));
  };

  const wordCount = resumeText.split(/\s+/).length;
  const hasGoodLength = wordCount >= 150 && wordCount <= 600;

  const checkFormatting = () => {
    const sections = lines.length;
    const avgLineLength = resumeText.length / lines.length;
    return sections > 5 && avgLineLength > 20;
  };

  // Calculate metrics
  const actionVerbCount = hasActionVerbs();
  const technicalKeywordsFound = findTechnicalKeywords();
  const formatCheckPassed = checkFormatting();

  // Build strengths
  const strengths = [];
  if (hasContactInfo()) strengths.push('Contact information is clearly visible and easy to find');
  if (hasMetrics()) strengths.push('Resume includes quantifiable achievements and metrics');
  if (actionVerbCount > 5) strengths.push('Good use of strong action verbs throughout the document');
  if (technicalKeywordsFound.length > 3) strengths.push(`Includes relevant technical skills (${technicalKeywordsFound.slice(0, 3).join(', ')})`);
  if (getEducationSection()) strengths.push('Education section is clearly documented');
  if (hasExperienceSection()) strengths.push('Professional experience is well-organized');
  if (hasSummary()) strengths.push('Has a professional summary or objective statement');
  if (formatCheckPassed) strengths.push('Good formatting with clear section organization');

  if (strengths.length === 0) {
    strengths.push('Resume exists and is readable');
  }

  // Build weaknesses
  const weaknesses = [];
  if (!hasContactInfo()) weaknesses.push('Missing clear contact information (email, phone, LinkedIn)');
  if (!hasMetrics()) weaknesses.push('Lacks quantifiable achievements and measurable results');
  if (actionVerbCount < 3) weaknesses.push('Could use more strong action verbs to describe accomplishments');
  if (technicalKeywordsFound.length === 0) weaknesses.push('Missing technical skills and tools keywords');
  if (!getEducationSection()) weaknesses.push('Education section is unclear or missing');
  if (!hasExperienceSection()) weaknesses.push('Work experience is not clearly structured');
  if (!hasSummary()) weaknesses.push('Missing professional summary or objective statement');
  if (!hasGoodLength) weaknesses.push(`Resume length (${wordCount} words) should be between 150-600 words`);
  if (!formatCheckPassed) weaknesses.push('Formatting could be improved for better readability');

  if (weaknesses.length === 0) {
    weaknesses.push('Resume could include more details');
  }

  // Build suggestions
  const suggestions = [];
  if (!hasContactInfo()) suggestions.push('Add clear contact information at the top: email, phone, LinkedIn, GitHub');
  if (!hasMetrics()) suggestions.push('Quantify your achievements - use percentages, numbers, dollar amounts');
  if (actionVerbCount < 5) suggestions.push('Start bullet points with power words like: Developed, Implemented, Led, Managed');
  if (technicalKeywordsFound.length < 5) suggestions.push('Include more technical skills and tools relevant to your target role');
  if (!hasSummary()) suggestions.push('Add a professional summary (3-4 lines) highlighting key strengths');
  suggestions.push('Use consistent formatting and date formats throughout');
  suggestions.push('Keep most recent/relevant experience first');
  if (wordCount < 150) suggestions.push('Expand resume with more details about your accomplishments');
  if (wordCount > 600) suggestions.push('Condense resume - aim for 150-600 words for better readability');

  // Calculate score
  let score = 60; // Base score

  // Add points for strengths
  score += Math.min(strengths.length * 3, 15);

  // Subtract points for weaknesses
  score -= Math.min(weaknesses.length * 2, 20);

  // Add bonus for technical skills
  if (technicalKeywordsFound.length > 5) score += 5;
  if (actionVerbCount > 10) score += 5;

  // Add bonus for proper length
  if (hasGoodLength) score += 3;

  // Add bonus for formatting
  if (formatCheckPassed) score += 3;

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  // Create summary
  let summary = '';
  if (score >= 80) {
    summary = 'Your resume is well-structured with strong content. Focus on fine-tuning details and ensuring all key achievements are highlighted.';
  } else if (score >= 70) {
    summary = 'Your resume has a good foundation. Enhance it by adding more metrics, technical skills, and action verbs to make it stand out.';
  } else if (score >= 60) {
    summary = 'Your resume covers the basics but needs improvement. Add quantifiable results, better formatting, and stronger descriptions of your accomplishments.';
  } else if (score >= 50) {
    summary = 'Your resume needs significant work. Focus on adding contact info, structuring sections clearly, and using powerful action verbs.';
  } else {
    summary = 'Your resume needs major revisions. Start by ensuring it includes clear contact info, education, experience, and strong action verbs.';
  }

  return {
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
    overallScore: score,
    summary: summary
  };
};

module.exports = { analyzeResumeLocal };
