/**
 * Search YouTube for tutorials related to a skill
 * @param {string} skill - The skill to search for
 * @param {number} maxResults - Maximum number of results (default: 5)
 * @returns {Promise<Array>} - Array of video objects
 */
export async function searchYouTubeTutorials(skill, maxResults = 5) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not set in environment variables');
  }

  // Create search query - add "tutorial" to improve relevance
  const query = `${skill} tutorial`;
  
  // YouTube Data API v3 search endpoint
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.append('part', 'snippet');
  url.searchParams.append('q', query);
  url.searchParams.append('type', 'video');
  url.searchParams.append('maxResults', maxResults.toString());
  url.searchParams.append('order', 'relevance'); // Most relevant first
  url.searchParams.append('videoDuration', 'medium'); // Prefer medium-length videos (4-20 min)
  url.searchParams.append('key', apiKey);

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Transform YouTube API response to our format
    const videos = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return videos;
  } catch (error) {
    if (error.message.includes('YOUTUBE_API_KEY')) {
      throw error;
    }
    throw new Error(`Failed to search YouTube: ${error.message}`);
  }
}

/**
 * Get YouTube tutorials for multiple skills
 * @param {Array<string>} skills - Array of skills to search for
 * @param {number} maxResultsPerSkill - Maximum results per skill (default: 3)
 * @returns {Promise<Map<string, Array>>} - Map of skill to videos
 */
export async function getTutorialsForSkills(skills, maxResultsPerSkill = 3) {
  const results = new Map();

  // Search for tutorials for each skill
  for (const skill of skills) {
    try {
      const videos = await searchYouTubeTutorials(skill, maxResultsPerSkill);
      results.set(skill, videos);
    } catch (error) {
      console.error(`Error fetching tutorials for ${skill}:`, error.message);
      results.set(skill, []); // Set empty array on error
    }
  }

  return results;
}

