import { getCategoryColor } from '@/lib/utils';

export default function SkillBadge({ skill, category, similarity, showSimilarity = false, variant }) {
  // If variant is specified, use section-specific colors instead of category colors
  let colorClass;
  if (variant === 'matched') {
    colorClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
  } else if (variant === 'missing') {
    colorClass = 'bg-red-500/20 text-red-300 border border-red-500/30';
    } else if (variant === 'niceToHave') {
      colorClass = 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
  } else {
    // Default: use category-based colors
    colorClass = getCategoryColor(category);
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {skill}
      {showSimilarity && similarity && (
        <span className="ml-2 text-xs opacity-90">
          ({Math.round(similarity * 100)}%)
        </span>
      )}
    </span>
  );
}

