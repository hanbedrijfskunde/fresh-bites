import type { Account } from '@/types';

export const ACCOUNTS: Account[] = [
  // Assets (Activa)
  {
    id: 'kas',
    name: 'Kas',
    type: 'activa',
    category: 'debit',
  },
  {
    id: 'bank',
    name: 'Bank',
    type: 'activa',
    category: 'debit',
  },
  {
    id: 'debiteuren',
    name: 'Debiteuren',
    type: 'activa',
    category: 'debit',
  },
  {
    id: 'voorraad',
    name: 'Voorraad',
    type: 'activa',
    category: 'debit',
  },
  {
    id: 'inventaris',
    name: 'Inventaris',
    type: 'activa',
    category: 'debit',
  },

  // Liabilities (Passiva)
  {
    id: 'crediteuren',
    name: 'Crediteuren',
    type: 'passiva',
    category: 'credit',
  },

  // Revenue (Opbrengsten)
  {
    id: 'omzet',
    name: 'Omzet',
    type: 'opbrengsten',
    category: 'credit',
  },

  // Expenses (Kosten)
  {
    id: 'inkoopwaarde',
    name: 'Inkoopwaarde omzet',
    type: 'kosten',
    category: 'debit',
  },
  {
    id: 'huurkosten',
    name: 'Huurkosten',
    type: 'kosten',
    category: 'debit',
  },
  {
    id: 'loonkosten',
    name: 'Loonkosten',
    type: 'kosten',
    category: 'debit',
  },
  {
    id: 'overige_kosten',
    name: 'Overige kosten',
    type: 'kosten',
    category: 'debit',
  },
  {
    id: 'afschrijvingskosten',
    name: 'Afschrijvingskosten',
    type: 'kosten',
    category: 'debit',
  },
];

/**
 * Get account by ID
 */
export function getAccountById(id: string): Account | undefined {
  return ACCOUNTS.find((account) => account.id === id);
}

/**
 * Get accounts grouped by type
 */
export function getAccountsByType(): Record<string, Account[]> {
  return {
    activa: ACCOUNTS.filter((a) => a.type === 'activa'),
    passiva: ACCOUNTS.filter((a) => a.type === 'passiva'),
    opbrengsten: ACCOUNTS.filter((a) => a.type === 'opbrengsten'),
    kosten: ACCOUNTS.filter((a) => a.type === 'kosten'),
  };
}
