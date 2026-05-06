const estimateComplexity = (sourceCode) => {
  if (!sourceCode) {
    return 'O(1)';
  }

  const normalized = sourceCode.replace(/\s+/g, ' ').toLowerCase();
  const loopMatches = normalized.match(/\bfor\b|\bwhile\b/g) || [];
  const nestedLoops = normalized.match(/for\s*\([^)]*\)\s*\{[^{}]*(for|while)\b|while\s*\([^)]*\)\s*\{[^{}]*(for|while)\b/g) || [];

  if (nestedLoops.length > 0) {
    return 'O(n^2)';
  }
  if (loopMatches.length > 0) {
    return 'O(n)';
  }
  return 'O(1)';
};

module.exports = { estimateComplexity };
