import React from 'react';
import { Modal } from '../common/Modal';
import { useSimulationStore } from '@/store/useSimulationStore';
import type { HintModalData } from '@/types';

interface HintModalProps {
  isOpen: boolean;
  data: HintModalData;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, data }) => {
  const { closeModal } = useSimulationStore();

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="md">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💡</span>
            <div>
              <h2 className="text-2xl font-bold">Hint {data.level}/3</h2>
              <p className="text-sm text-error">-{data.starPenalty} ⭐ ster penalty</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Sluiten"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Hint Content */}
        <div className="bg-hint/10 border border-hint rounded-lg p-6 mb-6">
          <p className="text-gray-800 text-lg leading-relaxed">{data.text}</p>
        </div>

        {/* Action Button */}
        <button onClick={closeModal} className="btn btn-primary w-full py-3">
          Begrepen, terug naar journaalpost
        </button>
      </div>
    </Modal>
  );
};
