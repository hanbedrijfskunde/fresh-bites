import React from 'react';
import { Modal } from '../common/Modal';
import { useSimulationStore } from '@/store/useSimulationStore';
import { formatCurrency } from '@/utils/formatters';
import type { FeedbackModalData } from '@/types';

interface FeedbackModalProps {
  isOpen: boolean;
  data: FeedbackModalData;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, data }) => {
  const { closeModal, userProgress, goToScreen } = useSimulationStore();

  const handleNext = () => {
    closeModal();

    // Check if simulation is complete
    if (userProgress?.status === 'completed') {
      goToScreen('end');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={data.isCorrect ? handleNext : closeModal} size="md">
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">
          {data.isCorrect ? '✅' : '❌'}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">
          {data.isCorrect ? 'Goed geboekt!' : 'Dat klopt nog niet helemaal'}
        </h2>

        {/* Message */}
        <p className="text-lg text-gray-700 mb-4">{data.message}</p>

        {/* Character Quote */}
        {data.characterQuote && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-800 italic">"{data.characterQuote}"</p>
          </div>
        )}

        {/* Stars Earned (if correct) */}
        {data.isCorrect && data.starsEarned > 0 && (
          <div className="mb-6">
            <p className="text-primary font-semibold text-xl">
              +{data.starsEarned.toFixed(1)} ⭐ verdiend!
            </p>
          </div>
        )}

        {/* Validation Errors (if incorrect) */}
        {!data.isCorrect && data.validationResult?.errors && data.validationResult.errors.length > 0 && (
          <div className="mb-6 text-left space-y-2">
            {data.validationResult.errors.map((error, idx) => {
              const isMismatchError = error.type === 'AMOUNT_MISMATCH';

              return (
                <div
                  key={idx}
                  className={`text-sm rounded-lg p-3 ${
                    isMismatchError
                      ? 'bg-orange-50 border-2 border-orange-400 text-orange-900 font-semibold'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {error.message}
                </div>
              );
            })}
          </div>
        )}

        {/* Attempt Counter (if incorrect) */}
        {!data.isCorrect && (
          <div className="mb-6">
            <p className="text-gray-600">
              Poging {data.currentAttempt} van {data.maxAttempts}
            </p>
          </div>
        )}

        {/* Solution (after 3 attempts) */}
        {data.showSolution && data.solution && (
          <div className="bg-hint/10 border border-hint rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-3 text-hint">Correcte uitwerking:</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Rekening</th>
                  <th className="text-right py-2">Debet</th>
                  <th className="text-right py-2">Credit</th>
                </tr>
              </thead>
              <tbody>
                {data.solution.map((entry, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2">{entry.account.name}</td>
                    <td className="text-right py-2">
                      {entry.debit ? formatCurrency(entry.debit) : '—'}
                    </td>
                    <td className="text-right py-2">
                      {entry.credit ? formatCurrency(entry.credit) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {data.isCorrect ? (
            <button onClick={handleNext} className="btn btn-success px-8 py-3 text-lg">
              Volgende bericht →
            </button>
          ) : data.showSolution ? (
            <button onClick={handleNext} className="btn btn-primary px-8 py-3">
              Volgende →
            </button>
          ) : (
            <>
              {data.showSolution && (
                <button onClick={() => closeModal()} className="btn btn-secondary">
                  Toon uitwerking
                </button>
              )}
              <button onClick={() => closeModal()} className="btn btn-primary px-8">
                Opnieuw proberen
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
