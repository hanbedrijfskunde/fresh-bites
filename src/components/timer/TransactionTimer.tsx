import React, { useEffect } from 'react';
import { TimerManager } from '@/engine/TimerManager';
import { useSimulationStore } from '@/store/useSimulationStore';
import { formatTime } from '@/utils/formatters';

// Singleton instance (persists across renders, prevents multiple intervals)
const timerManager = new TimerManager();

interface TransactionTimerProps {
  transactionId: string;
}

export const TransactionTimer: React.FC<TransactionTimerProps> = ({ transactionId }) => {
  const { userProgress, updateTimerTick, handleTimerExpire } = useSimulationStore();
  const progress = userProgress?.transactionProgress[transactionId];

  useEffect(() => {
    if (!progress || progress.status !== 'active' || progress.timeExpired) {
      return; // Don't start timer if not active or already expired
    }

    const timeRemaining = progress.timeRemaining ?? progress.timeLimit;

    // Start timer
    timerManager.startTimer(
      transactionId,
      timeRemaining,
      (remaining) => updateTimerTick(transactionId, remaining),
      () => handleTimerExpire(transactionId)
    );

    // Cleanup on unmount or transaction change
    return () => {
      timerManager.stopTimer(transactionId);
    };
  }, [transactionId, progress?.status, progress?.timeExpired]);

  if (!progress || progress.timeLimit === 0) return null;

  const remaining = progress.timeRemaining ?? progress.timeLimit;
  const threshold = 10; // Last 10 seconds
  const isWarning = remaining <= threshold;

  return (
    <div
      className={`flex items-center gap-2 font-mono transition-colors duration-300 ${
        isWarning ? 'text-red-600 animate-pulse' : 'text-gray-600'
      }`}
      role="timer"
      aria-live="polite"
      aria-label={`Resterende tijd: ${formatTime(remaining)}`}
    >
      <span className="text-xl">⏱️</span>
      <span className="font-semibold text-lg">{formatTime(remaining)}</span>
    </div>
  );
};
