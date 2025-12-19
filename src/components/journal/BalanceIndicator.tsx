import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface BalanceIndicatorProps {
  debitTotal: number;
  creditTotal: number;
  isBalanced: boolean;
}

export const BalanceIndicator: React.FC<BalanceIndicatorProps> = ({
  debitTotal,
  creditTotal,
  isBalanced,
}) => {
  return (
    <div className="space-y-2">
      {/* Totals */}
      <div className="grid grid-cols-12 gap-2 text-sm font-semibold">
        <div className="col-span-6 text-right text-gray-700">Totaal</div>
        <div className="col-span-3 text-right text-gray-900">
          {formatCurrency(debitTotal)}
        </div>
        <div className="col-span-3 text-right text-gray-900">
          {formatCurrency(creditTotal)}
        </div>
      </div>

      {/* Balance indicator */}
      <div className="flex items-center justify-center gap-2 py-2">
        <span className="text-2xl">⚖️</span>
        {isBalanced && debitTotal > 0 ? (
          <span className="text-success font-medium">
            In balans ✓
          </span>
        ) : debitTotal > 0 || creditTotal > 0 ? (
          <span className="text-error font-medium">
            Niet in balans ✗
          </span>
        ) : (
          <span className="text-gray-500">
            Vul bedragen in
          </span>
        )}
      </div>
    </div>
  );
};
