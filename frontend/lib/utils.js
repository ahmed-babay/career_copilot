/**
 * Utility functions
 */

/**
 * Format similarity score as percentage
 */
export function formatSimilarity(score) {
  return `${(score * 100).toFixed(1)}%`;
}

/**
 * Format date
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate text
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get skill category color
 */
export function getCategoryColor(category) {
  const colors = {
    programming_languages: 'bg-blue-100 text-blue-800',
    web_technologies: 'bg-green-100 text-green-800',
    databases: 'bg-purple-100 text-purple-800',
    cloud_platforms: 'bg-orange-100 text-orange-800',
    data_science: 'bg-pink-100 text-pink-800',
    devops_tools: 'bg-yellow-100 text-yellow-800',
    testing: 'bg-indigo-100 text-indigo-800',
    mobile: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.other;
}

