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
 * Segment text into smaller, more focused chunks for better embedding accuracy
 * Uses multiple strategies: delimiter splitting and sentence-based chunking
 */
export function segmentText(text, maxChunkSize = 100, overlap = 20) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks = new Set(); 

  // Strategy 1: Split by common delimiters (commas, semicolons, newlines, dashes, bullets)
  const parts = text.split(/([,\n;|•\-\t]+)/);
  
  for (const part of parts) {
    const trimmed = part.trim();
    // Skip empty parts and delimiter-only parts
    if (trimmed.length === 0 || /^[,\n;|•\-\t\s]+$/.test(trimmed)) continue;
    
    if (trimmed.length <= maxChunkSize) {
      // Small enough, add as-is
      chunks.add(trimmed);
    } else {
      // Too long, split by sentences
      const sentences = trimmed.split(/([.!?]\s+)/).filter(s => s.trim().length > 0);
      let currentChunk = '';

      for (const sentence of sentences) {
        const sentenceTrimmed = sentence.trim();
        if (sentenceTrimmed.length === 0) continue;
        
        if (currentChunk.length + sentenceTrimmed.length <= maxChunkSize) {
          currentChunk += (currentChunk ? ' ' : '') + sentenceTrimmed;
        } else {
          if (currentChunk) {
            chunks.add(currentChunk);
          }
          // If single sentence is too long, create sliding windows for it
          if (sentenceTrimmed.length > maxChunkSize) {
            for (let i = 0; i <= sentenceTrimmed.length - maxChunkSize; i += maxChunkSize - overlap) {
              const window = sentenceTrimmed.substring(i, i + maxChunkSize).trim();
              if (window.length > 20) {
                chunks.add(window);
              }
            }
            // Add the last part if it wasn't covered
            const remaining = sentenceTrimmed.length % (maxChunkSize - overlap);
            if (remaining > 20) {
              const lastPart = sentenceTrimmed.substring(sentenceTrimmed.length - remaining).trim();
              chunks.add(lastPart);
            }
            currentChunk = '';
          } else {
            currentChunk = sentenceTrimmed;
          }
        }
      }
      if (currentChunk) {
        chunks.add(currentChunk);
      }
    }
  }

  // Strategy 2: Also extract complete sentences for context (but only if not already captured)
  // This helps catch skills mentioned in full sentences that might have been split
  const allSentences = text.split(/([.!?]\s+)/).filter(s => {
    const trimmed = s.trim();
    return trimmed.length > 10 && trimmed.length <= maxChunkSize;
  });
  
  for (const sentence of allSentences) {
    const trimmed = sentence.trim();
    // Only add if it's not already captured as a smaller chunk
    // Check if this sentence is already represented by existing chunks
    const alreadyCaptured = Array.from(chunks).some(chunk => 
      trimmed.includes(chunk) || chunk.includes(trimmed)
    );
    if (!alreadyCaptured && trimmed.length > 10) {
      chunks.add(trimmed);
    }
  }

  // Convert Set to Array, filter, and sort by length (shorter first for better focus)
  const result = Array.from(chunks)
    .filter(chunk => {
      const trimmed = chunk.trim();
      return trimmed.length >= 5 && trimmed.length <= maxChunkSize * 2; // Allow slightly larger chunks
    })
    .map(chunk => chunk.trim())
    .sort((a, b) => a.length - b.length); // Shorter chunks first

  // If no chunks were created, return the whole text (for very short texts)
  if (result.length === 0) {
    return [text.trim()];
  }

  return result;
}

/**
 * Quick keyword-based pre-filtering to reduce unnecessary embedding comparisons
 */
function mightContainSkill(text, skill) {
  const lowerText = text.toLowerCase();
  const lowerSkill = skill.toLowerCase();
  
  // Direct match
  if (lowerText.includes(lowerSkill)) {
    return true;
  }
  
  // Handle common variations (e.g., "JS" for "JavaScript", "Node" for "Node.js")
  const variations = {
    'javascript': ['js', 'javascript', 'ecmascript'],
    'typescript': ['ts', 'typescript'],
    'node.js': ['node', 'nodejs', 'node.js'],
    'react': ['react', 'reactjs', 'react.js'],
    'vue.js': ['vue', 'vuejs', 'vue.js'],
    'angular': ['angular', 'angularjs', 'angular.js'],
    'amazon web services': ['aws', 'amazon web services'],
    'google cloud': ['gcp', 'google cloud', 'google cloud platform'],
  };
  
  // Check if skill has known variations
  for (const [key, variants] of Object.entries(variations)) {
    if (lowerSkill.includes(key) || variants.some(v => lowerSkill.includes(v))) {
      return variants.some(v => lowerText.includes(v));
    }
  }
  
  // Check for partial matches (e.g., "Python" in "Python developer")
  const skillWords = lowerSkill.split(/[\s.]+/).filter(w => w.length > 2);
  return skillWords.some(word => lowerText.includes(word));
}

/**
 * Extract skills from text using embedding-based similarity with improved chunking
 * @param {string} text - The text to extract skills from (CV or job description)
 * @param {number} threshold - Similarity threshold (default: 0.5)
 * @param {number} maxChunkSize - Maximum characters per chunk (default: 100)
 * @returns {Promise<Array<{skill: string, category: string, similarity: number}>>} - Matched skills with scores
 */
export async function extractSkillsFromText(text, threshold = 0.5, maxChunkSize = 100) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Get skill embeddings
  const skillEmbeddings = await getSkillEmbeddings();
  const skills = loadSkills();
  
  // Segment text into smaller, more focused chunks
  const chunks = segmentText(text, maxChunkSize);
  
  // Debug: Print chunks
  console.log(`\n📝 Text segmented into ${chunks.length} chunks:`);
  chunks.forEach((chunk, index) => {
    console.log(`   Chunk ${index + 1} (${chunk.length} chars): "${chunk.substring(0, 80)}${chunk.length > 80 ? '...' : ''}"`);
  });
  console.log('');
  
  // Pre-filter skills using keyword matching to reduce embedding computations
  const candidateSkills = skills.filter(({ skill }) => {
    // Check if any chunk might contain this skill
    return chunks.some(chunk => mightContainSkill(chunk, skill));
  });

  console.log(`Processing ${chunks.length} chunks, ${candidateSkills.length} candidate skills (out of ${skills.length} total)`);

  // Generate embeddings for each chunk
  const chunkEmbeddings = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    chunkEmbeddings.push({ chunk, embedding });
  }

  // Track best similarity score for each skill across all chunks
  const skillScores = new Map();

  // Compare each chunk's embedding with each candidate skill embedding
  for (const { skill, category } of candidateSkills) {
    const skillEmbedding = skillEmbeddings.get(skill);
    let maxSimilarity = 0;

    // Find the maximum similarity across all chunks
    for (const { embedding: chunkEmbedding } of chunkEmbeddings) {
      const similarity = cosineSimilarity(chunkEmbedding, skillEmbedding);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
      }
    }

    // Store the best similarity score for this skill
    if (maxSimilarity >= threshold) {
      skillScores.set(skill, {
        skill,
        category,
        similarity: parseFloat(maxSimilarity.toFixed(4)),
      });
    }
  }

  // Convert map to array and sort by similarity (highest first)
  const matchedSkills = Array.from(skillScores.values());
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


