import React, { useState } from 'react';
import { JournalRow } from './JournalRow';
import { BalanceIndicator } from './BalanceIndicator';
import { ActionBar } from './ActionBar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { getAccountById } from '@/data/accounts';
import { parseAmount } from '@/utils/formatters';
import type { JournalRowState, JournalEntry } from '@/types';
import { MIN_JOURNAL_ROWS, MAX_JOURNAL_ROWS } from '@/utils/constants';

interface JournalTableProps {
  transactionId: string;
}

export const JournalTable: React.FC<JournalTableProps> = ({ transactionId }) => {
  const { simulation, userProgress, submitAnswer, showModal } = useSimulationStore();

  const [rows, setRows] = useState<JournalRowState[]>([
    { id: '1', accountId: null, debitValue: '', creditValue: '', hasError: false },
    { id: '2', accountId: null, debitValue: '', creditValue: '', hasError: false },
  ]);

  const transaction = simulation?.transactions.find((t) => t.id === transactionId);
  const progress = userProgress?.transactionProgress[transactionId];

  // Calculate balance
  const debitTotal = rows.reduce((sum, r) => sum + (parseAmount(r.debitValue) || 0), 0);
  const creditTotal = rows.reduce((sum, r) => sum + (parseAmount(r.creditValue) || 0), 0);
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01 && debitTotal > 0;

  const canSubmit = isBalanced && rows.some((r) => r.accountId !== null);

  const handleAddRow = () => {
    if (rows.length < MAX_JOURNAL_ROWS) {
      setRows([
        ...rows,
        {
          id: Date.now().toString(),
          accountId: null,
          debitValue: '',
          creditValue: '',
          hasError: false,
        },
      ]);
    }
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length > MIN_JOURNAL_ROWS) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof JournalRowState, value: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSubmit = () => {
    if (!canSubmit || !transaction) return;

    // Convert rows to JournalEntry format
    const entries: JournalEntry[] = rows
      .filter((r) => r.accountId)
      .map((r) => ({
        account: getAccountById(r.accountId!)!,
        debit: parseAmount(r.debitValue),
        credit: parseAmount(r.creditValue),
      }));

    const result = submitAnswer(transactionId, entries);

    // Show feedback modal
    const isCorrect = result.isValid;
    const currentAttempt = (progress?.attempts || 0) + 1;
    const showSolution = !isCorrect && currentAttempt >= 3;

    showModal({
      type: 'feedback',
      content: {
        isCorrect,
        message: isCorrect
          ? transaction.feedbackCorrect.message
          : transaction.feedbackIncorrect.message,
        characterQuote: isCorrect ? transaction.feedbackCorrect.characterQuote : undefined,
        starsEarned: progress?.starsEarned || 0,
        currentAttempt,
        maxAttempts: 3,
        showSolution,
        solution: showSolution ? transaction.correctAnswer : undefined,
        validationResult: result,
      },
    });

    // Clear form if correct
    if (isCorrect) {
      setRows([
        { id: '1', accountId: null, debitValue: '', creditValue: '', hasError: false },
        { id: '2', accountId: null, debitValue: '', creditValue: '', hasError: false },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Jouw Journaalpost</h3>

      <div className="space-y-3">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 px-2">
          <div className="col-span-6">Rekening</div>
          <div className="col-span-3 text-right">Debet</div>
          <div className="col-span-3 text-right">Credit</div>
        </div>

        {/* Rows */}
        {rows.map((row) => (
          <JournalRow
            key={row.id}
            row={row}
            onChange={(field, value) => handleRowChange(row.id, field, value)}
            onRemove={() => handleRemoveRow(row.id)}
            canRemove={rows.length > MIN_JOURNAL_ROWS}
          />
        ))}

        {/* Add row button */}
        {rows.length < MAX_JOURNAL_ROWS && (
          <button
            onClick={handleAddRow}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors mt-2"
          >
            + Regel toevoegen
          </button>
        )}
      </div>

      {/* Balance indicator */}
      <div className="mt-6 pt-4 border-t">
        <BalanceIndicator
          debitTotal={debitTotal}
          creditTotal={creditTotal}
          isBalanced={isBalanced}
        />
      </div>

      {/* Action bar */}
      <ActionBar
        transactionId={transactionId}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
        attempts={progress?.attempts || 0}
      />
    </div>
  );
};
