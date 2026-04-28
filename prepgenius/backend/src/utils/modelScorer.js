const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MODEL_PATH = path.join(
  __dirname,
  '../../../training/artifacts/resume_score_model.joblib'
);
const SCRIPT_PATH = path.join(__dirname, '../../../training/score_resume.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python';

const scoreResumeWithModel = (resumeText, jdHints) => {
  if (!fs.existsSync(MODEL_PATH) || !fs.existsSync(SCRIPT_PATH)) {
    return null;
  }

  const payload = JSON.stringify({
    resumeText,
    jdHints,
    modelPath: MODEL_PATH
  });

  const result = spawnSync(PYTHON_BIN, [SCRIPT_PATH], {
    input: payload,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    timeout: 15000
  });

  if (result.error || result.status !== 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(result.stdout || '{}');
    if (parsed.error) {
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
};

module.exports = { scoreResumeWithModel };
