import { describe, it, expect } from 'vitest';
import { ValidationEngine } from '../ValidationEngine';
import type { JournalEntry, GeneratedTransaction, Account } from '@/types';

// Mock accounts for testing
const KAS: Account = { id: 'kas', name: 'Kas', type: 'activa', category: 'debit' };
const BANK: Account = { id: 'bank', name: 'Bank', type: 'activa', category: 'debit' };
const VOORRAAD: Account = { id: 'voorraad', name: 'Voorraad', type: 'activa', category: 'debit' };
const OMZET: Account = { id: 'omzet', name: 'Omzet', type: 'opbrengsten', category: 'credit' };

describe('ValidationEngine', () => {
  const validator = new ValidationEngine();

  describe('validate - basic validation', () => {
    it('should validate correct balanced entry', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject unbalanced entry', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 50 }, // Wrong amount
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'NOT_BALANCED' })
      );
      expect(result.balanceCheck.debitTotal).toBe(100);
      expect(result.balanceCheck.creditTotal).toBe(50);
    });

    it('should reject empty entries', () => {
      const result = validator.validate([], [
        { account: KAS, debit: 100, credit: null },
      ]);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'EMPTY_ENTRY' })
      );
    });

    it('should detect missing entries', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        // Missing second entry
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'MISSING_ENTRY' })
      );
    });

    it('should detect extra entries', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
        { account: BANK, debit: 50, credit: null }, // Extra
        { account: OMZET, debit: null, credit: 50 }, // Extra
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'EXTRA_ENTRIES' })
      );
    });

    it('should detect incorrect account', () => {
      const userEntry: JournalEntry[] = [
        { account: BANK, debit: 100, credit: null }, // Wrong account (should be VOORRAAD)
        { account: KAS, debit: null, credit: 100 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'INCORRECT_ENTRY' })
      );
    });

    it('should detect incorrect amount', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 150, credit: null }, // Wrong amount
        { account: KAS, debit: null, credit: 150 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'INCORRECT_ENTRY' })
      );
    });

    it('should detect swapped debit/credit', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: null, credit: 100 }, // Swapped
        { account: KAS, debit: 100, credit: null },       // Swapped
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'INCORRECT_ENTRY' })
      );
    });
  });

  describe('validate - floating point tolerance', () => {
    it('should handle floating point precision issues', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100.005, credit: null },
        { account: KAS, debit: null, credit: 100.005 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      // Should be valid within tolerance of 0.01
      expect(result.balanceCheck.isBalanced).toBe(true);
    });

    it('should reject amounts outside tolerance', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 100.02, credit: null }, // Outside 0.01 tolerance
        { account: KAS, debit: null, credit: 100.02 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ type: 'INCORRECT_ENTRY' })
      );
    });
  });

  describe('validate - amount mismatch detection', () => {
    it('should detect when user used chat amount instead of receipt amount', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 350, credit: null }, // User used displayAmount
        { account: KAS, debit: null, credit: 350 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 400, credit: null }, // Actual amount
        { account: KAS, debit: null, credit: 400 },
      ];

      const transaction = {
        hasAmountMismatch: true,
        displayAmount: 350, // Chat shows 350
        actualAmount: 400,  // Receipt shows 400
      } as GeneratedTransaction;

      const result = validator.validate(userEntry, correctAnswer, transaction);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('AMOUNT_MISMATCH');
      expect(result.errors[0].message).toContain('350');
      expect(result.errors[0].message).toContain('400');
    });

    it('should not show mismatch error if amounts are correct', () => {
      const userEntry: JournalEntry[] = [
        { account: VOORRAAD, debit: 400, credit: null }, // Correct amount
        { account: KAS, debit: null, credit: 400 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 400, credit: null },
        { account: KAS, debit: null, credit: 400 },
      ];

      const transaction = {
        hasAmountMismatch: true,
        displayAmount: 350,
        actualAmount: 400,
      } as GeneratedTransaction;

      const result = validator.validate(userEntry, correctAnswer, transaction);
      expect(result.isValid).toBe(true);
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ type: 'AMOUNT_MISMATCH' })
      );
    });
  });

  describe('validate - complex scenarios', () => {
    it('should validate multi-row entries correctly', () => {
      const userEntry: JournalEntry[] = [
        { account: BANK, debit: 500, credit: null },
        { account: KAS, debit: null, credit: 200 },
        { account: VOORRAAD, debit: null, credit: 300 },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: BANK, debit: 500, credit: null },
        { account: KAS, debit: null, credit: 200 },
        { account: VOORRAAD, debit: null, credit: 300 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(true);
      expect(result.balanceCheck.debitTotal).toBe(500);
      expect(result.balanceCheck.creditTotal).toBe(500);
    });

    it('should handle entries in different order', () => {
      const userEntry: JournalEntry[] = [
        { account: KAS, debit: null, credit: 100 },
        { account: VOORRAAD, debit: 100, credit: null },
      ];
      const correctAnswer: JournalEntry[] = [
        { account: VOORRAAD, debit: 100, credit: null },
        { account: KAS, debit: null, credit: 100 },
      ];

      const result = validator.validate(userEntry, correctAnswer);
      expect(result.isValid).toBe(true);
    });
  });
});
