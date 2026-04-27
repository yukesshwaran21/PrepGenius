# ATS Resume Evaluator Specification (End-to-End)

## 1) Preferred Stack
- Implemented stack: JavaScript (Node.js + Express backend, React frontend)
- Parsing libraries:
  - pdf-parse for PDF
  - mammoth for DOCX
  - native file read for TXT
- Why this stack:
  - Matches existing PrepGenius architecture
  - Easy local setup and fast MVP iteration
  - Deterministic, transparent scoring logic

## 2) End-to-End ATS Scoring Workflow
### Input
- Required:
  - Resume file: PDF, DOCX, or TXT
  - Or parsed resume text (for CLI/API integration)
- Optional:
  - Job Description hints text (JD)

### Parsing Pipeline
1. Extract text from file (or accept parsed text).
2. Normalize into lines and tokens.
3. Detect section headers and order.
4. Extract metadata:
   - Contact info signals (email, phone, LinkedIn)
   - Date ranges
   - Bullet style and consistency
   - Possible ATS-hostile formatting indicators

### Evaluation Criteria
- Keyword matching to JD hints
- Proper section ordering and standard headings
- ATS-safe formatting compatibility
- Date consistency and chronology checks
- Readability and impact language quality
- Contact info completeness
- Work experience clarity
- Education and experience alignment
- Flags for images/headers/footers or suspicious formatting repetition

### Scoring Rubric (Explicit Weights)
- 40% Keyword / requirements alignment
- 20% Structure / parseability
- 20% Formatting compatibility
- 10% Dates consistency
- 10% Readability

### Output
- overallScore: 0-100
- sectionBreakdown: weighted per category
- flaggedIssues: concrete ATS risks
- remediationSteps: prioritized fix list
- recommendations:
  - targetedKeywordSuggestions
  - templateFitGuidance
  - todoChecklist
- templates: 5 ATS-optimized templates with tailoring guidance

## 3) API Design
### Endpoints
- POST /api/resume/upload
  - multipart/form-data
  - fields: file, jdHints(optional)
- POST /api/resume/analyze-text
  - body: { resumeText, jdHints? }
- GET /api/resume/templates
  - returns ATS template library

### Example Request/Response
#### POST /api/resume/analyze-text
Request:
{
  "resumeText": "...parsed resume text...",
  "jdHints": "React, TypeScript, REST APIs, CI/CD, AWS"
}

Response (abridged):
{
  "analysis": {
    "workflowVersion": "ats-v1.0",
    "overallScore": 78,
    "rubric": {
      "keywordAlignment": 40,
      "structureParseability": 20,
      "formattingCompatibility": 20,
      "datesConsistency": 10,
      "readability": 10
    },
    "sectionBreakdown": {
      "keywordAlignment": { "score": 29, "max": 40, "missingKeywords": ["ci/cd"] },
      "structureParseability": { "score": 15, "max": 20 },
      "formattingCompatibility": { "score": 16, "max": 20 },
      "datesConsistency": { "score": 8, "max": 10 },
      "readability": { "score": 10, "max": 10 }
    },
    "flaggedIssues": [
      "Mixed date formats found. Use one consistent style (e.g., MMM YYYY)."
    ],
    "remediationSteps": [
      "Use standard section headings...",
      "Add 5-8 relevant JD keywords naturally..."
    ],
    "recommendations": {
      "targetedKeywordSuggestions": ["ci/cd", "aws"],
      "templateFitGuidance": "Use ATS Compact Mid-Level...",
      "todoChecklist": ["..."]
    }
  }
}

## 4) Textual Architecture Diagram
Client (React Resume Analyzer)
-> Resume API Client
-> Express Resume Routes
-> Resume Controller
-> Parser Layer (PDF/DOCX/TXT)
-> ATS Scoring Engine (weighted rubric + detectors)
-> Template Recommender
-> JSON Report
-> Persisted resume analysis (Prisma/PostgreSQL for file uploads)
-> UI scorecards + issues + checklist + template gallery

## 5) Core Implementation Snippets
### Parsing Selector (Node)
```js
const extractTextFromResumeFile = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.pdf') return extractTextFromPDF(filePath);
  if (extension === '.docx') return extractTextFromDOCX(filePath);
  if (extension === '.txt') return extractTextFromTXT(filePath);
  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
};
```

### Weighted Score Aggregation
```js
const overallScore = clamp(
  keyword.score + structure.score + formatting.score + dates.score + readability.score,
  0,
  100
);
```

### Template Rendering (React)
```jsx
{analysis.templates.map((template) => (
  <pre key={template.id}>{template.templateText}</pre>
))}
```

## 6) ATS Templates Included
- ATS Classic Chronological
- ATS Compact Mid-Level
- ATS Skills-Forward
- ATS Entry-Level Impact
- ATS Senior Leadership

Each template includes:
- ATS-safe heading structure
- Placeholder content blocks
- Why it scores well metadata
- JD tailoring instructions

## 7) MVP Plan and Phased Enhancements
### MVP (Done)
- File + text analysis modes
- Weighted ATS rubric
- Flagged issues and remediation checklist
- Template recommendation and 5 templates

### Phase 2
- Better JD requirement extraction (must-have vs nice-to-have)
- Domain-specific keyword packs (frontend, backend, data, PM)
- Export actionable report as PDF/JSON

### Phase 3
- Role-aware bullet rewriting suggestions
- Multi-resume benchmarking and trend tracking
- Optional LLM-assisted rewrite mode with deterministic guardrails

## 8) Local Run Instructions
1. Backend dependencies:
   - npm install
2. Frontend dependencies:
   - npm install
3. Start backend:
   - npm run dev (in backend)
4. Start frontend:
   - npm start (in frontend)
5. Open Resume Analyzer page and test:
   - Upload PDF/DOCX/TXT, add JD hints, evaluate
   - Or use Paste Parsed Text mode
