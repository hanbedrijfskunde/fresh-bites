/**
 * TimerManager - Pure business logic for managing countdown timers
 * No React dependencies, testable in isolation
 */
export class TimerManager {
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();

  /**
   * Start a timer for a transaction
   * @param transactionId - Unique transaction identifier
   * @param timeRemaining - Seconds to count down from
   * @param onTick - Callback every second with new timeRemaining
   * @param onExpire - Callback when timer reaches 0
   */
  public startTimer(
    transactionId: string,
    timeRemaining: number,
    onTick: (remaining: number) => void,
    onExpire: () => void
  ): void {
    // Stop existing timer if there is one
    this.stopTimer(transactionId);

    // Start new timer
    const interval = setInterval(() => {
      timeRemaining--;

      if (timeRemaining <= 0) {
        this.stopTimer(transactionId);
        onExpire();
      } else {
        onTick(timeRemaining);
      }
    }, 1000);

    this.intervals.set(transactionId, interval);
  }

  /**
   * Stop a timer (cleanup)
   * @param transactionId - Transaction to stop timer for
   */
  public stopTimer(transactionId: string): void {
    const interval = this.intervals.get(transactionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(transactionId);
    }
  }

  /**
   * Clean up all timers (on unmount)
   */
  public cleanup(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}
