import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

export const WelcomeScreen: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [relaxedMode, setRelaxedMode] = useState(false);
  const { initializeSimulation, goToScreen } = useSimulationStore();

  const handleStart = () => {
    if (!userId.trim()) {
      alert('Vul eerst je voornaam in');
      return;
    }

    initializeSimulation(userId, undefined, { relaxedMode });
    goToScreen('simulation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full animate-slide-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚚</div>
          <h1 className="text-4xl font-bold text-primary mb-2">FreshBites</h1>
          <p className="text-xl text-gray-600">Een Dag als Boekhouder</p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Welkom!</h2>
          <p className="text-gray-700 mb-3">
            Vandaag ben jij de boekhouder van FreshBites, een foodtruck die verse broodjes en
            salades verkoopt. Je krijgt gedurende de dag verschillende berichten van collega's met
            transacties die je correct moet journaliseren.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>6 transacties verspreid over één werkdag</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏱️</span>
              <span>Elke transactie heeft een tijdslimiet</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⭐</span>
              <span>Verdien tot 6 sterren op basis van je prestaties</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💡</span>
              <span>Gebruik hints als je vastzit (kost wel sterren!)</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              Voornaam
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="input w-full"
              placeholder="bijv. Jan"
              autoFocus
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="relaxedMode"
              checked={relaxedMode}
              onChange={(e) => setRelaxedMode(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="relaxedMode" className="ml-2 block text-sm text-gray-700">
              Ontspannen modus (75% meer tijd per transactie)
            </label>
          </div>
        </div>

        {/* Start Button */}
        <button onClick={handleStart} className="btn btn-primary w-full py-3 text-lg">
          Start dag
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Geschatte duur: 12-18 minuten</p>
        </div>
      </div>
    </div>
  );
};
