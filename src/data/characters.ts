import type { Character } from '@/types';

export const CHARACTERS: Record<string, Character> = {
  chef_mo: {
    id: 'chef_mo',
    name: 'Chef Mo',
    role: 'Kok',
    avatar: '👨‍🍳',
    communicationStyle: 'informal',
  },
  fatima: {
    id: 'fatima',
    name: 'Fatima',
    role: 'Eigenaar',
    avatar: '👩‍💼',
    communicationStyle: 'formal',
  },
  system: {
    id: 'system',
    name: 'Systeem',
    role: 'Notificatie',
    avatar: '🔔',
    communicationStyle: 'neutral',
  },
};

/**
 * Get character by ID
 */
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS[id];
}
