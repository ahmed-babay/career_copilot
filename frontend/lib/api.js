/**
 * API client for communicating with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Make a request to the API
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Analyze CV text or upload CV file
 */
export async function analyzeCV(text, file, threshold = 0.5) {
  if (file) {
    // File upload
    const formData = new FormData();
    formData.append('cv', file);
    if (threshold) {
      formData.append('threshold', threshold.toString());
    }

    const response = await fetch(`${API_URL}/analyze/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to analyze CV');
    }

    return await response.json();
  } else if (text) {
    // Text analysis
    return apiRequest('/analyze/text', {
      method: 'POST',
      body: JSON.stringify({ text, threshold }),
    });
  } else {
    throw new Error('Either text or file must be provided');
  }
}

/**
 * Compare CV skills with job description skills
 */
export async function compareSkills(cvText, jdText, threshold = 0.5, matchThreshold = 0.6) {
  return apiRequest('/compare', {
    method: 'POST',
    body: JSON.stringify({ cvText, jdText, threshold, matchThreshold }),
  });
}

/**
 * Get YouTube tutorials for a skill
 */
export async function getTutorials(skill, maxResults = 5) {
  const params = new URLSearchParams({ skill, maxResults: maxResults.toString() });
  return apiRequest(`/learn?${params.toString()}`);
}

/**
 * Get YouTube tutorials for multiple skills
 */
export async function getTutorialsForSkills(skills, maxResultsPerSkill = 3) {
  const skillsParam = Array.isArray(skills) ? skills.join(',') : skills;
  const params = new URLSearchParams({ 
    skills: skillsParam, 
    maxResults: maxResultsPerSkill.toString() 
  });
  return apiRequest(`/learn?${params.toString()}`);
}

/**
 * Get saved learning plan
 */
export async function getLearningPlan() {
  return apiRequest('/plan');
}

/**
 * Save learning plan
 */
export async function saveLearningPlan(plan) {
  return apiRequest('/plan', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
}

