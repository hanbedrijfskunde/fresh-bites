import React from 'react';
import { Header } from '../layout/Header';
import { ProgressBar } from '../layout/ProgressBar';
import { MessageList } from '../messages/MessageList';
import { JournalTable } from '../journal/JournalTable';
import { FeedbackModal } from '../modals/FeedbackModal';
import { HintModal } from '../modals/HintModal';
import { AttachmentModal } from '../modals/AttachmentModal';
import { useSimulationStore } from '@/store/useSimulationStore';

export const SimulationScreen: React.FC = () => {
  const { simulation, userProgress, activeModal } = useSimulationStore();

  if (!simulation || !userProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Simulatie laden...</p>
      </div>
    );
  }

  const currentTransaction = simulation.transactions[userProgress.currentTransactionIndex];
  const transactionIds = simulation.transactions.map((t) => t.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        currentTransaction={currentTransaction}
        stars={userProgress.stars}
        showTimer={currentTransaction?.timeLimit > 0}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Side - Messages */}
        <div className="lg:w-1/2 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
          <MessageList
            transactions={simulation.transactions}
            transactionProgress={userProgress.transactionProgress}
            currentIndex={userProgress.currentTransactionIndex}
          />
        </div>

        {/* Right Side - Journal */}
        <div className="lg:w-1/2">
          {currentTransaction && (
            <JournalTable transactionId={currentTransaction.id} />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentIndex={userProgress.currentTransactionIndex}
        totalTransactions={simulation.transactions.length}
        transactionProgress={userProgress.transactionProgress}
        transactionIds={transactionIds}
      />

      {/* Modals */}
      {activeModal.type === 'feedback' && (
        <FeedbackModal isOpen={true} data={activeModal.content} />
      )}
      {activeModal.type === 'hint' && (
        <HintModal isOpen={true} data={activeModal.content} />
      )}
      {activeModal.type === 'attachment' && (
        <AttachmentModal isOpen={true} data={activeModal.content} />
      )}
    </div>
  );
};
