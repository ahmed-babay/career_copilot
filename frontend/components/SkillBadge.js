import { getCategoryColor } from '@/lib/utils';

export default function SkillBadge({ skill, category, similarity, showSimilarity = false }) {
  const colorClass = getCategoryColor(category);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {skill}
      {showSimilarity && similarity && (
        <span className="ml-2 text-xs opacity-75">
          ({Math.round(similarity * 100)}%)
        </span>
      )}
    </span>
  );
}

