import { pipeline } from '@xenova/transformers';

let embeddingModel = null;

/**
 * Initialize the embedding model
 */
export async function initializeEmbeddings() {
  if (!embeddingModel) {
    console.log('Loading embedding model...');
    embeddingModel = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    console.log('Embedding model loaded successfully');
  }
  return embeddingModel;
}

/**
 * Generate embeddings for a text string
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<Float32Array>} - The embedding vector
 */
export async function generateEmbedding(text) {
  const model = await initializeEmbeddings();
  const output = await model(text, {
    pooling: 'mean',
    normalize: true,
  });
  return output.data;
}

/**
 * Calculate cosine similarity between two embedding vectors
 * @returns {number} - Cosine similarity score (0-1)
 */
export function cosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}


