import React, { useEffect, useState } from 'react';
import { TimerManager } from '@/engine/TimerManager';
import { useSimulationStore } from '@/store/useSimulationStore';
import type { TimerState } from '@/types';
import { formatTime } from '@/utils/formatters';

const timerManager = new TimerManager();

interface TimerProps {
  transactionId: string;
  timeLimit: number;
}

export const Timer: React.FC<TimerProps> = ({ transactionId, timeLimit }) => {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const { userProgress, submitAnswer } = useSimulationStore();

  useEffect(() => {
    if (timeLimit === 0) return; // No timer

    const progress = userProgress?.transactionProgress[transactionId];
    if (!progress || progress.status !== 'active') return;

    const handleTick = (state: TimerState) => {
      setTimerState(state);
    };

    const handleExpire = () => {
      // Time expired - auto submit current entry
      if (progress.currentEntry && progress.currentEntry.length > 0) {
        submitAnswer(transactionId, progress.currentEntry);
      }
      if (userProgress) {
        userProgress.transactionProgress[transactionId].timeExpired = true;
      }
    };

    timerManager.startTimer(
      transactionId,
      progress.timeRemaining || timeLimit,
      handleTick,
      handleExpire
    );

    return () => {
      timerManager.stopTimer(transactionId);
    };
  }, [transactionId, timeLimit, userProgress, submitAnswer]);

  if (!timerState || timeLimit === 0) return null;

  const statusStyles = {
    normal: 'text-gray-600',
    warning: 'text-orange-500 animate-pulse',
    critical: 'text-red-600 animate-pulse-fast',
    expired: 'text-red-600',
  };

  const display = formatTime(timerState.timeRemaining);

  return (
    <div
      className={`flex items-center gap-2 ${statusStyles[timerState.status]}`}
      role="timer"
      aria-live="off"
      aria-label={`Resterende tijd: ${display}`}
    >
      <span className="text-xl">⏱️</span>
      <span className="font-mono font-semibold text-lg">
        {display}
      </span>
    </div>
  );
};
