import type {
  JournalEntry,
  ValidationResult,
  ValidationError,
  EntryMatchResult,
  BalanceCheck,
  GeneratedTransaction,
} from '@/types';

export class ValidationEngine {
  /**
   * Validate user's journal entry against correct answer
   */
  public validate(
    userEntry: JournalEntry[],
    correctAnswer: JournalEntry[],
    transaction?: GeneratedTransaction
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const entryMatches: EntryMatchResult[] = [];

    // Step 1: Check if entries are not empty
    if (userEntry.length === 0 || this.hasEmptyRows(userEntry)) {
      errors.push({
        type: 'EMPTY_ENTRY',
        message: 'Vul minimaal één regel in met rekening en bedrag.',
      });
    }

    // Step 2: Check balance
    const debitTotal = this.calculateTotal(userEntry, 'debit');
    const creditTotal = this.calculateTotal(userEntry, 'credit');
    const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01; // Floating point tolerance

    const balanceCheck: BalanceCheck = {
      isBalanced,
      debitTotal,
      creditTotal,
    };

    if (!isBalanced) {
      errors.push({
        type: 'NOT_BALANCED',
        message: `Debet (€${debitTotal.toFixed(2)}) is niet gelijk aan credit (€${creditTotal.toFixed(2)}).`,
      });
    }

    // Step 3: Match entries
    const { matches, missingEntries, extraEntries } = this.matchEntries(userEntry, correctAnswer);

    entryMatches.push(...matches);

    if (missingEntries.length > 0) {
      errors.push({
        type: 'MISSING_ENTRY',
        message: `Je mist ${missingEntries.length} regel(s) in je journaalpost.`,
      });
    }

    if (extraEntries.length > 0) {
      errors.push({
        type: 'EXTRA_ENTRIES',
        message: `Je hebt ${extraEntries.length} regel(s) te veel.`,
      });
    }

    // Check individual incorrect entries
    const incorrectMatches = matches.filter((m) => !m.isCorrect);
    if (incorrectMatches.length > 0) {
      errors.push({
        type: 'INCORRECT_ENTRY',
        message: `${incorrectMatches.length} regel(s) zijn niet correct.`,
      });
    }

    // Step 4: Check for amount mismatch (if user used chat amount instead of receipt amount)
    if (transaction?.hasAmountMismatch && errors.length > 0) {
      const usedDisplayAmount = this.checkIfUsedDisplayAmount(
        userEntry,
        transaction.displayAmount!,
        transaction.actualAmount
      );

      if (usedDisplayAmount) {
        // Add mismatch error at the beginning (highest priority)
        errors.unshift({
          type: 'AMOUNT_MISMATCH',
          message: `⚠️ Let op! Het bedrag in de chat (€${transaction.displayAmount!.toFixed(2)}) komt niet overeen met het bedrag op de factuur (€${transaction.actualAmount.toFixed(2)}). Controleer altijd de bijgevoegde documenten! 📋`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      balanceCheck,
      entryMatches,
    };
  }

  /**
   * Check if any rows are empty
   */
  private hasEmptyRows(entries: JournalEntry[]): boolean {
    return entries.some(
      (e) =>
        !e.account ||
        (e.debit === null && e.credit === null) ||
        (e.debit === 0 && e.credit === 0)
    );
  }

  /**
   * Calculate total for debit or credit side
   */
  private calculateTotal(entries: JournalEntry[], side: 'debit' | 'credit'): number {
    return entries.reduce((sum, entry) => {
      const value = side === 'debit' ? entry.debit : entry.credit;
      return sum + (value || 0);
    }, 0);
  }

  /**
   * Match user entries against correct answer
   */
  private matchEntries(
    userEntry: JournalEntry[],
    correctAnswer: JournalEntry[]
  ): {
    matches: EntryMatchResult[];
    missingEntries: JournalEntry[];
    extraEntries: JournalEntry[];
  } {
    const matches: EntryMatchResult[] = [];
    const unmatchedCorrect = [...correctAnswer];
    const unmatchedUser = [...userEntry];

    // Find exact matches
    for (let i = unmatchedUser.length - 1; i >= 0; i--) {
      const userRow = unmatchedUser[i];
      const matchIndex = unmatchedCorrect.findIndex((correct) => this.entriesMatch(userRow, correct));

      if (matchIndex !== -1) {
        matches.push({
          userEntry: userRow,
          expectedEntry: unmatchedCorrect[matchIndex],
          isCorrect: true,
          issues: [],
        });
        unmatchedCorrect.splice(matchIndex, 1);
        unmatchedUser.splice(i, 1);
      }
    }

    // Analyze remaining unmatched entries
    for (const userRow of unmatchedUser) {
      const issues: string[] = [];
      let closestMatch: JournalEntry | undefined;

      // Try to find what's wrong
      const accountMatch = unmatchedCorrect.find((c) => c.account.id === userRow.account.id);
      if (accountMatch) {
        closestMatch = accountMatch;
        if (Math.abs((userRow.debit || 0) - (accountMatch.debit || 0)) >= 0.01) {
          issues.push('Verkeerd debetbedrag');
        }
        if (Math.abs((userRow.credit || 0) - (accountMatch.credit || 0)) >= 0.01) {
          issues.push('Verkeerd creditbedrag');
        }
      } else {
        issues.push('Verkeerde rekening');
      }

      matches.push({
        userEntry: userRow,
        expectedEntry: closestMatch,
        isCorrect: false,
        issues,
      });
    }

    return {
      matches,
      missingEntries: unmatchedCorrect,
      extraEntries: unmatchedUser,
    };
  }

  /**
   * Check if two journal entries match exactly
   */
  private entriesMatch(a: JournalEntry, b: JournalEntry): boolean {
    return (
      a.account.id === b.account.id &&
      Math.abs((a.debit || 0) - (b.debit || 0)) < 0.01 &&
      Math.abs((a.credit || 0) - (b.credit || 0)) < 0.01
    );
  }

  /**
   * Check if user used the display amount (from chat) instead of actual amount (from receipt)
   */
  private checkIfUsedDisplayAmount(
    userEntry: JournalEntry[],
    displayAmount: number,
    actualAmount: number
  ): boolean {
    // Check if any of the user's amounts match the display amount but not the actual amount
    for (const entry of userEntry) {
      const userAmount = (entry.debit || 0) + (entry.credit || 0);

      // Tolerance for floating point comparison
      const matchesDisplay = Math.abs(userAmount - displayAmount) < 0.01;
      const matchesActual = Math.abs(userAmount - actualAmount) < 0.01;

      if (matchesDisplay && !matchesActual) {
        return true;
      }
    }

    return false;
  }
}
