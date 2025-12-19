import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { MAX_ATTEMPTS } from '@/utils/constants';

interface ActionBarProps {
  transactionId: string;
  canSubmit: boolean;
  onSubmit: () => void;
  attempts: number;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  transactionId,
  canSubmit,
  onSubmit,
  attempts,
}) => {
  const { simulation, userProgress, showModal, useHint } = useSimulationStore();

  const transaction = simulation?.transactions.find((t) => t.id === transactionId);
  const progress = userProgress?.transactionProgress[transactionId];

  const timeExpired = progress?.timeExpired ?? false;
  const canUseHint = progress && progress.hintsViewed.length < 3 && !timeExpired;
  const nextHintLevel = progress ? (progress.hintsViewed.length + 1) as 1 | 2 | 3 : 1;

  const handleHintClick = () => {
    if (!transaction || !canUseHint) return;

    const hint = transaction.hints.find((h) => h.level === nextHintLevel);
    if (hint) {
      useHint(transactionId, nextHintLevel);
      showModal({
        type: 'hint',
        content: {
          level: nextHintLevel,
          text: hint.text,
          starPenalty: 0.25,
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t mt-4">
      {/* Left side - Hint button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleHintClick}
          disabled={!canUseHint}
          className={`btn ${canUseHint ? 'btn-hint' : 'btn-disabled'} text-sm`}
        >
          💡 Hint {nextHintLevel}/3
        </button>

        {progress && progress.hintsViewed.length > 0 && (
          <span className="text-xs text-gray-500">
            {progress.hintsViewed.length} hint(s) gebruikt (-{progress.hintsViewed.length * 0.25} ⭐)
          </span>
        )}
      </div>

      {/* Right side - Submit button and attempt counter */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Poging {attempts + 1} van {MAX_ATTEMPTS}
        </span>

        <button
          onClick={onSubmit}
          disabled={!canSubmit || timeExpired}
          className={`btn ${canSubmit && !timeExpired ? 'btn-success' : 'btn-disabled'} px-8`}
        >
          {timeExpired ? '⏱️ Tijd verstreken' : '✓ Boeken'}
        </button>
      </div>
    </div>
  );
};
