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
  return (
    <div className="bg-white border-t border-gray-200 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress text */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Transactie {currentIndex + 1} van {totalTransactions}
          </span>
        </div>

        {/* Single progress bar with numbered boxes */}
        <div className="flex items-center gap-2">
          {transactionIds.map((id, index) => {
            const progress = transactionProgress[id];
            const status = progress?.status || 'locked';

            return (
              <div key={id} className="flex-1 h-10 relative">
                <div
                  className={`h-full rounded transition-colors ${
                    status === 'completed'
                      ? 'bg-success'
                      : status === 'active'
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                  title={`Transactie ${index + 1}: ${
                    status === 'completed'
                      ? 'Voltooid'
                      : status === 'active'
                      ? 'Bezig'
                      : 'Vergrendeld'
                  }`}
                />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
