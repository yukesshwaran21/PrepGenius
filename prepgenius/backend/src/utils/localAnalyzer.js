const { ATS_TEMPLATES, getTemplateFitGuidance } = require('./resumeTemplates');

const RUBRIC = {
  keywordAlignment: 40,
  structureParseability: 20,
  formattingCompatibility: 20,
  datesConsistency: 10,
  readability: 10
};

const COMMON_ATS_KEYWORDS = [
  'javascript',
  'typescript',
  'python',
  'java',
  'react',
  'node',
  'sql',
  'aws',
  'docker',
  'kubernetes',
  'rest',
  'api',
  'agile',
  'leadership',
  'communication'
];

const SECTION_ORDER = ['summary', 'skills', 'experience', 'education', 'certifications'];

const SECTION_ALIASES = {
  summary: ['summary', 'professional summary', 'profile', 'objective'],
  skills: ['skills', 'technical skills', 'core competencies'],
  experience: ['experience', 'work experience', 'employment history', 'professional experience'],
  education: ['education', 'academic background'],
  certifications: ['certifications', 'licenses', 'certificates']
};

const ACTION_VERBS = [
  'built',
  'designed',
  'implemented',
  'improved',
  'optimized',
  'led',
  'delivered',
  'scaled',
  'migrated',
  'launched',
  'reduced',
  'increased'
];

const DATE_RANGE_REGEX = /((jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–to]{1,3}\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current)/gi;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const tokenize = (text) => {
  const matches = text.toLowerCase().match(/[a-z0-9+#.]{2,}/g);
  return matches || [];
};

const unique = (arr) => [...new Set(arr)];

const normalizeLine = (line) => line.trim().replace(/\s+/g, ' ').toLowerCase();

const detectSections = (lines) => {
  const sections = [];

  lines.forEach((line, index) => {
    const normalized = normalizeLine(line);
    Object.entries(SECTION_ALIASES).forEach(([canonical, aliases]) => {
      if (aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias}:`))) {
        sections.push({ canonical, heading: line.trim(), index });
      }
    });
  });

  return sections;
};

const scoreKeywordAlignment = (resumeTokens, jdTokens) => {
  const keywordPool = jdTokens.length > 0 ? jdTokens : COMMON_ATS_KEYWORDS;
  const matchedKeywords = keywordPool.filter((kw) => resumeTokens.includes(kw));
  const ratio = keywordPool.length ? matchedKeywords.length / keywordPool.length : 0;
  const score = Math.round(clamp(ratio * RUBRIC.keywordAlignment, 0, RUBRIC.keywordAlignment));

  const missingKeywords = keywordPool.filter((kw) => !resumeTokens.includes(kw)).slice(0, 12);

  return {
    score,
    matchedKeywords: unique(matchedKeywords).slice(0, 20),
    missingKeywords
  };
};

const scoreStructure = (sections, lines) => {
  let score = 0;
  const issues = [];

  const foundOrder = sections.map((s) => s.canonical);
  const foundSet = new Set(foundOrder);

  SECTION_ORDER.forEach((section) => {
    if (foundSet.has(section)) {
      score += 3;
    }
  });

  // Parseability bonus for clear blocks
  if (lines.length >= 20) {
    score += 2;
  }

  // Ordering check
  let outOfOrder = false;
  for (let i = 1; i < sections.length; i += 1) {
    const prevRank = SECTION_ORDER.indexOf(sections[i - 1].canonical);
    const currRank = SECTION_ORDER.indexOf(sections[i].canonical);
    if (prevRank > currRank) {
      outOfOrder = true;
      break;
    }
  }

  if (!outOfOrder && sections.length > 1) {
    score += 3;
  } else if (outOfOrder) {
    issues.push('Sections appear out of a standard ATS-friendly order.');
  }

  if (!foundSet.has('experience')) {
    issues.push('Missing a clear Experience section heading.');
  }
  if (!foundSet.has('education')) {
    issues.push('Missing a clear Education section heading.');
  }

  return {
    score: clamp(score, 0, RUBRIC.structureParseability),
    detectedSections: sections,
    issues
  };
};

const scoreFormatting = (rawText, lines) => {
  let score = RUBRIC.formattingCompatibility;
  const issues = [];

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/.test(rawText);
  const hasLinkedIn = /linkedin\.com|linkedin/i.test(rawText);

  if (!hasEmail || !hasPhone) {
    score -= 4;
    issues.push('Contact info appears incomplete. Include both email and phone number.');
  }
  if (!hasLinkedIn) {
    score -= 1;
    issues.push('Add a LinkedIn profile URL for better ATS and recruiter context.');
  }

  const bulletLines = lines.filter((line) => /^\s*([\-*•])\s+/.test(line));
  if (bulletLines.length < 4) {
    score -= 3;
    issues.push('Use concise bullet points for experience and achievements.');
  }

  const bulletTypes = new Set(
    bulletLines
      .map((line) => line.trim()[0])
      .filter((char) => ['-', '*', '•'].includes(char))
  );

  if (bulletTypes.size > 1) {
    score -= 2;
    issues.push('Use a consistent bullet style throughout the resume.');
  }

  if (/\.(png|jpg|jpeg|gif|svg)|\bimage\b|\bicon\b|\bgraphic\b/i.test(rawText)) {
    score -= 3;
    issues.push('Avoid images/icons that ATS systems may not parse correctly.');
  }

  const repeatedLines = new Map();
  lines.forEach((line) => {
    const normalized = normalizeLine(line);
    if (!normalized) {
      return;
    }
    repeatedLines.set(normalized, (repeatedLines.get(normalized) || 0) + 1);
  });

  const suspiciousRepeats = [...repeatedLines.values()].some((count) => count >= 3);
  if (suspiciousRepeats) {
    score -= 2;
    issues.push('Possible header/footer repetition detected; ATS may duplicate or skip content.');
  }

  // Heuristic: unusual unicode density may indicate incompatible fonts/icons in converted text
  const nonAsciiCount = (rawText.match(/[^\x00-\x7F]/g) || []).length;
  if (nonAsciiCount > rawText.length * 0.03) {
    score -= 2;
    issues.push('Detected many special symbols; use ATS-safe fonts and plain text symbols.');
  }

  return {
    score: clamp(score, 0, RUBRIC.formattingCompatibility),
    hasEmail,
    hasPhone,
    hasLinkedIn,
    issues
  };
};

const parseYear = (token) => {
  const yearMatch = token.match(/(19|20)\d{2}/);
  if (yearMatch) {
    return parseInt(yearMatch[0], 10);
  }
  return null;
};

const scoreDateConsistency = (rawText) => {
  let score = RUBRIC.datesConsistency;
  const issues = [];
  const ranges = [];

  let match = DATE_RANGE_REGEX.exec(rawText);
  while (match) {
    const startToken = match[1] || '';
    const endToken = match[3] || '';
    const startYear = parseYear(startToken);
    const endYear = /present|current/i.test(endToken) ? new Date().getFullYear() : parseYear(endToken);

    if (startYear && endYear) {
      ranges.push({ startYear, endYear, raw: match[0] });
      if (startYear > endYear) {
        score -= 3;
        issues.push(`Date range appears reversed: ${match[0]}`);
      }
    }

    match = DATE_RANGE_REGEX.exec(rawText);
  }

  if (ranges.length === 0) {
    score -= 4;
    issues.push('No clear date ranges found for experience/education entries.');
  }

  const inconsistentDateFormats = (() => {
    const hasMonthWord = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(rawText);
    const hasSlashDates = /\d{1,2}\/\d{4}/.test(rawText);
    return hasMonthWord && hasSlashDates;
  })();

  if (inconsistentDateFormats) {
    score -= 2;
    issues.push('Mixed date formats found. Use one consistent style (e.g., MMM YYYY).');
  }

  return {
    score: clamp(score, 0, RUBRIC.datesConsistency),
    ranges,
    issues
  };
};

const scoreReadability = (rawText, lines) => {
  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const avgWordsPerLine = lines.length ? wordCount / lines.length : wordCount;
  const actionVerbCount = ACTION_VERBS.reduce((sum, verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    return sum + (rawText.match(regex) || []).length;
  }, 0);

  let score = RUBRIC.readability;
  const issues = [];

  if (wordCount < 200) {
    score -= 2;
    issues.push('Resume is very short; add impact bullets and context.');
  }
  if (wordCount > 900) {
    score -= 3;
    issues.push('Resume is likely too long for ATS/recruiter scanning; target 1-2 pages.');
  }
  if (avgWordsPerLine > 18) {
    score -= 2;
    issues.push('Long dense lines reduce scannability. Use shorter bullet points.');
  }
  if (actionVerbCount < 5) {
    score -= 2;
    issues.push('Use more action verbs to improve impact and readability.');
  }

  return {
    score: clamp(score, 0, RUBRIC.readability),
    wordCount,
    actionVerbCount,
    issues
  };
};

const inferRole = (tokens) => {
  if (tokens.includes('data') || tokens.includes('analytics') || tokens.includes('sql')) {
    return 'Data / Analytics';
  }
  if (tokens.includes('react') || tokens.includes('frontend')) {
    return 'Frontend';
  }
  if (tokens.includes('node') || tokens.includes('backend') || tokens.includes('api')) {
    return 'Backend';
  }
  return 'General';
};

const scoreEducationExperienceAlignment = (rawText) => {
  const issues = [];
  const hasEducation = /\beducation\b|university|college|bachelor|master|phd/i.test(rawText);
  const hasExperience = /\bexperience\b|employment|worked|engineer|developer|manager/i.test(rawText);

  if (!hasEducation || !hasExperience) {
    issues.push('Education and experience sections should both be explicit for ATS ranking.');
  }

  return {
    aligned: hasEducation && hasExperience,
    issues
  };
};

const buildRemediationChecklist = (missingKeywords, issues) => {
  const checklist = [
    'Use standard section headings: Summary, Skills, Experience, Education, Certifications.',
    'Ensure contact block includes full name, email, phone, and LinkedIn URL.',
    'Use single-column layout and plain bullet points with consistent style.',
    'Keep date format consistent across all sections (recommended: MMM YYYY).'
  ];

  if (missingKeywords.length > 0) {
    checklist.push(`Add 5-8 relevant JD keywords naturally: ${missingKeywords.slice(0, 8).join(', ')}.`);
  }

  if (issues.some((issue) => issue.toLowerCase().includes('image'))) {
    checklist.push('Remove icons, graphics, logos, and text boxes for ATS compatibility.');
  }

  return checklist;
};

const analyzeResumeLocal = (resumeText, options = {}) => {
  const rawText = resumeText || '';
  const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const resumeTokens = unique(tokenize(rawText));
  const jdHints = options.jdHints || '';
  const jdTokens = unique(tokenize(jdHints)).filter((token) => token.length >= 3);

  const sections = detectSections(lines);
  const keyword = scoreKeywordAlignment(resumeTokens, jdTokens);
  const structure = scoreStructure(sections, lines);
  const formatting = scoreFormatting(rawText, lines);
  const dates = scoreDateConsistency(rawText);
  const readability = scoreReadability(rawText, lines);
  const eduExpAlignment = scoreEducationExperienceAlignment(rawText);

  const overallScore = clamp(
    keyword.score + structure.score + formatting.score + dates.score + readability.score,
    0,
    100
  );

  const flaggedIssues = [
    ...structure.issues,
    ...formatting.issues,
    ...dates.issues,
    ...readability.issues,
    ...eduExpAlignment.issues
  ];

  const strengths = [
    keyword.matchedKeywords.length > 0
      ? `Matched ${keyword.matchedKeywords.length} relevant keywords.`
      : 'Resume text is extractable and scannable.',
    structure.detectedSections.length >= 3
      ? `Detected clear sections: ${structure.detectedSections
          .map((s) => s.canonical)
          .filter((value, index, arr) => arr.indexOf(value) === index)
          .join(', ')}.`
      : 'Basic section structure detected.',
    formatting.hasEmail && formatting.hasPhone
      ? 'Contact information includes email and phone.'
      : 'Contact block exists and can be improved.',
    readability.actionVerbCount >= 5
      ? `Good action-verb usage (${readability.actionVerbCount} detected).`
      : 'Readable baseline resume language.'
  ];

  const weaknesses = flaggedIssues.slice(0, 8);
  const remediationChecklist = buildRemediationChecklist(keyword.missingKeywords, flaggedIssues);

  const inferredRole = inferRole(resumeTokens);
  const templateFitGuidance = getTemplateFitGuidance(inferredRole);

  const summary =
    overallScore >= 85
      ? 'Excellent ATS compatibility with minor improvements needed.'
      : overallScore >= 70
      ? 'Good ATS baseline. Address flagged issues to increase interview conversion.'
      : overallScore >= 55
      ? 'Moderate ATS compatibility. Prioritize structure and keyword alignment fixes.'
      : 'Low ATS compatibility. Rebuild with an ATS-optimized template and targeted keywords.';

  return {
    workflowVersion: 'ats-v1.0',
    overallScore,
    rubric: RUBRIC,
    sectionBreakdown: {
      keywordAlignment: {
        max: RUBRIC.keywordAlignment,
        score: keyword.score,
        matchedKeywords: keyword.matchedKeywords,
        missingKeywords: keyword.missingKeywords
      },
      structureParseability: {
        max: RUBRIC.structureParseability,
        score: structure.score,
        detectedSections: structure.detectedSections
      },
      formattingCompatibility: {
        max: RUBRIC.formattingCompatibility,
        score: formatting.score,
        checks: {
          hasEmail: formatting.hasEmail,
          hasPhone: formatting.hasPhone,
          hasLinkedIn: formatting.hasLinkedIn
        }
      },
      datesConsistency: {
        max: RUBRIC.datesConsistency,
        score: dates.score,
        rangesDetected: dates.ranges.length
      },
      readability: {
        max: RUBRIC.readability,
        score: readability.score,
        wordCount: readability.wordCount,
        actionVerbCount: readability.actionVerbCount
      }
    },
    flaggedIssues: unique(flaggedIssues).slice(0, 20),
    remediationSteps: remediationChecklist,
    recommendations: {
      targetedKeywordSuggestions: keyword.missingKeywords.slice(0, 12),
      templateFitGuidance,
      todoChecklist: remediationChecklist
    },
    templates: ATS_TEMPLATES,

    // Backward-compatible keys used by existing UI
    strengths: strengths.slice(0, 6),
    weaknesses,
    suggestions: remediationChecklist.slice(0, 8),
    summary
  };
};

module.exports = { analyzeResumeLocal, RUBRIC };
