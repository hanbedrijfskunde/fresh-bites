import { describe, it, expect } from 'vitest';
import { SimulationGenerator } from '../SimulationGenerator';
import type { TransactionPool, SimulationConfig } from '@/types';
import { ACCOUNTS } from '@/data/accounts';

// Simple mock pool for testing
const mockPool: TransactionPool = {
  id: 'test_pool',
  timeSlot: '10:00',
  label: 'Test Pool',
  templates: [
    {
      id: 'test_template_1',
      poolId: 'test_pool',
      sender: { id: 'test', name: 'Test', role: 'test', avatar: '🧪', communicationStyle: 'neutral' },
      messageTemplate: 'Test message with {amount}',
      amountRange: { min: 100, max: 200, step: 50 },
      correctAnswerTemplate: [
        { account: ACCOUNTS[0], debitFormula: 'amount', creditFormula: null },
        { account: ACCOUNTS[1], debitFormula: null, creditFormula: 'amount' },
      ],
      hints: [
        { level: 1, text: 'Hint 1' },
        { level: 2, text: 'Hint 2 with {amount}' },
        { level: 3, text: 'Hint 3' },
      ],
      feedbackCorrect: { message: 'Correct!' },
      feedbackIncorrect: { message: 'Try again' },
      complexity: 'basic',
      requiresMultipleRows: false,
      allowAmountMismatch: false,
    },
    {
      id: 'test_template_2',
      poolId: 'test_pool',
      sender: { id: 'test', name: 'Test', role: 'test', avatar: '🧪', communicationStyle: 'neutral' },
      messageTemplate: 'Another test with {amount}',
      amountRange: { min: 50, max: 100, step: 25 },
      correctAnswerTemplate: [
        { account: ACCOUNTS[0], debitFormula: 'amount', creditFormula: null },
        { account: ACCOUNTS[1], debitFormula: null, creditFormula: 'amount' },
      ],
      hints: [
        { level: 1, text: 'Hint' },
        { level: 2, text: 'Hint' },
        { level: 3, text: 'Hint' },
      ],
      feedbackCorrect: { message: 'Good' },
      feedbackIncorrect: { message: 'Nope' },
      complexity: 'basic',
      requiresMultipleRows: false,
      allowAmountMismatch: false,
    },
  ],
};

const mockPoolWithPartial: TransactionPool = {
  id: 'partial_pool',
  timeSlot: '14:00',
  label: 'Partial Payment Pool',
  templates: [
    {
      id: 'partial_template',
      poolId: 'partial_pool',
      sender: { id: 'test', name: 'Test', role: 'test', avatar: '🧪', communicationStyle: 'neutral' },
      messageTemplate: 'Split payment: {amount} total, paid {partial}',
      amountRange: { min: 100, max: 200, step: 50 },
      partialPaymentRange: { min: 25, max: 50, step: 5 },
      correctAnswerTemplate: [
        { account: ACCOUNTS[0], debitFormula: 'amount', creditFormula: null },
        { account: ACCOUNTS[1], debitFormula: null, creditFormula: 'partial' },
        { account: ACCOUNTS[2], debitFormula: null, creditFormula: 'amount - partial' },
      ],
      hints: [
        { level: 1, text: 'Hint' },
        { level: 2, text: 'Hint' },
        { level: 3, text: 'Hint' },
      ],
      feedbackCorrect: { message: 'Good' },
      feedbackIncorrect: { message: 'Nope' },
      complexity: 'medium',
      requiresMultipleRows: true,
      allowAmountMismatch: false,
    },
  ],
};

const mockConfig: SimulationConfig = {
  transactionTimeLimits: { 1: 180, 2: 180, 3: 120, 4: 120, 5: 60 },
  timerWarningThreshold: 10,
};

describe('SimulationGenerator', () => {
  describe('deterministic randomization', () => {
    it('should generate identical simulations with same seed', () => {
      const seed = 'test-seed-123';
      const generator1 = new SimulationGenerator(seed);
      const generator2 = new SimulationGenerator(seed);

      const sim1 = generator1.generateSimulation('user1', [mockPool], mockConfig);
      const sim2 = generator2.generateSimulation('user1', [mockPool], mockConfig);

      // Same template selection
      expect(sim1.transactions[0].templateId).toBe(sim2.transactions[0].templateId);

      // Same amounts
      expect(sim1.transactions[0].generatedAmounts.amount).toBe(
        sim2.transactions[0].generatedAmounts.amount
      );

      // Same message
      expect(sim1.transactions[0].message).toBe(sim2.transactions[0].message);

      // Same correct answers
      expect(sim1.transactions[0].correctAnswer).toEqual(sim2.transactions[0].correctAnswer);
    });

    it('should generate different simulations with different seeds', () => {
      const generator1 = new SimulationGenerator('seed-1');
      const generator2 = new SimulationGenerator('seed-2');

      const sim1 = generator1.generateSimulation('user1', [mockPool], mockConfig);
      const sim2 = generator2.generateSimulation('user1', [mockPool], mockConfig);

      // Both amounts should be valid numbers
      const amount1 = sim1.transactions[0].generatedAmounts.amount;
      const amount2 = sim2.transactions[0].generatedAmounts.amount;

      expect(amount1).toBeTypeOf('number');
      expect(amount2).toBeTypeOf('number');
      expect(amount1).toBeGreaterThanOrEqual(100);
      expect(amount2).toBeGreaterThanOrEqual(100);
    });
  });

  describe('amount generation', () => {
    it('should generate amounts within specified range', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);

      const amount = simulation.transactions[0].generatedAmounts.amount;
      expect(amount).toBeGreaterThanOrEqual(100);
      expect(amount).toBeLessThanOrEqual(200);
    });

    it('should respect step constraints', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);

      const amount = simulation.transactions[0].generatedAmounts.amount;
      // Should be 100, 150, or 200 (min: 100, max: 200, step: 50)
      expect([100, 150, 200]).toContain(amount);
    });

    it('should generate partial payments correctly', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPoolWithPartial], mockConfig);

      const { amount, partial } = simulation.transactions[0].generatedAmounts;

      expect(partial).toBeDefined();
      expect(partial!).toBeGreaterThan(0);
      expect(partial!).toBeLessThan(amount);
      // Partial should be rounded to nearest 10
      expect(partial! % 10).toBe(0);
    });

    it('should calculate correct answer formulas properly', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPoolWithPartial], mockConfig);

      const transaction = simulation.transactions[0];
      const { amount, partial } = transaction.generatedAmounts;

      // Check formula evaluation: amount - partial
      const debitTotal = transaction.correctAnswer
        .reduce((sum, entry) => sum + (entry.debit || 0), 0);
      const creditTotal = transaction.correctAnswer
        .reduce((sum, entry) => sum + (entry.credit || 0), 0);

      expect(debitTotal).toBe(amount);
      expect(creditTotal).toBe(amount);

      // Find the entry with "amount - partial" formula
      const remainingEntry = transaction.correctAnswer.find(
        (entry) => entry.credit === amount - partial!
      );
      expect(remainingEntry).toBeDefined();
    });
  });

  describe('template filling', () => {
    it('should fill {amount} placeholders in messages', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);

      const message = simulation.transactions[0].message;
      expect(message).not.toContain('{amount}');
      expect(message).toMatch(/Test message with \d+/);
    });

    it('should fill {amount} placeholders in hints', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);

      const hints = simulation.transactions[0].hints;
      const hint2 = hints.find((h) => h.level === 2);

      expect(hint2).toBeDefined();
      expect(hint2!.text).not.toContain('{amount}');
      expect(hint2!.text).toMatch(/Hint 2 with \d+/);
    });

    it('should fill both {amount} and {partial} placeholders', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPoolWithPartial], mockConfig);

      const message = simulation.transactions[0].message;
      expect(message).not.toContain('{amount}');
      expect(message).not.toContain('{partial}');
      expect(message).toMatch(/Split payment: \d+ total, paid \d+/);
    });
  });

  describe('simulation structure', () => {
    it('should create simulation with correct metadata', () => {
      const userId = 'test-user';
      const seed = 'test-seed';
      const generator = new SimulationGenerator(seed);
      const simulation = generator.generateSimulation(userId, [mockPool], mockConfig);

      expect(simulation.id).toBeDefined();
      expect(simulation.seed).toBe(seed);
      expect(simulation.userId).toBe(userId);
      expect(simulation.createdAt).toBeInstanceOf(Date);
      expect(simulation.config).toEqual(mockConfig);
    });

    it('should generate one transaction per pool', () => {
      const generator = new SimulationGenerator('test-seed');
      const pools = [mockPool, mockPoolWithPartial];
      const simulation = generator.generateSimulation('user1', pools, mockConfig);

      expect(simulation.transactions).toHaveLength(2);
    });

    it('should assign transaction numbers correctly', () => {
      const generator = new SimulationGenerator('test-seed');
      const pools = [mockPool, mockPoolWithPartial];
      const simulation = generator.generateSimulation('user1', pools, mockConfig);

      expect(simulation.transactions[0].transactionNumber).toBe(1);
      expect(simulation.transactions[1].transactionNumber).toBe(2);
    });

    it('should include all required transaction properties', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);
      const transaction = simulation.transactions[0];

      expect(transaction.id).toBeDefined();
      expect(transaction.templateId).toBeDefined();
      expect(transaction.transactionNumber).toBeDefined();
      expect(transaction.sender).toBeDefined();
      expect(transaction.message).toBeDefined();
      expect(transaction.generatedAmounts).toBeDefined();
      expect(transaction.correctAnswer).toBeDefined();
      expect(transaction.correctAnswer.length).toBeGreaterThan(0);
      expect(transaction.hints).toBeDefined();
      expect(transaction.hints).toHaveLength(3);
    });
  });

  describe('amount mismatch feature', () => {
    it('should not create mismatch when allowAmountMismatch is false', () => {
      const generator = new SimulationGenerator('test-seed');
      const simulation = generator.generateSimulation('user1', [mockPool], mockConfig);

      expect(simulation.transactions[0].hasAmountMismatch).toBeFalsy();
      expect(simulation.transactions[0].displayAmount).toBeUndefined();
    });

    it('should create predictable mismatches with same seed', () => {
      const poolWithMismatch: TransactionPool = {
        ...mockPool,
        templates: mockPool.templates.map((t) => ({
          ...t,
          allowAmountMismatch: true,
          attachment: { type: 'html', filename: 'test.html' },
        })),
      };

      const seed = 'mismatch-seed';
      const gen1 = new SimulationGenerator(seed);
      const gen2 = new SimulationGenerator(seed);

      const sim1 = gen1.generateSimulation('user1', [poolWithMismatch], mockConfig);
      const sim2 = gen2.generateSimulation('user1', [poolWithMismatch], mockConfig);

      const tx1 = sim1.transactions[0];
      const tx2 = sim2.transactions[0];

      // If mismatch is generated, it should be identical
      expect(tx1.hasAmountMismatch).toBe(tx2.hasAmountMismatch);
      if (tx1.hasAmountMismatch) {
        expect(tx1.displayAmount).toBe(tx2.displayAmount);
        expect(tx1.actualAmount).toBe(tx2.actualAmount);
      }
    });
  });
});
