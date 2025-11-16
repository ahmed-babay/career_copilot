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
 * Get skill category color (optimized for dark theme)
 */
export function getCategoryColor(category) {
  const colors = {
    programming_languages: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    web_technologies: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    databases: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    cloud_platforms: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    data_science: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
    devops_tools: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    testing: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    mobile: 'bg-red-500/20 text-red-300 border border-red-500/30',
    other: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };
  return colors[category] || colors.other;
}

