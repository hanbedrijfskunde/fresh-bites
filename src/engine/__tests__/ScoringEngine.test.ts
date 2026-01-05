import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../ScoringEngine';
import type { TransactionProgress } from '@/types';

describe('ScoringEngine', () => {
  const scorer = new ScoringEngine();

  describe('calculateStars', () => {
    it('should award 1 star for first attempt success', () => {
      const stars = scorer.calculateStars(1, 0, false, true);
      expect(stars).toBe(1.0);
    });

    it('should award 0.5 stars for second attempt success', () => {
      const stars = scorer.calculateStars(2, 0, false, true);
      expect(stars).toBe(0.5);
    });

    it('should award 0 stars for third attempt success', () => {
      const stars = scorer.calculateStars(3, 0, false, true);
      expect(stars).toBe(0.0);
    });

    it('should award 0 stars for attempts beyond third', () => {
      expect(scorer.calculateStars(4, 0, false, true)).toBe(0.0);
      expect(scorer.calculateStars(10, 0, false, true)).toBe(0.0);
    });

    it('should deduct 0.25 stars per hint used', () => {
      expect(scorer.calculateStars(1, 1, false, true)).toBe(0.75); // 1.0 - 0.25
      expect(scorer.calculateStars(1, 2, false, true)).toBe(0.5);  // 1.0 - 0.5
      expect(scorer.calculateStars(1, 3, false, true)).toBe(0.25); // 1.0 - 0.75
    });

    it('should never return negative stars', () => {
      expect(scorer.calculateStars(1, 5, false, true)).toBe(0);    // Would be -0.25
      expect(scorer.calculateStars(2, 3, false, true)).toBe(0);    // Would be -0.25
      expect(scorer.calculateStars(3, 1, false, true)).toBe(0);    // Would be -0.25
    });

    it('should return 0 stars if time expired', () => {
      expect(scorer.calculateStars(1, 0, true, true)).toBe(0);
      expect(scorer.calculateStars(1, 0, true, false)).toBe(0);
    });

    it('should return 0 stars if answer is incorrect', () => {
      expect(scorer.calculateStars(1, 0, false, false)).toBe(0);
      expect(scorer.calculateStars(2, 0, false, false)).toBe(0);
    });

    it('should handle edge cases correctly', () => {
      expect(scorer.calculateStars(0, 0, false, true)).toBe(0);    // Invalid: 0 attempts
      expect(scorer.calculateStars(1, 0, false, true)).toBe(1.0);  // Perfect score
      expect(scorer.calculateStars(2, 1, false, true)).toBe(0.25); // 0.5 - 0.25
    });
  });

  describe('getPerformanceLevel', () => {
    it('should return "excellent" for 4.5+ stars', () => {
      expect(scorer.getPerformanceLevel(5.0).level).toBe('excellent');
      expect(scorer.getPerformanceLevel(4.5).level).toBe('excellent');
    });

    it('should return "good" for 3.5-4.49 stars', () => {
      expect(scorer.getPerformanceLevel(4.49).level).toBe('good');
      expect(scorer.getPerformanceLevel(4.0).level).toBe('good');
      expect(scorer.getPerformanceLevel(3.5).level).toBe('good');
    });

    it('should return "pass" for 2.5-3.49 stars', () => {
      expect(scorer.getPerformanceLevel(3.49).level).toBe('pass');
      expect(scorer.getPerformanceLevel(3.0).level).toBe('pass');
      expect(scorer.getPerformanceLevel(2.5).level).toBe('pass');
    });

    it('should return "needs_improvement" for <2.5 stars', () => {
      expect(scorer.getPerformanceLevel(2.49).level).toBe('needs_improvement');
      expect(scorer.getPerformanceLevel(2.0).level).toBe('needs_improvement');
      expect(scorer.getPerformanceLevel(0).level).toBe('needs_improvement');
    });

    it('should include appropriate messages for each level', () => {
      expect(scorer.getPerformanceLevel(5.0).message).toContain('Uitstekend');
      expect(scorer.getPerformanceLevel(4.0).message).toContain('Goed');
      expect(scorer.getPerformanceLevel(3.0).message).toContain('basis');
      expect(scorer.getPerformanceLevel(1.0).message).toContain('oefenen');
    });
  });

  describe('calculateTotalStars', () => {
    it('should sum stars from multiple transactions', () => {
      const transactionProgress: Record<string, TransactionProgress> = {
        't1': {
          transactionId: 't1',
          status: 'completed',
          attempts: 1,
          hintsUsed: 0,
          hintsViewed: [],
          starsEarned: 1.0,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 100,
          timeExpired: false,
          currentEntry: [],
        },
        't2': {
          transactionId: 't2',
          status: 'completed',
          attempts: 2,
          hintsUsed: 0,
          hintsViewed: [],
          starsEarned: 0.5,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 50,
          timeExpired: false,
          currentEntry: [],
        },
        't3': {
          transactionId: 't3',
          status: 'completed',
          attempts: 3,
          hintsUsed: 0,
          hintsViewed: [],
          starsEarned: 0.0,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 10,
          timeExpired: false,
          currentEntry: [],
        },
      };

      const total = scorer.calculateTotalStars(transactionProgress);
      expect(total).toBe(1.5); // 1.0 + 0.5 + 0.0
    });

    it('should account for hints across multiple transactions', () => {
      const transactionProgress: Record<string, TransactionProgress> = {
        't1': {
          transactionId: 't1',
          status: 'completed',
          attempts: 1,
          hintsUsed: 1,
          hintsViewed: [1],
          starsEarned: 0.75,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 100,
          timeExpired: false,
          currentEntry: [],
        },
        't2': {
          transactionId: 't2',
          status: 'completed',
          attempts: 1,
          hintsUsed: 2,
          hintsViewed: [1, 2],
          starsEarned: 0.5,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 50,
          timeExpired: false,
          currentEntry: [],
        },
        't3': {
          transactionId: 't3',
          status: 'completed',
          attempts: 1,
          hintsUsed: 0,
          hintsViewed: [],
          starsEarned: 1.0,
          isCorrect: true,
          timeLimit: 180,
          timeRemaining: 120,
          timeExpired: false,
          currentEntry: [],
        },
      };

      const total = scorer.calculateTotalStars(transactionProgress);
      expect(total).toBe(2.25); // 0.75 + 0.5 + 1.0
    });

    it('should handle empty progress', () => {
      expect(scorer.calculateTotalStars({})).toBe(0);
    });
  });
});
