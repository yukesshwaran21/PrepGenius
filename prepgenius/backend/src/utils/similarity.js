const tokenize = (code) => {
  if (!code) {
    return [];
  }
  const tokens = code
    .toLowerCase()
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .match(/[a-z_][a-z0-9_]*|\d+|==|!=|<=|>=|\+\+|--|\+|-|\*|\/|%/g);
  return tokens || [];
};

const jaccardSimilarity = (aTokens, bTokens) => {
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  if (aSet.size === 0 || bSet.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const token of aSet) {
    if (bSet.has(token)) {
      intersection += 1;
    }
  }
  const union = aSet.size + bSet.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const computeSimilarityScore = (sourceA, sourceB) => {
  const aTokens = tokenize(sourceA);
  const bTokens = tokenize(sourceB);
  const similarity = jaccardSimilarity(aTokens, bTokens);
  return Math.round(similarity * 100);
};

module.exports = { computeSimilarityScore };
