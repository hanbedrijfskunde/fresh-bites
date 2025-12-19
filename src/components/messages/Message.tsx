import React from 'react';
import { Avatar } from './Avatar';
import type { GeneratedTransaction, TransactionProgress } from '@/types';
import { useSimulationStore } from '@/store/useSimulationStore';

interface MessageProps {
  transaction: GeneratedTransaction;
  progress: TransactionProgress;
}

export const Message: React.FC<MessageProps> = ({ transaction, progress }) => {
  const { showModal } = useSimulationStore();

  const handleAttachmentClick = () => {
    if (transaction.attachment) {
      showModal({
        type: 'attachment',
        content: {
          filename: transaction.attachment.filename,
          url: transaction.attachment.url,
          type: transaction.attachment.type,
          htmlContent: transaction.attachment.htmlContent,
        },
      });
    }
  };

  const isCompleted = progress.status === 'completed';
  const isActive = progress.status === 'active';

  return (
    <div
      className={`flex gap-3 items-start animate-slide-in ${
        isActive ? 'opacity-100' : 'opacity-70'
      }`}
    >
      {/* Avatar */}
      <Avatar character={transaction.sender} size="md" />

      {/* Message Content */}
      <div className="flex-1 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">{transaction.sender.name}</span>
          <span className="text-sm text-gray-500">{transaction.timeSlot}</span>
          {isCompleted && (
            <span className="text-xs text-success font-medium">✓ Geboekt</span>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`message-bubble ${
            transaction.sender.id === 'system' ? 'message-bubble-system' : 'message-bubble-received'
          }`}
        >
          <p className="text-gray-800 whitespace-pre-wrap">{transaction.message}</p>

          {/* Attachment */}
          {transaction.attachment && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1 italic">
                📎 Document bijgevoegd - controleer zorgvuldig!
              </div>
              <button
                onClick={handleAttachmentClick}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <span>📄</span>
                <span>{transaction.attachment.filename}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
