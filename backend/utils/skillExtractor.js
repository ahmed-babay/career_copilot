import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateEmbedding, cosineSimilarity } from './embeddings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for skill embeddings (to avoid recomputing)
let skillEmbeddingsCache = null;
let allSkillsList = null;

/**
 * Load all skills from the skills.json file
 * @returns {Array<{skill: string, category: string}>} - Array of skills with categories
 */
export function loadSkills() {
  if (allSkillsList) {
    return allSkillsList;
  }

  const skillsPath = path.join(__dirname, '../data/skills.json');
  const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
  
  allSkillsList = [];
  for (const [category, skills] of Object.entries(skillsData.categories)) {
    for (const skill of skills) {
      allSkillsList.push({ skill, category });
    }
  }

  return allSkillsList;
}

/**
 * Generate embeddings for all canonical skills (cached)
 * @returns {Promise<Map<string, Float32Array>>} - Map of skill name to embedding
 */
export async function getSkillEmbeddings() {
  if (skillEmbeddingsCache) {
    return skillEmbeddingsCache;
  }

  console.log('Generating embeddings for all skills...');
  const skills = loadSkills();
  skillEmbeddingsCache = new Map();

  // Generate embeddings for all skills
  for (const { skill } of skills) {
    const embedding = await generateEmbedding(skill);
    skillEmbeddingsCache.set(skill, embedding);
  }

  console.log(`Generated embeddings for ${skills.length} skills`);
  return skillEmbeddingsCache;
}

/**
 * Extract skills from text using embedding-based similarity
 * @param {string} text - The text to extract skills from (CV or job description)
 * @param {number} threshold - Similarity threshold (default: 0.6)
 * @returns {Promise<Array<{skill: string, category: string, similarity: number}>>} - Matched skills with scores
 */
export async function extractSkillsFromText(text, threshold = 0.6) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Get skill embeddings
  const skillEmbeddings = await getSkillEmbeddings();
  
  // Generate embedding for the input text
  const textEmbedding = await generateEmbedding(text);
  
  // Compare text embedding with each skill embedding
  const matchedSkills = [];
  const skills = loadSkills();

  for (const { skill, category } of skills) {
    const skillEmbedding = skillEmbeddings.get(skill);
    const similarity = cosineSimilarity(textEmbedding, skillEmbedding);
    
    if (similarity >= threshold) {
      matchedSkills.push({
        skill,
        category,
        similarity: parseFloat(similarity.toFixed(4)),
      });
    }
  }

  // Sort by similarity score (highest first)
  matchedSkills.sort((a, b) => b.similarity - a.similarity);

  return matchedSkills;
}

/**
 * Clear the skill embeddings cache (useful for testing or updates)
 */
export function clearSkillEmbeddingsCache() {
  skillEmbeddingsCache = null;
  allSkillsList = null;
}


