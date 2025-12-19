import React from 'react';
import { getAccountsByType } from '@/data/accounts';

interface AccountDropdownProps {
  value: string | null;
  onChange: (accountId: string | null) => void;
  disabled?: boolean;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const accountsByType = getAccountsByType();

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className="input w-full text-sm"
      aria-label="Selecteer rekening"
    >
      <option value="">Selecteer rekening</option>

      <optgroup label="Activa">
        {accountsByType.activa.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </optgroup>

      <optgroup label="Passiva">
        {accountsByType.passiva.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </optgroup>

      <optgroup label="Opbrengsten">
        {accountsByType.opbrengsten.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </optgroup>

      <optgroup label="Kosten">
        {accountsByType.kosten.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </optgroup>
    </select>
  );
};
