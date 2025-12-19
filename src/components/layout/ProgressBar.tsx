import React from 'react';
import type { TransactionProgress } from '@/types';

interface ProgressBarProps {
  currentIndex: number;
  totalTransactions: number;
  transactionProgress: Record<string, TransactionProgress>;
  transactionIds: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalTransactions,
  transactionProgress,
  transactionIds,
}) => {
  const percentage = ((currentIndex + 1) / totalTransactions) * 100;

  return (
    <div className="bg-white border-t border-gray-200 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress text */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Transactie {currentIndex + 1} van {totalTransactions}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}% voltooid
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Transaction status indicators */}
        <div className="flex items-center justify-between mt-3 gap-1">
          {transactionIds.map((id, index) => {
            const progress = transactionProgress[id];
            const status = progress?.status || 'locked';

            return (
              <div
                key={id}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  status === 'completed'
                    ? 'bg-success'
                    : status === 'active'
                    ? 'bg-primary animate-pulse'
                    : 'bg-gray-300'
                }`}
                title={`Transactie ${index + 1}: ${
                  status === 'completed'
                    ? 'Voltooid'
                    : status === 'active'
                    ? 'Bezig'
                    : 'Vergrendeld'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
