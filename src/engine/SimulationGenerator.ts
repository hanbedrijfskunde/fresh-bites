import seedrandom from 'seedrandom';
import type {
  JournalEntryTemplate,
  Simulation,
  SimulationConfig,
  TransactionPool,
  TransactionTemplate,
  GeneratedTransaction,
  JournalEntry,
  AmountRange,
  Hint,
} from '@/types';
import {
  generateWholesaleReceipt,
  generateSupplierInvoice,
  generateCateringInvoice,
  generateEquipmentInvoice,
  generateRepairInvoice,
} from '@/utils/receiptGenerator';

export class SimulationGenerator {
  private rng: seedrandom.PRNG;

  constructor(private seed: string) {
    this.rng = seedrandom(seed);
  }

  /**
   * Generate a complete simulation with randomized transactions
   */
  public generateSimulation(
    userId: string,
    pools: TransactionPool[],
    config: SimulationConfig
  ): Simulation {
    // Select templates from each pool
    const selectedTemplates: TransactionTemplate[] = [];
    for (const pool of pools) {
      const template = this.selectTemplate(pool.templates);
      selectedTemplates.push(template);
    }

    // Determine which transactions should have amount mismatches
    const mismatchIndices = this.selectTransactionsForMismatch(selectedTemplates);

    // Generate transactions
    const transactions: GeneratedTransaction[] = [];
    for (let i = 0; i < selectedTemplates.length; i++) {
      const template = selectedTemplates[i];
      const hasMismatch = mismatchIndices.has(i);
      const transaction = this.generateTransaction(template, i + 1, config, hasMismatch);
      transactions.push(transaction);
    }

    return {
      id: this.generateId(),
      seed: this.seed,
      userId,
      createdAt: new Date(),
      config,
      transactions,
    };
  }

  /**
   * Select a random template from pool
   */
  private selectTemplate(templates: TransactionTemplate[]): TransactionTemplate {
    const index = Math.floor(this.rng() * templates.length);
    return templates[index];
  }

  /**
   * Determine which transactions should have amount mismatches
   * Returns a Set of transaction indices (0-based) that should have mismatches
   */
  private selectTransactionsForMismatch(templates: TransactionTemplate[]): Set<number> {
    // Filter templates that are eligible for amount mismatch
    const eligibleIndices = templates
      .map((t, idx) => ({ t, idx }))
      .filter(({ t }) => t.allowAmountMismatch && t.attachment?.type === 'html')
      .map(({ idx }) => idx);

    if (eligibleIndices.length === 0) {
      return new Set();
    }

    // Use seeded random to determine count (1 or 2)
    const countRng = seedrandom(`${this.seed}-mismatch-count`);
    const mismatchCount = countRng() < 0.5 ? 1 : 2;

    // Shuffle eligible indices using seeded random
    const selectRng = seedrandom(`${this.seed}-mismatch-select`);
    const shuffled = [...eligibleIndices].sort(() => selectRng() - 0.5);

    // Select first N indices
    const selected = new Set<number>();
    for (let i = 0; i < Math.min(mismatchCount, shuffled.length); i++) {
      selected.add(shuffled[i]);
    }

    return selected;
  }

  /**
   * Generate an amount mismatch (difference between chat and receipt amounts)
   * Returns the display amount (chat) and the difference
   */
  private generateAmountMismatch(
    actualAmount: number,
    transactionNumber: number
  ): { displayAmount: number; difference: number } {
    // Use seeded random for consistent generation
    const rng = seedrandom(`${this.seed}-tx${transactionNumber}-mismatch`);

    // Random difference between €10-€50 in steps of €10
    const minDiff = 10;
    const maxDiff = 50;
    const step = 10;
    const steps = (maxDiff - minDiff) / step;
    const difference = minDiff + Math.floor(rng() * (steps + 1)) * step;

    // Random direction: positive (chat > receipt) or negative (chat < receipt)
    const direction = rng() < 0.5 ? 1 : -1;
    const actualDifference = difference * direction;

    const displayAmount = actualAmount + actualDifference;

    return { displayAmount, difference: actualDifference };
  }

  /**
   * Generate a transaction instance from template
   */
  private generateTransaction(
    template: TransactionTemplate,
    transactionNumber: number,
    _config: SimulationConfig,
    hasMismatch: boolean = false
  ): GeneratedTransaction {
    // Generate actual amount (the correct amount on the receipt)
    const actualAmount = this.generateAmount(template.amountRange);

    // Generate display amount (shown in chat - may differ from actual)
    let displayAmount = actualAmount;
    let mismatchDetails;

    if (hasMismatch) {
      const mismatch = this.generateAmountMismatch(actualAmount, transactionNumber);
      displayAmount = mismatch.displayAmount;
      mismatchDetails = {
        chatAmount: displayAmount,
        receiptAmount: actualAmount,
        difference: mismatch.difference,
      };
    }

    // Generate partial payment (use actualAmount for correct calculation)
    let partial: number | undefined;
    if (template.partialPaymentRange) {
      const percentage = this.generateAmount(template.partialPaymentRange) / 100;
      partial = this.roundToNearestTen(actualAmount * percentage);
    }

    // Fill in message template with DISPLAY amount (possibly incorrect)
    const message = this.fillTemplate(template.messageTemplate, { amount: displayAmount, partial });

    // Generate correct answer using ACTUAL amount (always correct)
    const correctAnswer = this.generateCorrectAnswer(template.correctAnswerTemplate, {
      amount: actualAmount,
      partial,
    });

    // Fill hints with ACTUAL amount (hints should guide to correct answer)
    const hints = this.fillHints(template.hints, { amount: actualAmount, partial });

    // Generate dynamic HTML attachment with ACTUAL amounts (correct values on receipt)
    let attachment = template.attachment;
    if (template.attachment && template.attachment.type === 'html') {
      const transactionDate = new Date();
      let htmlContent = '';

      switch (template.id) {
        case 'a1_voorraad_contant':
          htmlContent = generateWholesaleReceipt(actualAmount, transactionDate);
          break;
        case 'a2_voorraad_rekening':
          htmlContent = generateSupplierInvoice(actualAmount, transactionDate);
          break;
        case 'b1_verkoop_factuur':
        case 'b2_verkoop_contant':
          htmlContent = generateCateringInvoice(actualAmount, transactionDate);
          break;
        case 'd1_inventaris_split':
          htmlContent = generateEquipmentInvoice(actualAmount, partial!, transactionDate);
          break;
        case 'd2_reparatie_split':
          htmlContent = generateRepairInvoice(actualAmount, partial!, transactionDate);
          break;
        default:
          htmlContent = '';
      }

      attachment = {
        ...template.attachment,
        htmlContent,
      };
    }

    return {
      id: this.generateId(),
      templateId: template.id,
      transactionNumber,
      timeSlot: template.poolId.replace('pool_', '').toUpperCase(),
      sender: template.sender,
      message,
      attachment,
      generatedAmounts: { amount: actualAmount, partial },
      correctAnswer,
      hints,
      feedbackCorrect: template.feedbackCorrect,
      feedbackIncorrect: template.feedbackIncorrect,
      hasAmountMismatch: hasMismatch,
      displayAmount: hasMismatch ? displayAmount : undefined,
      actualAmount,
      mismatchDetails,
    };
  }

  /**
   * Generate random amount within range
   */
  private generateAmount(range: AmountRange): number {
    if (range.min === 0 && range.max === 0) return 0;

    const steps = (range.max - range.min) / range.step;
    const randomStep = Math.floor(this.rng() * (steps + 1));
    return range.min + randomStep * range.step;
  }

  /**
   * Round to nearest 10 for partial payments
   */
  private roundToNearestTen(value: number): number {
    return Math.round(value / 10) * 10;
  }

  /**
   * Fill template string with values
   */
  private fillTemplate(template: string, values: Record<string, number | undefined>): string {
    let result = template;

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        result = result.replace(regex, value.toString());
      }
    }

    return result;
  }

  /**
   * Generate correct journal entries from template
   */
  private generateCorrectAnswer(
    templates: JournalEntryTemplate[],
    values: Record<string, number | undefined>
  ): JournalEntry[] {
    return templates.map((template) => ({
      account: template.account,
      debit: template.debitFormula ? this.evaluateFormula(template.debitFormula, values) : null,
      credit: template.creditFormula ? this.evaluateFormula(template.creditFormula, values) : null,
    }));
  }

  /**
   * Evaluate formula string with values
   */
  private evaluateFormula(
    formula: string,
    values: Record<string, number | undefined>
  ): number {
    let expression = formula;

    // Replace variable names with their values
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, value.toString());
      }
    }

    try {
      // Safely evaluate simple arithmetic expressions
      // This handles: "amount", "partial", "amount - partial"
      // eslint-disable-next-line no-eval
      const result = eval(expression);
      return typeof result === 'number' ? result : 0;
    } catch (error) {
      console.error('Formula evaluation error:', formula, error);
      return 0;
    }
  }

  /**
   * Fill hint templates with values
   */
  private fillHints(hints: Hint[], values: Record<string, number | undefined>): Hint[] {
    return hints.map((hint) => ({
      ...hint,
      text: this.fillTemplate(hint.text, values),
    }));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
