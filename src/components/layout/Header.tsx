import React from 'react';
import { StarRating } from './StarRating';
import { TransactionTimer } from '../timer/TransactionTimer';
import type { GeneratedTransaction } from '@/types';

interface HeaderProps {
  currentTransaction?: GeneratedTransaction;
  stars: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTransaction, stars }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚚</span>
            <div>
              <h1 className="text-xl font-bold text-primary">FreshBites</h1>
              <p className="text-xs text-gray-500">Boekhoudsimulatie</p>
            </div>
          </div>

          {/* Right - Stars, Timer and Time */}
          <div className="flex items-center gap-6">
            <StarRating stars={stars} maxStars={6} />
            {currentTransaction && (
              <>
                <TransactionTimer transactionId={currentTransaction.id} />
                <div className="text-sm text-gray-600">
                  {currentTransaction.timeSlot}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
