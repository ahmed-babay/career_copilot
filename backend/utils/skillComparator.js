import { extractSkillsFromText } from './skillExtractor.js';

/**
 * Compare CV skills with job description skills using embeddings
 * @param {string} cvText - CV text
 * @param {string} jdText - Job description text
 * @param {number} threshold - Similarity threshold for matching (default: 0.5)
 * @param {number} matchThreshold - Threshold for considering skills as "matched" (default: 0.6)
 * @returns {Promise<{matched: Array, missing: Array, niceToHave: Array}>}
 */
export async function compareSkills(cvText, jdText, threshold = 0.5, matchThreshold = 0.6) {
  // Extract skills from both CV and job description
  const cvSkills = await extractSkillsFromText(cvText, threshold);
  const jdSkills = await extractSkillsFromText(jdText, threshold);

  // Create maps for easier lookup
  const cvSkillsMap = new Map();
  cvSkills.forEach(({ skill, category, similarity }) => {
    cvSkillsMap.set(skill, { category, similarity });
  });

  const jdSkillsMap = new Map();
  jdSkills.forEach(({ skill, category, similarity }) => {
    jdSkillsMap.set(skill, { category, similarity });
  });

  // Find matched skills (skills that appear in both with good similarity)
  const matched = [];
  const matchedSkillsSet = new Set();

  for (const { skill, category, similarity: jdSimilarity } of jdSkills) {
    if (cvSkillsMap.has(skill)) {
      const cvSkill = cvSkillsMap.get(skill);
      // Use the higher similarity score (best match from either side)
      const bestSimilarity = Math.max(jdSimilarity, cvSkill.similarity);
      
      if (bestSimilarity >= matchThreshold) {
        matched.push({
          skill,
          category,
          similarity: parseFloat(bestSimilarity.toFixed(4)),
          cvSimilarity: parseFloat(cvSkill.similarity.toFixed(4)),
          jdSimilarity: parseFloat(jdSimilarity.toFixed(4)),
        });
        matchedSkillsSet.add(skill);
      }
    }
  }

  // Find missing skills (in JD but not in CV, or with low similarity in CV)
  const missing = [];
  for (const { skill, category, similarity: jdSimilarity } of jdSkills) {
    if (!matchedSkillsSet.has(skill)) {
      // Check if it exists in CV but with low similarity
      const cvSkill = cvSkillsMap.get(skill);
      if (!cvSkill || cvSkill.similarity < matchThreshold) {
        missing.push({
          skill,
          category,
          jdSimilarity: parseFloat(jdSimilarity.toFixed(4)),
          cvSimilarity: cvSkill ? parseFloat(cvSkill.similarity.toFixed(4)) : 0,
        });
      }
    }
  }

  // Find nice-to-have skills (in CV but not required in JD)
  const niceToHave = [];
  for (const { skill, category, similarity: cvSimilarity } of cvSkills) {
    if (!matchedSkillsSet.has(skill) && !jdSkillsMap.has(skill)) {
      niceToHave.push({
        skill,
        category,
        similarity: parseFloat(cvSimilarity.toFixed(4)),
      });
    }
  }

  // Sort by similarity (highest first)
  matched.sort((a, b) => b.similarity - a.similarity);
  missing.sort((a, b) => b.jdSimilarity - a.jdSimilarity);
  niceToHave.sort((a, b) => b.similarity - a.similarity);

  return {
    matched,
    missing,
    niceToHave,
    summary: {
      totalMatched: matched.length,
      totalMissing: missing.length,
      totalNiceToHave: niceToHave.length,
      matchPercentage: jdSkills.length > 0 
        ? parseFloat(((matched.length / jdSkills.length) * 100).toFixed(2))
        : 0,
    },
  };
}

