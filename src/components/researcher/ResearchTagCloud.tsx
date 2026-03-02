interface ResearchTagCloudProps {
  tags: string[];
  maxTags?: number;
  size?: 'sm' | 'md';
  clickable?: boolean;
  onTagClick?: (tag: string) => void;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
};

export default function ResearchTagCloud({
  tags,
  maxTags = 5,
  size = 'sm',
  clickable = false,
  onTagClick,
}: ResearchTagCloudProps) {
  const displayTags = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayTags.map((tag) => (
        <span
          key={tag}
          onClick={() => clickable && onTagClick?.(tag)}
          className={`
            ${sizeClasses[size]}
            bg-neutral-800 text-neutral-300
            border border-neutral-700
            rounded
            ${clickable ? 'cursor-pointer hover:bg-orange-600/20 hover:border-orange-600/50 hover:text-orange-400 transition-colors' : ''}
          `}
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={`${sizeClasses[size]} bg-neutral-800/50 text-neutral-500 rounded`}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
