import React from 'react';
import { AccountDropdown } from './AccountDropdown';
import { AmountInput } from './AmountInput';
import type { JournalRowState } from '@/types';

interface JournalRowProps {
  row: JournalRowState;
  onChange: (field: keyof JournalRowState, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const JournalRow: React.FC<JournalRowProps> = ({
  row,
  onChange,
  onRemove,
  canRemove,
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      {/* Account Dropdown */}
      <div className="col-span-6">
        <AccountDropdown
          value={row.accountId}
          onChange={(value) => onChange('accountId', value || '')}
        />
      </div>

      {/* Debet Amount */}
      <div className="col-span-3">
        <AmountInput
          value={row.debitValue}
          onChange={(value) => {
            onChange('debitValue', value);
            // Clear credit if debit is entered
            if (value && row.creditValue) {
              onChange('creditValue', '');
            }
          }}
          label="Debet"
          error={row.hasError}
        />
      </div>

      {/* Credit Amount */}
      <div className="col-span-3 relative">
        <AmountInput
          value={row.creditValue}
          onChange={(value) => {
            onChange('creditValue', value);
            // Clear debit if credit is entered
            if (value && row.debitValue) {
              onChange('debitValue', '');
            }
          }}
          label="Credit"
          error={row.hasError}
        />

        {/* Remove button */}
        {canRemove && (
          <button
            onClick={onRemove}
            className="absolute -right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-error transition-colors"
            aria-label="Verwijder regel"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
