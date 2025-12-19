# FreshBites - Een Dag als Boekhouder

Een narratieve leersimulatie voor boekhoudonderwijs, gebouwd met React, TypeScript, en Tailwind CSS.

## Project Status

### ✅ Completed (Phase 1-3)

#### Setup & Configuration
- ✅ Package.json with all dependencies
- ✅ TypeScript configuration (tsconfig.json)
- ✅ Vite build configuration
- ✅ Tailwind CSS setup with custom theme
- ✅ PostCSS configuration
- ✅ Vitest testing configuration
- ✅ Playwright E2E testing configuration
- ✅ ESLint and Prettier configuration
- ✅ Directory structure created

#### Core Implementation
- ✅ **Type Definitions** (`src/types/index.ts`) - Complete type system with 40+ interfaces
- ✅ **Utility Functions** (`src/utils/`) - Constants, formatters for currency, time, stars
- ✅ **Static Data**:
  - ✅ 12 accounts (Activa, Passiva, Kosten, Opbrengsten)
  - ✅ 3 characters (Chef Mo, Fatima, Systeem)
  - ✅ **6 complete transaction pools** with 15 variants:
    - Pool A (08:30): Voorraad inkoop (2 variants)
    - Pool B (09:15): Verkoop (2 variants)
    - Pool C (10:45): Vaste lasten (3 variants)
    - Pool D (12:30): Inventaris split payments (2 variants)
    - Pool E (14:00): Betalingsverkeer (2 variants)
    - Pool F (16:00): Eindcontrole (1 fixed)

#### Core Engines
- ✅ **SimulationGenerator** - Deterministic randomization with seeding
- ✅ **ValidationEngine** - Journal entry validation with 3-step process
- ✅ **ScoringEngine** - Star calculation with hint penalties
- ✅ **TimerManager** - Timer with warning/critical thresholds

#### State Management
- ✅ **Zustand Store** with localStorage persistence
  - initializeSimulation, submitAnswer, useHint
  - Transaction progress tracking
  - Modal and screen navigation

#### UI Components
- ✅ **WelcomeScreen** - User onboarding with relaxed mode toggle
- ✅ Global styles with Tailwind

### 🚧 In Progress / Remaining (Phase 4-7)

#### UI Components Remaining (~25 components)
- [ ] **SimulationScreen** - Main game screen
- [ ] **EndScreen** - Results and statistics
- [ ] **Layout Components**: Header, ProgressBar, StarRating
- [ ] **Message Components**: MessageList, Message, Avatar
- [ ] **Journal Components**: JournalTable, JournalRow, AccountDropdown, AmountInput, BalanceIndicator, ActionBar
- [ ] **Modal Components**: FeedbackModal, AttachmentModal, HintModal
- [ ] **Timer Component** - Countdown with visual states
- [ ] **Common Components**: Button, Modal

#### Assets & Content
- [ ] Mock attachment files (PDFs/images for receipts and invoices)
- [ ] Favicon and logo assets

#### Testing
- [ ] Unit tests for core engines (SimulationGenerator, ValidationEngine, ScoringEngine)
- [ ] E2E tests with Playwright (complete simulation flow)

#### Polish
- [ ] Animations and transitions
- [ ] Error boundaries
- [ ] Loading states
- [ ] Accessibility improvements

## Quick Start

bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build


## Development Commands

bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run lint         # Lint code
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking


## Project Structure

```
fresh-bites/
├── documentation/
│   ├── PRD_FreshBites.md          # Product Requirements (90KB)
│   ├── TDD_FreshBites.md          # Technical Design (150KB)
│   └── CLAUDE.md                   # Claude Code guidance
├── src/
│   ├── components/
│   │   ├── screens/                # ✅ WelcomeScreen (others pending)
│   │   ├── layout/                 # Pending
│   │   ├── messages/               # Pending
│   │   ├── journal/                # Pending
│   │   ├── modals/                 # Pending
│   │   ├── timer/                  # Pending
│   │   └── common/                 # Pending
│   ├── data/
│   │   ├── accounts.ts             # ✅ 12 accounts
│   │   ├── characters.ts           # ✅ 3 characters
│   │   └── transaction-pools.ts    # ✅ 6 pools, 15 variants
│   ├── engine/
│   │   ├── SimulationGenerator.ts  # ✅ Complete
│   │   ├── ValidationEngine.ts     # ✅ Complete
│   │   ├── ScoringEngine.ts        # ✅ Complete
│   │   └── TimerManager.ts         # ✅ Complete
│   ├── store/
│   │   └── useSimulationStore.ts   # ✅ Complete with persistence
│   ├── types/
│   │   └── index.ts                # ✅ 40+ interfaces
│   ├── utils/
│   │   ├── constants.ts            # ✅ Complete
│   │   └── formatters.ts           # ✅ Complete
│   ├── styles/
│   │   └── globals.css             # ✅ Complete
│   ├── App.tsx                     # ✅ Placeholder
│   └── main.tsx                    # ✅ Complete
├── tests/
│   └── e2e/                        # Pending
├── package.json                    # ✅ Complete
├── tsconfig.json                   # ✅ Complete
├── vite.config.ts                  # ✅ Complete
├── tailwind.config.js              # ✅ Complete
└── vitest.config.ts                # ✅ Complete
```

## Architecture Overview

### Data Flow

```
User Input → Zustand Store → Core Engines → Validation → State Update → UI Render
                                ↓
                          LocalStorage (Persist)
```

### Core Engines

1. **SimulationGenerator**
   - Uses seedrandom for deterministic randomization
   - Generates 6 transactions from pools
   - Fills templates with random amounts (respects min/max/step)
   - Calculates correct answers from formulas

2. **ValidationEngine**
   - Step 1: Check balance (debit = credit, ±0.01 tolerance)
   - Step 2: Match entries against correct answer
   - Step 3: Identify missing/extra entries

3. **ScoringEngine**
   - 1st attempt: 1.0 star
   - 2nd attempt: 0.5 star
   - 3rd attempt: 0.0 star
   - Hint penalty: -0.25 star per hint

4. **TimerManager**
   - Normal (>30s), Warning (≤30s), Critical (≤10s), Expired (0s)
   - Auto-submit on expiration

### State Management (Zustand)

- **Simulation**: Generated transactions with correct answers
- **UserProgress**: Per-transaction progress, attempts, hints, stars
- **UI State**: Current screen, active modal
- **Persistence**: Auto-saves to localStorage

## Key Features

### Randomization
- **Deterministic**: Same seed = same transactions
- **48+ combinations**: Pool A (2) × Pool B (2) × Pool C (3) × Pool D (2) × Pool E (2) × Pool F (1)
- **Variable amounts**: Respects min/max/step constraints (e.g., €250-€600 in €50 steps)
- **Split payments**: Partial percentages (25%-50%), rounded to nearest €10

### Timer System
- Transaction 1-2: 3:00
- Transaction 3-4: 2:00
- Transaction 5: 1:00
- Transaction 6: No limit (eindcontrole)
- Relaxed mode: 1.75x multiplier

### Validation
- Real-time balance checking
- Floating point tolerance (±0.01)
- Detailed error messages in Dutch
- Entry matching with partial credit

## Next Steps to Complete MVP

### Priority 1: Core UI (Essential for functionality)
1. **SimulationScreen** - Main game layout
2. **JournalTable** - Input for journal entries
3. **JournalRow** - Individual row with account dropdown + amount inputs
4. **FeedbackModal** - Show results after submission
5. **Timer** - Countdown display

### Priority 2: User Experience
6. **MessageList** - Display transaction messages
7. **Header** - Logo, timer, stars
8. **ProgressBar** - Show progress through simulation
9. **EndScreen** - Final results and statistics

### Priority 3: Polish
10. **Mock attachments** - PDF/image placeholders
11. **Unit tests** - Core engine validation
12. **E2E tests** - Complete simulation flow
13. **Accessibility** - Keyboard navigation, ARIA labels

## Testing Strategy

### Unit Tests (Vitest)
bash
npm run test


Test files in `src/engine/__tests__/`:
- SimulationGenerator: Same seed, amount ranges, partial payments
- ValidationEngine: Balance checking, entry matching
- ScoringEngine: Star calculation, performance levels

### E2E Tests (Playwright)
bash
npm run test:e2e


Test files in `tests/e2e/`:
- Complete simulation flow (6 transactions)
- Randomization (different seeds)
- Timer behavior
- Accessibility (keyboard nav, screen readers)

## Tech Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.4.5
- **Build Tool**: Vite 5.2.11
- **Styling**: Tailwind CSS 3.4.3
- **State**: Zustand 4.5.2
- **Random**: seedrandom 3.0.5
- **Date**: date-fns 3.6.0
- **Testing**: Vitest 1.6.0 + Playwright 1.44.0

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size (gzipped): < 200KB
- Lighthouse Score: > 90

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Success Criteria

✅ All 6 transaction pools with 2-3 variants each
✅ Deterministic randomization (same seed = same transactions)
✅ Real-time validation with balance checking
✅ Timer system with warning/critical states
✅ Star rating with hint penalties
✅ Relaxed mode toggle (1.75x time)
⏳ Complete UI components
⏳ Mock attachment files
⏳ Unit tests passing
⏳ E2E tests passing
⏳ Accessible (keyboard navigation, ARIA labels)
⏳ Responsive design (desktop + tablet)

## Contributing

This project follows the implementation plan in `/Users/witoldtenhove/.claude/plans/soft-churning-nebula.md`.

## License

Educational use only.
