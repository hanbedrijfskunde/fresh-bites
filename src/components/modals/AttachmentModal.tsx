import React from 'react';
import { Modal } from '../common/Modal';
import { useSimulationStore } from '@/store/useSimulationStore';
import type { AttachmentModalData } from '@/types';

interface AttachmentModalProps {
  isOpen: boolean;
  data: AttachmentModalData;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({ isOpen, data }) => {
  const { closeModal } = useSimulationStore();

  // Debug: Log the data to see what we're receiving (will remove after testing)
  console.log('AttachmentModal data:', data);
  console.log('HTML content length:', data.htmlContent?.length || 0);

  // If htmlContent is empty, show a helpful message
  if (data.type === 'html' && !data.htmlContent) {
    console.warn('⚠️ HTML content is empty! This likely means you need to restart the simulation to generate fresh receipts.');
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>📎</span>
            <span>{data.filename}</span>
          </h2>
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

        {/* Content */}
        <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
          {data.type === 'html' ? (
            <div
              className="w-full max-h-[600px] overflow-auto bg-white p-4"
              dangerouslySetInnerHTML={{ __html: data.htmlContent || '' }}
            />
          ) : (
            <img
              src={data.url}
              alt={data.filename}
              className="max-w-full max-h-[600px] object-contain"
            />
          )}
        </div>

        {/* Close Button */}
        <div className="mt-4 flex justify-end">
          <button onClick={closeModal} className="btn btn-secondary">
            Sluiten
          </button>
        </div>
      </div>
    </Modal>
  );
};
