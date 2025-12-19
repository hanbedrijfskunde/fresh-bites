# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FreshBites** is a narrative learning simulation for HBO Bedrijfskunde students to practice accounting (journalizing transactions). Students act as an accountant for a food truck business and receive messages from colleagues via a WhatsApp-like interface with financial transactions to book correctly throughout one virtual workday.

The application aims for 85%+ completion rate, 60%+ first-try accuracy, and 12-18 minute average session duration.

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

### Timing System
- Decreasing time limits per transaction: T1-T2: 3min, T3-T4: 2min, T5: 1min, T6: no limit
- Timer turns orange at <30s, red at <10s with pulse animation
- Auto-submit when time expires
- Optional "relaxed mode" (1.75x multiplier) for accessibility

### Star Rating System
- Max 6 stars total (1 per transaction)
- Correct first attempt: +1⭐, second: +0.5⭐, third: +0⭐
- Hint used: -0.25⭐ penalty
- Speed bonus displayed but doesn't affect final score

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

## Component Architecture

```
App
├── WelcomeScreen
├── SimulationScreen
│   ├── Header (Logo, StarRating, Clock)
│   ├── MessageList (Message with Avatar, MessageBubble, Attachment)
│   ├── JournalTable (JournalRow with AccountDropdown, DebitInput, CreditInput)
│   ├── ActionBar (HintButton, SubmitButton)
│   └── ProgressBar
├── FeedbackModal (CorrectFeedback, IncorrectFeedback)
├── AttachmentModal
└── EndScreen (StarSummary, Statistics, ActionButtons)
```

## Design Guidelines

### Color Palette
- Primary (FreshBites brand): `#FF6B35` (Orange)
- Secondary: `#2D5A3D` (Dark green)
- Background chat: `#F5F5F5` (Light gray)
- Correct feedback: `#4CAF50` (Green)
- Error feedback: `#F44336` (Red)
- Hint: `#2196F3` (Blue)

### UI Principles
- **Familiar**: WhatsApp-like chat interface
- **Focused**: One transaction at a time, no distractions
- **Friendly**: Warm colors, emojis, informal tone (in Dutch)
- **Forgiving**: Errors are learning moments, max 3 attempts per transaction

### Characters
- **Chef Mo** 👨‍🍳: Cook, informal, enthusiastic, uses emojis
- **Fatima** 👩‍💼: Owner, business-like but friendly
- **Systeem** 🔔: Automated notifications, neutral, brief
- **Jan de Vries** 👤: Customer, formal

## Transaction Examples

### Transaction 1: Ingredient Purchase (08:32)
Chef Mo buys €400 ingredients with cash.
```
Debit:  Voorraad €400
Credit: Kas      €400
```

### Transaction 4: Inventory Purchase (12:30)
Chef Mo buys new fryer for €600: €200 cash, €400 credit.
```
Debit:  Inventaris   €600
Credit: Kas          €200
Credit: Crediteuren  €400
```

## Important Rules

### Transaction Content
- All messages and feedback must be in **Dutch**
- Keep informal, friendly tone matching character style
- Include relevant emojis sparingly
- Messages should feel authentic to a small business context

### Randomization
- Always use deterministic random with seed for reproducibility
- Round partial payments to nearest €10
- Ensure all amounts fall within defined min/max/step constraints
- Generate seed from userId + timestamp if not provided

### Accessibility
- All interactive elements must be keyboard navigable (Tab order)
- ARIA labels required for screen readers
- Color contrast must meet WCAG AA (4.5:1 minimum)
- Visible focus indicators on all interactive elements

### Testing
- Always validate journal entry logic: balance check, entry matching, count verification
- Test timer behavior at thresholds (30s, 10s, 0s)
- Verify randomization produces unique combinations
- Test that same seed produces identical transactions

## Development Notes

### Tech Stack (Recommended)
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- State: Zustand or Context API
- Backend: Firebase (v2.0) or serverless
- Hosting: Vercel or Netlify
- LMS Integration: LTI 1.3 (v2.0)

### Phase 1 (MVP v1.0) Scope
- 6 transactions from predefined pools
- Basic randomization (amounts + transaction selection)
- Star rating system with hints
- Timer system with accessibility mode
- Feedback modals with character responses
- End screen with statistics
- No backend/persistence (client-side only)

### Future (v2.0)
- Teacher dashboard with analytics
- LMS integration (Canvas, Brightspace, Edstack)
- Result persistence (Firebase)
- Multiple case templates beyond FreshBites
