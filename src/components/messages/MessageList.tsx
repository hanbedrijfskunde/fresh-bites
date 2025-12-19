import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import type { GeneratedTransaction, TransactionProgress } from '@/types';

interface MessageListProps {
  transactions: GeneratedTransaction[];
  transactionProgress: Record<string, TransactionProgress>;
  currentIndex: number;
}

export const MessageList: React.FC<MessageListProps> = ({
  transactions,
  transactionProgress,
  currentIndex,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentIndex]);

  // Only show messages up to current transaction
  const visibleTransactions = transactions.slice(0, currentIndex + 1);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {visibleTransactions.map((transaction) => (
          <Message
            key={transaction.id}
            transaction={transaction}
            progress={transactionProgress[transaction.id]}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
