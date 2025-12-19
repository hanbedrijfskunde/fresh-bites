// ============================================================================
// STATIC CONFIGURATION (Content)
// ============================================================================

export type AccountType = 'activa' | 'passiva' | 'kosten' | 'opbrengsten';
export type AccountCategory = 'debit' | 'credit';
export type CommunicationStyle = 'informal' | 'formal' | 'neutral';
export type AttachmentType = 'html' | 'image';
export type HintLevel = 1 | 2 | 3;
export type Complexity = 'basic' | 'medium' | 'advanced';
export type FormulaString = string; // "amount" | "partial" | "amount - partial" | null

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string; // Emoji or URL
  communicationStyle: CommunicationStyle;
}

export interface Attachment {
  type: AttachmentType;
  filename: string;
  url?: string; // For images only
  htmlContent?: string; // For dynamic HTML receipts
}

export interface AmountRange {
  min: number;
  max: number;
  step: number;
}

export interface Hint {
  level: HintLevel;
  text: string;
}

export interface FeedbackTemplate {
  message: string;
  characterQuote?: string;
}

export interface JournalEntryTemplate {
  account: Account;
  debitFormula: FormulaString | null;
  creditFormula: FormulaString | null;
}

/**
 * A template for generating transaction instances
 */
export interface TransactionTemplate {
  id: string;
  poolId: string;
  sender: Character;
  messageTemplate: string; // e.g., "Gekocht voor €{amount}, betaald €{partial} contant"
  attachment?: Attachment;

  // Randomization config
  amountRange: AmountRange;
  partialPaymentRange?: AmountRange; // For split payments

  // Correct answer generation
  correctAnswerTemplate: JournalEntryTemplate[];

  // Feedback & hints
  hints: Hint[];
  feedbackCorrect: FeedbackTemplate;
  feedbackIncorrect: FeedbackTemplate;

  // Difficulty metadata
  complexity: Complexity;
  requiresMultipleRows: boolean;

  // Amount mismatch feature (for training double-checking)
  allowAmountMismatch?: boolean; // Can this transaction have a chat/receipt amount difference?
}

export interface TransactionPool {
  id: string;
  timeSlot: string; // e.g., "08:30"
  label: string; // e.g., "Ochtend inkoop"
  templates: TransactionTemplate[];
}

// ============================================================================
// RUNTIME / GENERATED DATA
// ============================================================================

export interface JournalEntry {
  account: Account;
  debit: number | null;
  credit: number | null;
}

/**
 * A transaction instance generated for a specific simulation run
 */
export interface GeneratedTransaction {
  id: string; // Unique ID for this instance
  templateId: string; // Reference to source template
  transactionNumber: number; // 1-6
  timeSlot: string; // e.g., "08:32"
  sender: Character;

  // Generated content
  message: string; // Template with values filled in
  attachment?: Attachment;

  // Generated amounts
  generatedAmounts: {
    amount: number;
    partial?: number; // For split payments
  };

  // Computed correct answer
  correctAnswer: JournalEntry[];

  // Feedback & hints (copied from template)
  hints: Hint[];
  feedbackCorrect: FeedbackTemplate;
  feedbackIncorrect: FeedbackTemplate;

  // Amount mismatch feature (for training double-checking)
  hasAmountMismatch: boolean; // Does this transaction have a chat/receipt amount difference?
  displayAmount?: number; // Amount shown in chat message (differs from actual)
  actualAmount: number; // Actual amount on receipt/invoice (correct answer uses this)
  mismatchDetails?: {
    chatAmount: number;
    receiptAmount: number;
    difference: number; // Positive means chat > receipt, negative means chat < receipt
  };
}

export interface SimulationConfig {
  // Future configuration options can be added here
}

/**
 * Complete simulation instance for a user
 */
export interface Simulation {
  id: string;
  seed: string; // For reproducibility
  userId: string; // Student identifier
  createdAt: Date;

  config: SimulationConfig;
  transactions: GeneratedTransaction[];
}

// ============================================================================
// USER PROGRESS / SESSION STATE
// ============================================================================

export type SimulationStatus = 'not_started' | 'in_progress' | 'completed';
export type TransactionStatus = 'locked' | 'active' | 'completed';

export interface TransactionProgress {
  transactionId: string;
  status: TransactionStatus;

  attempts: number; // 0-3
  hintsUsed: number; // 0-3
  hintsViewed: HintLevel[]; // Which hint levels viewed [1,2]

  currentEntry: JournalEntry[]; // User's current input
  isCorrect: boolean | null; // null = not submitted yet

  starsEarned: number; // 0, 0.5, or 1
  completedAt?: Date;
}

export interface UserProgress {
  simulationId: string;
  userId: string;
  seed: string;

  // Progress tracking
  currentTransactionIndex: number; // 0-5
  status: SimulationStatus;

  // Performance metrics
  stars: number; // 0-6
  totalScore: number; // Decimal for intermediate scoring

  // Per-transaction state
  transactionProgress: {
    [transactionId: string]: TransactionProgress;
  };

  // Session management
  startedAt?: Date;
  completedAt?: Date;
  lastSavedAt: Date;
}

// ============================================================================
// VALIDATION
// ============================================================================

export type ValidationErrorType =
  | 'NOT_BALANCED'
  | 'INCORRECT_ENTRY'
  | 'MISSING_ENTRY'
  | 'EXTRA_ENTRIES'
  | 'EMPTY_ENTRY'
  | 'AMOUNT_MISMATCH';

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  affectedRowIndex?: number;
}

export interface EntryMatchResult {
  userEntry: JournalEntry;
  expectedEntry?: JournalEntry; // If this should match something
  isCorrect: boolean;
  issues: string[]; // e.g., ["Wrong account", "Debit should be credit"]
}

export interface BalanceCheck {
  isBalanced: boolean;
  debitTotal: number;
  creditTotal: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];

  // Detailed feedback
  balanceCheck: BalanceCheck;
  entryMatches: EntryMatchResult[];
}

// ============================================================================
// UI STATE
// ============================================================================

export type ScreenType = 'welcome' | 'simulation' | 'end';
export type ModalType = 'none' | 'feedback' | 'attachment' | 'hint';

export interface JournalRowState {
  id: string;
  accountId: string | null;
  debitValue: string; // String for input control
  creditValue: string;

  // UI feedback
  hasError: boolean;
  errorMessage?: string;
}

export interface FeedbackModalData {
  isCorrect: boolean;
  message: string;
  characterQuote?: string;
  starsEarned: number;
  currentAttempt: number;
  maxAttempts: number;
  showSolution: boolean;
  solution?: JournalEntry[];
  validationResult?: ValidationResult; // Include validation errors for display
}

export interface AttachmentModalData {
  filename: string;
  url?: string;
  type: AttachmentType;
  htmlContent?: string;
}

export interface HintModalData {
  level: HintLevel;
  text: string;
  starPenalty: number;
}

export type ModalData =
  | { type: 'feedback'; content: FeedbackModalData }
  | { type: 'attachment'; content: AttachmentModalData }
  | { type: 'hint'; content: HintModalData }
  | { type: 'none'; content: null };

export interface UIState {
  // Screen navigation
  currentScreen: ScreenType;

  // Modals
  activeModal: ModalData;

  // Journal table
  journalRows: JournalRowState[];

  // Interaction state
  isSubmitting: boolean;
  canSubmit: boolean;
  showValidationErrors: boolean;
}

// ============================================================================
// PERFORMANCE & SCORING
// ============================================================================

export type PerformanceLevel = 'excellent' | 'good' | 'pass' | 'needs_improvement';

export interface PerformanceResult {
  level: PerformanceLevel;
  message: string;
}

export interface SimulationStatistics {
  totalTransactions: number;
  correctCount: number;
  firstTryCorrect: number;
  hintsUsed: number;
}

// ============================================================================
// STORE STATE
// ============================================================================

export interface SimulationStore {
  // Current simulation
  simulation: Simulation | null;
  userProgress: UserProgress | null;

  // UI state
  currentScreen: ScreenType;
  activeModal: ModalData;

  // Actions
  initializeSimulation: (
    userId: string,
    seed?: string,
    config?: Partial<SimulationConfig>
  ) => void;
  loadSimulation: (simulation: Simulation, progress: UserProgress) => void;

  // Transaction actions
  startTransaction: (transactionId: string) => void;
  submitAnswer: (transactionId: string, entry: JournalEntry[]) => ValidationResult;
  useHint: (transactionId: string, level: HintLevel) => void;
  completeTransaction: (transactionId: string, isCorrect: boolean) => void;

  // Navigation
  goToScreen: (screen: ScreenType) => void;
  showModal: (modal: ModalData) => void;
  closeModal: () => void;

  // Persistence
  saveProgress: () => void;
  resetSimulation: () => void;
}
