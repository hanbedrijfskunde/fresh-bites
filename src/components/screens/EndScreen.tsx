import React from 'react';
import { StarRating } from '../layout/StarRating';
import { useSimulationStore } from '@/store/useSimulationStore';
import { ScoringEngine } from '@/engine/ScoringEngine';
import { formatPercentage } from '@/utils/formatters';

export const EndScreen: React.FC = () => {
  const { simulation, userProgress, resetSimulation, goToScreen } = useSimulationStore();

  if (!simulation || !userProgress) {
    return null;
  }

  const scorer = new ScoringEngine();
  const performance = scorer.getPerformanceLevel(userProgress.stars);

  // Calculate statistics
  const totalTransactions = simulation.transactions.length;
  const completedTransactions = Object.values(userProgress.transactionProgress).filter(
    (p) => p.isCorrect
  ).length;
  const firstTryCorrect = Object.values(userProgress.transactionProgress).filter(
    (p) => p.isCorrect && p.attempts === 1
  ).length;
  const hintsUsed = Object.values(userProgress.transactionProgress).reduce(
    (sum, p) => sum + p.hintsUsed,
    0
  );

  const handleRestart = () => {
    resetSimulation();
    goToScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl w-full animate-slide-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-primary mb-2">Dag voltooid!</h1>
          <p className="text-xl text-gray-600">Goed gedaan bij FreshBites</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-primary/20">
            <StarRating stars={userProgress.stars} maxStars={5} size="lg" showCount={true} />
          </div>
        </div>

        {/* Eindcontrole Message */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👩‍💼</span>
            <h3 className="text-xl font-semibold text-secondary">Fatima</h3>
          </div>
          <p className="text-gray-700 italic">
            "Einde van de dag! Bedankt voor je hulp vandaag. De administratie is helemaal
            up-to-date dankzij jou. Goed gedaan! 🎉"
          </p>
        </div>

        {/* Performance Level */}
        <div className={`text-center mb-8 p-4 rounded-lg ${
          performance.level === 'excellent' ? 'bg-success/10 text-success' :
          performance.level === 'good' ? 'bg-primary/10 text-primary' :
          performance.level === 'pass' ? 'bg-hint/10 text-hint' :
          'bg-gray-100 text-gray-700'
        }`}>
          <p className="text-lg font-semibold">{performance.message}</p>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">📊 Jouw resultaten</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Transacties correct:</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedTransactions} / {totalTransactions}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Eerste poging correct:</p>
              <p className="text-2xl font-bold text-gray-900">
                {firstTryCorrect} / {totalTransactions}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Hints gebruikt:</p>
              <p className="text-2xl font-bold text-gray-900">{hintsUsed}</p>
            </div>
            <div>
              <p className="text-gray-600">First-try accuracy:</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(firstTryCorrect, totalTransactions)}
              </p>
            </div>
          </div>
        </div>

        {/* Character Quote */}
        <div className="bg-secondary/10 rounded-lg p-6 mb-8 border-2 border-secondary/20">
          <div className="flex items-start gap-3">
            <span className="text-4xl">👩‍💼</span>
            <div>
              <p className="font-semibold text-secondary mb-2">Fatima zegt:</p>
              <p className="text-gray-800 italic">
                "Goed gedaan! Dankzij jou is de administratie van FreshBites weer helemaal op
                orde. Tot morgen!"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button onClick={handleRestart} className="btn btn-primary flex-1 py-3">
            Opnieuw spelen
          </button>
          <button
            onClick={() => {
              // TODO: Implement review mode
              alert('Review modus komt binnenkort!');
            }}
            className="btn btn-secondary flex-1 py-3"
          >
            Bekijk journaalposten
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Je resultaten zijn opgeslagen in je browser</p>
        </div>
      </div>
    </div>
  );
};
