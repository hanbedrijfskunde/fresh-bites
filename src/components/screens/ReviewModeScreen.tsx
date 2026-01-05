import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { JournalEntry } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export const ReviewModeScreen: React.FC = () => {
  const { simulation, userProgress, goToScreen } = useSimulationStore();
  const [selectedTransactionIndex, setSelectedTransactionIndex] = useState(0);

  if (!simulation || !userProgress) {
    return null;
  }

  const selectedTransaction = simulation.transactions[selectedTransactionIndex];
  const progress = userProgress.transactionProgress[selectedTransaction.id];

  const renderJournalEntry = (entry: JournalEntry, index: number) => {
    return (
      <tr key={index} className="border-b border-gray-200">
        <td className="py-2 px-4 text-sm">{entry.account.name}</td>
        <td className="py-2 px-4 text-right text-sm font-mono">
          {entry.debit !== null ? formatCurrency(entry.debit) : '-'}
        </td>
        <td className="py-2 px-4 text-right text-sm font-mono">
          {entry.credit !== null ? formatCurrency(entry.credit) : '-'}
        </td>
      </tr>
    );
  };

  const calculateTotals = (entries: JournalEntry[]) => {
    const debitTotal = entries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const creditTotal = entries.reduce((sum, e) => sum + (e.credit || 0), 0);
    return { debitTotal, creditTotal };
  };

  const correctTotals = calculateTotals(selectedTransaction.correctAnswer);
  const userTotals = progress.currentEntry.length > 0 ? calculateTotals(progress.currentEntry) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">📋 Journaalposten overzicht</h1>
              <p className="text-gray-600 mt-1">
                Bekijk alle transacties en vergelijk jouw antwoorden met de correcte oplossing
              </p>
            </div>
            <button
              onClick={() => goToScreen('end')}
              className="btn btn-secondary"
            >
              ← Terug naar resultaten
            </button>
          </div>

          {/* Transaction selector */}
          <div className="flex gap-2 flex-wrap">
            {simulation.transactions.map((transaction, index) => {
              const txProgress = userProgress.transactionProgress[transaction.id];
              const isSelected = index === selectedTransactionIndex;
              const isCorrect = txProgress.isCorrect;

              return (
                <button
                  key={transaction.id}
                  onClick={() => setSelectedTransactionIndex(index)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md scale-105'
                      : isCorrect
                      ? 'bg-success/20 text-success hover:bg-success/30'
                      : 'bg-error/20 text-error hover:bg-error/30'
                  }`}
                >
                  Transactie {index + 1}
                  {isCorrect ? ' ✓' : ' ✗'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Transaction details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Transaction info */}
          <div className="space-y-6">
            {/* Message */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>{selectedTransaction.sender.avatar}</span>
                <span>Bericht van {selectedTransaction.sender.name}</span>
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-800">{selectedTransaction.message}</p>
                <p className="text-sm text-gray-500 mt-2">⏰ {selectedTransaction.timeSlot}</p>
              </div>
              {selectedTransaction.attachment && (
                <div className="bg-hint/10 border border-hint/30 rounded-lg p-3">
                  <p className="text-sm text-hint font-semibold">
                    📎 {selectedTransaction.attachment.filename}
                  </p>
                </div>
              )}
            </div>

            {/* Performance stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Jouw prestatie</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pogingen:</p>
                  <p className="text-2xl font-bold text-gray-900">{progress.attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hints gebruikt:</p>
                  <p className="text-2xl font-bold text-gray-900">{progress.hintsUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <p className={`text-lg font-bold ${progress.isCorrect ? 'text-success' : 'text-error'}`}>
                    {progress.isCorrect ? '✓ Correct' : '✗ Onjuist'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sterren verdiend:</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    ⭐ {progress.starsEarned.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Journal entries comparison */}
          <div className="space-y-6">
            {/* User's answer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className={progress.isCorrect ? 'text-success' : 'text-error'}>
                  {progress.isCorrect ? '✓' : '✗'}
                </span>
                Jouw antwoord
              </h3>
              {progress.currentEntry.length > 0 ? (
                <>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                          Rekening
                        </th>
                        <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">
                          Debet
                        </th>
                        <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.currentEntry.map((entry, index) => renderJournalEntry(entry, index))}
                    </tbody>
                    {userTotals && (
                      <tfoot className="bg-gray-100 font-semibold">
                        <tr>
                          <td className="py-2 px-4 text-sm">Totaal</td>
                          <td className="py-2 px-4 text-right text-sm font-mono">
                            {formatCurrency(userTotals.debitTotal)}
                          </td>
                          <td className="py-2 px-4 text-right text-sm font-mono">
                            {formatCurrency(userTotals.creditTotal)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 text-sm">Balans</td>
                          <td
                            colSpan={2}
                            className={`py-2 px-4 text-center text-sm font-semibold ${
                              Math.abs(userTotals.debitTotal - userTotals.creditTotal) < 0.01
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            {Math.abs(userTotals.debitTotal - userTotals.creditTotal) < 0.01
                              ? '✓ In balans'
                              : '✗ Niet in balans'}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </>
              ) : (
                <p className="text-gray-500 italic">Geen antwoord ingediend</p>
              )}
            </div>

            {/* Correct answer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-success">✓</span>
                Correcte oplossing
              </h3>
              <table className="w-full">
                <thead className="bg-success/10">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                      Rekening
                    </th>
                    <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">
                      Debet
                    </th>
                    <th className="py-2 px-4 text-right text-sm font-semibold text-gray-700">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTransaction.correctAnswer.map((entry, index) =>
                    renderJournalEntry(entry, index)
                  )}
                </tbody>
                <tfoot className="bg-success/20 font-semibold">
                  <tr>
                    <td className="py-2 px-4 text-sm">Totaal</td>
                    <td className="py-2 px-4 text-right text-sm font-mono">
                      {formatCurrency(correctTotals.debitTotal)}
                    </td>
                    <td className="py-2 px-4 text-right text-sm font-mono">
                      {formatCurrency(correctTotals.creditTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">Balans</td>
                    <td colSpan={2} className="py-2 px-4 text-center text-sm text-success font-semibold">
                      ✓ In balans
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Navigation footer */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedTransactionIndex(Math.max(0, selectedTransactionIndex - 1))}
              disabled={selectedTransactionIndex === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Vorige
            </button>
            <p className="text-gray-600">
              Transactie {selectedTransactionIndex + 1} van {simulation.transactions.length}
            </p>
            <button
              onClick={() =>
                setSelectedTransactionIndex(
                  Math.min(simulation.transactions.length - 1, selectedTransactionIndex + 1)
                )
              }
              disabled={selectedTransactionIndex === simulation.transactions.length - 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volgende →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
