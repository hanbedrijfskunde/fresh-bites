import React from 'react';
import type { Character } from '@/types';

interface AvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ character, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
  };

  const borderColors: Record<string, string> = {
    chef_mo: 'border-primary',
    fatima: 'border-secondary',
    system: 'border-gray-400',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-white border-2 ${
        borderColors[character.id] || 'border-gray-300'
      } flex items-center justify-center shadow-sm`}
      role="img"
      aria-label={`${character.name} avatar`}
    >
      <span>{character.avatar}</span>
    </div>
  );
};
