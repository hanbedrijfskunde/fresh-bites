import type { TransactionProgress, PerformanceResult, PerformanceLevel } from '@/types';
import { HINT_PENALTY, PERFORMANCE_THRESHOLDS, PERFORMANCE_MESSAGES } from '@/utils/constants';

export class ScoringEngine {


  /**
   * Calculate stars earned for a transaction
   */
  public calculateStars(
    attempts: number,
    hintsUsed: number,
    _timeExpired: boolean,
    isCorrect: boolean
  ): number {
    if (!isCorrect) return 0;

    let stars = 0;

    // Base stars by attempt
    if (attempts === 1) {
      stars = 1.0;
    } else if (attempts === 2) {
      stars = 0.5;
    } else {
      stars = 0; // 3rd attempt = no stars
    }

    // Penalty for hints
    stars -= hintsUsed * HINT_PENALTY;

    // Ensure non-negative
    stars = Math.max(0, stars);

    return stars;
  }

  /**
   * Calculate total stars for entire simulation
   */
  public calculateTotalStars(transactionProgress: Record<string, TransactionProgress>): number {
    return Object.values(transactionProgress).reduce(
      (total, progress) => total + progress.starsEarned,
      0
    );
  }

  /**
   * Determine performance level
   */
  public getPerformanceLevel(totalStars: number): PerformanceResult {
    let level: PerformanceLevel;

    if (totalStars >= PERFORMANCE_THRESHOLDS.excellent) {
      level = 'excellent';
    } else if (totalStars >= PERFORMANCE_THRESHOLDS.good) {
      level = 'good';
    } else if (totalStars >= PERFORMANCE_THRESHOLDS.pass) {
      level = 'pass';
    } else {
      level = 'needs_improvement';
    }

    return {
      level,
      message: PERFORMANCE_MESSAGES[level],
    };
  }

}
