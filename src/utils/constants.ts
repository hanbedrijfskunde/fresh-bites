import type { SimulationConfig } from '@/types';

export const DEFAULT_CONFIG: SimulationConfig = {
  transactionTimeLimits: {
    1: 180, // 3:00
    2: 180, // 3:00
    3: 120, // 2:00
    4: 120, // 2:00
    5: 60,  // 1:00
  },
  timerWarningThreshold: 10, // Last 10 seconds
};

export const MAX_ATTEMPTS = 3;
export const HINT_PENALTY = 0.25;
export const MAX_JOURNAL_ROWS = 4;
export const MIN_JOURNAL_ROWS = 2;
export const TOTAL_TRANSACTIONS = 5;
export const MAX_STARS = 5;

export const PERFORMANCE_THRESHOLDS = {
  excellent: 4.5,
  good: 3.5,
  pass: 2.5,
};

export const ERROR_MESSAGES = {
  NOT_BALANCED: 'Je journaalpost is niet in balans. Debet en credit moeten gelijk zijn.',
  INCORRECT_ENTRY:
    'Een of meerdere regels zijn niet correct. Controleer de rekeningen en bedragen.',
  MISSING_ENTRY: 'Je mist een of meerdere regels in je journaalpost.',
  EXTRA_ENTRIES: 'Je hebt te veel regels. Verwijder de onnodige regels.',
  EMPTY_ENTRY: 'Vul minimaal één regel in met een rekening en bedrag.',
};

export const PERFORMANCE_MESSAGES = {
  excellent: 'Uitstekend werk! Je beheerst journaliseren prima.',
  good: 'Goed gedaan! Je bent goed op weg.',
  pass: 'Je hebt de basis onder de knie, blijf oefenen!',
  needs_improvement: 'Blijf oefenen, je komt er wel!',
};
