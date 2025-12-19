# Technical Design Document (TDD)

## FreshBites: Een Dag als Boekhouder

**Versie:** 1.0
**Datum:** 18 december 2024
**Status:** Draft
**Auteur:** Technical Team

---

## 1. Executive Summary

Dit document beschrijft de technische architectuur en implementatie van FreshBites, een webgebaseerde leersimulatie voor boekhoudonderwijs. Het systeem genereert gerandomiseerde transacties, valideert journaalposten in real-time, en biedt adaptieve feedback binnen een chat-gebaseerde interface.

### 1.1 Technische Scope

**MVP (v1.0):**
- Client-side React applicatie met TypeScript
- Deterministische randomisatie met seeding
- Real-time validatie en timer systeem
- LocalStorage voor sessie persistentie
- Responsive design (desktop/tablet prioriteit)

**Out of Scope voor MVP:**
- Backend API / database
- Multi-user / docent dashboard
- LMS integratie
- Authenticatie

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │◄─┤  State Mgmt  │◄─┤  Game Engine │          │
│  │  Components  │  │   (Zustand)  │  │   (Core)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                  │                  │
│         │                 │                  ▼                  │
│         │                 │         ┌──────────────┐            │
│         │                 │         │ Validation   │            │
│         │                 │         │   Engine     │            │
│         │                 │         └──────────────┘            │
│         │                 │                  │                  │
│         │                 ▼                  ▼                  │
│         │         ┌──────────────────────────────┐              │
│         │         │   LocalStorage Persistence   │              │
│         │         └──────────────────────────────┘              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │          Static Assets & Content                 │          │
│  │  (Transaction Templates, Attachments, Hints)     │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | React | 18.x | Component-based, excellent ecosystem |
| **Language** | TypeScript | 5.x | Type safety, better DX, catches errors early |
| **Build Tool** | Vite | 5.x | Fast HMR, modern build tool |
| **Styling** | Tailwind CSS | 3.x | Rapid development, consistent design system |
| **State Management** | Zustand | 4.x | Lightweight, simple API, TypeScript support |
| **Routing** | React Router | 6.x | Standard routing solution |
| **Forms** | React Hook Form | 7.x | Performance, minimal re-renders |
| **Testing** | Vitest + RTL | Latest | Fast, Vite-native, React testing |
| **E2E Testing** | Playwright | Latest | Reliable, cross-browser |
| **Linting** | ESLint + Prettier | Latest | Code quality, consistent formatting |
| **Random Generation** | seedrandom | 3.x | Deterministic randomization |
| **Date/Time** | date-fns | 3.x | Lightweight, tree-shakeable |
| **Hosting** | Vercel | N/A | Zero-config, automatic deploys |

---

## 3. Data Models

### 3.1 Core Domain Models

```typescript
// ============================================================================
// STATIC CONFIGURATION (Content)
// ============================================================================

/**
 * A template for generating transaction instances
 */
interface TransactionTemplate {
  id: string;
  poolId: string; // Which time slot this belongs to
  sender: Character;
  messageTemplate: string; // e.g., "Gekocht voor €{amount}, betaald €{partial} contant"
  attachment?: Attachment;

  // Randomization config
  amountRange: AmountRange;
  partialPaymentRange?: AmountRange; // For split payments

  // Correct answer generation
  correctAnswerTemplate: JournalEntryTemplate[];

  // Feedback & hints
  hints: HintLevel[];
  feedbackCorrect: FeedbackTemplate;
  feedbackIncorrect: FeedbackTemplate;

  // Difficulty metadata
  complexity: 'basic' | 'medium' | 'advanced';
  requiresMultipleRows: boolean;
}

interface JournalEntryTemplate {
  account: Account;
  debitFormula: FormulaString | null;  // e.g., "amount", "partial", "amount - partial"
  creditFormula: FormulaString | null;
}

type FormulaString = string; // "amount" | "partial" | "amount - partial" | null

interface AmountRange {
  min: number;      // e.g., 250
  max: number;      // e.g., 600
  step: number;     // e.g., 50
}

interface TransactionPool {
  id: string;
  timeSlot: string;         // e.g., "08:30"
  label: string;            // e.g., "Ochtend inkoop"
  templates: TransactionTemplate[];
}

interface Character {
  id: string;
  name: string;             // e.g., "Chef Mo"
  role: string;             // e.g., "Kok"
  avatar: string;           // Emoji or URL
  communicationStyle: 'informal' | 'formal' | 'neutral';
}

interface Account {
  id: string;
  name: string;             // e.g., "Voorraad", "Kas"
  type: AccountType;
  category: 'debit' | 'credit'; // Normal balance
}

type AccountType = 'activa' | 'passiva' | 'kosten' | 'opbrengsten';

interface Attachment {
  type: 'pdf' | 'image';
  filename: string;
  url: string; // Can be data URL or path to static asset
}

interface HintLevel {
  level: 1 | 2 | 3;
  text: string;
}

interface FeedbackTemplate {
  message: string;
  characterQuote?: string;  // Optional quote from character
}

// ============================================================================
// RUNTIME / GENERATED DATA
// ============================================================================

/**
 * A transaction instance generated for a specific simulation run
 */
interface GeneratedTransaction {
  id: string;                          // Unique ID for this instance
  templateId: string;                  // Reference to source template
  transactionNumber: number;           // 1-6
  timeSlot: string;                    // e.g., "08:32"
  sender: Character;

  // Generated content
  message: string;                     // Template with values filled in
  attachment?: Attachment;

  // Generated amounts
  generatedAmounts: {
    amount: number;
    partial?: number;                  // For split payments
  };

  // Computed correct answer
  correctAnswer: JournalEntry[];

  // Feedback & hints (copied from template)
  hints: HintLevel[];
  feedbackCorrect: FeedbackTemplate;
  feedbackIncorrect: FeedbackTemplate;

  // Timer configuration
  timeLimit: number;                   // Seconds, 0 = no limit
}

interface JournalEntry {
  account: Account;
  debit: number | null;
  credit: number | null;
}

/**
 * Complete simulation instance for a user
 */
interface Simulation {
  id: string;
  seed: string;                        // For reproducibility
  userId: string;                      // Student identifier
  createdAt: Date;

  config: SimulationConfig;
  transactions: GeneratedTransaction[];
}

interface SimulationConfig {
  relaxedMode: boolean;                // Extended time limits
  relaxedMultiplier: number;           // Default: 1.75

  transactionTimeLimits: {
    [transactionNumber: number]: number; // Seconds
  };

  timerWarningThreshold: number;       // Default: 30 seconds
  timerCriticalThreshold: number;      // Default: 10 seconds
}

// ============================================================================
// USER PROGRESS / SESSION STATE
// ============================================================================

interface UserProgress {
  simulationId: string;
  userId: string;
  seed: string;

  // Progress tracking
  currentTransactionIndex: number;     // 0-5
  status: 'not_started' | 'in_progress' | 'completed';

  // Performance metrics
  stars: number;                       // 0-6
  totalScore: number;                  // Decimal for intermediate scoring

  // Per-transaction state
  transactionProgress: {
    [transactionId: string]: TransactionProgress;
  };

  // Timing
  startedAt?: Date;
  completedAt?: Date;
  totalTimeSpent: number;              // Seconds

  // Session management
  lastSavedAt: Date;
}

interface TransactionProgress {
  transactionId: string;
  status: 'locked' | 'active' | 'completed';

  attempts: number;                    // 0-3
  hintsUsed: number;                   // 0-3
  hintsViewed: number[];               // Which hint levels viewed [1,2]

  timeRemaining: number | null;        // Seconds, null if no limit
  timeExpired: boolean;

  currentEntry: JournalEntry[];        // User's current input
  isCorrect: boolean | null;           // null = not submitted yet

  starsEarned: number;                 // 0, 0.5, or 1
  completedAt?: Date;
}

// ============================================================================
// VALIDATION
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];

  // Detailed feedback
  balanceCheck: {
    isBalanced: boolean;
    debitTotal: number;
    creditTotal: number;
  };

  entryMatches: EntryMatchResult[];
}

interface ValidationError {
  type: 'NOT_BALANCED' | 'INCORRECT_ENTRY' | 'MISSING_ENTRY' | 'EXTRA_ENTRIES' | 'EMPTY_ENTRY';
  message: string;
  affectedRowIndex?: number;
}

interface EntryMatchResult {
  userEntry: JournalEntry;
  expectedEntry?: JournalEntry;       // If this should match something
  isCorrect: boolean;
  issues: string[];                   // e.g., ["Wrong account", "Debit should be credit"]
}

// ============================================================================
// UI STATE
// ============================================================================

interface UIState {
  // Screen navigation
  currentScreen: 'welcome' | 'simulation' | 'end';

  // Modals
  activeModal: 'none' | 'feedback' | 'attachment' | 'hint';
  modalData: ModalData | null;

  // Journal table
  journalRows: JournalRowState[];

  // Interaction state
  isSubmitting: boolean;
  canSubmit: boolean;
  showValidationErrors: boolean;
}

interface JournalRowState {
  id: string;
  accountId: string | null;
  debitValue: string;                 // String for input control
  creditValue: string;

  // UI feedback
  hasError: boolean;
  errorMessage?: string;
}

interface ModalData {
  type: 'feedback' | 'attachment' | 'hint';
  content: FeedbackModalData | AttachmentModalData | HintModalData;
}

interface FeedbackModalData {
  isCorrect: boolean;
  message: string;
  characterQuote?: string;
  starsEarned: number;
  currentAttempt: number;
  maxAttempts: number;
  showSolution: boolean;
  solution?: JournalEntry[];
}

interface AttachmentModalData {
  filename: string;
  url: string;
  type: 'pdf' | 'image';
}

interface HintModalData {
  level: 1 | 2 | 3;
  text: string;
  starPenalty: number;
}

// ============================================================================
// TIMER
// ============================================================================

interface TimerState {
  transactionId: string;
  timeLimit: number;                   // Total seconds
  timeRemaining: number;               // Current seconds
  isRunning: boolean;
  isPaused: boolean;                   // Future: pause capability

  status: 'normal' | 'warning' | 'critical' | 'expired';

  startedAt?: Date;
  pausedAt?: Date;
}
```

### 3.2 Content Data Structure

**File: `/src/data/accounts.ts`**
```typescript
export const ACCOUNTS: Account[] = [
  { id: 'kas', name: 'Kas', type: 'activa', category: 'debit' },
  { id: 'bank', name: 'Bank', type: 'activa', category: 'debit' },
  { id: 'debiteuren', name: 'Debiteuren', type: 'activa', category: 'debit' },
  { id: 'voorraad', name: 'Voorraad', type: 'activa', category: 'debit' },
  { id: 'inventaris', name: 'Inventaris', type: 'activa', category: 'debit' },
  { id: 'crediteuren', name: 'Crediteuren', type: 'passiva', category: 'credit' },
  { id: 'omzet', name: 'Omzet', type: 'opbrengsten', category: 'credit' },
  { id: 'inkoopwaarde', name: 'Inkoopwaarde omzet', type: 'kosten', category: 'debit' },
  { id: 'huurkosten', name: 'Huurkosten', type: 'kosten', category: 'debit' },
  { id: 'loonkosten', name: 'Loonkosten', type: 'kosten', category: 'debit' },
  { id: 'overige_kosten', name: 'Overige kosten', type: 'kosten', category: 'debit' },
  { id: 'afschrijvingskosten', name: 'Afschrijvingskosten', type: 'kosten', category: 'debit' },
];
```

**File: `/src/data/characters.ts`**
```typescript
export const CHARACTERS: Record<string, Character> = {
  chef_mo: {
    id: 'chef_mo',
    name: 'Chef Mo',
    role: 'Kok',
    avatar: '👨‍🍳',
    communicationStyle: 'informal',
  },
  fatima: {
    id: 'fatima',
    name: 'Fatima',
    role: 'Eigenaar',
    avatar: '👩‍💼',
    communicationStyle: 'formal',
  },
  system: {
    id: 'system',
    name: 'Systeem',
    role: 'Notificatie',
    avatar: '🔔',
    communicationStyle: 'neutral',
  },
};
```

**File: `/src/data/transaction-pools.ts`**
```typescript
export const TRANSACTION_POOLS: TransactionPool[] = [
  {
    id: 'pool_a',
    timeSlot: '08:30',
    label: 'Ochtend inkoop',
    templates: [
      {
        id: 'a1_voorraad_contant',
        poolId: 'pool_a',
        sender: CHARACTERS.chef_mo,
        messageTemplate: 'Hey! Net €{amount} aan verse ingrediënten gekocht bij de groothandel. Heb contant betaald uit de kas. Kun je dit even boeken? 🥬🍅',
        attachment: {
          type: 'pdf',
          filename: 'Kassabon_groothandel.pdf',
          url: '/assets/attachments/receipt_wholesale.pdf',
        },
        amountRange: { min: 250, max: 600, step: 50 },
        correctAnswerTemplate: [
          { account: ACCOUNTS[3], debitFormula: 'amount', creditFormula: null },
          { account: ACCOUNTS[0], debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          { level: 1, text: 'Je koopt iets (voorraad neemt toe) en betaalt contant (kas neemt af). Welke kant is debet, welke credit?' },
          { level: 2, text: 'Gebruik de rekeningen "Voorraad" en "Kas". Voorraad is een actief, dus toename = debet.' },
          { level: 3, text: 'Voorraad €{amount} debet, Kas €{amount} credit.' },
        ],
        feedbackCorrect: {
          message: 'Goed geboekt!',
          characterQuote: 'Top, dan weet ik dat de administratie klopt als ik boodschappen doe! 👍',
        },
        feedbackIncorrect: {
          message: 'Dat klopt nog niet helemaal.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
      {
        id: 'a2_voorraad_rekening',
        poolId: 'pool_a',
        sender: CHARACTERS.chef_mo,
        messageTemplate: 'Morgen! Ingrediënten besteld voor €{amount}. Betalen we volgende week aan de leverancier.',
        amountRange: { min: 300, max: 700, step: 50 },
        correctAnswerTemplate: [
          { account: ACCOUNTS[3], debitFormula: 'amount', creditFormula: null },
          { account: ACCOUNTS[5], debitFormula: null, creditFormula: 'amount' },
        ],
        hints: [
          { level: 1, text: 'Je ontvangt voorraad (toename actief) maar betaalt nog niet. Wat voor schuld ontstaat er?' },
          { level: 2, text: 'Gebruik "Voorraad" (debet) en "Crediteuren" (credit).' },
          { level: 3, text: 'Voorraad €{amount} debet, Crediteuren €{amount} credit.' },
        ],
        feedbackCorrect: {
          message: 'Perfect!',
          characterQuote: 'Crediteuren, dat is de leverancier waar we nog aan moeten betalen toch? 📝',
        },
        feedbackIncorrect: {
          message: 'Niet helemaal correct.',
        },
        complexity: 'basic',
        requiresMultipleRows: false,
      },
    ],
  },
  // Additional pools defined similarly...
];
```

---

## 4. Core Engine Logic

### 4.1 Simulation Generator

**File: `/src/engine/SimulationGenerator.ts`**

```typescript
import seedrandom from 'seedrandom';

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
    const transactions: GeneratedTransaction[] = [];

    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      const template = this.selectTemplate(pool.templates);
      const transaction = this.generateTransaction(template, i + 1, config);
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
   * Generate a transaction instance from template
   */
  private generateTransaction(
    template: TransactionTemplate,
    transactionNumber: number,
    config: SimulationConfig
  ): GeneratedTransaction {
    // Generate amounts
    const amount = this.generateAmount(template.amountRange);
    let partial: number | undefined;

    if (template.partialPaymentRange) {
      const percentage = this.generateAmount(template.partialPaymentRange) / 100;
      partial = this.roundToNearestTen(amount * percentage);
    }

    // Fill in message template
    const message = this.fillTemplate(template.messageTemplate, { amount, partial });

    // Generate correct answer
    const correctAnswer = this.generateCorrectAnswer(
      template.correctAnswerTemplate,
      { amount, partial }
    );

    // Determine time limit
    const baseLimit = config.transactionTimeLimits[transactionNumber] || 120;
    const timeLimit = config.relaxedMode
      ? Math.round(baseLimit * config.relaxedMultiplier)
      : baseLimit;

    return {
      id: this.generateId(),
      templateId: template.id,
      transactionNumber,
      timeSlot: template.poolId.replace('pool_', '').toUpperCase(), // Format time
      sender: template.sender,
      message,
      attachment: template.attachment,
      generatedAmounts: { amount, partial },
      correctAnswer,
      hints: this.fillHints(template.hints, { amount, partial }),
      feedbackCorrect: template.feedbackCorrect,
      feedbackIncorrect: template.feedbackIncorrect,
      timeLimit,
    };
  }

  /**
   * Generate random amount within range
   */
  private generateAmount(range: AmountRange): number {
    const steps = (range.max - range.min) / range.step;
    const randomStep = Math.floor(this.rng() * (steps + 1));
    return range.min + (randomStep * range.step);
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
  private fillTemplate(template: string, values: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value.toString());
      }
    }
    return result;
  }

  /**
   * Generate correct journal entries from template
   */
  private generateCorrectAnswer(
    templates: JournalEntryTemplate[],
    values: Record<string, any>
  ): JournalEntry[] {
    return templates.map(template => ({
      account: template.account,
      debit: template.debitFormula ? this.evaluateFormula(template.debitFormula, values) : null,
      credit: template.creditFormula ? this.evaluateFormula(template.creditFormula, values) : null,
    }));
  }

  /**
   * Evaluate formula string with values
   */
  private evaluateFormula(formula: string, values: Record<string, any>): number {
    // Simple formula evaluation: "amount", "partial", "amount - partial"
    let result = formula;
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        result = result.replace(new RegExp(key, 'g'), value.toString());
      }
    }

    // Evaluate mathematical expression (safely)
    try {
      return eval(result); // In production, use a safe math evaluator library
    } catch (e) {
      console.error('Formula evaluation error:', formula, e);
      return 0;
    }
  }

  /**
   * Fill hint templates with values
   */
  private fillHints(hints: HintLevel[], values: Record<string, any>): HintLevel[] {
    return hints.map(hint => ({
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
```

### 4.2 Validation Engine

**File: `/src/engine/ValidationEngine.ts`**

```typescript
export class ValidationEngine {
  /**
   * Validate user's journal entry against correct answer
   */
  public validate(
    userEntry: JournalEntry[],
    correctAnswer: JournalEntry[]
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const entryMatches: EntryMatchResult[] = [];

    // Step 1: Check if entries are not empty
    if (userEntry.length === 0 || this.hasEmptyRows(userEntry)) {
      errors.push({
        type: 'EMPTY_ENTRY',
        message: 'Vul minimaal één regel in met rekening en bedrag.',
      });
    }

    // Step 2: Check balance
    const debitTotal = this.calculateTotal(userEntry, 'debit');
    const creditTotal = this.calculateTotal(userEntry, 'credit');
    const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01; // Floating point tolerance

    const balanceCheck = {
      isBalanced,
      debitTotal,
      creditTotal,
    };

    if (!isBalanced) {
      errors.push({
        type: 'NOT_BALANCED',
        message: `Debet (€${debitTotal.toFixed(2)}) is niet gelijk aan credit (€${creditTotal.toFixed(2)}).`,
      });
    }

    // Step 3: Match entries
    const { matches, missingEntries, extraEntries } = this.matchEntries(userEntry, correctAnswer);

    entryMatches.push(...matches);

    if (missingEntries.length > 0) {
      errors.push({
        type: 'MISSING_ENTRY',
        message: `Je mist ${missingEntries.length} regel(s) in je journaalpost.`,
      });
    }

    if (extraEntries.length > 0) {
      errors.push({
        type: 'EXTRA_ENTRIES',
        message: `Je hebt ${extraEntries.length} regel(s) te veel.`,
      });
    }

    // Check individual incorrect entries
    const incorrectMatches = matches.filter(m => !m.isCorrect);
    if (incorrectMatches.length > 0) {
      errors.push({
        type: 'INCORRECT_ENTRY',
        message: `${incorrectMatches.length} regel(s) zijn niet correct.`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      balanceCheck,
      entryMatches,
    };
  }

  /**
   * Check if any rows are empty
   */
  private hasEmptyRows(entries: JournalEntry[]): boolean {
    return entries.some(e =>
      !e.account ||
      (e.debit === null && e.credit === null) ||
      (e.debit === 0 && e.credit === 0)
    );
  }

  /**
   * Calculate total for debit or credit side
   */
  private calculateTotal(entries: JournalEntry[], side: 'debit' | 'credit'): number {
    return entries.reduce((sum, entry) => {
      const value = side === 'debit' ? entry.debit : entry.credit;
      return sum + (value || 0);
    }, 0);
  }

  /**
   * Match user entries against correct answer
   */
  private matchEntries(
    userEntry: JournalEntry[],
    correctAnswer: JournalEntry[]
  ): {
    matches: EntryMatchResult[];
    missingEntries: JournalEntry[];
    extraEntries: JournalEntry[];
  } {
    const matches: EntryMatchResult[] = [];
    const unmatchedCorrect = [...correctAnswer];
    const unmatchedUser = [...userEntry];

    // Find exact matches
    for (let i = unmatchedUser.length - 1; i >= 0; i--) {
      const userRow = unmatchedUser[i];
      const matchIndex = unmatchedCorrect.findIndex(correct =>
        this.entriesMatch(userRow, correct)
      );

      if (matchIndex !== -1) {
        matches.push({
          userEntry: userRow,
          expectedEntry: unmatchedCorrect[matchIndex],
          isCorrect: true,
          issues: [],
        });
        unmatchedCorrect.splice(matchIndex, 1);
        unmatchedUser.splice(i, 1);
      }
    }

    // Analyze remaining unmatched entries
    for (const userRow of unmatchedUser) {
      const issues: string[] = [];
      let closestMatch: JournalEntry | undefined;

      // Try to find what's wrong
      const accountMatch = unmatchedCorrect.find(c => c.account.id === userRow.account.id);
      if (accountMatch) {
        closestMatch = accountMatch;
        if (userRow.debit !== accountMatch.debit) {
          issues.push('Verkeerd debetbedrag');
        }
        if (userRow.credit !== accountMatch.credit) {
          issues.push('Verkeerd creditbedrag');
        }
      } else {
        issues.push('Verkeerde rekening');
      }

      matches.push({
        userEntry: userRow,
        expectedEntry: closestMatch,
        isCorrect: false,
        issues,
      });
    }

    return {
      matches,
      missingEntries: unmatchedCorrect,
      extraEntries: unmatchedUser,
    };
  }

  /**
   * Check if two journal entries match exactly
   */
  private entriesMatch(a: JournalEntry, b: JournalEntry): boolean {
    return (
      a.account.id === b.account.id &&
      Math.abs((a.debit || 0) - (b.debit || 0)) < 0.01 &&
      Math.abs((a.credit || 0) - (b.credit || 0)) < 0.01
    );
  }
}
```

### 4.3 Scoring Engine

**File: `/src/engine/ScoringEngine.ts`**

```typescript
export class ScoringEngine {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly HINT_PENALTY = 0.25;

  /**
   * Calculate stars earned for a transaction
   */
  public calculateStars(
    attempts: number,
    hintsUsed: number,
    timeExpired: boolean,
    isCorrect: boolean
  ): number {
    if (!isCorrect) return 0;

    let stars = 0;

    // Base stars by attempt
    if (attempts === 1) {
      stars = 1.0;
    } else if (attempts === 2) {
      stars = 0.5;
    } else {
      stars = 0; // 3rd attempt = no stars
    }

    // Penalty for hints
    stars -= hintsUsed * ScoringEngine.HINT_PENALTY;

    // Ensure non-negative
    stars = Math.max(0, stars);

    return stars;
  }

  /**
   * Calculate total stars for entire simulation
   */
  public calculateTotalStars(transactionProgress: Record<string, TransactionProgress>): number {
    return Object.values(transactionProgress).reduce(
      (total, progress) => total + progress.starsEarned,
      0
    );
  }

  /**
   * Determine performance level
   */
  public getPerformanceLevel(totalStars: number): {
    level: 'excellent' | 'good' | 'pass' | 'needs_improvement';
    message: string;
  } {
    if (totalStars >= 5.5) {
      return {
        level: 'excellent',
        message: 'Uitstekend werk! Je beheerst journaliseren prima.',
      };
    } else if (totalStars >= 4) {
      return {
        level: 'good',
        message: 'Goed gedaan! Je bent goed op weg.',
      };
    } else if (totalStars >= 3) {
      return {
        level: 'pass',
        message: 'Je hebt de basis onder de knie, blijf oefenen!',
      };
    } else {
      return {
        level: 'needs_improvement',
        message: 'Blijf oefenen, je komt er wel!',
      };
    }
  }

  /**
   * Check if speed bonus should be awarded (display only, doesn't affect score)
   */
  public hasSpeedBonus(timeRemaining: number, timeLimit: number): boolean {
    if (timeLimit === 0) return false; // No time limit
    const timeUsed = timeLimit - timeRemaining;
    const percentageUsed = timeUsed / timeLimit;
    return percentageUsed < 0.5; // Used less than 50% of time
  }
}
```

### 4.4 Timer Manager

**File: `/src/engine/TimerManager.ts`**

```typescript
export class TimerManager {
  private timers: Map<string, TimerState> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start a timer for a transaction
   */
  public startTimer(
    transactionId: string,
    timeLimit: number,
    onTick: (state: TimerState) => void,
    onExpire: () => void
  ): void {
    const state: TimerState = {
      transactionId,
      timeLimit,
      timeRemaining: timeLimit,
      isRunning: true,
      isPaused: false,
      status: 'normal',
      startedAt: new Date(),
    };

    this.timers.set(transactionId, state);

    // Update every second
    const interval = setInterval(() => {
      const currentState = this.timers.get(transactionId);
      if (!currentState || !currentState.isRunning) {
        this.stopTimer(transactionId);
        return;
      }

      currentState.timeRemaining -= 1;

      // Update status based on remaining time
      if (currentState.timeRemaining <= 0) {
        currentState.status = 'expired';
        currentState.isRunning = false;
        this.stopTimer(transactionId);
        onExpire();
      } else if (currentState.timeRemaining <= 10) {
        currentState.status = 'critical';
      } else if (currentState.timeRemaining <= 30) {
        currentState.status = 'warning';
      }

      onTick(currentState);
    }, 1000);

    this.intervals.set(transactionId, interval);
    onTick(state);
  }

  /**
   * Stop a timer
   */
  public stopTimer(transactionId: string): void {
    const interval = this.intervals.get(transactionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(transactionId);
    }

    const state = this.timers.get(transactionId);
    if (state) {
      state.isRunning = false;
    }
  }

  /**
   * Get current timer state
   */
  public getTimerState(transactionId: string): TimerState | null {
    return this.timers.get(transactionId) || null;
  }

  /**
   * Pause timer (future feature)
   */
  public pauseTimer(transactionId: string): void {
    const state = this.timers.get(transactionId);
    if (state) {
      state.isPaused = true;
      state.pausedAt = new Date();
      this.stopTimer(transactionId);
    }
  }

  /**
   * Resume timer (future feature)
   */
  public resumeTimer(
    transactionId: string,
    onTick: (state: TimerState) => void,
    onExpire: () => void
  ): void {
    const state = this.timers.get(transactionId);
    if (state && state.isPaused) {
      state.isPaused = false;
      state.pausedAt = undefined;
      this.startTimer(transactionId, state.timeRemaining, onTick, onExpire);
    }
  }

  /**
   * Clean up all timers
   */
  public cleanup(): void {
    for (const transactionId of this.intervals.keys()) {
      this.stopTimer(transactionId);
    }
    this.timers.clear();
  }
}
```

---

## 5. State Management

### 5.1 Zustand Store Structure

**File: `/src/store/useSimulationStore.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SimulationStore {
  // Current simulation
  simulation: Simulation | null;
  userProgress: UserProgress | null;

  // UI state
  currentScreen: 'welcome' | 'simulation' | 'end';
  activeModal: ModalData | null;

  // Actions
  initializeSimulation: (userId: string, seed?: string, config?: Partial<SimulationConfig>) => void;
  loadSimulation: (simulation: Simulation, progress: UserProgress) => void;

  // Transaction actions
  startTransaction: (transactionId: string) => void;
  submitAnswer: (transactionId: string, entry: JournalEntry[]) => ValidationResult;
  useHint: (transactionId: string, level: number) => void;
  completeTransaction: (transactionId: string, isCorrect: boolean) => void;

  // Navigation
  goToScreen: (screen: 'welcome' | 'simulation' | 'end') => void;
  showModal: (modal: ModalData) => void;
  closeModal: () => void;

  // Persistence
  saveProgress: () => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set, get) => ({
      simulation: null,
      userProgress: null,
      currentScreen: 'welcome',
      activeModal: null,

      initializeSimulation: (userId, seed, config) => {
        const finalSeed = seed || `${userId}-${Date.now()}`;
        const defaultConfig: SimulationConfig = {
          relaxedMode: false,
          relaxedMultiplier: 1.75,
          transactionTimeLimits: {
            1: 180,
            2: 180,
            3: 120,
            4: 120,
            5: 60,
            6: 0,
          },
          timerWarningThreshold: 30,
          timerCriticalThreshold: 10,
          ...config,
        };

        const generator = new SimulationGenerator(finalSeed);
        const simulation = generator.generateSimulation(
          userId,
          TRANSACTION_POOLS,
          defaultConfig
        );

        const userProgress: UserProgress = {
          simulationId: simulation.id,
          userId,
          seed: finalSeed,
          currentTransactionIndex: 0,
          status: 'not_started',
          stars: 0,
          totalScore: 0,
          transactionProgress: {},
          totalTimeSpent: 0,
          lastSavedAt: new Date(),
        };

        // Initialize progress for each transaction
        simulation.transactions.forEach(t => {
          userProgress.transactionProgress[t.id] = {
            transactionId: t.id,
            status: t.transactionNumber === 1 ? 'active' : 'locked',
            attempts: 0,
            hintsUsed: 0,
            hintsViewed: [],
            timeRemaining: t.timeLimit,
            timeExpired: false,
            currentEntry: [],
            isCorrect: null,
            starsEarned: 0,
          };
        });

        set({ simulation, userProgress, currentScreen: 'welcome' });
      },

      loadSimulation: (simulation, progress) => {
        set({ simulation, userProgress: progress });
      },

      startTransaction: (transactionId) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (progress) {
          progress.status = 'active';
          if (!userProgress.startedAt) {
            userProgress.startedAt = new Date();
          }
          userProgress.status = 'in_progress';
          set({ userProgress: { ...userProgress } });
        }
      },

      submitAnswer: (transactionId, entry) => {
        const { simulation, userProgress } = get();
        if (!simulation || !userProgress) {
          return { isValid: false, errors: [], balanceCheck: { isBalanced: false, debitTotal: 0, creditTotal: 0 }, entryMatches: [] };
        }

        const transaction = simulation.transactions.find(t => t.id === transactionId);
        const progress = userProgress.transactionProgress[transactionId];

        if (!transaction || !progress) {
          return { isValid: false, errors: [], balanceCheck: { isBalanced: false, debitTotal: 0, creditTotal: 0 }, entryMatches: [] };
        }

        // Validate
        const validator = new ValidationEngine();
        const result = validator.validate(entry, transaction.correctAnswer);

        // Update progress
        progress.attempts += 1;
        progress.currentEntry = entry;
        progress.isCorrect = result.isValid;

        if (result.isValid) {
          progress.status = 'completed';
          progress.completedAt = new Date();

          // Calculate stars
          const scorer = new ScoringEngine();
          progress.starsEarned = scorer.calculateStars(
            progress.attempts,
            progress.hintsUsed,
            progress.timeExpired,
            true
          );

          userProgress.totalScore += progress.starsEarned;
          userProgress.stars = Math.round(userProgress.totalScore * 2) / 2; // Round to nearest 0.5

          // Unlock next transaction
          const nextIndex = transaction.transactionNumber;
          if (nextIndex < simulation.transactions.length) {
            const nextTransaction = simulation.transactions[nextIndex];
            userProgress.transactionProgress[nextTransaction.id].status = 'active';
            userProgress.currentTransactionIndex = nextIndex;
          } else {
            // Simulation complete
            userProgress.status = 'completed';
            userProgress.completedAt = new Date();
          }
        }

        set({ userProgress: { ...userProgress } });
        get().saveProgress();

        return result;
      },

      useHint: (transactionId, level) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (progress && !progress.hintsViewed.includes(level)) {
          progress.hintsViewed.push(level);
          progress.hintsUsed = progress.hintsViewed.length;
          set({ userProgress: { ...userProgress } });
          get().saveProgress();
        }
      },

      completeTransaction: (transactionId, isCorrect) => {
        const { userProgress } = get();
        if (!userProgress) return;

        const progress = userProgress.transactionProgress[transactionId];
        if (progress) {
          progress.status = 'completed';
          progress.isCorrect = isCorrect;
          progress.completedAt = new Date();
          set({ userProgress: { ...userProgress } });
          get().saveProgress();
        }
      },

      goToScreen: (screen) => {
        set({ currentScreen: screen });
      },

      showModal: (modal) => {
        set({ activeModal: modal });
      },

      closeModal: () => {
        set({ activeModal: null });
      },

      saveProgress: () => {
        const { userProgress } = get();
        if (userProgress) {
          userProgress.lastSavedAt = new Date();
          // Persist is handled by zustand middleware
        }
      },

      resetSimulation: () => {
        set({
          simulation: null,
          userProgress: null,
          currentScreen: 'welcome',
          activeModal: null,
        });
      },
    }),
    {
      name: 'freshbites-simulation',
      partialize: (state) => ({
        simulation: state.simulation,
        userProgress: state.userProgress,
      }),
    }
  )
);
```

---

## 6. Component Implementation

### 6.1 Component Hierarchy

```
src/
├── components/
│   ├── screens/
│   │   ├── WelcomeScreen.tsx
│   │   ├── SimulationScreen.tsx
│   │   └── EndScreen.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ProgressBar.tsx
│   │   └── StarRating.tsx
│   ├── messages/
│   │   ├── MessageList.tsx
│   │   ├── Message.tsx
│   │   ├── MessageBubble.tsx
│   │   └── Avatar.tsx
│   ├── journal/
│   │   ├── JournalTable.tsx
│   │   ├── JournalRow.tsx
│   │   ├── AccountDropdown.tsx
│   │   ├── AmountInput.tsx
│   │   ├── BalanceIndicator.tsx
│   │   └── ActionBar.tsx
│   ├── modals/
│   │   ├── FeedbackModal.tsx
│   │   ├── AttachmentModal.tsx
│   │   └── HintModal.tsx
│   ├── timer/
│   │   └── Timer.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Icon.tsx
```

### 6.2 Key Component Examples

**File: `/src/components/journal/JournalTable.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { JournalRow } from './JournalRow';
import { BalanceIndicator } from './BalanceIndicator';
import { ActionBar } from './ActionBar';
import { useSimulationStore } from '@/store/useSimulationStore';

export const JournalTable: React.FC<{ transactionId: string }> = ({ transactionId }) => {
  const { simulation, userProgress, submitAnswer, showModal } = useSimulationStore();
  const [rows, setRows] = useState<JournalRowState[]>([
    { id: '1', accountId: null, debitValue: '', creditValue: '', hasError: false },
    { id: '2', accountId: null, debitValue: '', creditValue: '', hasError: false },
  ]);

  const transaction = simulation?.transactions.find(t => t.id === transactionId);
  const progress = userProgress?.transactionProgress[transactionId];

  // Calculate balance
  const debitTotal = rows.reduce((sum, r) => sum + (parseFloat(r.debitValue) || 0), 0);
  const creditTotal = rows.reduce((sum, r) => sum + (parseFloat(r.creditValue) || 0), 0);
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01 && debitTotal > 0;

  const canSubmit = isBalanced && rows.some(r => r.accountId !== null);

  const handleAddRow = () => {
    if (rows.length < 4) {
      setRows([...rows, {
        id: Date.now().toString(),
        accountId: null,
        debitValue: '',
        creditValue: '',
        hasError: false,
      }]);
    }
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length > 2) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleRowChange = (id: string, field: keyof JournalRowState, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = () => {
    if (!canSubmit || !transaction) return;

    // Convert rows to JournalEntry format
    const entries: JournalEntry[] = rows
      .filter(r => r.accountId)
      .map(r => ({
        account: ACCOUNTS.find(a => a.id === r.accountId)!,
        debit: parseFloat(r.debitValue) || null,
        credit: parseFloat(r.creditValue) || null,
      }));

    const result = submitAnswer(transactionId, entries);

    // Show feedback modal
    showModal({
      type: 'feedback',
      content: {
        isCorrect: result.isValid,
        message: result.isValid
          ? transaction.feedbackCorrect.message
          : transaction.feedbackIncorrect.message,
        characterQuote: result.isValid
          ? transaction.feedbackCorrect.characterQuote
          : undefined,
        starsEarned: progress?.starsEarned || 0,
        currentAttempt: (progress?.attempts || 0) + 1,
        maxAttempts: 3,
        showSolution: !result.isValid && (progress?.attempts || 0) >= 2,
        solution: !result.isValid && (progress?.attempts || 0) >= 2
          ? transaction.correctAnswer
          : undefined,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Jouw Journaalpost</h3>

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 px-2">
          <div className="col-span-6">Rekening</div>
          <div className="col-span-3 text-right">Debet</div>
          <div className="col-span-3 text-right">Credit</div>
        </div>

        {rows.map(row => (
          <JournalRow
            key={row.id}
            row={row}
            onChange={(field, value) => handleRowChange(row.id, field, value)}
            onRemove={() => handleRemoveRow(row.id)}
            canRemove={rows.length > 2}
          />
        ))}
      </div>

      {rows.length < 4 && (
        <button
          onClick={handleAddRow}
          className="mt-3 text-sm text-primary hover:text-primary-dark font-medium"
        >
          + Regel toevoegen
        </button>
      )}

      <div className="mt-4 pt-4 border-t">
        <BalanceIndicator
          debitTotal={debitTotal}
          creditTotal={creditTotal}
          isBalanced={isBalanced}
        />
      </div>

      <ActionBar
        transactionId={transactionId}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
        attempts={progress?.attempts || 0}
      />
    </div>
  );
};
```

**File: `/src/components/timer/Timer.tsx`**

```typescript
import React, { useEffect, useState } from 'react';
import { TimerManager } from '@/engine/TimerManager';
import { useSimulationStore } from '@/store/useSimulationStore';

const timerManager = new TimerManager();

export const Timer: React.FC<{ transactionId: string; timeLimit: number }> = ({
  transactionId,
  timeLimit,
}) => {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const { submitAnswer, userProgress } = useSimulationStore();

  useEffect(() => {
    if (timeLimit === 0) return; // No timer

    const progress = userProgress?.transactionProgress[transactionId];
    if (!progress || progress.status !== 'active') return;

    timerManager.startTimer(
      transactionId,
      progress.timeRemaining || timeLimit,
      (state) => setTimerState(state),
      () => {
        // Time expired - auto submit current entry
        if (progress.currentEntry.length > 0) {
          submitAnswer(transactionId, progress.currentEntry);
        }
        progress.timeExpired = true;
      }
    );

    return () => {
      timerManager.stopTimer(transactionId);
    };
  }, [transactionId, timeLimit]);

  if (!timerState || timeLimit === 0) return null;

  const minutes = Math.floor(timerState.timeRemaining / 60);
  const seconds = timerState.timeRemaining % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const statusColors = {
    normal: 'text-gray-600',
    warning: 'text-orange-500 animate-pulse',
    critical: 'text-red-600 animate-pulse-fast',
    expired: 'text-red-600',
  };

  return (
    <div className={`flex items-center gap-2 ${statusColors[timerState.status]}`}>
      <span className="text-xl">⏱️</span>
      <span className="font-mono font-semibold text-lg">{display}</span>
    </div>
  );
};
```

---

## 7. Persistence Strategy

### 7.1 LocalStorage Schema

```typescript
// Key: 'freshbites-simulation'
interface PersistedState {
  state: {
    simulation: Simulation;
    userProgress: UserProgress;
  };
  version: number; // For migration support
}
```

### 7.2 Auto-save Strategy

- Save on every significant action:
  - Answer submission
  - Hint usage
  - Transaction completion
- Debounce saves for rapid actions (e.g., typing)
- Include timestamp for last save

### 7.3 Recovery & Validation

```typescript
// On app load
function validateAndRecoverState(persisted: PersistedState): boolean {
  try {
    // Check version compatibility
    if (persisted.version !== CURRENT_VERSION) {
      return migrateState(persisted);
    }

    // Validate structure
    if (!persisted.state.simulation || !persisted.state.userProgress) {
      return false;
    }

    // Validate seed matches
    if (persisted.state.simulation.seed !== persisted.state.userProgress.seed) {
      console.error('Seed mismatch in persisted state');
      return false;
    }

    return true;
  } catch (error) {
    console.error('State validation failed:', error);
    return false;
  }
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Critical Units to Test:**

1. **SimulationGenerator**
   - ✓ Generates consistent transactions with same seed
   - ✓ Respects amount ranges (min/max/step)
   - ✓ Calculates partial payments correctly
   - ✓ Fills templates correctly

2. **ValidationEngine**
   - ✓ Detects imbalanced entries
   - ✓ Matches correct entries
   - ✓ Identifies missing/extra entries
   - ✓ Handles floating point precision

3. **ScoringEngine**
   - ✓ Calculates stars correctly for each attempt
   - ✓ Applies hint penalties
   - ✓ Returns correct performance levels

**Example Test:**

```typescript
import { describe, it, expect } from 'vitest';
import { SimulationGenerator } from '@/engine/SimulationGenerator';

describe('SimulationGenerator', () => {
  it('should generate identical simulations with same seed', () => {
    const seed = 'test-seed-123';
    const gen1 = new SimulationGenerator(seed);
    const gen2 = new SimulationGenerator(seed);

    const sim1 = gen1.generateSimulation('user1', TRANSACTION_POOLS, DEFAULT_CONFIG);
    const sim2 = gen2.generateSimulation('user1', TRANSACTION_POOLS, DEFAULT_CONFIG);

    expect(sim1.transactions[0].generatedAmounts).toEqual(sim2.transactions[0].generatedAmounts);
    expect(sim1.transactions[0].message).toEqual(sim2.transactions[0].message);
  });

  it('should respect amount ranges', () => {
    const gen = new SimulationGenerator('test');
    const range = { min: 100, max: 500, step: 50 };

    // Generate 100 amounts
    for (let i = 0; i < 100; i++) {
      const amount = gen['generateAmount'](range);
      expect(amount).toBeGreaterThanOrEqual(range.min);
      expect(amount).toBeLessThanOrEqual(range.max);
      expect(amount % range.step).toBe(0);
    }
  });
});
```

### 8.2 Integration Tests

**Component Integration:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalTable } from '@/components/journal/JournalTable';

describe('JournalTable', () => {
  it('should allow user to add and fill journal entries', () => {
    render(<JournalTable transactionId="test-1" />);

    // Select account
    const accountDropdown = screen.getAllByRole('combobox')[0];
    fireEvent.change(accountDropdown, { target: { value: 'voorraad' } });

    // Enter debit amount
    const debitInput = screen.getAllByLabelText('Debet')[0];
    fireEvent.change(debitInput, { target: { value: '400' } });

    // Enter credit amount in second row
    const creditInput = screen.getAllByLabelText('Credit')[1];
    fireEvent.change(creditInput, { target: { value: '400' } });

    // Check balance indicator
    expect(screen.getByText(/In balans/i)).toBeInTheDocument();

    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /Boeken/i });
    expect(submitButton).not.toBeDisabled();
  });
});
```

### 8.3 E2E Tests

**Critical User Flows:**

```typescript
import { test, expect } from '@playwright/test';

test('complete simulation flow', async ({ page }) => {
  await page.goto('/');

  // Welcome screen
  await expect(page.locator('h1')).toContainText('FreshBites');
  await page.click('button:has-text("Start dag")');

  // First transaction
  await expect(page.locator('[data-testid="message"]')).toContainText('Chef Mo');

  // Fill journal entry
  await page.selectOption('[data-testid="account-0"]', 'voorraad');
  await page.fill('[data-testid="debit-0"]', '400');
  await page.selectOption('[data-testid="account-1"]', 'kas');
  await page.fill('[data-testid="credit-1"]', '400');

  // Submit
  await page.click('button:has-text("Boeken")');

  // Check feedback
  await expect(page.locator('[data-testid="feedback-modal"]')).toContainText('Goed geboekt!');
  await page.click('button:has-text("Volgende")');

  // Continue through remaining transactions...
  // (Repeat for each transaction)

  // End screen
  await expect(page.locator('h1')).toContainText('Dag voltooid');
  await expect(page.locator('[data-testid="star-rating"]')).toBeVisible();
});

test('timer expiration auto-submits', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Start dag")');

  // Wait for timer to expire (use short time limit in test config)
  await page.waitForSelector('[data-testid="feedback-modal"]', { timeout: 10000 });

  // Should show feedback even without manual submission
  await expect(page.locator('[data-testid="feedback-modal"]')).toBeVisible();
});
```

---

## 9. Performance Optimization

### 9.1 Bundle Size Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'state': ['zustand'],
          'utils': ['date-fns', 'seedrandom'],
        },
      },
    },
  },
});
```

### 9.2 Code Splitting

```typescript
// Lazy load screens
const WelcomeScreen = lazy(() => import('@/components/screens/WelcomeScreen'));
const SimulationScreen = lazy(() => import('@/components/screens/SimulationScreen'));
const EndScreen = lazy(() => import('@/components/screens/EndScreen'));
```

### 9.3 Rendering Optimization

- Use `React.memo` for expensive components (e.g., MessageList)
- Implement virtual scrolling if message list grows (future)
- Debounce input changes to reduce re-renders
- Use `useMemo` for expensive calculations (balance totals)

---

## 10. Deployment

### 10.1 Build Process

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Type check
npm run type-check

# Build for production
npm run build

# Preview build locally
npm run preview
```

### 10.2 Environment Configuration

```typescript
// .env.production
VITE_APP_TITLE=FreshBites
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false  # v2.0 feature
VITE_API_URL=                # v2.0 feature
```

### 10.3 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 10.4 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 11. Accessibility Implementation

### 11.1 Keyboard Navigation

```typescript
// Journal table keyboard navigation
const JournalRow: React.FC = () => {
  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, field: 'account' | 'debit' | 'credit') => {
    switch (e.key) {
      case 'Tab':
        // Default tab behavior
        break;
      case 'Enter':
        if (field === 'credit' && rowIndex === rows.length - 1) {
          // Submit on Enter in last credit field
          handleSubmit();
        }
        break;
      case 'ArrowDown':
        // Move to same field in next row
        e.preventDefault();
        focusField(rowIndex + 1, field);
        break;
      case 'ArrowUp':
        // Move to same field in previous row
        e.preventDefault();
        focusField(rowIndex - 1, field);
        break;
    }
  };

  return (
    <input
      onKeyDown={(e) => handleKeyDown(e, rowIndex, 'debit')}
      aria-label={`Debetbedrag regel ${rowIndex + 1}`}
      // ...
    />
  );
};
```

### 11.2 ARIA Labels

```typescript
// Screen reader friendly components
<button
  aria-label="Toon hint voor deze transactie"
  aria-describedby="hint-description"
  onClick={handleHintClick}
>
  💡 Hint
</button>

<div role="alert" aria-live="polite">
  {validationError && <p>{validationError}</p>}
</div>

<div
  role="timer"
  aria-label="Resterende tijd"
  aria-live="off" // Don't announce every second
>
  {timeRemaining}
</div>
```

### 11.3 Focus Management

```typescript
// Manage focus when modals open/close
const FeedbackModal: React.FC = ({ onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Trap focus within modal
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Implement focus trap
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Feedback</h2>
      {/* ... */}
      <button ref={closeButtonRef} onClick={onClose}>
        Sluiten
      </button>
    </div>
  );
};
```

---

## 12. Error Handling & Logging

### 12.1 Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);

    // Future: Send to error tracking service
    // trackError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h1>Er is iets misgegaan</h1>
          <p>Probeer de pagina te vernieuwen.</p>
          <button onClick={() => window.location.reload()}>
            Vernieuwen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12.2 Validation Error Messages

```typescript
// User-friendly Dutch error messages
const ERROR_MESSAGES: Record<ValidationError['type'], string> = {
  NOT_BALANCED: 'Je journaalpost is niet in balans. Debet en credit moeten gelijk zijn.',
  INCORRECT_ENTRY: 'Een of meerdere regels zijn niet correct. Controleer de rekeningen en bedragen.',
  MISSING_ENTRY: 'Je mist een of meerdere regels in je journaalpost.',
  EXTRA_ENTRIES: 'Je hebt te veel regels. Verwijder de onnodige regels.',
  EMPTY_ENTRY: 'Vul minimaal één regel in met een rekening en bedrag.',
};
```

---

## 13. Future Enhancements (v2.0)

### 13.1 Backend Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Firebase   │────▶│   Firestore  │
│   (React)    │     │  Auth/Cloud  │     │   Database   │
└──────────────┘     │  Functions   │     └──────────────┘
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  LTI Gateway │
                     │  (Canvas/BS) │
                     └──────────────┘
```

### 13.2 Database Schema (Firestore)

```typescript
// Collections
collections/
├── users/
│   └── {userId}/
│       ├── profile: { name, email, institution }
│       └── simulations/
│           └── {simulationId}/
│               ├── progress: UserProgress
│               └── attempts/
│                   └── {attemptId}: TransactionAttempt
├── institutions/
│   └── {institutionId}/
│       ├── settings: InstitutionSettings
│       └── classes/
│           └── {classId}/
│               ├── students: string[]
│               └── assignments/
│                   └── {assignmentId}: Assignment
└── analytics/
    └── {date}/
        └── metrics: AggregatedMetrics
```

### 13.3 LTI Integration

```typescript
// LTI 1.3 Deep Linking
interface LTILaunchRequest {
  iss: string;                    // Platform issuer
  aud: string;                    // Client ID
  sub: string;                    // User ID
  'https://purl.imsglobal.org/spec/lti/claim/context': {
    id: string;
    label: string;
    title: string;
  };
  'https://purl.imsglobal.org/spec/lti/claim/custom': {
    institution_id: string;
    class_id: string;
  };
}

// Grade passback
async function sendGradeToLMS(
  userId: string,
  simulationId: string,
  score: number
): Promise<void> {
  // Implementation depends on LMS
}
```

---

## 14. Development Workflow

### 14.1 Project Setup

```bash
# Clone repository
git clone https://github.com/your-org/freshbites.git
cd freshbites

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### 14.2 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests
npm run lint             # Lint code
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Utilities
npm run generate:seed    # Generate new random seed
npm run validate:content # Validate transaction templates
```

### 14.3 Git Workflow

```bash
# Feature branch
git checkout -b feature/transaction-pool-c

# Commit with conventional commits
git commit -m "feat(transactions): add pool C variants"
git commit -m "fix(validation): handle floating point precision"
git commit -m "docs(tdd): update validation engine section"

# Push and create PR
git push origin feature/transaction-pool-c
```

---

## 15. Appendix

### 15.1 Default Configuration

```typescript
export const DEFAULT_CONFIG: SimulationConfig = {
  relaxedMode: false,
  relaxedMultiplier: 1.75,
  transactionTimeLimits: {
    1: 180,  // 3:00
    2: 180,  // 3:00
    3: 120,  // 2:00
    4: 120,  // 2:00
    5: 60,   // 1:00
    6: 0,    // No limit
  },
  timerWarningThreshold: 30,
  timerCriticalThreshold: 10,
};
```

### 15.2 Content Validation Rules

```typescript
// Validate transaction templates before deployment
function validateTransactionTemplate(template: TransactionTemplate): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check message template has placeholders
  if (template.messageTemplate.includes('{amount}')) {
    if (!template.amountRange) {
      issues.push({ severity: 'error', message: 'Missing amountRange for {amount} placeholder' });
    }
  }

  // Check correct answer template
  const hasDebit = template.correctAnswerTemplate.some(e => e.debitFormula);
  const hasCredit = template.correctAnswerTemplate.some(e => e.creditFormula);

  if (!hasDebit || !hasCredit) {
    issues.push({ severity: 'error', message: 'Correct answer must have both debit and credit entries' });
  }

  // Check hints
  if (template.hints.length !== 3) {
    issues.push({ severity: 'warning', message: 'Should have exactly 3 hint levels' });
  }

  return issues;
}
```

### 15.3 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Recommended |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | 14+ | Responsive design |
| Chrome Android | 90+ | Responsive design |

### 15.4 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Bundle Size (gzipped) | < 200KB | webpack-bundle-analyzer |

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **Journaalpost** | A journal entry recording a financial transaction |
| **Debet** | Debit side of journal entry |
| **Credit** | Credit side of journal entry |
| **Rekening** | Account (e.g., Cash, Bank, Revenue) |
| **Voorraad** | Inventory |
| **Crediteuren** | Accounts payable (creditors) |
| **Debiteuren** | Accounts receivable (debtors) |
| **Activa** | Assets |
| **Passiva** | Liabilities |
| **Seed** | Deterministic random seed for reproducibility |
| **Pool** | Set of transaction templates for a time slot |
| **Template** | Reusable transaction pattern with placeholders |

---

**Document Version:** 1.0
**Last Updated:** 18 december 2024
**Next Review:** After MVP pilot feedback
