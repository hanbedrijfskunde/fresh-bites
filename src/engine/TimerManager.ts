import type { TimerState, TimerStatus } from '@/types';

export class TimerManager {
  private timers: Map<string, TimerState> = new Map();
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();

  /**
   * Start a timer for a transaction
   */
  public startTimer(
    transactionId: string,
    timeLimit: number,
    onTick: (state: TimerState) => void,
    onExpire: () => void
  ): void {
    // Clear any existing timer
    this.stopTimer(transactionId);

    const state: TimerState = {
      transactionId,
      timeLimit,
      timeRemaining: timeLimit,
      isRunning: true,
      isPaused: false,
      status: 'normal',
      startedAt: new Date(),
    };

    this.timers.set(transactionId, state);

    // Initial tick
    onTick(state);

    // If no time limit, don't start interval
    if (timeLimit === 0) {
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const currentState = this.timers.get(transactionId);
      if (!currentState || !currentState.isRunning) {
        this.stopTimer(transactionId);
        return;
      }

      currentState.timeRemaining -= 1;

      // Update status based on remaining time
      if (currentState.timeRemaining <= 0) {
        currentState.status = 'expired';
        currentState.timeRemaining = 0;
        currentState.isRunning = false;
        this.stopTimer(transactionId);
        onExpire();
      } else {
        currentState.status = this.getTimerStatus(currentState.timeRemaining);
      }

      onTick(currentState);
    }, 1000);

    this.intervals.set(transactionId, interval);
  }

  /**
   * Stop a timer
   */
  public stopTimer(transactionId: string): void {
    const interval = this.intervals.get(transactionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(transactionId);
    }

    const state = this.timers.get(transactionId);
    if (state) {
      state.isRunning = false;
    }
  }

  /**
   * Get current timer state
   */
  public getTimerState(transactionId: string): TimerState | null {
    return this.timers.get(transactionId) || null;
  }

  /**
   * Pause timer (future feature)
   */
  public pauseTimer(transactionId: string): void {
    const state = this.timers.get(transactionId);
    if (state && state.isRunning) {
      state.isPaused = true;
      state.pausedAt = new Date();

      const interval = this.intervals.get(transactionId);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(transactionId);
      }
    }
  }

  /**
   * Resume timer (future feature)
   */
  public resumeTimer(
    transactionId: string,
    onTick: (state: TimerState) => void,
    onExpire: () => void
  ): void {
    const state = this.timers.get(transactionId);
    if (state && state.isPaused) {
      state.isPaused = false;
      state.pausedAt = undefined;
      state.isRunning = true;

      // Resume with current time remaining
      this.startTimer(transactionId, state.timeRemaining, onTick, onExpire);
    }
  }

  /**
   * Get timer status based on remaining time
   */
  private getTimerStatus(timeRemaining: number): TimerStatus {
    if (timeRemaining <= 0) {
      return 'expired';
    } else if (timeRemaining <= 10) {
      return 'critical';
    } else if (timeRemaining <= 30) {
      return 'warning';
    } else {
      return 'normal';
    }
  }

  /**
   * Clean up all timers
   */
  public cleanup(): void {
    for (const transactionId of this.intervals.keys()) {
      this.stopTimer(transactionId);
    }
    this.timers.clear();
  }
}
