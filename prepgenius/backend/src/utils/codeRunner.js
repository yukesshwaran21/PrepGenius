const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_TIME_LIMIT_MS = 2000;
const MAX_OUTPUT_BYTES = 256 * 1024;

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const safeCleanup = (dirPath) => {
  if (!dirPath || !fs.existsSync(dirPath)) {
    return;
  }
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Failed to cleanup temp dir:', error.message);
  }
};

const buildTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'prepgenius-'));

const compileC = (dirPath) => {
  const compiler = process.env.C_COMPILER || 'gcc';
  const result = spawnSync(compiler, ['main.c', '-O2', '-std=c11', '-o', 'main.exe'], {
    cwd: dirPath,
    encoding: 'utf8',
    timeout: DEFAULT_TIME_LIMIT_MS
  });
  return result;
};

const compileJava = (dirPath) => spawnSync('javac', ['Main.java'], {
  cwd: dirPath,
  encoding: 'utf8',
  timeout: DEFAULT_TIME_LIMIT_MS
});

const runCommand = (command, args, dirPath, input, timeLimitMs) => {
  const start = Date.now();
  const result = spawnSync(command, args, {
    cwd: dirPath,
    input,
    encoding: 'utf8',
    timeout: timeLimitMs || DEFAULT_TIME_LIMIT_MS,
    maxBuffer: MAX_OUTPUT_BYTES
  });
  const runtimeMs = Date.now() - start;
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    exitCode: typeof result.status === 'number' ? result.status : null,
    runtimeMs,
    error: result.error || null
  };
};

const prepareProgram = (language, sourceCode, timeLimitMs) => {
  const dirPath = buildTempDir();
  ensureDir(dirPath);

  try {
    if (language === 'python') {
      fs.writeFileSync(path.join(dirPath, 'main.py'), sourceCode, 'utf8');
      return {
        dirPath,
        run: (input) => runCommand(process.env.PYTHON_BIN || 'python', ['main.py'], dirPath, input, timeLimitMs),
        cleanup: () => safeCleanup(dirPath)
      };
    }

    if (language === 'java') {
      fs.writeFileSync(path.join(dirPath, 'Main.java'), sourceCode, 'utf8');
      const compileResult = compileJava(dirPath);
      if (compileResult.error || compileResult.status !== 0) {
        return {
          dirPath,
          compileError: compileResult.stderr || compileResult.error?.message || 'Java compilation failed',
          cleanup: () => safeCleanup(dirPath)
        };
      }
      return {
        dirPath,
        run: (input) => runCommand('java', ['Main'], dirPath, input, timeLimitMs),
        cleanup: () => safeCleanup(dirPath)
      };
    }

    if (language === 'c') {
      fs.writeFileSync(path.join(dirPath, 'main.c'), sourceCode, 'utf8');
      const compileResult = compileC(dirPath);
      if (compileResult.error || compileResult.status !== 0) {
        return {
          dirPath,
          compileError: compileResult.stderr || compileResult.error?.message || 'C compilation failed',
          cleanup: () => safeCleanup(dirPath)
        };
      }
      return {
        dirPath,
        run: (input) => runCommand(path.join(dirPath, 'main.exe'), [], dirPath, input, timeLimitMs),
        cleanup: () => safeCleanup(dirPath)
      };
    }

    return {
      dirPath,
      compileError: 'Unsupported language',
      cleanup: () => safeCleanup(dirPath)
    };
  } catch (error) {
    safeCleanup(dirPath);
    return {
      dirPath,
      compileError: error.message || 'Failed to prepare program',
      cleanup: () => safeCleanup(dirPath)
    };
  }
};

const normalizeOutput = (output) => (output || '').trim().replace(/\r\n/g, '\n');

const runTestCases = (runner, testCases, timeLimitMs) => {
  const results = [];
  let totalRuntime = 0;

  for (const testCase of testCases) {
    const execution = runner.run(testCase.input, timeLimitMs);
    const stdout = normalizeOutput(execution.stdout);
    const expected = normalizeOutput(testCase.expectedOutput);
    const passed = stdout === expected && !execution.error && execution.exitCode === 0;
    const isHidden = Boolean(testCase.isHidden);
    totalRuntime += execution.runtimeMs || 0;

    results.push({
      input: testCase.input,
      expectedOutput: expected,
      actualOutput: stdout,
      passed,
      isHidden,
      stderr: execution.stderr || null,
      runtimeMs: execution.runtimeMs || 0
    });
  }

  return {
    totalRuntime,
    results
  };
};

module.exports = {
  prepareProgram,
  runTestCases,
  normalizeOutput
};
