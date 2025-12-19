import React from 'react';
import { formatAmountForInput, parseAmount } from '@/utils/formatters';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: 'Debet' | 'Credit';
  disabled?: boolean;
  error?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  error = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow empty
    if (input === '') {
      onChange('');
      return;
    }

    // Remove non-numeric characters except comma and dot
    const cleaned = input.replace(/[^\d,\.]/g, '');

    // Replace dot with comma (Dutch format)
    const normalized = cleaned.replace('.', ',');

    onChange(normalized);
  };

  const handleBlur = () => {
    if (value) {
      const parsed = parseAmount(value);
      if (parsed !== null) {
        onChange(formatAmountForInput(parsed));
      }
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
        €
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`input w-full pl-7 text-sm text-right ${
          error ? 'input-error' : ''
        }`}
        placeholder="0,00"
        aria-label={label}
        inputMode="decimal"
      />
    </div>
  );
};
