# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FreshBites** is a narrative learning simulation for HBO Bedrijfskunde students to practice accounting (journalizing transactions). Students act as an accountant for a food truck business and receive messages from colleagues via a WhatsApp-like interface with financial transactions to book correctly throughout one virtual workday.

The application aims for 85%+ completion rate, 60%+ first-try accuracy, and 12-18 minute average session duration.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173
npm run build            # Type check + production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # ESLint check
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking only (no emit)

# Testing
npm run test             # Run unit tests (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # Run E2E tests with UI
```

## Core Concepts

### Simulation Flow
```
BERICHT ontvangen → JOURNAAL invullen → VALIDATIE checken → FEEDBACK tonen
                                              ↓ Fout        ↓ Correct
                                         HINT tonen    VOLGENDE bericht
```

### Randomization System
- Each student receives a unique combination of transactions from **transaction pools**
- 48+ unique combinations (2×2×3×2×2) ensure anti-fraud
- Amounts are randomized within predefined ranges (e.g., €250-€600 in €50 steps)
- Partial payments calculated as percentages (25%-50% in 5% steps)
- Seeds enable reproducibility for specific students


### Star Rating System
- Max 6 stars total (1 per transaction)
- Correct first attempt: +1⭐, second: +0.5⭐, third: +0⭐
- Hint used: -0.25⭐ penalty

## Data Model

### Key TypeScript Interfaces

```typescript
interface GeneratedTransaction {
  id: string;
  templateId: string;
  time: string;
  sender: Character;
  message: string; // Template with filled amounts
  generatedAmounts: { amount: number; partial?: number };
  correctAnswer: JournalEntry[];
  hints: string[];
}

interface JournalEntry {
  account: Account;
  debit: number | null;
  credit: number | null;
}

interface UserProgress {
  userId: string;
  seed: string; // For reproducibility
  generatedTransactions: GeneratedTransaction[];
  currentTransaction: number;
  stars: number;
  attempts: Record<string, number>;
  hintsUsed: Record<string, boolean>;
  timeExpired: Record<string, boolean>;
  relaxedMode: boolean;
}
```

### Chart of Accounts (Rekeningenschema)
- **Assets (Activa)**: Kas, Bank, Debiteuren, Voorraad, Inventaris
- **Liabilities (Passiva)**: Crediteuren
- **Revenue (Opbrengsten)**: Omzet
- **Expenses (Kosten)**: Inkoopwaarde, Huurkosten, Loonkosten, Overige kosten, Afschrijvingskosten

## Validation Logic

### Journal Entry Validation Steps
1. **Check balance**: Total debit must equal total credit
2. **Check entries**: All correct rows must be present with exact amounts
3. **Check count**: No extra rows allowed

### Error Types
- `NOT_BALANCED`: Debit ≠ Credit
- `INCORRECT_ENTRY`: Wrong account, amount, or debit/credit side
- `EXTRA_ENTRIES`: More rows than expected

### Hint System Levels
1. After 1st error: General hint about transaction type
2. After 2nd error: Specific accounts mentioned
3. After 3rd error: Full solution shown

## Architecture

### Tech Stack
- **React 18.3.1** with TypeScript 5.4.5
- **Vite 5.2.11** for build/dev
- **Tailwind CSS 3.4.3** for styling
- **Zustand 4.5.2** with persist middleware for state management
- **seedrandom 3.0.5** for deterministic randomization
- **Vitest + Playwright** for testing

### Directory Structure
```
src/
├── components/          # React components organized by feature
│   ├── screens/        # WelcomeScreen, SimulationScreen, EndScreen
│   ├── layout/         # Header, ProgressBar, StarRating
│   ├── messages/       # MessageList, Message, Avatar
│   ├── journal/        # JournalTable, JournalRow, AccountDropdown, AmountInput
│   ├── modals/         # FeedbackModal, AttachmentModal, HintModal
│   └── common/         # Modal, Button (shared components)
├── data/               # Static data (accounts, characters, transaction-pools)
├── engine/             # Core business logic (isolated, testable)
│   ├── SimulationGenerator.ts   # Generates transactions with seeded randomization
│   ├── ValidationEngine.ts      # Validates journal entries
│   └── ScoringEngine.ts         # Calculates stars
├── store/              # Zustand store (useSimulationStore)
├── types/              # TypeScript interfaces (40+ types)
├── utils/              # Constants, formatters (currency, time, stars)
└── styles/             # Global CSS

Key principle: Engines are pure functions/classes with no React dependencies.
All business logic lives in /engine, making it easy to unit test.
```

### Data Flow
```
User Input → React Component → Zustand Store Actions → Engine Classes → Store Update → UI Re-render
                                                            ↓
                                                    LocalStorage (auto-persisted)
```

### Component Architecture

```
App (screens/*)
├── WelcomeScreen                    # User onboarding
├── SimulationScreen                 # Main game screen
│   ├── Header                       # Logo, StarRating, current time
│   ├── MessageList                  # Chat-style messages
│   │   └── Message                  # Avatar, bubble, attachment link
│   ├── JournalTable                 # Journal entry input
│   │   ├── JournalRow (multiple)    # Account dropdown + debit/credit inputs
│   │   └── BalanceIndicator         # Shows debit/credit totals
│   ├── ActionBar                    # Hint button, Submit button
│   └── ProgressBar                  # Transaction progress
├── Modals (conditional)
│   ├── FeedbackModal                # Correct/Incorrect feedback
│   ├── AttachmentModal              # Shows receipt/invoice PDFs
│   └── HintModal                    # Progressive hints
└── EndScreen                        # Final results, statistics
```

## State Management (Zustand)

The application uses a single Zustand store (`src/store/useSimulationStore.ts`) with localStorage persistence.

### Store Structure
```typescript
{
  simulation: Simulation | null,        // Generated transactions with correct answers
  userProgress: UserProgress | null,    // Per-transaction progress, attempts, hints
  currentScreen: ScreenType,            // 'welcome' | 'simulation' | 'end'
  activeModal: ModalData,               // Current modal state
}
```

### Key Actions
- `initializeSimulation(userId, seed?, config?)` - Creates new simulation with deterministic seed
- `submitAnswer(transactionId, entry[])` - Validates entry, updates progress, unlocks next
- `useHint(transactionId, level)` - Records hint usage (affects stars)
- `startTransaction(transactionId)` - Marks transaction as active
- `goToScreen(screen)` - Navigation between screens

### Immutability Pattern
**CRITICAL**: Always create new objects when updating nested state. The store uses immutable updates:

```typescript
// CORRECT - Creates new objects at each level
set({
  userProgress: {
    ...userProgress,
    transactionProgress: {
      ...userProgress.transactionProgress,
      [transactionId]: {
        ...progress,
        status: 'active',
      },
    },
  },
});

// INCORRECT - Mutates nested objects
progress.status = 'active';  // Won't trigger re-render!
```

### Persistence
- Persists to `localStorage['freshbites-simulation']`
- Only `simulation` and `userProgress` are persisted
- UI state (screen, modals) is ephemeral

## Design Guidelines

### Color Palette (Tailwind Config)
- Primary: `#FF6B35` (orange) - FreshBites brand
- Secondary: `#2D5A3D` (dark green)
- Success: `#4CAF50` (green) - correct feedback
- Error: `#F44336` (red) - incorrect feedback
- Hint: `#2196F3` (blue) - hint messages
- Warning: `#FF9800` (orange) - timer warnings

Use Tailwind classes: `text-primary`, `bg-error`, `border-success`, etc.

### UI Principles
- **Familiar**: WhatsApp-like chat interface
- **Focused**: One transaction at a time, no distractions
- **Friendly**: Warm colors, emojis, informal tone (in Dutch)
- **Forgiving**: Errors are learning moments, max 3 attempts per transaction

### Characters (data/characters.ts)
- **Chef Mo** 👨‍🍳: Cook, informal, enthusiastic, uses emojis
- **Fatima** 👩‍💼: Owner, business-like but friendly
- **Systeem** 🔔: Automated notifications, neutral, brief
- **Jan de Vries** 👤: Customer, formal

## Core Engine Classes

### SimulationGenerator (engine/SimulationGenerator.ts)
Generates transactions with deterministic randomization using `seedrandom`.

**Key methods:**
- `generateSimulation(userId, pools, config)` - Selects one variant per pool, generates amounts
- Uses seeded RNG for reproducibility (same seed = same transactions)
- Fills message templates with generated amounts using `{amount}`, `{partial}` placeholders
- Calculates `correctAnswer[]` by executing `answerFormula` functions

**Transaction pool structure:**
```typescript
{
  poolId: 'pool_a',
  time: '08:30',
  variants: [
    {
      templateId: 'a1',
      message: 'Ik heb voor {amount} aan ingrediënten gekocht...',
      answerFormula: (amounts) => [
        { account: VOORRAAD, debit: amounts.amount, credit: null },
        { account: KAS, debit: null, credit: amounts.amount }
      ],
      amountRanges: { amount: { min: 250, max: 600, step: 50 } }
    }
  ]
}
```

### ValidationEngine (engine/ValidationEngine.ts)
Validates user journal entries against correct answers.

**Validation steps:**
1. Check for empty entries
2. Check balance (debit = credit, with ±0.01 tolerance for floating point)
3. Match user entries to correct entries
4. Detect amount mismatch (if user used chat amount instead of receipt amount)

**Returns:**
```typescript
{
  isValid: boolean,
  errors: ValidationError[],
  balanceCheck: { isBalanced, debitTotal, creditTotal },
  entryMatches: EntryMatchResult[]
}
```

**Amount mismatch detection:**
Some transactions have `hasAmountMismatch: true` with `displayAmount` (in chat) ≠ `actualAmount` (on receipt). ValidationEngine detects if user used wrong amount and shows special error message.

### ScoringEngine (engine/ScoringEngine.ts)
Calculates stars based on attempts and hints.

**Star formula:**
- Attempt 1: 1.0 star
- Attempt 2: 0.5 star
- Attempt 3+: 0.0 star
- Hint penalty: -0.25 star per hint used
- Minimum: 0 stars

## Important Implementation Rules

### Language & Content
- **All user-facing text must be in Dutch** (messages, feedback, UI labels)
- Match character tone: Chef Mo (informal, emoji-heavy), Fatima (friendly-professional), Systeem (brief, neutral)
- Messages should feel authentic to small business context

### Randomization
- **Always use deterministic seeding** - same seed must produce identical transactions
- Access RNG via `SimulationGenerator` class, never use `Math.random()`
- Round partial payments to nearest €10
- Respect `min`, `max`, `step` constraints in `amountRanges`
- Default seed format: `${userId}-${timestamp}`

### Validation
- **Floating point tolerance**: Use `Math.abs(a - b) < 0.01` for all amount comparisons
- ValidationEngine expects `JournalEntry[]` with `{ account, debit, credit }`
- Pass transaction object to `validate()` for amount mismatch detection
- Empty rows (no account or both debit/credit null/0) are invalid

### State Updates
- **Never mutate store objects directly** - always spread/clone nested objects
- Zustand won't detect mutations to nested properties
- Call `saveProgress()` after updates to persist to localStorage

### Accessibility
- All interactive elements keyboard navigable (proper Tab order)
- Include `aria-label` on icon-only buttons
- Maintain WCAG AA color contrast (4.5:1)
- Show visible focus indicators (`:focus-visible` styles)

### File Imports
- Use path alias `@/` for `src/` (configured in vite.config.ts and tsconfig.json)
- Example: `import { ACCOUNTS } from '@/data/accounts'`
- Types are centralized in `@/types`

## Testing Strategy

### Unit Tests (Vitest)
- Test all engine classes in isolation (SimulationGenerator, ValidationEngine, ScoringEngine)
- Verify deterministic randomization (same seed → same output)
- Test validation edge cases (floating point, missing entries, extra entries, amount mismatch)
- Test star calculation formulas

### E2E Tests (Playwright)
- Complete simulation flow (6 transactions)
- Hint system (progressive hints, star penalties)
- Accessibility (keyboard navigation, screen readers)

## Development Workflow

### Adding a New Transaction Pool
1. Add pool to `src/data/transaction-pools.ts`
2. Define `variants[]` with `templateId`, `message`, `answerFormula`, `amountRanges`, `hints`
3. Use `{amount}`, `{partial}` placeholders in message templates
4. `answerFormula` receives `{ amount, partial? }` and returns `JournalEntry[]`
5. Test with specific seed to verify amounts and correct answers

### Adding a New Component
1. Determine category: screens, layout, messages, journal, modals, or common
2. Use TypeScript interfaces from `@/types`
3. Access store via `useSimulationStore()` hook
4. Use Tailwind classes from theme (colors, animations)
5. Add keyboard navigation and ARIA labels

### Debugging State Issues
1. Check browser DevTools → Application → Local Storage → `freshbites-simulation`
2. Use Zustand DevTools (optional): `npm install -D @redux-devtools/extension`
3. Verify immutable updates (check if re-renders trigger)
4. Clear localStorage and restart simulation to test from fresh state
