import React from 'react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 5,
  size = 'md',
  showCount = true,
}) => {
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${sizeClasses[size]}`} role="img" aria-label={`${stars} van ${maxStars} sterren`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">
            ⭐
          </span>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <span className="text-yellow-400">
            ✨
          </span>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ☆
          </span>
        ))}
      </div>

      {showCount && (
        <span className="text-sm font-medium text-gray-600">
          {stars.toFixed(1)} / {maxStars}
        </span>
      )}
    </div>
  );
};
